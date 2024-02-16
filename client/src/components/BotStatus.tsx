import React from "react";

interface Props {
  status: string | undefined;
}

export const BotStatus: React.FC<Props> = ({ status }) => {
  return (
    <div>
      <h1 className="text-white font-semibold text-xl text-center mb-3">
        Status
      </h1>
      <p
        className={`bg-${
          !status ? "red-500" : "green-700"
        } text-white font-bold py-2 px-4 rounded`}
      >
        {!status ? "Offline" : "Online"}
      </p>
    </div>
  );
};
