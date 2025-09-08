import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Product } from "./types"

export const useProductBySlug = () => {
  const { slug } = useParams<{ slug: string }>()
  const [productDetails, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const endpoint = `http://localhost:3000/products/${slug}`
    if(!slug) {
      setLoading(false)
      return
    }

    fetch(endpoint)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch product')
        }
        return res.json()
      })
      .then(product => {
        setProduct(product)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching product:', err)
      })
  }, [slug])


  return { productDetails, loading }
}