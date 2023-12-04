import os from "os";
import { SystemMonitor } from "../SystemMonitor";
import { AlertSender } from "../../alerts/AlertSender";
import { MonitorInput, newMonitor, Runtime } from "./MonitorRuntime";

export type CpuMonitorInput = MonitorInput & {
  objectType: "CpuMonitorInput";
  cpuPercent: number;
};

export type CpuMonitor = SystemMonitor & {
  objectType: "CpuMonitor";
};

type CpuUsage = {
  objectType: "CpuUsage";
  idle: number;
  total: number;
};

const awaitCPUUsagePercent = async function (
  delay: number = 1000,
): Promise<number> {
  return new Promise((resolve) => {
    const stats1 = getCPUInfo();
    const startIdle = stats1.idle;
    const startTotal = stats1.total;

    setTimeout(function () {
      const stats2 = getCPUInfo();
      const endIdle = stats2.idle;
      const endTotal = stats2.total;

      const idle = endIdle - startIdle;
      const total = endTotal - startTotal;
      const perc = idle / total;
      const used = 1 - perc;
      resolve(~~(used * 100));
    }, delay);
  });
};

const getCPUInfo = function (): CpuUsage {
  const cpus = os.cpus();

  let user = 0;
  let nice = 0;
  let sys = 0;
  let idle = 0;
  let irq = 0;

  for (const cpu of cpus) {
    user += cpu.times.user;
    nice += cpu.times.nice;
    sys += cpu.times.sys;
    irq += cpu.times.irq;
    idle += cpu.times.idle;
  }

  const total = user + nice + sys + idle + irq;

  return {
    objectType: "CpuUsage",
    idle: idle,
    total: total,
  };
};

const checkCpuUsage = async function (data: {
  runtime: Runtime;
  input: CpuMonitorInput;
  sender: AlertSender;
}) {
  const { runtime, input, sender } = data;
  const { cpuPercent } = input;

  const percent = await awaitCPUUsagePercent();
  if (percent >= cpuPercent) {
    // Publish out message
    runtime.trigger(() => {
      sender.sendMessage({
        monitorName: "CpuMonitor",
        text: `${new Date()}

High CPU usage: ${percent}%`,
      });
    });
  } else {
    // Reset flag
    runtime.reset(() => {
      sender.sendMessage({
        monitorName: "CpuMonitor",
        text: `${new Date()}

Normal CPU usage: ${percent}%`,
      });
    });
  }
};

export const newCpuMonitor = function (
  sender: AlertSender,
  input: CpuMonitorInput,
): CpuMonitor {
  return newMonitor({
    objectType: "CpuMonitor",
    sender,
    input,
    onCheckMonitor: checkCpuUsage,
  });
};
