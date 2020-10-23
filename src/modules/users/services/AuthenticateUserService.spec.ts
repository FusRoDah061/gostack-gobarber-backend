import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRespository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRespository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRespository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRespository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    const response = await authenticateUser.execute({
      email: 'teste@email.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non-existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'teste@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRespository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    await expect(
      authenticateUser.execute({
        email: 'teste@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
