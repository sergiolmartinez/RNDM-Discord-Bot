import discord
from discord.ext import commands

from models import GuildConfig, WelcomeConfig, LeaveConfig


class Events(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        print(f"Loaded {self.__class__.__name__} cog.")

    @commands.Cog.listener()
    async def on_guild_join(self, guild: discord.Guild):
        new_config = GuildConfig(id=guild.id)
        await new_config.save()

    @commands.Cog.listener()
    async def on_member_join(self, member: discord.Member):
        config = await GuildConfig.filter(id=member.guild.id).get_or_none()
        if not config:
            return

        if config.welcome_enabled:
            welcome_config = await WelcomeConfig.filter(guild_id=member.guild.id).get_or_none()
            embed = discord.Embed(
                title="Welcome!", colour=discord.Colour.blue())
            embed.set_image(url=member.avatar.url)
            embed.description = welcome_config.message.format(member.mention)

            send_channel = discord.utils.get(
                member.guild.channels, id=welcome_config.channel_id)
            await send_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_member_remove(self, member: discord.Member):
        config = await GuildConfig.filter(id=member.guild.id).get_or_none()
        if not config:
            return

        if config.leave_enabled:
            leave_config = await LeaveConfig.filter(guild_id=member.guild.id).get_or_none()
            embed = discord.Embed(
                title="Member Left", colour=discord.Colour.blue())
            embed.set_image(url=member.avatar.url)
            embed.description = leave_config.message.format(member.mention)

            send_channel = discord.utils.get(
                member.guild.channels, id=leave_config.channel_id)
            await send_channel.send(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(Events(bot))
