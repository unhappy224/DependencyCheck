import chalk from 'chalk';

export function flatMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U[]): U[] {
  return Array.prototype.concat(...array.map(callbackfn));
}

export function exit(msg?: string, code: number = -1) {
  if (msg) {
    console.log(msg);
  }
  process.exit(code);
}
export function err(msg?: string) {
  if (msg) {
    console.log(chalk.red('Error: ') + msg);
  }
  process.exit(-1);
}
