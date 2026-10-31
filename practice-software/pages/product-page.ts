import { expect, Locator, Page } from '@playwright/test';
import { NavMenu } from './components/nav-menu';

export class ProductPage {
  readonly menu: NavMenu;

  constructor(private readonly page: Page) {
    this.menu = new NavMenu(page);
  }

  private get searchInput() {
    return this.page.getByRole('textbox', { name: 'Zoeken' });
  }

  private get searchButton() {
    return this.page.getByRole('button', { name: 'Zoeken' });
  }

  private categoryCheckbox(name: string) {
    return this.page.getByRole('group', { name: 'Categorieën' }).getByRole('checkbox', { name, exact: true });
  }

  private get ecoFriendlyCheckbox() {
    return this.page.getByRole('checkbox', { name: 'Alleen milieuvriendelijke producten tonen' });
  }

  private productCard(name: string) {
    return this.page.getByRole('heading', { name, level: 5 });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async filterByCategory(name: string): Promise<void> {
    await this.checkFilter(this.categoryCheckbox(name));
  }

  async showOnlyEcoFriendly(): Promise<void> {
    await this.checkFilter(this.ecoFriendlyCheckbox);
  }

  async expectProductShown(name: string): Promise<void> {
    await expect(this.productCard(name)).toBeVisible();
  }

  async expectProductHidden(name: string): Promise<void> {
    await expect(this.productCard(name)).toBeHidden();
  }

  /** Waits for the filtered products, so a check afterwards does not see the old list. */
  private async checkFilter(checkbox: Locator): Promise<void> {
    const filtered = this.page.waitForResponse((response) => new URL(response.url()).pathname === '/products');
    await checkbox.check();
    await filtered;
  }
}
