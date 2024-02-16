import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { CallbackHandler } from "./pages/CallbackHandler";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/callback" element={<CallbackHandler />} />
      </Routes>
    </BrowserRouter>
  );
};
