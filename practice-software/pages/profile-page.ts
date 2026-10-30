import { expect, Page } from '@playwright/test';
import { NavMenu } from './components/nav-menu';

export class ProfilePage {
  readonly menu: NavMenu;

  constructor(private readonly page: Page) {
    this.menu = new NavMenu(page);
  }

  get title() {
    return this.page.getByRole('heading', { name: 'Profiel' });
  }

  get totpSecret() {
    return this.page.locator('[data-test="totp-secret"]');
  }

  get totpCodeInput() {
    return this.page.getByLabel('TOTP code');
  }

  get verifyTotpButton() {
    return this.page.getByRole('button', { name: 'TOTP verifiëren' });
  }

  get totpEnabledMessage() {
    return this.page.getByRole('status').filter({ hasText: 'TOTP verified and enabled successfully' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toBeVisible();
  }

  async readTotpSecret(): Promise<string> {
    await expect(this.totpSecret).not.toBeEmpty();
    return (await this.totpSecret.innerText()).trim();
  }

  async activateTotp(code: string): Promise<void> {
    await this.totpCodeInput.fill(code);
    await this.verifyTotpButton.click();
  }

  async expectTotpEnabled(): Promise<void> {
    await expect(this.totpEnabledMessage).toBeVisible();
  }
}
