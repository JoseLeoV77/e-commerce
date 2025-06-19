import { SearchIcon } from "../Icons/Icons"
// import { useLocation } from "react-router-dom"
import { useState } from "react"
import './searchForm.css'
import { useNavigate } from "react-router-dom"
import { Categories } from "../Categories/Categories"

export const SearchForm = () => {
  const [inputValue, setInputValue ] = useState('')
  const navigate = useNavigate()
  
  function handleChange (e: React.ChangeEvent<HTMLInputElement>){
    setInputValue(e.target.value)
  }

  function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = inputValue.trim()
    const selectedCategory = formData.get('searchDropdown') as string
    let searchURL = ''
    console.log(selectedCategory)

    if(searchQuery){
      searchURL += `/search?q=${encodeURIComponent(inputValue)}`
    } 
    
    if (selectedCategory){
      searchURL += `${searchQuery ? '&category' : '/search?q'}=${encodeURIComponent(selectedCategory)}`
    }

    navigate(searchURL)
  }
  return (
    <form onSubmit={handleSubmit} action="" className='nav-form'>
      <Categories />
      <input onChange={handleChange} name="input" type="text" className="nav-input" placeholder="Buscar" value={inputValue}/>
      <button type="submit" className='nav-submit-bttn'>
        <SearchIcon />
      </button>
  </form>
  )
}


