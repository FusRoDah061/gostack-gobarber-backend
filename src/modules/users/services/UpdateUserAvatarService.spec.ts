import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRespository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRespository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRespository,
      fakeStorageProvider,
    );
  });

  it('should be able to update user avatar', async () => {
    const user = await fakeUsersRespository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    });

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update non existing user avatar', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: "i dont't exist",
        avatarFilename: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should delete user's old avatar when setting a new one", async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRespository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.png');
    expect(user.avatar).toBe('avatar2.png');
  });
});
