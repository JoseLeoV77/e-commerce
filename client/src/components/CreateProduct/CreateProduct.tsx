import { useContext, useState } from "react"
import "./createProducts.css"
import { AuthContext } from "../../context/userContext"
import { CategoriesCreateProduct } from "../CategoriesCreateProduct/CategoriesCreateProduct"



export const CreateProduct = () => {
  const [productImages, setProductImages] = useState<File[]>([])
  const { accessToken } = useContext(AuthContext)
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    productPrice: 0,
    category: "",
  })
  

  function handleChange (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) {
    if (e.target.files) {
      setProductImages((prevImages) => {
        const newImages = Array.from(e.target.files!); // Asume que e.target.files no es null
        const uniqueImages = [...new Map([...prevImages, ...newImages].map(img => [img.name, img])).values()]; // Eliminar duplicados basados en el nombre del archivo
        return uniqueImages;
    });

    } else {
    setProduct({ ...product, [e.target.name]: e.target.value });
    }
  }

  function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData()

    Object.entries(product).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    
    productImages.forEach((image) => {
      formData.append("productImages", image);
    });

    fetch("http://localhost:3000/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}` 
      },
      body: formData
    })
    .then((response) => {
      if (response.ok) {
        console.log("Producto creado con éxito");
      } else {
        console.error("Error al crear el producto");
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
    });
  }

  return (
    <form className="publish-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Crear Producto</h2>

      <label htmlFor="search-dropdown">
        Elige la categoria: 
        <CategoriesCreateProduct onChange={handleChange} />
      </label>

      <label htmlFor="productName">
        Nombre del producto
        <input id="productName" type="text" name="productName" onChange={handleChange} />
      </label>
  
      <label htmlFor="productDescription">
         Descripción
        <input id="productDescription" type="text" name="productDescription" onChange={handleChange} />
      </label>

      <label htmlFor="productPrice">
         Precio
        <input id="productPrice" type="number" name="productPrice"
        step="0.01" min="0" onChange={handleChange} />
      </label>

      <label htmlFor="productImages">
         Imagen
        <input id="productImages" type="file" name="productImages" accept="image/*" onChange={handleChange} multiple/>
      </label>

      <button type="submit" >Publicar</button>
    </form>
  )
}