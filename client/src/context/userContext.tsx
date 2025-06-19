import { createContext, useState, useEffect, useCallback } from "react";
import { AuthContextType } from "./types";
import { GlobalProps } from "./types";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  accessToken: "",
  login: () => {},
  logout: () => {},
  refreshAccessToken: () => {},
  userProducts: []

});

export const AuthProvider = ({ children }: GlobalProps) => {
  const [user, setUser] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userProducts, setUserProducts] = useState([]);

  const login = useCallback(({userData, token}: { userData: string; token: string}) => {
    setUser(userData)
    setAccessToken(token) 
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      setUser(null)
      setAccessToken("")
      setIsAuthenticated(false)
    })
    .catch((error) => {
      console.log('Logout error', error)
    })
  }, [])

  useEffect(() => {

    if(isAuthenticated && accessToken){
      fetch("http://localhost:3000/user-products", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}` //get token info. 
          }
        })
      .then(res => res.json())
      .then(res => {
        console.log('user products', res)
        setUserProducts(res)
      })
      .catch((error) => {
        console.error("Error fetching user products", error)
      })
    } else {
      console.log("No access token or not authenticated!")
    }
  }, [isAuthenticated, accessToken])

  useEffect(() => {
    if(isAuthenticated && accessToken){
      fetch("http://localhost:3000/protected", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        if (res){
          const userData = res.user.username //get user info.
          setUser(userData)
          setIsAuthenticated(true)
        }
      })
      .catch(() => {
        setIsAuthenticated(false)
      })
    } else {
      console.log("No access token!")
    }
  }, [isAuthenticated, accessToken]);

  const refreshAccessToken = useCallback(() => {
    if(isRefreshing){
      return false
    }
    setIsRefreshing(true)
    
    fetch("http://localhost:3000/refreshToken", 
      {
        method: "GET",
        credentials: "include"
      }
    )
      .then(res => res.json())
      .then(res => {
        if(res.accessToken){
          setAccessToken(res.accessToken)
          setIsAuthenticated(true)
          return true
        } else {
          console.log("refresh token, invalid")
          logout()
          return false
        }
      })
      .catch((error => {
        console.error("Error during token refresh", error)
        logout()
        return false
      }))
      .finally(() => {
        setIsRefreshing(false)
      })
  }, [isRefreshing, setAccessToken, setIsAuthenticated, logout])

  useEffect(()=>{
    refreshAccessToken()
  }, [])

  useEffect(()=>{
    if(accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]))
        
        if(!payload.exp) {
          throw new Error("Invalid token")
        }

        const expirationTime = payload.exp * 1000
        const now = Date.now()
        const timeUntilExpiration = expirationTime - now

        const refreshThreshold = 5 * 60 * 1000

        if(timeUntilExpiration <= refreshThreshold) {
          const timeoutId = setTimeout(() => {
            console.log("Access token expiring, attempting refresh")
            refreshAccessToken()
          }, timeUntilExpiration - refreshThreshold)
          return () => clearTimeout(timeoutId)
        }

      } catch (err) {
        console.log(err)
        refreshAccessToken()
      }
    }
  }, [accessToken, refreshAccessToken])

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated, login, logout, refreshAccessToken, userProducts }}>
      {children}
    </AuthContext.Provider>
  );
};