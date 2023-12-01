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

import { AlertSender } from "./alerts/AlertSender";
import {
  SystemMonitor,
  SystemMonitorUnregister,
} from "./monitors/SystemMonitor";
import {
  MemoryMonitorInput,
  newMemoryMonitor,
} from "./monitors/memory/MemoryMonitor";
import { CommandLineArguments } from "./cli";

const memoryMonitor = function (
  sender: AlertSender,
  args: CommandLineArguments,
): SystemMonitor {
  const inputs: MemoryMonitorInput = {
    objectType: "MemoryMonitorInput",
    interval: args.interval,
    memoryPercent: args.memoryPercent,
  };
  return newMemoryMonitor(sender, inputs);
};

export const initializeMonitors = function (
  sender: AlertSender,
  args: CommandLineArguments,
): SystemMonitorUnregister {
  const monitors: SystemMonitor[] = [];
  monitors.push(memoryMonitor(sender, args));

  const unregsiters = monitors.map((m) => m.watchForAlarm());
  return {
    unregister: function () {
      unregsiters.forEach((u) => u.unregister());
    },
  };
};
