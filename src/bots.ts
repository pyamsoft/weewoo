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

import { BotConfig } from "./config";
import { newLogger } from "./logger";
import { newDiscordBot } from "./alerts/discord/DiscordBot";
import { AlertBot } from "./alerts/AlertBot";

const logger = newLogger("Bots");

const initializeDiscord = async function (
  config: BotConfig,
  onError: () => void,
): Promise<AlertBot> {
  const bot = newDiscordBot(config, onError);

  const loggedIn = await bot.login();
  if (loggedIn) {
    logger.log("Bot logged in: ", loggedIn);
  } else {
    logger.warn("Bot failed to login!");
  }

  return bot;
};

export const initializeBots = async function (
  config: BotConfig,
  onError: () => void,
): Promise<AlertBot[]> {
  return Promise.all([initializeDiscord(config, onError)]);
};
