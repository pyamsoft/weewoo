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

import { sourceConfig } from "./config";
import { newLogger } from "./logger";
import { registerPeriodicHealthCheck } from "./health";
import { newAlertSender } from "./alerts/AlertSender";
import { initializeMonitors } from "./monitors";
import { CommandLineArguments } from "./cli";
import { initializeBots } from "./bots";

const logger = newLogger("WeeWoo");

const collectCmdArgs = async function (): Promise<CommandLineArguments> {
  return {
    objectType: "CommandLineArguments",

    // 15 seconds between checks
    interval: 15 * 1000,

    // Warn if free memory below 15%
    memoryPercent: 15,

    // Warn if CPU usage above 10%
    cpuPercent: 10,
  };
};

const main = function () {
  const config = sourceConfig();

  const { healthCheckUrl } = config;
  const healthCheck = registerPeriodicHealthCheck(healthCheckUrl);

  Promise.resolve().then(async () => {
    try {
      logger.log("All bots initialized");

      const bots = await initializeBots(config, () => {
        logger.warn("Bot received at error, shutdown!");
        healthCheck.unregister();
        system.unregister();
      });

      const sender = newAlertSender(bots);
      const args = await collectCmdArgs();
      const system = initializeMonitors(sender, args);
    } catch (e) {
      logger.error(e, "Error during bot initialization!");
      healthCheck.unregister();
    }
  });
};

main();
