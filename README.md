# Repository Details

This repository is for the RNDM Discord bot that is capable of various things. Functionality will be added throughout its life and listed below. The repository can be broken into three parts:

    - The bot written in python in the `bot` directory
    - The backend uses flask and can be found in the `backend` directory
    - The frontend for the web based admin dashboard, is built using rReact in typescript and can be found in the `frontend` directory

Note that this bot uses postgresql that can be installed on your computer for development purposes https://www.postgresql.org/download/

# Description

The bot is intended to be capable of everything you need to raise productivity and user activity on your discord server and provide valuable statistics and data.

The initial features include:

    - Multi-guild support
    - Config creation for each guild
    - Member welcome and leave messages (likely to be removed in the future)
    - Guild specific prefixes that can be changed by those with manage server permissions
    - Extra logging functionality (more to be implemented in the future)
    - Welcome and leave channel selection
    - Discord OAUTH integration
    - Simple login diplaying the logged in users name and avatar

Possible features to be added:

    - Play with me command
    - Reaction roles
    - Stats about member roles (counts, messages sent, joins, removes, etc)
    - Social media integrations
    - Steam and Battle.net integrations
    - News integrations for specific topics to be sent to specific channels
    - Games and other fun stuff
    - Less likely but possible: Ranking systems, sending files, music, ticketing system, DMs to/from the bot
    - Other recommendations welcome from users

# Setup Instructions

for the bot

1. Create a discord bot here https://discord.com/developers/applications
2. Create the invite link and add the bot to your server with the required permissions (for dev only use Administrator)
3. Create a .env file from a copy of .env.sample in the `bot` directory and include your Discord bot token
4. In postgresql create a user and database, include the required information in the .env file
5. Create a `logs` folder in the root directory
6. cd to `bot` directory, activate your venv, and run
   `pip install -r requirements.txt`
7. To run the bot, run the `bot.py` file

for the backend

1. cd to the `backend` directory
2. Create a .env file from a copy of .env.sample in the `backend` directory and include your client ID, secret and the redirect URI (remember to set this in the developer portal and create your oauth permissions)
3. Create a venv using `python -m venv venv`
4. Activate your venv, and run
   `pip install -r requirements.txt`
5. To run the backend, run the `main.py` file

for the frontend

1. cd to the frontend directory
2. Create a `config.json` file and include your API URI and the OAUTH URI from the Discord developer portal.
3. Run `npm install`
4. To run the frontend simple run `yarn start`
