import { useEffect, useState } from "react"

export const useCategories = () => {
  const [categories, setCategories] = useState<{ category_name: string }[]>([])

  useEffect(()=>{
    fetch('http://localhost:3000/categories')
      .then(res => res.json())
      .then(res => {
        setCategories(res)
      })

  }, []) // fetch categories to display in the dropdown.

  return {
    categories
  }
}