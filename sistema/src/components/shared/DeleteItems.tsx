import axios from 'axios'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { Global } from '../../helper/Global'
import { type deleteValues } from './Interfaces'

export const DeleteItems = ({ ruta, id, token, getData, totalPosts, cantidadRegistros, paginaActual, setpaginaActual }: deleteValues): void => {
  Swal.fire({
    title: `¿Estas seguro de eliminar al registro N° ${id}?`,
    showDenyButton: true,
    confirmButtonText: 'Eliminar',
    denyButtonText: 'Cancelar'
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      try {
        const resultado = await axios.delete(
                `${Global.url}/${ruta}/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${
                      token !== null && token !== '' ? token : ''
                    }`
                  }
                }
        )

        if (resultado.data.status == 'success') {
          Swal.fire('Registro eliminado correctamente', '', 'success')
          getData()
          setTimeout(() => {
            if (Math.round(totalPosts / cantidadRegistros) !== paginaActual) {
              setpaginaActual(Math.round(totalPosts / cantidadRegistros))
            }
          }, 1000)
        } else {
          Swal.fire('Error al eliminar el registro', '', 'error')
        }
      } catch (error) {
        Swal.fire('Error al eliminar el registro', '', 'error')
        console.log(error)
      }
    }
  })
}
