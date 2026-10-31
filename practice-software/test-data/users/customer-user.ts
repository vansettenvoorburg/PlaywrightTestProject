import { User } from '../user';

export const customerUser: User = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: process.env.USER_EMAIL!,
  password: process.env.USER_PASSWORD!,
};
