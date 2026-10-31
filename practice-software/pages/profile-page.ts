import { expect, Page } from '@playwright/test';
import { NavMenu } from './components/nav-menu';
import { Registration } from '../test-data/user';

export class ProfilePage {
  readonly menu: NavMenu;

  constructor(private readonly page: Page) {
    this.menu = new NavMenu(page);
  }

  private get title() {
    return this.page.getByRole('heading', { name: 'Profiel' });
  }

  private get firstNameInput() {
    return this.page.getByLabel('Voornaam');
  }

  private get lastNameInput() {
    return this.page.getByLabel('Achternaam');
  }

  private get emailInput() {
    return this.page.getByLabel('E-mailadres');
  }

  private get phoneInput() {
    return this.page.getByLabel('Telefoon');
  }

  private get streetInput() {
    return this.page.getByLabel('Straat');
  }

  private get postalCodeInput() {
    return this.page.getByLabel('Postcode');
  }

  private get cityInput() {
    return this.page.getByLabel('Stad');
  }

  private get stateInput() {
    return this.page.getByLabel('Provincie');
  }

  private get countrySelect() {
    return this.page.getByLabel('Land');
  }

  private get totpSecret() {
    return this.page.getByTestId('totp-secret');
  }

  private get totpCodeInput() {
    return this.page.getByLabel('TOTP code');
  }

  private get verifyTotpButton() {
    return this.page.getByRole('button', { name: 'TOTP verifiëren' });
  }

  private get totpEnabledMessage() {
    return this.page.getByRole('status').filter({ hasText: 'TOTP verified and enabled successfully' });
  }

  async readTotpSecret(): Promise<string> {
    await expect(this.totpSecret).not.toBeEmpty();
    return (await this.totpSecret.innerText()).trim();
  }

  async activateTotp(code: string): Promise<void> {
    await this.totpCodeInput.fill(code);
    await this.verifyTotpButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toBeVisible();
  }

  async expectDetails(user: Registration): Promise<void> {
    await expect(this.firstNameInput).toHaveValue(user.firstName);
    await expect(this.lastNameInput).toHaveValue(user.lastName);
    await expect(this.emailInput).toHaveValue(user.email);
    await expect(this.phoneInput).toHaveValue(user.phone);
    await expect(this.streetInput).toHaveValue(user.street);
    await expect(this.postalCodeInput).toHaveValue(user.postalCode);
    await expect(this.cityInput).toHaveValue(user.city);
    await expect(this.stateInput).toHaveValue(user.state);
    await expect(this.countrySelect).toHaveValue(user.country);
  }

  async expectTotpEnabled(): Promise<void> {
    await expect(this.totpEnabledMessage).toBeVisible();
  }
}
