export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  country?: string;
  postalCode?: string;
  houseNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  phone?: string;
};

export function fullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
