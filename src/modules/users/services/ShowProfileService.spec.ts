import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRespository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRespository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRespository);
  });

  it('should be able to show user profile ', async () => {
    const user = await fakeUsersRespository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Teste');
    expect(profile.email).toBe('teste@email.com');
  });

  it('should not be able to show non existing user profile ', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non existing user id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
