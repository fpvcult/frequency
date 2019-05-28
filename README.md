# Frequency

A JavaScript library, written in TypeScript, to lookup 5.8GHz FPV channels.

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

`get(name: string): Channel`
`get(band: number, channel: number): Channel`

Either takes a string representing a channel name `A1` or `R8`. Or takes two number arguments, first for band and second for channel.

```javascript
freqs.get("F2"); // => Channel { band: 1, channel: 2, frequency: 5760, name: 'F2' }
freqs.get(2, 8); // => Channel { band: 2, channel: 8, frequency: 5917, name: 'R8' }
```

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
