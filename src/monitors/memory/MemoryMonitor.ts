import { SystemMonitor, SystemMonitorUnregister } from "../SystemMonitor";
import { newLogger } from "../../logger";
import { AlertSender } from "../../alerts/AlertSender";
import os from "os";

const logger = newLogger("MemoryMonitor");

export type MemoryMonitorInput = {
  objectType: "MemoryMonitorInput";
  interval: number;
  memoryPercent: number;
};

export type MemoryMonitor = SystemMonitor & {
  objectType: "MemoryMonitor";
};

type Runtime = {
  triggered: boolean;
};

const getPercentFreeMemory = function () {
  const raw = os.freemem() / os.totalmem();

  // Cast float into int
  return ~~(raw * 100);
};

const checkFreeMemorySpace = function (
  runtime: Runtime,
  input: MemoryMonitorInput,
  sender: AlertSender,
) {
  const { memoryPercent } = input;

  const percent = getPercentFreeMemory();
  if (percent <= memoryPercent) {
    // Only notify if flag is not set
    if (!runtime.triggered) {
      runtime.triggered = true;

      // Publish out message
      sender.sendMessage({
        monitorName: "MemoryMonitor",
        text: `${new Date()}

Running out of memory: ${percent}% Free`,
      });
    }
  } else {
    // Reset flag
    if (runtime.triggered) {
      runtime.triggered = false;

      // Publish out message
      sender.sendMessage({
        monitorName: "MemoryMonitor",
        text: `${new Date()}

Memory available: ${percent}% Free`,
      });
    }
  }
};

export const newMemoryMonitor = function (
  sender: AlertSender,
  input: MemoryMonitorInput,
): MemoryMonitor {
  const { interval } = input;
  const runtime: Runtime = {
    triggered: false,
  };
  return {
    objectType: "MemoryMonitor",

    watchForAlarm(): SystemMonitorUnregister {
      logger.log("Watch for Memory alarm");

      const id = setInterval(() => {
        checkFreeMemorySpace(runtime, input, sender);
      }, interval);
      return {
        unregister: function () {
          logger.log("Stop watch for Memory alarm");
          clearInterval(id);
        },
      };
    },
  };
};
