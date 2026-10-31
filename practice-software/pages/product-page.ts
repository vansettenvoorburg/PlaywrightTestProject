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

  private productTitle(name: string) {
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
    await this.setFilter(this.categoryCheckbox(name), true);
  }

  async showOnlyEcoFriendly(): Promise<void> {
    await this.setFilter(this.ecoFriendlyCheckbox, true);
  }

  async removeEcoFriendlyFilter(): Promise<void> {
    await this.setFilter(this.ecoFriendlyCheckbox, false);
  }

  async expectProductShown(name: string): Promise<void> {
    await expect(this.productTitle(name)).toBeVisible();
  }

  async expectProductHidden(name: string): Promise<void> {
    await expect(this.productTitle(name)).toBeHidden();
  }

  /** Waits for the filtered products, so the next filter change does not overlap with this one. */
  private async setFilter(checkbox: Locator, checked: boolean): Promise<void> {
    const filtered = this.page.waitForResponse((response) => new URL(response.url()).pathname === '/products');
    await checkbox.setChecked(checked);
    await filtered;
  }
}
