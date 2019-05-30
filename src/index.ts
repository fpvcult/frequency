/**
 * Author: John Hooks <bitmachina@outlook.com>
 * URL: https://github.com/fpvcult/frequeny
 * Version: 0.1.0
 *
 * This file is part of Frequency.
 *
 * Frequency is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Frequency is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Frequency.  If not, see <http://www.gnu.org/licenses/>.
 */

type Config = "laprf" | "rx5808";

const rx5808 = "ABEFR";
const laprf = "FREBA";

const bands: { [key: string]: number[] } = {
  A: [5865, 5845, 5825, 5805, 5785, 5765, 5745, 5725],
  B: [5733, 5752, 5771, 5790, 5809, 5828, 5847, 5866],
  E: [5705, 5685, 5665, 5645, 5885, 5905, 5925, 5945],
  F: [5740, 5760, 5780, 5800, 5820, 5840, 5860, 5880],
  R: [5658, 5695, 5732, 5769, 5806, 5843, 5880, 5917]
};

interface IndexOf<T> {
  [key: string]: T;
  [index: number]: T;
}

const indexes = Symbol("indexes");

class Index<T> {
  private names: string[] = [];
  public [indexes]: IndexOf<T> = {};

  get length(): number {
    return this.names.length;
  }

  set(signature: number, name: string, item: T) {
    this[indexes][signature] = this[indexes][name] = item;
    this.names.push(name);
  }

  get(key: string | number): T | undefined {
    return this[indexes][key];
  }

  /**
   * Iterate over just the name values.
   */
  *[Symbol.iterator]() {
    for (let i = 0, len = this.names.length; i < len; i++) {
      yield this.names[i];
    }
  }
}

export class Channel {
  constructor(
    readonly band: number,
    readonly channel: number,
    readonly frequency: number,
    readonly name: string
  ) {}
}

export class Frequency {
  private channels = new Index<Channel>();

  constructor(config: Config = "laprf") {
    if (config !== "laprf" && config !== "rx5808") {
      throw new Error("Invalid configuration input");
    }
    const order = (config === "laprf" ? laprf : rx5808).split("");

    for (let band = 0; band < order.length; band++) {
      const frequencies = bands[order[band]];
      for (let channel = 0; channel < frequencies.length; channel++) {
        const current = new Channel(
          band + 1,
          channel + 1,
          frequencies[channel],
          order[band] + (channel + 1)
        );
        this.channels.set(band * 8 + channel, current.name, current);
      }
    }
  }

  get(name: string): Channel | undefined;
  get(frequency: number): Channel | undefined;
  get(band: number, channel: number): Channel | undefined;
  get(arg1: string | number, arg2?: number): Channel | undefined {
    if (typeof arg1 === "string") {
      return this.channels.get(arg1.toUpperCase());
    } else if (typeof arg1 === "number" && typeof arg2 === "number") {
      return this.channels.get((arg1 - 1) * 8 + (arg2 - 1));
    } else if (typeof arg1 === "number") {
      for (let key of this.channels) {
        if (this.channels[indexes][key].frequency === arg1) {
          return this.channels[indexes][key];
        }
      }
    }
    return undefined;
  }
}
