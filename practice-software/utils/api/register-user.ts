import { ApiClient } from '../../../api-helper/api-client';
import { User } from '../../test-data/user';

export async function registerUser(apiClient: ApiClient, user: User) {
  await apiClient.post('/users/register', {
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    password: user.password,
  }, { expectedStatus: 201 });
}
