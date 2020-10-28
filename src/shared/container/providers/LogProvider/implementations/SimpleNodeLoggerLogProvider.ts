import { createSimpleLogger } from 'simple-node-logger';
import ILogProvider from '../models/ILogProvider';

export default class SimpleNodeLoggerLogProvider implements ILogProvider {
  private logger: any;

  constructor(module: string) {
    this.logger = createSimpleLogger({ domain: module });
  }

  public info(...args: any[]): void {
    this.logger.info(...args);
  }

  public debug(...args: any[]): void {
    this.logger.debug(...args);
  }

  public error(...args: any[]): void {
    this.logger.error(...args);
  }

  setLevel(level: string): void {
    this.logger.setLevel(level);
  }
}
