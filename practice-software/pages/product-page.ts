import { Page } from '@playwright/test';
import { NavMenu } from './components/nav-menu';

export class ProductPage {
  readonly menu: NavMenu;

  constructor(private readonly page: Page) {
    this.menu = new NavMenu(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
