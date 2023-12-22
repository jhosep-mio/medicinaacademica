import {
  useState,
  useEffect,
  createContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction
} from 'react'
import { Global } from '../helper/Global'
import axios from 'axios'
import { type UserSchema } from './UserSchema'

export interface AuthContextValue {
  auth: typeof UserSchema
  setAuth: Dispatch<SetStateAction<typeof UserSchema>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  loadingComponents: boolean
  setLoadingComponents: Dispatch<SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({
  children
}: {
  children: ReactNode
}): JSX.Element => {
  const [auth, setAuth] = useState<typeof UserSchema>({
    id: '',
    name: '',
    email: '',
    idRol: null,
    foto: ''
  })
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [loadingComponents, setLoadingComponents] = useState(false)

  useEffect(() => {
    authUser()
  }, [])

  const authUser = async (): Promise<false | undefined> => {
    // SACAR DATOS DEL USUARIO IDENTIFICADO DEL LOCALSTORAGE
    const token = localStorage.getItem('token')
    const tokenProfesor = localStorage.getItem('tokenProfesor')
    const user = localStorage.getItem('user')

    // COMPROBRAR SI TENGO EL TOKEN Y EL USER
    // if ((!token || !tokenProfesor) || !user) {
    //   setLoading(false)
    //   return false
    // }

    if (token && user) {
      const respuesta = await axios.get(`${Global.url}/user-profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setAuth({
        id: respuesta.data.user.id,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        name: respuesta.data.user.name,
        email: respuesta.data.user.email,
        idRol: respuesta.data.user.id_rol,
        foto: respuesta.data.user.foto
      })
    }
    if (tokenProfesor && user) {
      const respuesta2 = await axios.get(`${Global.url}/perfilProfesor`, {
        headers: {
          Authorization: `Bearer ${tokenProfesor}`
        }
      })
      setAuth({
        id: respuesta2.data.user.id,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        name: `${respuesta2.data.user.nombre}`,
        email: respuesta2.data.user.email,
        idRol: respuesta2.data.user.id_rol,
        foto: respuesta2.data.user.imagen1
      })
    } else {
      setLoading(false)
      return false
    }
    // SETEAR LOS DATOS
    setLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loading,
        setLoading,
        title,
        setTitle,
        loadingComponents,
        setLoadingComponents
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
