import { type productosValues } from '../Interfaces'
import React from 'react'
import useAuth from '../../../hooks/useAuth'
import Swal from 'sweetalert2'

interface ComponentProps {
  producto: productosValues
  contador: number
  precioFinal: number
}

export const AddProducto: React.FC<ComponentProps> = ({ producto, contador, precioFinal }): JSX.Element => {
  const { cart, setCart } = useAuth()
  function addProduct (product: productosValues, cantidad: number): void {
    const itemIndex = cart.findIndex(
      (item: any) => item.id === product.id && item.nombre === product.nombre
    )
    if (itemIndex === -1) {
      // No existe un elemento coincidente en el carrito, agregar uno nuevo
      setCart([
        ...cart,
        {
          id: product.id,
          nombre: product.nombre,
          cantidad,
          precio: precioFinal,
          imagen1: product.imagen1
        }
      ])
      localStorage.setItem(
        'cart',
        JSON.stringify([
          ...cart,
          { id: product.id, nombre: product.nombre, cantidad, precio: precioFinal, imagen1: product.imagen1 }
        ])
      )
      Swal.fire(`${product.nombre} agregado al carrito`, '', 'success')
    } else {
      Swal.fire('Este curso ya se encuentra en su carrito', '', 'info')
    }
  }
  return (
    <button className='btn-carrito '
      onClick={(e) => {
        e.stopPropagation()
        addProduct(producto, contador)
      }}
    >
      Agregar al carrito
    </button>
  )
}
