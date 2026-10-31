import { ApiClient } from '../../../api-helper/api-client';
import { Product } from '../../test-data/product';

export async function createProduct(apiClient: ApiClient, product: Product) {
  const result = await apiClient.post('/products', {
    name: product.name,
    description: product.description,
    price: product.price,
    category_id: await findId(apiClient, '/categories', 'name', product.category),
    brand_id: await findId(apiClient, '/brands', 'name', product.brand),
    product_image_id: await findId(apiClient, '/images', 'title', product.image),
    is_eco_friendly: product.isEcoFriendly,
    is_location_offer: false,
    is_rental: false,
  });
  if (result.status !== 201) {
    throw new Error(`Creating product failed with status ${result.status}: ${JSON.stringify(result.body)}`);
  }
}

/** IDs change when the demo database is reset, so they are looked up by their visible text. */
async function findId(apiClient: ApiClient, path: string, field: string, value: string) {
  const result = await apiClient.get(path);
  const item = (result.body as Record<string, string>[]).find((entry) => entry[field] === value);
  if (!item) {
    throw new Error(`No item with ${field} '${value}' found at ${path}`);
  }
  return item.id;
}
