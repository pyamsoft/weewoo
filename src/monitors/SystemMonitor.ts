export type SystemMonitorUnregister = {
  unregister: () => void;
};

export type SystemMonitor = {
  watchForAlarm: () => SystemMonitorUnregister;
};
