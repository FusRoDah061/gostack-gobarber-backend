import { container } from 'tsyringe';
import SimpleNodeLoggerLogProvider from './implementations/SimpleNodeLoggerLogProvider';
import ILogProvider from './models/ILogProvider';

const providers = {
  simpleNodeLogger: SimpleNodeLoggerLogProvider,
};

container.registerSingleton<ILogProvider>(
  'LogProvider',
  providers.simpleNodeLogger,
);
