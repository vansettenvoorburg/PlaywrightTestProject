import { mergeTests } from '@playwright/test';
import { test as apiTest } from '../fixtures/api';
import { test as pagesTest } from '../fixtures/pages';
import { hammerProduct } from '../test-data/products/hammer-product';
import { adminUser } from '../test-data/users/admin-user';
import { createProduct } from '../utils/api/create-product';
import { loginUser } from '../utils/api/login-user';

const test = mergeTests(pagesTest, apiTest);

test.describe('Product filter', () => {
  test.beforeEach(async ({ apiClient, productPage }) => {
    await loginUser(apiClient, adminUser);
    await productPage.goto();
  });

  test('filters keep a matching product and hide a non-matching one', async ({ apiClient, productPage }) => {
    const product = hammerProduct;
    await createProduct(apiClient, product);

    await productPage.search(product.name);
    await productPage.expectProductShown(product.name);

    await productPage.filterByCategory(product.category);
    await productPage.expectProductShown(product.name);

    await productPage.showOnlyEcoFriendly();
    await productPage.expectProductHidden(product.name);
  });
});
