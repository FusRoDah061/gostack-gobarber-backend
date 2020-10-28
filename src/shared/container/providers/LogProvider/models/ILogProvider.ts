export default interface ILogProvider {
  info(...args: any[]): void;
  debug(...args: any[]): void;
  error(...args: any[]): void;
  setLevel(level: string): void;
}
