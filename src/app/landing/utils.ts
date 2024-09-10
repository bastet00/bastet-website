export function toSymbol(sy: string) {
  const symbol = '0x' + sy;
  const entity = parseInt(symbol, 16);
  return `&#${entity};`;
}
