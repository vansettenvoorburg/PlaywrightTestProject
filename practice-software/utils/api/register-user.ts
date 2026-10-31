import { ApiClient } from '../../../api-helper/api-client';

type NewUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export async function registerUser(apiClient: ApiClient, user: NewUser) {
  const result = await apiClient.post('/users/register', {
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    password: user.password,
  });
  if (result.status !== 201) {
    throw new Error(`Registering user failed with status ${result.status}: ${JSON.stringify(result.body)}`);
  }
}
