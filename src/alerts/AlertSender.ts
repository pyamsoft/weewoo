import { AlertBot } from "./AlertBot";

export type AlertSender = {
  objectType: "AlertSender";

  sendMessage: (data: { monitorName: string; text: string }) => void;
};

export const newAlertSender = function (bots: AlertBot[]): AlertSender {
  return Object.freeze({
    objectType: "AlertSender",

    sendMessage: function (data: { monitorName: string; text: string }) {
      return Promise.all(bots.map((b) => b.sendMessage(data)));
    },
  });
};
