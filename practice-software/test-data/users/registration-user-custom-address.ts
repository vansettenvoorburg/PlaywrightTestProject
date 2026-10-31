import { User } from '../user';
import { uniqueEmail, uniquePassword } from '../../utils/unique-credentials';

export const registrationUserCustomAddress: Required<User> = {
  firstName: 'Register',
  lastName: 'Tester',
  dateOfBirth: '1990-01-15',
  country: 'NL',
  postalCode: '1012JS',
  houseNumber: '1',
  street: 'Teststraat',
  city: 'Testdorp',
  state: 'Utrecht',
  phone: '0612345678',
  email: uniqueEmail(),
  password: uniquePassword(),
};
