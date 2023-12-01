import { newLogger } from "../../logger";
import { BotConfig } from "../../config";
import {
  Client,
  GatewayIntentBits,
  Partials,
  PartialTextBasedChannelFields,
} from "discord.js";
import { AlertBot } from "../AlertBot";

const logger = newLogger("DiscordBot");

export type DiscordBot = AlertBot & {
  objectType: "DiscordBot";

  login: () => Promise<boolean>;
};

const codeblock = function (text: string): string {
  return "```" + text + "```";
};

export const newDiscordBot = function (
  config: BotConfig,
  onError: () => void,
): DiscordBot {
  // This does exist in the source?
  // noinspection JSUnresolvedReference
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Message, Partials.Channel],
  });

  const { discord } = config;

  client.on("error", (e) => {
    logger.error(e, "Discord bot error!");
    client.destroy().then(() => {
      logger.warn("Discord bot shutdown!");
      onError();
    });
  });

  return Object.freeze({
    objectType: "DiscordBot",

    login: async function () {
      const { token } = discord;
      return client
        .login(token)
        .then(() => {
          logger.log("Bot logged in!");
          return true;
        })
        .catch((e) => {
          logger.error(e, "Error logging in");
          return false;
        });
    },

    sendMessage: async function (data: { monitorName: string; text: string }) {
      const { specificChannel } = discord;
      const channel = client.channels.cache.get(specificChannel);
      if (!channel) {
        logger.warn("Could not resolve Discord channel", specificChannel);
        return;
      }

      const { monitorName, text } = data;
      const message = codeblock(
        `Monitor: ${monitorName}

${text}
`.trim(),
      );

      // Typescript is lame but I know this field exists on a message channel
      return (channel as unknown as PartialTextBasedChannelFields).send(
        message,
      );
    },
  });
};
