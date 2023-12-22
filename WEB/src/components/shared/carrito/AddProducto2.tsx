import { type productosValues } from '../Interfaces'
import React from 'react'
import useAuth from '../../../hooks/useAuth'
import Swal from 'sweetalert2'

interface ComponentProps {
  producto: productosValues
  contador: number
  precioFinal: number
  setContador: React.Dispatch<React.SetStateAction<number>>
}

export const AddProducto2: React.FC<ComponentProps> = ({ producto, contador, setContador, precioFinal }): JSX.Element => {
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
      // Ya existe un elemento en el carrito con el mismo id y nombre, actualizar la cantidad
      const updatedItems = [...cart]
      if (cantidad != null) {
        updatedItems[itemIndex].cantidad =
          (updatedItems[itemIndex].cantidad ?? 0) + cantidad
      }
      setCart(updatedItems)
      Swal.fire(`Se agrego mas unidades a ${product.nombre}`, '', 'success')
      setContador(1)
      localStorage.setItem('cart', JSON.stringify(updatedItems))
    }
  }
  return (
    <button className='btn-carrito2'
      onClick={() => {
        addProduct(producto, contador)
      }}
    >
      Agregar al carrito
    </button>
  )
}
