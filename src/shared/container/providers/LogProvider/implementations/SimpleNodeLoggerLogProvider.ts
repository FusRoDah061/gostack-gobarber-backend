import { createSimpleLogger } from 'simple-node-logger';
import ILogProvider from '../models/ILogProvider';

export default class SimpleNodeLoggerLogProvider implements ILogProvider {
  private logger: any = createSimpleLogger();

  private moduleName: string;

  public info(...args: any[]): void {
    this.logger.info(`[${this.moduleName}]\t`, ...args);
  }

  public debug(...args: any[]): void {
    this.logger.debug(`[${this.moduleName}]\t`, ...args);
  }

  public error(...args: any[]): void {
    this.logger.error(`[${this.moduleName}]\t`, ...args);
  }

  public setLevel(level: string): void {
    this.logger.setLevel(level);
  }

  public setModuleName(name: string): void {
    this.moduleName = name;
  }
}
