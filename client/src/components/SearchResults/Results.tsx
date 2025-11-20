import { Link } from "react-router-dom"
import { useProduct } from "../../hooks/useProduct"
import { ProductImage } from "../ProductImage/ProductImage"
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner"
import { useTranslation } from "react-i18next"
import './results.css'

export const Results = () => {
  const { productDetails, loading } = useProduct()
  const { t } = useTranslation()
  const mappedDetails = productDetails?.map(product => (
    {   
      id: product.product_id,
      name: product.product_name,
      description: product.product_description,
      price: product.price,
      slug: product.slug,
      image_url: product.image_url
    }
  ))

  if (loading) {
    return (
    <h2 style={{padding: 20}}>
      <LoadingSpinner animating={loading}
      size={50}
      color="black"/>
    </h2>
    )
  }
  
  return (
    <div className="result-container">
      <h2>{t("search_results")}</h2>
      <section className="result-products">
        {mappedDetails.length > 0 ? (
          mappedDetails.map(product => (
            <Link to={`/products/${product.slug}`} key={product.id}>
              <ProductImage product={product} />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </Link>
          )))
          : ( <h3>{t("search_no_products_found")}</h3>) 
        } 
      </section>
    </div>
  )
}