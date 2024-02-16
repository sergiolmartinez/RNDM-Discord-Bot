import React from "react";

interface Props {
  count: number | undefined;
}

export const BotServerCount: React.FC<Props> = ({ count }) => {
  return (
    <div>
      <h1 className="text-white font-semibold text-xl text-center mb-3">
        Servers
      </h1>
      <p className="text-center text-white font-bold py-2">
        {!count ? "N/A" : count}
      </p>
    </div>
  );
};
