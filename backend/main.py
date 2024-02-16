import os
from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import aiohttp
from dotenv import load_dotenv

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


@app.route('/guilds', methods=['GET'])
async def mutual_guilds():
    # Extract the Authorization header and the token
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header[7:]  # Skip 'Bearer ' to get the token
    else:
        abort(
            401, description="Unauthorized: No access token provided or token is malformed")

    async with aiohttp.ClientSession() as session:
        headers = {'Authorization': f'Bearer {token}'}
        async with session.get('https://discord.com/api/users/@me/guilds', headers=headers) as resp:
            if resp.status != 200:
                # If Discord's API returns an error, provide a more detailed error message if possible
                error_message = f"Failed to fetch guilds: {resp.reason}"
                try:
                    # Attempt to parse the error message from Discord's response
                    error_data = await resp.json()
                    if "message" in error_data:
                        error_message += f" - {error_data['message']}"
                except Exception:
                    pass  # If parsing fails, ignore and use the generic error message
                abort(resp.status, description=error_message)

            guilds = await resp.json()

    # Example filtering logic: Keep guilds where the bot is a member
    # This is placeholder logic. You'll need to adjust this based on your application's requirements
    # and the data structure of the guilds.
    mutual_guilds = [
        guild for guild in guilds if "bot_is_member" in guild and guild["bot_is_member"]]

    return jsonify(mutual_guilds)


if __name__ == '__main__':
    app.run(debug=True, port=8000)
