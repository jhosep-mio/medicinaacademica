import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { type ImagenState } from '../../../shared/Interfaces'
import { ImageUpdate } from '../../../shared/ImageUpdate'

export const EditarBanner = () => {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()
  const [imagen1, setImagen1] = useState('')
  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')
  const [imagenNueva1, SetImagenNueva1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  useEffect(() => {
    setTitle('Editar Banner')
    getBanner()
  }, [])

  const updateBanner = async (): Promise<void> => {
    setLoadingComponents(true)
    const data = new FormData()

    if (imagenNueva1.archivo != null) {
      data.append('imagen1', imagenNueva1.archivo)
    }
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateBanner/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )

      if (respuesta.data.status == 'success') {
        Swal.fire('Actualizado correctamente', '', 'success')
        navigate('/admin/banners')
      } else {
        Swal.fire('Error al realizar la edicion', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
    setLoadingComponents(false)
  }

  const getBanner = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/oneBanner/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setImagen1(request.data.imagen1)
    setLoadingComponents(false)
  }
  return (
    <>
    {loadingComponents
      ? (
      <Loading />
        )
      : (
      <form
        className="bg-secondary-100 p-8 rounded-xl"
        onSubmit={updateBanner}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-8">
          <div className="w-full md:w-1/4">
            <p>
              Imagen<span className="text-red-500">*</span>
            </p>
          </div>
          <div className="flex-1 flex  items-center gap-4">
            <ImageUpdate
              globalUrl="banner"
              url={url1}
              setUrl={setUrl1}
              boton={boton1}
              setBoton={setBoton1}
              imagen={imagen1}
              setImagen={SetImagenNueva1}
              clase="1"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full justify-end">
          <input type="hidden" name="oculto" value="1" />
          <Link
            to="/admin/banners"
            className="bg-red-500 px-4 py-2 rounded-md text-white"
          >
            Cancelar
          </Link>
          <input
            type="submit"
            className="bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
            value="Editar"
          />
        </div>
      </form>
        )}
    </>
  )
}

export default EditarBanner
