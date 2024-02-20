from discord.ext import commands
from aiohttp import web

import asyncio
import aiohttp_cors
import discord
from discord import Forbidden


class Server(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.site = None

    async def get_status(self, request):
        return web.json_response({"guilds": len(self.bot.guilds), "ping": round(self.bot.latency * 1000)})

    async def get_mutual_guilds(self, request):
        # print('request: ', request.headers)
        json_data = await request.json()
        # print('json+data: ', json_data)
        guild_ids = json_data.get("guilds")
        # print('guilds: ', guild_ids)
        if not guild_ids:
            return web.json_response({"error": "Invalid guilds"}, status=400)

        # bot_guilds = self.bot.guilds
        # bot_guild_ids = [guild.id for guild in bot_guilds]

        # test: discord.Guild = await self.bot.fetch_guild(int(1194378734808076399))
        # print('bot_guild', test)

        guilds = []
        for guild_id in guild_ids:
            try:
                guild: discord.Guild = await self.bot.fetch_guild(int(guild_id))
                if guild:  # Check if the guild object is not None
                    if not guild:
                        continue
                    else:
                        if not guild.icon:
                            icon_url = None
                        else:
                            icon_url = guild.icon.url
                        guilds.append({
                            "id": str(guild.id),
                            "name": guild.name,
                            "icon_url": str(icon_url) if icon_url else None
                        })
            except Exception as e:  # Catch exceptions to handle guilds that can't be fetched
                # print(f'Guild {guild_id} not found: {e}')
                continue
        # print('bot_guilds: ', guilds)

        return web.json_response({"guilds": guilds})

    async def start_server(self):
        app = web.Application()
        cors = aiohttp_cors.setup(app)

        cors.add(
            cors.add(app.router.add_resource("/status")).add_route("GET", self.get_status), {
                "*": aiohttp_cors.ResourceOptions(
                    allow_credentials=True,
                    expose_headers="*",
                    allow_headers="*")
            })

        cors.add(
            cors.add(app.router.add_resource("/guilds")).add_route("POST", self.get_mutual_guilds), {
                "localhost:8000": aiohttp_cors.ResourceOptions(
                    allow_credentials=True,
                    expose_headers="*",
                    allow_headers="*"
                )
            })

        # app.router.add_get("/status", self.get_status)

        runner = web.AppRunner(app)
        await runner.setup()

        self.api = web.TCPSite(runner, "0.0.0.0", 6969)

        await self.bot.wait_until_ready()
        await self.api.start()
        print("Server has started!")

    def __unload(self):
        asyncio.ensure_future(self.api.stop())
        print("Server has stopped!")


async def setup(bot: commands.Bot):
    cog = Server(bot)
    await bot.add_cog(Server(bot))
    bot.loop.create_task(cog.start_server())
