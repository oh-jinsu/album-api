import { None, Some } from 'src/core/enums/option';
import { ProviderError, ProviderOk } from 'src/core/enums/results/provider';
import { RepositoryOk } from 'src/core/enums/results/repository';
import { UserModel } from 'src/declarations/models/user';
import { SignUpWithAppleUseCase } from './usecase';

describe('sign_up_usecase_test', () => {
  const userRepository = {
    find: jest.fn(),
    findByEmail: jest.fn(),
    save: jest.fn(),
  };

  const appleAuthProvider = {
    verify: jest.fn(),
    extractEmail: jest.fn(),
  };

  const usecase = new SignUpWithAppleUseCase(userRepository, appleAuthProvider);

  it('should be defined', () => {
    appleAuthProvider.verify.mockResolvedValue(new ProviderOk(null));

    appleAuthProvider.extractEmail.mockResolvedValue(new ProviderOk('email'));

    userRepository.findByEmail.mockResolvedValue(new RepositoryOk(new None()));

    expect(usecase).toBeDefined();
  });

  it('should fail for a invalid id token', async () => {
    appleAuthProvider.verify.mockResolvedValueOnce(new ProviderError(''));
    const idToken = 'an id token';

    const result = await usecase.execute({ idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe('유효하지 않은 인증정보입니다.');
  });

  it('should fail for a existing user', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(
      new RepositoryOk(new Some(null)),
    );

    const idToken = 'an id token';

    const result = await usecase.execute({ idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);

    expect(result.message).toBe('이미 가입한 이용자입니다.');
  });

  it('should sccess', async () => {
    userRepository.save.mockResolvedValueOnce(
      new RepositoryOk(
        new UserModel({
          id: 1,
          email: 'email',
          refreshToken: null,
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
    );

    const idToken = 'an id token';

    const result = await usecase.execute({ idToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.id).toBe(1);

    expect(result.value.email).toBe('email');
  });
});
