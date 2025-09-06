import { useCategories } from "../../hooks/useCategories"
import './categories.css'

export const Categories = () => {
  const { categories } = useCategories()

  return(
    <select name="searchDropdown" id="search-dropdown" className="categories-dropdown">
      <option defaultValue='All' value='All'>All</option>
      {
        categories && categories.map((category, index) => (
        <option key={index} value={category.category_name}>{category.category_name.charAt(0).toUpperCase() + category.category_name.slice(1)}</option>
        ))
      }
    </select>
  )
}