import { ReactNode } from "react"
import { Route, Routes } from "react-router-dom"
import { MissingPage } from "../MissingPage/MissingPage"

interface Props {
  children: ReactNode
}

export const RoutesNotFound = ({ children }: Props) => {

  return (
    <Routes>
      {children}
      <Route path='/*' element={<MissingPage />} />
    </Routes>
  )
}