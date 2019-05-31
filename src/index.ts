/**
 * Author: John Hooks <bitmachina@outlook.com>
 * URL: https://github.com/fpvcult/frequeny
 * Version: 0.2.0
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

export class Channel {
  constructor(
    readonly band: number,
    readonly channel: number,
    readonly frequency: number,
    readonly name: string
  ) {}
}

export class Frequency {
  private byNameOrIndex: IndexOf<Channel> = {};
  private byFrequency: IndexOf<Array<Channel>> = {};
  constructor(config: Config = "laprf") {
    if (config !== "laprf" && config !== "rx5808") {
      throw new Error("Invalid configuration input");
    }

    const order = (config === "laprf" ? laprf : rx5808).split("");
    console.log(order);
    for (let i = 0; i < order.length; i++) {
      const bandName = order[i];
      const frequencies = bands[bandName];
      console.log(order[i]);
      for (let j = 0; j < frequencies.length; j++) {
        const band = i + 1;
        const channel = j + 1;
        const index = i * 8 + j;
        const frequency = frequencies[j];
        const name = bandName + channel;
        const current = new Channel(band, channel, frequency, name);
        this.byNameOrIndex[name] = this.byNameOrIndex[index] = current;
        this.byFrequency[frequency] = this.byFrequency[frequency] || [];
        this.byFrequency[frequency].push(current);
      }
    }
  }

  get(name: string): Channel | undefined;
  get(band: number, channel: number): Channel | undefined;
  get(arg1: string | number, arg2?: number): Channel | undefined {
    if (typeof arg1 === "string") {
      return this.byNameOrIndex[arg1.toUpperCase()];
    } else if (typeof arg1 === "number" && typeof arg2 === "number") {
      const index = (arg1 - 1) * 8 + (arg2 - 1);
      return this.byNameOrIndex[index];
    }
    return undefined;
  }

  getByFrequency(frequency: number): Channel | Channel[] | undefined {
    const channels = this.byFrequency[frequency];
    if (channels !== undefined && channels.length === 1) return channels[0];
    return channels;
  }
}
