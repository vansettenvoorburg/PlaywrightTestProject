import { User } from '../user';
import { uniqueEmail, uniquePassword } from '../../utils/unique-credentials';

export const totpUser: User = {
  firstName: 'Totp',
  lastName: 'Tester',
  email: uniqueEmail(),
  password: uniquePassword(),
};
