import { expect, Page } from '@playwright/test';
import { NavMenu } from './components/nav-menu';
import { User } from '../test-data/user';

export type Registration = Required<User>;

export class RegisterPage {
  readonly menu: NavMenu;

  constructor(private readonly page: Page) {
    this.menu = new NavMenu(page);
  }

  private get title() {
    return this.page.getByRole('heading', { name: 'Klantregistratie' });
  }

  private get firstNameInput() {
    return this.page.getByLabel('Voornaam');
  }

  private get lastNameInput() {
    return this.page.getByLabel('Achternaam');
  }

  private get dateOfBirthInput() {
    return this.page.getByLabel('Geboortedatum');
  }

  private get countrySelect() {
    return this.page.getByLabel('Land');
  }

  private get postalCodeInput() {
    return this.page.getByLabel('Postcode');
  }

  private get houseNumberInput() {
    return this.page.getByLabel('Huisnummer');
  }

  private get streetInput() {
    return this.page.getByLabel('Straat');
  }

  private get cityInput() {
    return this.page.getByLabel('Stad');
  }

  private get stateInput() {
    return this.page.getByLabel('Provincie');
  }

  private get phoneInput() {
    return this.page.getByLabel('Telefoon');
  }

  private get emailInput() {
    return this.page.getByLabel('E-mailadres');
  }

  private get passwordInput() {
    return this.page.getByLabel('Wachtwoord');
  }

  private get registerButton() {
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

  private async fillRequiredFields(user: Registration): Promise<void> {
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

  private async fillOtherFields(user: Registration): Promise<void> {
    await this.streetInput.fill(user.street);
    await this.cityInput.fill(user.city);
    await this.stateInput.fill(user.state);
  }

  private async expectAutoFilledValues(user: Registration): Promise<void> {
    await expect(this.streetInput).toHaveValue(user.street);
    await expect(this.cityInput).toHaveValue(user.city);
    await expect(this.stateInput).toHaveValue(user.state);
  }

  // TODO: Workaround. The site sends the postcode lookup twice, and the second response overwrites
  // the street, city and state that were already filled in. Keep this until it is confirmed that the
  // double lookup is intended, or until it is fixed as a bug.
  private async waitForAddressLookups(count: number): Promise<void> {
    let received = 0;
    await this.page.waitForResponse(response => {
      if (!response.url().includes('/postcode-lookup')) return false;
      received++;
      return received === count;
    });
  }
}
