import { ApiClient } from '../../../api-helper/api-client';
import { User } from '../../test-data/user';

export async function loginUser(apiClient: ApiClient, user: User) {
  const result = await apiClient.post('/users/login', {
    email: user.email,
    password: user.password,
  }, { expectedStatus: 200 });
  apiClient.setAuthorizationToken((result.body as { access_token: string }).access_token);
}
