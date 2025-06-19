import { Link } from "react-router-dom"
import { useProduct } from "../../hooks/useProduct"
import { ProductImage } from "../ProductImage/ProductImage"
import './results.css'

export const Results = () => {
  const { productDetails, loading } = useProduct()
  console.log('a', productDetails)
  const mappedDetails = productDetails?.map(product => (
    {   
      id: product.product_id,
      name: product.product_name,
      description: product.product_description,
      price: product.price,
      image_url: product.image_url
    }
  ))

  if (loading) {
    return <h2>Loading...</h2>
  }
  
  return (
    <div className="result-container">
      <h2>Results</h2>
      <section className="result-products">
        {mappedDetails.length > 0 ? (
          mappedDetails.map(product => (
            <Link to={`/${product.name}`} key={product.id}>
              <ProductImage product={product} />
            </Link>
          )))
          : ( <h3>No products found!</h3>) 
        } 
      </section>
    </div>
  )
}