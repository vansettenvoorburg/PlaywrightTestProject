import { expect, Page } from '@playwright/test';
import { NavMenu } from './components/nav-menu';

export type Registration = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  postalCode: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password: string;
};

export class RegisterPage {
  readonly menu: NavMenu;

  constructor(private readonly page: Page) {
    this.menu = new NavMenu(page);
  }

  get title() {
    return this.page.getByRole('heading', { name: 'Klantregistratie' });
  }

  get firstNameInput() {
    return this.page.getByLabel('Voornaam');
  }

  get lastNameInput() {
    return this.page.getByLabel('Achternaam');
  }

  get dateOfBirthInput() {
    return this.page.getByLabel('Geboortedatum');
  }

  get countrySelect() {
    return this.page.getByLabel('Land');
  }

  get postalCodeInput() {
    return this.page.getByLabel('Postcode');
  }

  get houseNumberInput() {
    return this.page.getByLabel('Huisnummer');
  }

  get streetInput() {
    return this.page.getByLabel('Straat');
  }

  get cityInput() {
    return this.page.getByLabel('Stad');
  }

  get stateInput() {
    return this.page.getByLabel('Provincie');
  }

  get phoneInput() {
    return this.page.getByLabel('Telefoon');
  }

  get emailInput() {
    return this.page.getByLabel('E-mailadres');
  }

  get passwordInput() {
    return this.page.getByLabel('Wachtwoord');
  }

  get registerButton() {
    return this.page.getByRole('button', { name: 'Registreren' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toBeVisible();
  }

  async registerWithAllFields(user: Registration): Promise<void> {
    await this.fillRequiredFields(user);
    await this.fillOtherFields(user);
    await this.registerButton.click();
  }

  async registerWithRequiredFields(user: Registration): Promise<void> {
    await this.fillRequiredFields(user);
    await this.expectAutoFilledValues(user);
    await this.registerButton.click();
  }

  async fillRequiredFields(user: Registration): Promise<void> {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.dateOfBirthInput.fill(user.dateOfBirth);
    await this.countrySelect.selectOption(user.country);
    const addressLookups = this.waitForAddressLookups(2);
    await this.postalCodeInput.fill(user.postalCode);
    await this.houseNumberInput.fill(user.houseNumber);
    await addressLookups;
    await this.phoneInput.fill(user.phone);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
  }

  async fillOtherFields(user: Registration): Promise<void> {
    await this.streetInput.fill(user.street);
    await this.cityInput.fill(user.city);
    await this.stateInput.fill(user.state);
  }

  async expectAutoFilledValues(user: Registration): Promise<void> {
    await expect(this.streetInput).toHaveValue(user.street);
    await expect(this.cityInput).toHaveValue(user.city);
    await expect(this.stateInput).toHaveValue(user.state);
  }

  private async waitForAddressLookups(count: number): Promise<void> {
    let received = 0;
    await this.page.waitForResponse(response => response.url().includes('/postcode-lookup') && ++received === count);
  }
}
