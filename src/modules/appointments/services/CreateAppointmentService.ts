import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ILogProvider from '@shared/container/providers/LogProvider/models/ILogProvider';
import logging from '@config/logging';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
export default class CreateAppointmentService {
  private logger: ILogProvider;

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {
    this.logger = logging.createLogger('CreateAppointmentService');
  }

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    this.logger.info('Starting appointment creation');

    // Obtém o repositório
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      this.logger.debug(
        `Can't create appointment on past date [${appointmentDate}] and current date [${Date.now()}]`,
      );
      throw new AppError("You can't create an appointment on a past date.");
    }

    if (user_id === provider_id) {
      this.logger.debug(`Can't create appointment with yourself`);
      throw new AppError("You can't create an appointment with yourself.");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      this.logger.debug(
        `Appointment hour outside allowed period: [${getHours(
          appointmentDate,
        )}]`,
      );
      throw new AppError(
        'You can only create appointments between 8am and 6pm',
      );
    }

    const appointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (appointmentInSameDate) {
      this.logger.debug(
        `Appointment already exists for date [${appointmentDate}] and provider [${provider_id}]: `,
        appointmentInSameDate,
      );
      throw new AppError('This appointment is already booked.');
    }

    // Cria a entidade
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${formattedDate}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    this.logger.info('Finishing appointment creation');

    return appointment;
  }
}
