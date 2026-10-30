import { expect, Page } from '@playwright/test';

export class NavMenu {
  constructor(private readonly page: Page) {}

  get menuBar() {
    return this.page.getByRole('menubar', { name: 'Main menu' });
  }

  get signInLink() {
    return this.menuBar.getByRole('link', { name: 'Inloggen' });
  }

  get adminDashboardLink() {
    return this.menuBar.getByRole('link', { name: 'Dashboard' });
  }

  get myAccountLink() {
    return this.menuBar.getByRole('link', { name: 'Mijn account' });
  }

  userMenuButton(name: string) {
    return this.menuBar.getByRole('button', { name });
  }

  async goToSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  async openUserMenu(name: string): Promise<void> {
    await this.userMenuButton(name).click();
  }

  async expectLoggedInAsAdmin(name: string): Promise<void> {
    await this.openUserMenu(name);
    await expect(this.adminDashboardLink).toBeVisible();
    await expect(this.myAccountLink).toBeHidden();
  }

  async expectLoggedInAsUser(name: string): Promise<void> {
    await this.openUserMenu(name);
    await expect(this.myAccountLink).toBeVisible();
    await expect(this.adminDashboardLink).toBeHidden();
  }
}
