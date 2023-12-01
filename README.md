# Simple Monitoring and Alerting System

Monitor a system for things like low memory or high CPU and send a message on Discord


# Install

Copy the `env.default` file to `.env` to get started!

## Discord Alerts

This is not currently a public bot, you need
to make your own Discord App in the developer portal,

You will need to provide a Discord BOT_TOKEN and a dedicated message
BOT_CHANNEL_ID


# Running

You will need to create a Bot in the
[Discord Developer Portal](https://discord.com/developers/applications/).

To simplify setup, we use the `Administrator` permission. This is not required
however, as all the bot needs to be able to do is post messages to a dedicated channel.

```bash
$ yarn start

OR

$ ./bin/dockerize
```


# Usage

When the bot is running it will post messages to the channel defined by `DISCORD_BOT_CHANNEL_ID`


## License

Apache 2

```
Copyright 2023 pyamsoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

[1]: https://raw.githubusercontent.com/pyamsoft/mouswatch/main/art/intents.png
[2]: https://raw.githubusercontent.com/pyamsoft/mouswatch/main/art/show.png
