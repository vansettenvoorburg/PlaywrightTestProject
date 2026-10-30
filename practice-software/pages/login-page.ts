import { expect, Page } from '@playwright/test';
import { NavMenu } from './components/nav-menu';

export class LoginPage {
  readonly menu: NavMenu;

  constructor(private readonly page: Page) {
    this.menu = new NavMenu(page);
  }

  get title() {
    return this.page.getByRole('heading', { name: 'Inloggen' });
  }

  get emailInput() {
    return this.page.getByLabel('E-mailadres');
  }

  get passwordInput() {
    return this.page.getByLabel('Wachtwoord');
  }

  get loginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }

  get totpCodeInput() {
    return this.page.getByLabel('TOTP-code');
  }

  get verifyTotpButton() {
    return this.page.getByRole('button', { name: 'TOTP verifiëren' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyTotp(code: string): Promise<void> {
    await this.totpCodeInput.fill(code);
    await this.verifyTotpButton.click();
  }
}
