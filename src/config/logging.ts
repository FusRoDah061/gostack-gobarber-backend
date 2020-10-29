import SimpleNodeLoggerLogProvider from '@shared/container/providers/LogProvider/implementations/SimpleNodeLoggerLogProvider';
import ILogProvider from '@shared/container/providers/LogProvider/models/ILogProvider';

interface ILoggingConfig {
  createLogger(module: string): ILogProvider;
}

const DefaultLogger = SimpleNodeLoggerLogProvider;

export default {
  createLogger: (module: string): ILogProvider => {
    const logger = new DefaultLogger();
    logger.setModuleName(module);
    logger.setLevel(process.env.LOG_LEVEL || 'info');
    return logger;
  },
} as ILoggingConfig;
