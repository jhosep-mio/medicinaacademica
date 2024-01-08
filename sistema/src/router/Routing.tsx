import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import { Login } from '../components/public/Login'
import { PrivateLayout } from '../components/private/PrivateLayout'
import Home from '../components/private/tables/Home'
import { ListaBanner } from '../components/private/tables/banners/ListaBanner'
import { CrearBanner } from '../components/private/tables/banners/CrearBanner'
import { EditarBanner } from '../components/private/tables/banners/EditarBanner'
import { ListaMarcas } from '../components/private/tables/marcas/ListaMarcas'
import { CrearMarca } from '../components/private/tables/marcas/CrearMarca'
import { EditarMarca } from '../components/private/tables/marcas/EditarMarca'
import { ListaCategorias } from '../components/private/tables/categorias/ListaCategorias'
import { CrearCategoria } from '../components/private/tables/categorias/CrearCategoria'
import { EditarCategoria } from '../components/private/tables/categorias/EditarCategoria'
import { ListaProductos } from '../components/private/tables/productos/ListaProductos'
import { CrearProducto } from '../components/private/tables/productos/CrearProducto'
import { EditarProducto } from '../components/private/tables/productos/EditarProducto'
import { EditarContacto } from '../components/private/tables/contacto/EditarContacto'
import { ListaTransacciones } from '../components/private/tables/transacciones/ListaTransacciones'
import { EditarTransaccion } from '../components/private/tables/transacciones/EditarTransaccion'
import ListarShowcategory from '../components/private/tables/mostrar/ListarShowcategory'
import { EditarShowcategory } from '../components/private/tables/mostrar/EditarShowcategory'
import { CrearBlog } from '../components/private/tables/blog/CrearBlog'
import { ListarBlog } from '../components/private/tables/blog/ListarBlog'
import { EditarBlog } from '../components/private/tables/blog/EditarBlog'

import { ListaServicios } from '../components/private/tables/servicios/ListarServicios'
import { AgregarServicios } from '../components/private/tables/servicios/AgregarServicios'
import { EditarServicios } from '../components/private/tables/servicios/EditarServicios'

import { ListarNosotros } from '../components/private/tables/nosotros/ListarNosotros'
import { CrearProfesor } from '../components/private/tables/nosotros/CrearNosotros'
import { EditarNosotros } from '../components/private/tables/nosotros/EditarNosotros'
import { ListarTestimonios } from '../components/private/tables/testimonios/ListarTestimonios'
import { AgregarTestimonio } from '../components/private/tables/testimonios/AgregarTestimonio'
import { EditarTestimonio } from '../components/private/tables/testimonios/EditarTestimonio'
import { Seguimiento } from '../components/private/tables/productos/Seguimiento'
import { Comentarios } from '../components/private/tables/productos/sections/Comentarios'
import { ListaProductosToProfesor } from '../components/private/tables/productostoprofesro/ListaProductosToProfesor'
import { SeguimientoToProfesor } from '../components/private/tables/productostoprofesro/SeguimientoToProfesor'
import { ComentariosTwo } from '../components/private/tables/productostoprofesro/sections/ComentariosTwo'
import { ListaAlumnos } from '../components/private/tables/alumnos/ListaAlumnos'
import { VerEstudiante } from '../components/private/tables/alumnos/VerEstudiante'
import { ListadoExamenes } from '../components/private/tables/examenes/ListadoExamenes'
import { CrearExamen } from '../components/private/tables/examenes/CrearExamen'
import { EditarExamen } from '../components/private/tables/examenes/EditarExamen'
import { ListaArchivos } from '../components/private/tables/productos/archivos/ListaArchivos'
import { CrearProductoProfesor } from '../components/private/tables/productostoprofesro/CrearProductoProfesor'
import { EditarProductoProfesor } from '../components/private/tables/productostoprofesro/EditarProductoProfesor'
import { ListadoExamenesProfesor } from '../components/private/tables/examenes/ListadoExamenesProfesor'
import { CrearExamenProfesor } from '../components/private/tables/examenes/CrearExamenProfesor'
import { EditarExamenProfesor } from '../components/private/tables/examenes/EditarExamenProfesor'
import { ListaReseneas } from '../components/private/tables/productos/ListaReseneas'
import { ListaArchivosProfesor } from '../components/private/tables/productostoprofesro/archivos/ListaArchivosProfesor'
import { AgregarCupon } from '../components/private/tables/cupones/AgregarCupon'
import { ListaCupones } from '../components/private/tables/cupones/ListarCupones'

