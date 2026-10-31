import { User } from '../user';

export const adminUser: User = {
  firstName: 'John',
  lastName: 'Doe',
  email: process.env.ADMIN_EMAIL!,
  password: process.env.ADMIN_PASSWORD!,
};
