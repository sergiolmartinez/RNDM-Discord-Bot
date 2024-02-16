import React, { useEffect } from "react";

export const Logout: React.FC = () => {
  useEffect(() => {
    localStorage.removeItem("access_token");
    // Optionally, update any global state or context to reflect the logout
    // Then redirect
    window.location.href = "/";
  }, []);

  return <div>Logging out...</div>;
};
