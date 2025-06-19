import { ReactNode } from "react"

export interface GlobalProps {
  children: ReactNode
}

export interface AuthContextType {
  user: string | null
  isAuthenticated: boolean,
  accessToken: string,
  login: ({userData, token}: {userData: string, token: string}) => void,
  logout: () => void,
  refreshAccessToken: () => void,
  userProducts: any[]
}