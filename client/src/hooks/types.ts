export interface Product {
  product_id: string,
  product_name: string,
  product_description: string,
  user_name?: string,
  price: number,
  slug: string,
  image_url: string,
  stock_quantity: number
}
