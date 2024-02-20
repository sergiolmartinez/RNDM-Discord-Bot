import os
from flask import Flask, request, jsonify, abort, make_response
from flask_cors import CORS, cross_origin
import aiohttp
from dotenv import load_dotenv
from json import loads

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={
     r"*": {"origins": "*", "allow_headers": ["Authorization", "Content-Type"]}})

# Async function to fetch token using Discord OAuth


async def fetch_token(code):
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://discord.com/api/oauth2/token",
            data={
                "client_id": os.environ['CLIENT_ID'],
                "client_secret": os.environ['CLIENT_SECRET'],
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": os.environ['REDIRECT_URI'],
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        ) as resp:
            return await resp.json()


async def fetch_and_filter_guilds(token):
    url = "https://discord.com/api/v9/users/@me/guilds"
    headers = {"Authorization": f"Bearer {token}"}
    manage_guild_permission_bit = 0x20  # Manage Guild permission

    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers) as response:
            if response.status == 200:
                guilds = await response.json()
                owned_or_managed_guilds = [
                    guild for guild in guilds if int(guild["permissions"]) & manage_guild_permission_bit
                ]
                return owned_or_managed_guilds
            else:
                # Handle error appropriately
                return []


@app.route('/oauth/callback', methods=['POST'])
async def callback():
    data = request.get_json()
    code = data.get("code")
    if not code:
        return jsonify({"error": "Invalid request"}), 400

    token_data = await fetch_token(code)
    if "access_token" not in token_data:
        return jsonify({"error": "Invalid code"}), 400

    return jsonify({'access_token': token_data['access_token']})

# Assuming you have similar async utility functions for fetching user and guilds information


@app.route('/users/me', methods=['GET'])
async def get_own_user():
    # Extract the Authorization header
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        # Extract the token part after 'Bearer '
        token = auth_header.split(' ')[1]
    else:
        # Abort and return a 401 Unauthorized response if the token is missing or improperly formatted
        abort(
            401, description="Unauthorized: No access token provided or token is malformed")

    async with aiohttp.ClientSession() as session:
        headers = {'Authorization': f'Bearer {token}'}
        async with session.get('https://discord.com/api/users/@me', headers=headers) as resp:
            if resp.status != 200:
                # If Discord's API returns an error, abort and reflect that status in the response
                abort(resp.status, description=f"Failed to fetch user details: {
                      resp.reason}")

            user = await resp.json()

    return jsonify({
        'id': user['id'],
        'username': user['username'],
        'discriminator': user['discriminator'],
        'avatar_url': f"https://cdn.discordapp.com/avatars/{user['id']}/{user['avatar']}.png" if user.get('avatar') else None
    })


@app.route('/guilds')
# @cross_origin()
async def mutual_guilds():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return make_response(jsonify({"error": "Unauthorized", "description": "No access token provided or token is malformed", "status": 401}), 401)

    # Extract the token from the Authorization header
    token = auth_header.split(' ')[1]
    filtered_guilds = await fetch_and_filter_guilds(token)
    guild_ids = [guild['id'] for guild in filtered_guilds]
    # print(guild_ids)

    headers = {'Authorization': f'Bearer {token}',
               'Content-Type': 'application/json'}

    async with aiohttp.ClientSession() as session:
        headers = {'Authorization': f'Bearer {token}',
                   'Content-Type': 'application/json'}
        async with session.post('http://localhost:6969/guilds', headers=headers, json={"guilds": guild_ids}) as resp:
            if resp.status != 200:
                resp_text = await resp.text()
                return make_response(jsonify({"error": "Error fetching mutual guilds", "description": resp_text, "status": resp.status}), resp.status)

            mutual_guilds = await resp.json()
            print(mutual_guilds)

        return mutual_guilds


if __name__ == '__main__':
    app.run(debug=True, port=8000)
