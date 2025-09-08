import { useEffect, useState } from "react"

export const useCategories = () => {
  const [categories, setCategories] = useState<{ category_name: string }[]>([])

  useEffect(()=>{
    fetch('http://localhost:3000/categories')
      .then(res => res.json())
      .then(res => {
        setCategories(res)
      })
      .catch(err => {
        console.error('Error fetching categories:', err)
      })

  }, []) 

  return {
    categories
  }
}