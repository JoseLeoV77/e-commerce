interface ProductImageProps {
  product: {
    id: string,
    name: string,
    description: string,
    image_url: string,
    price: number,
  },
} 

export const ProductImage = ({ product }: ProductImageProps) => {
  console.log(product);
  if (!product || !product.image_url) {
    return <div>No image available</div>;
  }

  return (
    <>
      {product.image_url.startsWith("/uploads/") ? (
        <img src={`http://localhost:3000${product.image_url}`} alt={product.description} style={{ width: "200px", height: "200px" }} />
      ) : (
        <img src={product.image_url} alt={product.description} style={{ width: "200px", height: "200px" }} />
      )}
    </>
  );

}