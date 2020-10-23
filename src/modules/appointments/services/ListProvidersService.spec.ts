import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRespository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRespository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRespository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRespository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    const user2 = await fakeUsersRespository.create({
      name: 'Teste Jr',
      email: 'testejr@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    const loggedUser = await fakeUsersRespository.create({
      name: 'Teste Logado',
      email: 'testelogado@email.com',
      password: '123456',
      avatar: 'avatar.jpg',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
