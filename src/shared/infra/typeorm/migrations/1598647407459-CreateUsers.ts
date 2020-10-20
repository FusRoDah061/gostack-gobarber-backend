import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUsers1598647407459 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
            comment: 'Id do usuário',
          },
          {
            name: 'name',
            type: 'varchar',
            comment: 'Nome do usuário',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: false,
            comment: 'Email do usuário',
          },
          {
            name: 'password',
            type: 'varchar',
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
    await queryRunner.dropTable('users');
  }
}
