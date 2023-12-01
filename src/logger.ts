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

import * as console from "console";

const isDebug = process.env.BOT_ENV !== "production";

export type Logger = {
  objectType: "Logger";

  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (e: unknown, ...args: unknown[]) => void;
};

const logTag = function (prefix: string): string {
  return `<${prefix}>`;
};

export const newLogger = function (prefix: string): Logger {
  const tag = prefix ? logTag(prefix) : "";
  return {
    objectType: "Logger",

    log: function (...args: unknown[]) {
      if (isDebug) {
        console.log(tag, ...args);
      }
    },

    warn: function (...args: unknown[]) {
      if (isDebug) {
        console.warn(tag, ...args);
      }
    },

    error: function (e: unknown, ...args: unknown[]) {
      if (isDebug) {
        console.error(tag, e, ...args);
      }
    },
  };
};
