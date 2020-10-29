import ILogProvider from '../models/ILogProvider';

export default class FakeLogProvider implements ILogProvider {
  public info(...args: any[]): void {
    console.log(args);
  }

  public debug(...args: any[]): void {
    console.log(args);
  }

  public error(...args: any[]): void {
    console.log(args);
  }

  public setLevel(level: string): void {
    console.log(level);
  }

  public setModuleName(name: string): void {
    console.log(name);
  }
}
