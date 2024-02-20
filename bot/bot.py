import settings
import discord
from discord.ext import commands
from tortoise import Tortoise

from models import GuildConfig

logger = settings.logging.getLogger("bot")


async def connect_db():
    await Tortoise.init(
        db_url=f'postgres://{settings.PG_USER}:{
            settings.PG_PASSWORD}@localhost:{settings.PG_PORT}/{settings.PG_DB}',
        modules={'models': ['models']}
    )
    await Tortoise.generate_schemas()


async def get_prefix(bot: commands.bot, message: discord.Message):
    config = await GuildConfig.filter(id=message.guild.id).get_or_none()
    if config:
        return config.prefix
    return settings.DEFAULT_PREFIX


def run():
    intents = discord.Intents.all()
    intents.message_content = True
    intents.voice_states = True
    intents.members = True
    intents.guilds = True

    bot = commands.Bot(command_prefix=get_prefix, intents=intents)

    @bot.event
    async def on_ready():
        await connect_db()
        logger.info(f"User: {bot.user} - ID: {bot.user.id}")
        print(settings.COGS_DIR)
        for cog_file in settings.COGS_DIR.glob("*.py"):
            if cog_file.name != "__init__.py":
                await bot.load_extension(f"cogs.{cog_file.name[:-3]}")
        print("Bot is ready!")

    bot.run(settings.DISCORD_API_SECRET, root_logger=True)


if __name__ == "__main__":
    run()
