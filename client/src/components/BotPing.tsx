import React from "react";

interface Props {
  ping: number | undefined;
}

export const BotPing: React.FC<Props> = ({ ping }) => {
  return (
    <div>
      <h1 className="text-white font-semibold text-xl text-center mb-3">
        Ping
      </h1>
      <p className="text-center text-white font-bold py-2">
        {ping} {!ping ? "N/A" : " ms"}
      </p>
    </div>
  );
};
