import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Product } from "./types";

export const useProduct = () => {
  const location = useLocation()
  const searchData = decodeURIComponent(location.search) //get unencoded search
  const formattedSearchData = searchData.startsWith("?q=") ? searchData.slice(3) : "" //get the query, or well, the search. 
  const [productDetails, setProductDetails] = useState<Product[]>([])
  const [ loading, setLoading ] = useState(true)

  useEffect(()=>{
    setLoading(true)
    const searchEndpoint = formattedSearchData 
    ? `http://localhost:3000/search?q=${formattedSearchData}` 
    : "http://localhost:3000"; //search everything or search specific product 

    fetch(searchEndpoint)
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

