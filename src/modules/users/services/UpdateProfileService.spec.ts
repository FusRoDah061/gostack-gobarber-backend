import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRespository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRespository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRespository,
      fakeHashProvider,
    );
  });

  it('should be able to update user profile ', async () => {
    const user = await fakeUsersRespository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Teste Junior',
      email: 'testejr@email.com',
    });

    expect(updatedUser.name).toBe('Teste Junior');
    expect(updatedUser.email).toBe('testejr@email.com');
  });

  it('should not be able to update non existing user profile ', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non existing user id',
        name: 'Teste Junior',
        email: 'testejr@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user email to an existing email ', async () => {
    await fakeUsersRespository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    const user = await fakeUsersRespository.create({
      name: 'Teste Junior',
      email: 'testejr@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Teste Junior',
        email: 'teste@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password ', async () => {
    const user = await fakeUsersRespository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Teste Junior',
      email: 'testejr@email.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update user password without old password', async () => {
    const user = await fakeUsersRespository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Teste Junior',
        email: 'testejr@email.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password with wrong old password', async () => {
    const user = await fakeUsersRespository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Teste Junior',
        email: 'testejr@email.com',
        old_password: 'wrong-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
