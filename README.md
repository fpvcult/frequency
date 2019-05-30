# Frequency

A JavaScript library, written in TypeScript, to lookup 5.8GHz FPV channels.

```
npm i -D @fpvcult/frequency
```

## API

### constructor()

### constructor(config: string)

- `config` - Band organization, valid inputs are `laprf` or `rx5808`.
  If no argument is provided, it will default to `laprf`. It will also
  throw an error if called with an invalid argument.

Examples:

```javascript
const freqs = new Frequency();
const freqs = new Frequency("rx5808");
```

### Class Method: get

`get(name: string): Channel | undefinded`

`get(frequency: number: Channel | undefined`

`get(band: number, channel: number): Channel | undefined`

As aruments, takes either a string representing a channel name `F7` or `e2`, a number
representing a frequency `5800`, or lastly two numbera first for band and second
for channel.

```javascript
freqs.get("F2"); // => Channel { band: 1, channel: 2, frequency: 5760, name: 'F2' }
freqs.get(5800); // => Channel { band: 1, channel: 4, frequency: 5800, name: 'F4' }
freqs.get(2, 8); // => Channel { band: 2, channel: 8, frequency: 5917, name: 'R8' }
```

#### `TODO:`

- Right now providing a frequency argument will return a single channel. Even though
  a channel or two, between bands, share the same frequency. Consider the best method
  to return more than one channel.

- Frequency lookup has too loop though the channels to find the right one. Should
  probably make an index for it too.

### Channel Class

```typescript
export class Channel {
  constructor(
    readonly band: number,
    readonly channel: number,
    readonly frequency: number,
    readonly name: string
  ) {}
}
```
