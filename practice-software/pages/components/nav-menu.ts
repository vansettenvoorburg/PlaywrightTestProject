import { expect, Page } from '@playwright/test';

export class NavMenu {
  constructor(private readonly page: Page) {}

  private get menuBar() {
    return this.page.getByRole('menubar', { name: 'Main menu' });
  }

  private get signInLink() {
    return this.menuBar.getByRole('link', { name: 'Inloggen' });
  }

  private userMenuButton(name: string) {
    return this.menuBar.getByRole('button', { name });
  }

  private get myAccountLink() {
    return this.menuBar.getByRole('link', { name: 'Mijn account' });
  }

  private get myProfileLink() {
    return this.menuBar.getByRole('link', { name: 'Mijn profiel' });
  }

  private get adminDashboardLink() {
    return this.menuBar.getByRole('link', { name: 'Dashboard' });
  }

  private get signOutItem() {
    return this.menuBar.getByText('Uitloggen');
  }

  async goToSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  async goToMyProfile(name: string): Promise<void> {
    await this.openUserMenu(name);
    await this.myProfileLink.click();
  }

  async signOut(name: string): Promise<void> {
    await this.openUserMenu(name);
    await this.signOutItem.click();
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

  private async openUserMenu(name: string): Promise<void> {
    await this.userMenuButton(name).click();
  }
}
