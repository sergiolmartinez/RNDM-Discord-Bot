import React from "react";
import { Status } from "../types";
import { BotPing } from "./BotPing";
import { BotServerCount } from "./BotServerCount";
import { BotStatus } from "./BotStatus";

interface Props {
  status: Status | null;
}

export const BotInfo: React.FC<Props> = ({ status }) => {
  return (
    <div>
      {status ? (
        <div className="container my-5 mx-auto lg:w-2/4 md:w-1/3 sm:w-3/4">
          <h1 className="text-white font-semibold text-2xl text-center mb-3">
            Bot Info
          </h1>
          <div className="flex items-center justify-between">
            <BotPing ping={status.ping} />
            <BotStatus status={"online"} />
            <BotServerCount count={status.guilds} />
          </div>
        </div>
      ) : (
        <div className="container mx-auto lg:w-2/4 md:w-1/3 sm:w-3/4">
          <h1 className="text-white font-semibold text-2xl text-center mb-3">
            Bot Info
          </h1>
          <div className="flex items-center justify-between">
            <BotPing ping={undefined} />
            <BotStatus status={undefined} />
            <BotServerCount count={undefined} />
          </div>
        </div>
      )}
    </div>
  );
};