export const Routing = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<PrivateLayout />}>
            <Route index element={<Home />} />
            {/* BANNERS
            <Route path="banners" element={<ListaBanners />} />
            <Route path="banners/agregar" element={<CrearBanner />} />
            <Route path="banners/editar/:id" element={<EditarBanner />} /> */}
            {/* SECCIONUNO */}
            <Route path="alumnos" element={<ListaAlumnos />} />
            <Route path="alumnos/view/:id" element={<VerEstudiante />} />

            {/* CATEGORIAS */}
            <Route path="categorias" element={<ListaCategorias />} />
            <Route path="categorias/agregar" element={<CrearCategoria />} />
            <Route path="categorias/editar/:id" element={<EditarCategoria />} />

            {/* SHOW CATEGORY */}
            <Route path="showcategory" element={<ListarShowcategory />} />
            <Route path="showcategory/editar/:id" element={<EditarShowcategory/>} />

            {/* BANNERS */}
            <Route path="banners" element={<ListaBanner />} />
            <Route path="banners/agregar" element={<CrearBanner />} />
            <Route path="banners/editar/:id" element={<EditarBanner />} />

            {/* MARCAS */}
            <Route path="marcas" element={<ListaMarcas />} />
            <Route path="marcas/agregar" element={<CrearMarca />} />
            <Route path="marcas/editar/:id" element={<EditarMarca />} />

            {/* PRODUCTOS */}
            <Route path="productos" element={<ListaProductos />} />
            <Route path="productos/agregar" element={<CrearProducto />} />
            <Route path="productos/editar/:id" element={<EditarProducto />} />
            <Route path="productos/seguimiento/:id" element={<Seguimiento />} />
            <Route path="productos/seguimiento/:id/comentarios/:claseId" element={<Comentarios />} />
            <Route path="productos/seguimiento/:id/archivos/:claseId" element={<ListaArchivos />} />
            <Route path="productos/resenas/:id" element={<ListaReseneas />} />

            {/* PRFOESR CURSOS */}
            <Route path="cursos" element={<ListaProductosToProfesor />} />
            <Route path="cursos/seguimiento/:id" element={<SeguimientoToProfesor/>} />
            <Route path="cursos/seguimiento/:id/comentarios/:claseId" element={<ComentariosTwo />} />
            <Route path="cursos/seguimiento/:id/archivos/:claseId" element={<ListaArchivosProfesor />} />
            <Route path="cursos/agregar" element={<CrearProductoProfesor />} />
            <Route path="cursos/editar/:id" element={<EditarProductoProfesor />} />

            {/* BLOG */}
            <Route path="blog" element={<ListarBlog />} />
            <Route path="blog/agregar" element={<CrearBlog />} />
            <Route path="blog/editar/:id" element={<EditarBlog />} />

            {/* SERVICIOS */}
            <Route path='servicios' element={<ListaServicios/>}/>
            <Route path='servicios/agregar' element={<AgregarServicios/>}/>
            <Route path='servicios/editar/:id' element={<EditarServicios/>}/>

            <Route path="profesores" element={<ListarNosotros />} />
            <Route path="profesores/agregar" element={<CrearProfesor />} />
            <Route path="profesores/editar/:id" element={<EditarNosotros />} />

            <Route path="testimonios" element={<ListarTestimonios />} />
            <Route path="testimonios/agregar" element={<AgregarTestimonio />} />
            <Route path="testimonios/editar/:id" element={<EditarTestimonio />} />

            {/* CONFIGURACION */}
            <Route path="contacto/:id" element={<EditarContacto />} />
            <Route path="transacciones" element={<ListaTransacciones />} />
            <Route path="transacciones/viewTransaccion/:id" element={<EditarTransaccion />} />

            {/* EXAMENES */}
            <Route path="examenes" element={<ListadoExamenes />} />
            <Route path="examenes/agregar" element={<CrearExamen />} />
            <Route path="examenes/editar/:id" element={<EditarExamen />} />

            {/* CUPONEs */}
            <Route path='cupones' element={<ListaCupones/>}/>
            <Route path='cupones/agregar' element={<AgregarCupon/>}/>

            <Route path="examen" element={<ListadoExamenesProfesor />} />
            <Route path="examen/agregar" element={<CrearExamenProfesor />} />
            <Route path="examen/editar/:id" element={<EditarExamenProfesor />} />

          </Route>
          <Route path="*" element={<>Error 404</>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
