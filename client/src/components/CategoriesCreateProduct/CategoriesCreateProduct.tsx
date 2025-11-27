import { useCategories } from "../../hooks/useCategories"
import { useTranslation } from "react-i18next"

export const CategoriesCreateProduct = ({ onChange }: { onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => {
  const { categories } = useCategories()
  const { t } = useTranslation()
  return(
    <select name="category" id="create-search-dropdown" onChange={onChange} className="create-search-dropdown">
      <option defaultValue='All' value='All'>{t("select_category")}</option>
      {
        categories && categories.map((category, index) => (
        <option key={index} value={category.category_name}>{category.category_name.charAt(0).toUpperCase() + category.category_name.slice(1)}</option>
        ))
      }
    </select>
  )
}
