import { Registration } from '../user';
import { uniqueEmail, uniquePassword } from '../../utils/unique-credentials';

export const registrationUserLookedUpAddress: Registration = {
  firstName: 'Register',
  lastName: 'Tester',
  dateOfBirth: '1990-01-15',
  country: 'NL',
  postalCode: '1012JS',
  houseNumber: '1',
  street: 'van den Pollaan',
  city: 'Laren',
  state: 'Gelderland',
  phone: '0612345678',
  email: uniqueEmail(),
  password: uniquePassword(),
};
