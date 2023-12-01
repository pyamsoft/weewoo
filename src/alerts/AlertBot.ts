export type AlertBot = {
  sendMessage: (data: {
    monitorName: string;
    text: string;
  }) => Promise<unknown>;
};
