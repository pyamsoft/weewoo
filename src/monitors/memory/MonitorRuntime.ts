import { AlertSender } from "../../alerts/AlertSender";
import { SystemMonitorUnregister } from "../SystemMonitor";
import { newLogger } from "../../logger";

const logger = newLogger("MonitorRuntime");

export type Runtime = {
  objectType: "Runtime";

  seenCount: number;

  bumpSeenCount: () => void;

  trigger: (onTrigger: () => void) => void;
  reset: (onReset: () => void) => void;
};

const newRuntime = function (): Runtime {
  let triggered = false;
  let seenCount = 0;

  return {
    objectType: "Runtime",

    seenCount,

    trigger: function (onTrigger: () => void) {
      if (!triggered) {
        seenCount = 0;
        triggered = true;
        onTrigger();
      }
    },

    bumpSeenCount: function () {
      seenCount += 1;
    },

    reset: function (onReset: () => void) {
      if (triggered) {
        seenCount = 0;
        triggered = false;
        onReset();
      }
    },
  };
};

export type MonitorInput = {
  interval: number;
};

export const newMonitor = function <T, I extends MonitorInput>(data: {
  objectType: string;
  sender: AlertSender;
  input: I;
  onCheckMonitor: (data: {
    runtime: Runtime;
    input: I;
    sender: AlertSender;
  }) => void;
}): T {
  const { objectType, sender, input, onCheckMonitor } = data;
  const { interval } = input;
  const runtime = newRuntime();
  const res = {
    objectType,

    watchForAlarm(): SystemMonitorUnregister {
      logger.log(`Watch for ${objectType} alarm`);

      const id = setInterval(() => {
        onCheckMonitor({ runtime, input, sender });
      }, interval);
      return {
        unregister: function () {
          logger.log(`Stop watch for ${objectType} alarm`);
          clearInterval(id);
        },
      };
    },
  };

  return res as T;
};
