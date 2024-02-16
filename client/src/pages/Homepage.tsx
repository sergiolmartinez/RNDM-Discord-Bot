import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../types"; // Ensure this is correctly defined elsewhere in your project
import config from "../config.json";

export const Homepage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
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
    return (
      <div className="h-screen flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4" // Updated from stroke-width to strokeWidth
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
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
            <h1 className="text-white text-xl mb-2">
              Welcome to the RNDM bot homepage!
            </h1>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => (window.location.href = "/login")}
            >
              Login with Discord
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is logged in, show user details and logout option
  return (
    <div className="container mx-auto md:container md:mx-auto text-center h-screen">
      <div className="flex flex-col justify-center items-center h-full">
        <img
          src={user?.avatar_url || "default-avatar-url"}
          alt="User Avatar"
          className="rounded-full w-24 h-24 mb-4"
        />
        <h1 className="text-white text-xl mb-2">
          Logged in as: <span className="font-semibold">{user?.username}</span>
        </h1>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            localStorage.removeItem("access_token");
            window.location.href = "/"; // Redirect to the homepage or a dedicated logged out page
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
