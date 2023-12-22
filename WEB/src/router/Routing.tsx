import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { PublicLayout } from '../components/public/PublicLayout'
import { AuthProvider } from '../context/AuthProvider'
import Home from '../components/public/Home'
import Nosotros from '../components/public/Nosotros'
import Servicios from '../components/public/Servicios'
import Contacto from '../components/public/Contacto'
import Carrito from '../components/public/Carrito'
import Tienda from '../components/public/Tienda'
import View from '../components/public/View'
import Politicas from '../components/public/Informacion/Politicas'
import Preguntas from '../components/public/Informacion/Preguntas'
import ViewServicio from '../components/public/ViewServicio'
import Search from '../components/public/Search'
import { Login } from '../components/aula/Login'
import { Registro } from '../components/aula/Registro'
import { Perfil } from '../components/aula/pages/perfil/Perfil'
import { EditarPerfil } from '../components/aula/pages/perfil/EditarPerfil'
import { MisCursos } from '../components/aula/pages/cursos/MisCursos'
import { VistaCurso } from '../components/aula/pages/cursos/VistaCurso'
import { Clase } from '../components/aula/pages/clases/Clase'
import { NotFound } from '../components/public/NotFound'
import { Succes } from '../components/public/Succes'
import { SuccesPago } from '../components/public/SuccesPago'
import { MisApuntes } from '../components/aula/pages/apuntes/MisApuntes'
import { MisProyectos } from '../components/aula/pages/apuntes/MisProyectos'
import { MisConstancias } from '../components/aula/pages/apuntes/MisConstancias'
import Certificados from '../components/public/Certificados'
import { MisCompras } from '../components/aula/pages/apuntes/MisCompras'
import { CentroAyuda } from '../components/public/Informacion/CentroAyuda'

export const Routing = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path="servicios" element={<Servicios />} />
            <Route path="viewservicio/:id" element={<ViewServicio />} />
            <Route path="politicas" element={<Politicas />} />
            <Route path="preguntas" element={<Preguntas />} />
            <Route path="formacionacademica" element={<Tienda />} />
            <Route path="view/:id" element={<View />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="search/:query" element={<Search />} />
            <Route path="success/:ui" element={<Succes />} />
            <Route path="certificados/:name" element={<Certificados />} />
            <Route path="success-pago/:ui" element={<SuccesPago />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          {/* PERFIL */}
          <Route path="perfil" element={<Perfil />} />
          <Route path="centrodeayuda" element={<CentroAyuda />} />
          <Route path="perfil/edit" element={<EditarPerfil />} />
          <Route path="mis_cursos" element={<MisCursos />} />
          <Route path="mis_apuntes" element={<MisApuntes />} />
          <Route path="mis_proyectos" element={<MisProyectos />} />
          <Route path="mis_compras" element={<MisCompras/>} />
          <Route path="mis_constancias" element={<MisConstancias />} />
          <Route path="mis_cursos/curso/:id" element={<VistaCurso />} />
          <Route path="mis_cursos/curso/clase/:cursoId/tema/:claseId" element={<Clase />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
