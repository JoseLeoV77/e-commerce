import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Product } from "./types";

export const useProduct = () => {
  const location = useLocation()
 
  const queryParams = new URLSearchParams(location.search);
  const formattedSearchData = queryParams.get('q') || ""; //get the query, or well, the search.
  const [productDetails, setProductDetails] = useState<Product[]>([])
  const [ loading, setLoading ] = useState(true)

  useEffect(()=>{
    setLoading(true)
    const endpoint = formattedSearchData 
    ? `http://localhost:3000/search?q=${formattedSearchData}` 
    : "http://localhost:3000"; 

    fetch(endpoint)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch products')
        } 
        return res.json()
      })
      .then(details => {
        setProductDetails(details)
        setLoading(false)
      })
      .catch(err => {
        console.log('error', err)
        setLoading(false)
      })
    
  },[formattedSearchData])

  return {
    productDetails,
    loading
  }
} 

