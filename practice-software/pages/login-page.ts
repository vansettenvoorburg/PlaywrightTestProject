import { expect, Page } from '@playwright/test';
import { NavMenu } from './components/nav-menu';

export class LoginPage {
  readonly menu: NavMenu;

  constructor(private readonly page: Page) {
    this.menu = new NavMenu(page);
  }

  private get title() {
    return this.page.getByRole('heading', { name: 'Inloggen' });
  }

  private get emailInput() {
    return this.page.getByLabel('E-mailadres');
  }

  private get passwordInput() {
    return this.page.getByLabel('Wachtwoord');
  }

  private get loginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }

  private get registerLink() {
    return this.page.getByRole('link', { name: 'Register your account' });
  }

  private get totpCodeInput() {
    return this.page.getByLabel('TOTP-code');
  }

  private get verifyTotpButton() {
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

  async goToRegister(): Promise<void> {
    await this.registerLink.click();
  }

  async verifyTotp(code: string): Promise<void> {
    await this.totpCodeInput.fill(code);
    await this.verifyTotpButton.click();
  }
}
