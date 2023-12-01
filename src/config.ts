/*
 * Copyright 2023 pyamsoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import env from "dotenv";
import { newLogger } from "./logger";

const logger = newLogger("BotConfig");

// Use require here instead of import
//
// Parse the .env file if one exists
env.config();

export type BotConfig = {
  objectType: "BotConfig";

  healthCheckUrl: string;

  discord: {
    token: string;
    specificChannel: string;
  };
};

export const sourceConfig = function (): BotConfig {
  const config: BotConfig = Object.freeze({
    objectType: "BotConfig",

    healthCheckUrl: process.env.BOT_HEALTHCHECK_URL || "",

    discord: {
      token: process.env.DISCORD_BOT_TOKEN || "",
      specificChannel: process.env.DISCORD_BOT_CHANNEL_ID || "",
    },
  });
  logger.log("Bot Config: ", config);
  return config;
};
