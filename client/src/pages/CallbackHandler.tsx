import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import config from "../config.json";

interface TokenResponse {
  access_token: string | null;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export const CallbackHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    // Ensure code is not null before proceeding
    if (code) {
      axios
        .post(`${config.API_URL}/oauth/callback`, {
          code: code,
        })
        .then((res) => {
          const data: TokenResponse = res.data;
          if (data.access_token === null) {
            window.location.href = "/login";
          } else {
            // console.log("Access token:", data.access_token);
            localStorage.removeItem("access_token"); // Clear the old token
            localStorage.setItem("access_token", data.access_token); // Set the new token

            // Redirect to the homepage or dashboard
            window.location.href = "/";
          }
        })
        .catch((err) => {
          console.error(err);
          window.location.href = "/login"; // Redirect to login on error
        });
    }
  }, [code]); // Add code as a dependency to useEffect

  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-white text-5xl text-center">Redirecting...</h1>
    </div>
  );
};
