import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to recover password using email', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPassword.execute({
      password: '123123',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset password with non existing token', async () => {
    await expect(
      resetPassword.execute({
        password: '123123',
        token: "i'm not real",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password for non existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate("i'm a lie");

    await expect(
      resetPassword.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with expired token', async () => {
    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
