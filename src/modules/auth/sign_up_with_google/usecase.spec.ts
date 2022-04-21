import { GoogleAuthProvider } from 'src/declarations/providers/google_auth';
import { UserRepository } from 'src/declarations/repositories/user';
import { SignUpWithGoogleUseCase } from 'src/modules/auth/sign_up_with_google/usecase';

describe('sign_up_usecase_test', () => {
  const userRepository: UserRepository = {
    find: jest.fn(),
    findByEmail: jest.fn(),
    save: jest.fn(),
  };

  const googleAuthProvider: GoogleAuthProvider = {
    verify: jest.fn(),
    extractEmail: jest.fn(),
  };

  const usecase = new SignUpWithGoogleUseCase(
    userRepository,
    googleAuthProvider,
  );

  it('it should be defined', () => {
    expect(usecase).toBeDefined();
  });

  it('it should throw a badRequestException', async () => {
    const idToken = 'an id token';

    const result = await usecase.execute({ idToken });

    expect(result.isOk()).toBeTruthy();
  });
});
