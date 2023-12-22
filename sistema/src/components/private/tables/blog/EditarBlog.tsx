import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { useFormik } from 'formik'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { Errors } from '../../../shared/Errors'
import { ImageUpdate } from '../../../shared/ImageUpdate'

import {
  type ImagenState,
  blogValuesModificate
} from '../../../shared/Interfaces'
import { SchemaBlog } from '../../../shared/Schemas'
import Editor from '../../../shared/Editar'


export const EditarBlog = (): JSX.Element => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()
  const [imagen1, setImagen1] = useState('')
  const [imagenNueva1, setImagenNueva1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')

  useEffect(() => {
    setTitle('Editar Blog')
    getBlog()
  }, [])

  const updateBlog = async (
    values: blogValuesModificate
  ): Promise<void> => {
    setLoadingComponents(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('titulo', values.titulo)
    data.append('resumen', values.resumen)
    data.append('descripcion', content)
    
    if (imagenNueva1.archivo != null) {
      data.append('imagen1', imagenNueva1.archivo)
    }

    try {
      const respuesta = await axios.post(`${Global.url}/updateBlog/${id ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      console.log(respuesta)
      if (respuesta.data.status == 'success') {
        Swal.fire('Actualizado correctamente', '', 'success')
        navigate('/admin/blog')
      } else {
        Swal.fire('Error ', '', 'error')
      }
    } catch (error) {
      Swal.fire('Error', '', 'error')
    }
    setLoadingComponents(false)
  }



  const getBlog = async (): Promise<void> => {
    const token = localStorage.getItem('token')
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/oneBlog/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setValues({
      ...values,
      titulo: request.data.titulo,
      resumen: request.data.resumen,
    })
    setImagen1(request.data.imagen1)
    setLoadingComponents(false)

    setContent(request.data.descripcion)
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    setValues,
    touched,
    handleBlur
  } = useFormik({
    initialValues: {
      titulo: '',
      resumen: '',
      descripcion: ''
    },
    validationSchema: SchemaBlog,
    onSubmit: updateBlog
  })

  return (
    <>
      {loadingComponents
        ? (
        <Loading />
          )
        : (
        <form
          className="bg-secondary-100 p-8 rounded-xl"
          onSubmit={handleSubmit}
        >
          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-2">
            <div className="w-full lg:w-full">
              <TitleBriefs titulo="Título del blog" />
              <InputsBriefs
                name="titulo"
                type="text"
                value={values.titulo}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.titulo} touched={touched.titulo} />
            </div>
          
          </div>

          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
            
            <div className="w-full lg:w-full">
              <TitleBriefs titulo="Resumen del blog" />
              <InputsBriefs
                name="resumen"
                type="text"
                value={values.resumen}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.resumen} touched={touched.resumen} />
            </div>
          
         
          </div>


          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-10 relative">
            <p className="bg-secondary-100 pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-10px]">
              Imagen del blog<span className="text-red-500">*</span>
            </p>
            <div className="flex-1 flex flex-col lg:flex-row  items-center gap-4">
            <ImageUpdate
                globalUrl="blog"
                url={url1}
                setUrl={setUrl1}
                boton={boton1}
                setBoton={setBoton1}
                imagen={imagen1}
                setImagen={setImagenNueva1}
                clase="1"
              />
             
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-10 relative">
            <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-25px]">
              Descripción del Blog
            </p>
            <div className="flex-1 w-full md:w-3/4">
              <Editor content={content} setContent={setContent} />
            </div>
          </div>

          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/blog"
              className="bg-red-500 px-4 py-2 rounded-md text-white"
            >
              Cancelar
            </Link>
            <input
              type="submit"
              className="bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="Actualizar"
            />
          </div>
        </form>
          )}
    </>
  )
}
