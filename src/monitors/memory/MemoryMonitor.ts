import os from "os";
import { SystemMonitor } from "../SystemMonitor";
import { AlertSender } from "../../alerts/AlertSender";
import { MonitorInput, newMonitor, Runtime } from "../MonitorRuntime";

export type MemoryMonitorInput = MonitorInput & {
  objectType: "MemoryMonitorInput";
  memoryPercent: number;
};

export type MemoryMonitor = SystemMonitor & {
  objectType: "MemoryMonitor";
};

const getPercentFreeMemory = function () {
  const raw = os.freemem() / os.totalmem();

  // Cast float into int
  return ~~(raw * 100);
};

const checkFreeMemorySpace = function (data: {
  runtime: Runtime;
  input: MemoryMonitorInput;
  sender: AlertSender;
}) {
  const { input, runtime, sender } = data;
  const { memoryPercent } = input;

  const percent = getPercentFreeMemory();
  if (percent <= memoryPercent) {
    // Only notify if flag is not set
    runtime.trigger(() => {
      // Publish out message
      sender.sendMessage({
        monitorName: "MemoryMonitor",
        text: `${new Date()}

Running out of memory: ${percent}% Free`,
      });
    });
  } else {
    // Reset flag
    runtime.reset(() => {
      // Publish out message
      sender.sendMessage({
        monitorName: "MemoryMonitor",
        text: `${new Date()}

Memory available: ${percent}% Free`,
      });
    });
  }
};

export const newMemoryMonitor = function (
  sender: AlertSender,
  input: MemoryMonitorInput,
): MemoryMonitor {
  return newMonitor({
    objectType: "MemoryMonitor",
    input,
    sender,
    onCheckMonitor: checkFreeMemorySpace,
  });
};
