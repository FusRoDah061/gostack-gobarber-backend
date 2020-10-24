import { MigrationInterface, QueryRunner } from 'typeorm';

export default class SetDefaultAvatar1603497281776
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE users SET avatar='default_avatar.jpg' WHERE avatar IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE users ALTER avatar SET DEFAULT 'default_avatar.jpg'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE users SET avatar=NULL WHERE avatar='default_avatar.jpg'`,
    );

    await queryRunner.query(`ALTER TABLE users ALTER avatar SET DEFAULT NULL`);
  }
}
