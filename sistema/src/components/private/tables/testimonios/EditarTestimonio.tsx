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
import {
  type ImagenState,
  testimoniosValuesModificate,
  productosValues,
} from '../../../shared/Interfaces'
import { SchemaTestimonios } from '../../../shared/Schemas'
import Editor from '../../../shared/Editar'
import { ImageUpdate } from '../../../shared/ImageUpdate'

export const EditarTestimonio = (): JSX.Element => {
  const { id } = useParams()
  const token = localStorage.getItem('token')

  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const { setTitle } = useAuth()
  const [loadingComponents, setLoadingComponents] = useState(true)

  const [imagen1, setImagen1] = useState('')
  const [imagenNueva1, setImagenNueva1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')



  useEffect(() => {
    setTitle('Editar testimonio')
    getProducto()
    getServicios()
    getCursos()
  }, [])

  const updateProducto = async (
    values: testimoniosValuesModificate
  ): Promise<void> => {

    if(selectedOption2 == "Aula" && imagenNueva1 == null){
      Swal.fire('Debes agregar una imagen ', '', 'error')
    }
    else if(selectedOption2 == "Aula" && content == ''){
      Swal.fire('Debes agregar una descripción al testimonio ', '', 'error')
    }
    else if (selectedOption2 == "Facebook" && values.comentario == ''){
      Swal.fire('Debes agregar el código de Facebook', '', 'error')

    }
    else{

      setLoadingComponents(true)
      const token = localStorage.getItem('token')
      const data = new FormData()

      

      if(selectedOption2 == "Facebook"){
        console.log(selectedOption2)
        setContent('')
        setImagen1('')
        setImagenNueva1({
          archivo: null,
          archivoName: 'desconocido.png'
        })
      }
      if(selectedOption2 == "Aula"){
        if (imagenNueva1.archivo != null) {
          data.append('imagen1', imagenNueva1.archivo)
        }

      }

      console.log(imagenNueva1.archivoName)

      data.append('nombre', values.nombre)
      data.append('caracteristicas', content)
      data.append('id_curso', values.id_curso)
      data.append('id_servicio', values.id_servicio)
      data.append('tipoComentario', selectedOption2)
      data.append('comentario', values.comentario)

  
     
      data.append('_method', 'PUT')
  
      try {
        const respuesta = await axios.post(
          `${Global.url}/updateTestimonio/${id ?? ''}}`,
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
          navigate('/admin/testimonios')
        } else {
          Swal.fire('Error ', '', 'error')
        }
      } catch (error) {
        console.log(error)
        Swal.fire('Error', '', 'error')
      }
      setLoadingComponents(false)
    }
  }

  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');

  const handleTestimonio = (event:any) => {
    // Obtener el valor seleccionado
    const selectedValue = event.target.value;

    // Actualizar el estado con la opción seleccionada
    setSelectedOption(selectedValue);

    if(selectedOption == "1"){
        values.id_servicio = `0`
        getServicios()
    }
    else if(selectedOption == "2"){
        values.id_curso = "0"
        getCursos()
    }

  };

  const handleTestimonio2 = (event:any) => {
    // Obtener el valor seleccionado
    const selectedValue = event.target.value;

    // Actualizar el estado con la opción seleccionada
    setSelectedOption2(selectedValue);

    if(selectedValue == 'Aula'){
      values.comentario = ''
    }
  };

  const [ servicios, setServicios ] = useState([])

  const getServicios = async (): Promise<void> =>{
        const request = await axios.get(`${Global.url}/allServicios`, {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? `Bearer ${token}` : ''
            }`
          }
        })
        setServicios(request.data)
  }

  const [ cursos, setCursos ] = useState([])

  const getCursos = async (): Promise<void> =>{
    const request = await axios.get(`${Global.url}/allProductos`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setCursos(request.data)
    setLoadingComponents(false)
}

  const getProducto = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/oneTestimonio/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })

    if(request.data[0].id_curso == "0" || request.data[0].id_curso == null){
      setSelectedOption("1")
    }
    if(request.data[0].id_servicio == "0" || request.data[0].id_servicio == null){
      setSelectedOption("2")
    }


    setValues({

      ...values,
      nombre: request.data[0].nombre,
      id_curso: request.data[0].id_curso,
      id_servicio: request.data[0].id_servicio,
      tipoComentario: request.data[0].tipoComentario,
      comentario: request.data[0].comentario
    })
    setImagen1(request.data[0].imagen1)
    setSelectedOption2(request.data[0].tipoComentario)
    setContent(request.data[0].caracteristicas)
    
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    isSubmitting,
    touched,
    handleBlur,
    setValues
  } = useFormik({
    initialValues: {
      id: '',
      nombre: '',
      id_curso: '',
      comentario: '',
      tipoComentario: '',
      id_servicio: ''
    },
    validationSchema: SchemaTestimonios,
    onSubmit: updateProducto
  })


  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  

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
           <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
           <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Nombre" />
              <InputsBriefs
                name="nombre"
                type="text"
                value={values.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.nombre} touched={touched.nombre} />
            </div>

            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Testimonio de:" />
              <select
                className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                name="tipoComentario"
                value={selectedOption2}
                autoComplete="off"
                onChange={handleTestimonio2}
                onBlur={handleBlur}
              >
                  <option value="">Seleccionar</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Aula">Aula virtual</option>

              </select>
              <Errors errors={errors.tipoComentario} touched={touched.tipoComentario} />


            </div>

            

              <div className="w-full lg:w-1/4">
                <TitleBriefs titulo="Pertenece a:" />
                <select
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                        focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                        rounded-md transition-all"
                  name="id"
                  value={selectedOption}
                  autoComplete="off"
                  onChange={handleTestimonio}
                  onBlur={handleBlur}
                >
                    <option value="">Seleccionar</option>
                    <option value="1">Servicios</option>
                    <option value="2">Cursos</option>

                </select>
              </div>

              

            {selectedOption == "1" && (
                <div className="w-full lg:w-1/4">
                <TitleBriefs titulo="Servicios:" />
                
                    <select
                    className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                        focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                        rounded-md transition-all"
                    name="id_servicio"
                    value={values.id_servicio}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    <option value="">Seleccionar</option>
                    {servicios.map((servicio:testimoniosValuesModificate)=>(
                        <option value={`${servicio.id}`} key={servicio.id}>{servicio.nombre}</option>
                    ))}

                </select>
                </div>
            )}

            {selectedOption == "2" && (
              <div className="w-full lg:w-1/4">
                <TitleBriefs titulo="Cursos" />

                <select
                className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                name="id_curso"
                value={values.id_curso}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                  <option value="">Seleccionar</option>
                  {cursos.map((curso:productosValues)=>(
                    <option value={`${curso.id}`} key={curso.id}>{curso.nombre}</option>
                  ))}

              </select>
              </div>
            )}
                    
          </div>

          {selectedOption2 == 'Facebook' && (
            <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-10 relative">
              <div className="w-full">
                <TitleBriefs titulo="Código de Facebook" />
                <InputsBriefs
                  name="comentario"
                  type="text"
                  value={values.comentario}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.comentario} touched={touched.comentario} />
              </div>
          </div>
          )}
           {selectedOption2 == 'Aula' && ( 
            <>
              <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-10 relative">
                <p className="bg-secondary-100 pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-10px]">
                  Imagen<span className="text-red-500">*</span>
                </p>
                <div className="flex-1 flex flex-col lg:flex-row items-center gap-4">
                  <ImageUpdate
                    globalUrl="testimonios"
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
                  Información
                </p>
                <div className="flex-1 w-full md:w-3/4">
                  <Editor content={content} setContent={setContent} />
                </div>
              </div>
            
            </>

           )}
       

          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/testimonios"
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
