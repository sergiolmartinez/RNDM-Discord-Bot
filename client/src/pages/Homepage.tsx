import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Status } from "../types"; // Ensure this is correctly defined elsewhere in your project
import config from "../config.json";
import { BotInfo } from "../components/BotInfo";
import { UserDetails } from "../components/UserDetails";
import { LoadingScreen } from "../components/LoadingScreen";

export const Homepage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    axios
      .get(`${config.BOT_API_URL}/status`)
      .then((resp) => {
        setStatus(resp.data);
        // setStatus(null);
      })
      .catch((err) => {
        console.error("Error fetching bot status:", err);
      });

    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      setIsLoggedIn(true);
      axios
        .get(`${config.API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((resp) => {
          const user: User = resp.data;
          setUser(user);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          setLoading(false);
          setIsLoggedIn(false); // Assume logged out if there's an error fetching user data
        });
    } else {
      setLoading(false);
      setIsLoggedIn(false);
    }
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  // User is logged in, show user details and logout option
  return (
    <>
      {!isLoggedIn ? (
        <div>
          <div className="container mx-auto text-center h-screen">
            <div className="flex h-full justify-center items-center">
              <div className="container mx-auto">
                {/* For the bot avatar, change the src to your bots avatar url */}
                <img
                  src="https://cdn.discordapp.com/avatars/1202703374110167170/0844687cfd957459a769153ae9eb33ce.png"
                  alt="DIscord Bot Avatar"
                  className="inline mb-5 rounded-full border-2 border-white"
                />
                {/* For this H1 update the name to your bots name or any other welcome message you would like to include */}
                <h1 className="text-white font-semibold text-3xl mb-2">
                  Welcome to the RNDM bot homepage!
                </h1>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  bg-color="#0099ff"
                  onClick={() => (window.location.href = "/login")}
                >
                  Login with Discord
                </button>
                <div className="container border-dashed border-t-2 mt-10">
                  <BotInfo status={status} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto md:container md:mx-auto text-center h-screen">
          <UserDetails user={user} />
        </div>
      )}
    </>
  );
};
