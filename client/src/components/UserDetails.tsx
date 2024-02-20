import React from "react";
import { User } from "../types";

interface Props {
  user: User | null;
}

export const UserDetails: React.FC<Props> = ({ user }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <img
        src={user?.avatar_url || "default-avatar-url"}
        alt="User Avatar"
        className="rounded-full w-24 h-24 mb-4"
      />
      <h1 className="text-white text-xl mb-2">
        Logged in as: <span className="font-semibold">{user?.username}</span>
      </h1>
      <div className="flex items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-5 rounded"
          onClick={() => {
            window.location.href = "/guilds"; // Redirect to the homepage or a dedicated logged out page
          }}
        >
          Go to Guilds
        </button>

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
