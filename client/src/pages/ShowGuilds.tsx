import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config.json";
import { LoadingScreen } from "../components/LoadingScreen";
import { Guild, User } from "../types";
import salty512 from "../assets/salty512.png";

// Define your types outside of the component
// const default_guild_icon_url =
//   "https://cdn.discordapp.com/avatars/1202703374110167170/0844687cfd957459a769153ae9eb33ce.png";
const default_guild_icon_url = salty512;

export const ShowGuilds: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [guilds, setGuilds] = useState<Guild[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    const fetchUserAndGuilds = async () => {
      try {
        const userResponse = await axios.get<User>(
          `${config.API_URL}/users/me`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const guildsResponse = await axios.get<{ guilds: Guild[] }>(
          `${config.API_URL}/guilds`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setUser(userResponse.data);
        // Correctly access the nested guilds array
        setGuilds(guildsResponse.data.guilds);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndGuilds();
  }, []);

  // Debugging: Log the states after they are set
  useEffect(() => {
    console.log("User:", user);
    console.log("Guilds:", guilds);
  }, [user, guilds]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="container mx-auto h-screen">
        <div className="flex items-center h-full justify-center">
          <div className="h-3/4">
            <h1 className="text-white text-4xl mb-10 text-center">Guilds</h1>
            {guilds && guilds.length > 0 ? (
              <div className="pt-10 pb-6 h-64 grid grid-cols-3 gap-8">
                {guilds.map((guild) => (
                  <div
                    key={guild.id}
                    onClick={() =>
                      (window.location.href = `/guilds/${guild.id}`)
                    }
                    className="transition duration-500 transform hover:scale-105 bg-gray-700 hover:bg-gray-600 shadow rounded mb-12 cursor-pointer"
                  >
                    <div className="flex justify-center md:justify-center -mt-16">
                      <img
                        className="rounded-full border-2 bg-gray-700"
                        src={guild.icon_url || default_guild_icon_url}
                        alt={guild.name}
                        width="150"
                      />
                    </div>
                    <div className="px-6 py-4">
                      <h2 className="text-white text-2xl font-semibold text-center break-words">
                        {guild.name}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white text-center">
                No mutual guilds found where you have the proper permissions,
                please invite the bot to a server.
              </p>
            )}
          </div>

          <div className="absolute top-0 right-0 mr-5 mt-5">
            <div className="flex items-center gap-2">
              <img
                src={user?.avatar_url}
                width="50"
                alt=""
                className="rounded-full"
              />
              <h3 className="text-white text-center text-xl font-semibold">
                {user?.username}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
