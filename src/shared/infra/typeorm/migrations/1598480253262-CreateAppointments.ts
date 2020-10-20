import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAppointments1598480253262
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appointments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
            comment: 'Id do agendamento',
          },
          {
            name: 'provider',
            type: 'varchar',
            comment: 'Nome do provedor de serviço (barbeiro)',
          },
          {
            name: 'date',
            type: 'timestamp with time zone',
            comment: 'Data/hora do agendamento',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('appointments');
  }
}
