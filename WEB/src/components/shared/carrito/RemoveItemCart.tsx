import React from 'react'
import { type carrito } from '../Interfaces'
import useAuth from '../../../hooks/useAuth'
import Swal from 'sweetalert2'
import { BsFillTrashFill } from "react-icons/bs";

interface ComponentProps {
  producto: carrito
}

export const RemoveItemCart: React.FC<ComponentProps> = ({
  producto
}): JSX.Element => {
  const { cart, setCart } = useAuth()
  function removeItemFromCart (producto: carrito): void {
    const updatedItems = cart.filter(
      (item) => item.id !== producto.id || item.nombre !== producto.nombre
    )
    setCart(updatedItems)
    Swal.fire('Producto eliminado', '', 'success')
    localStorage.setItem('cart', JSON.stringify(updatedItems))
  }
  return (
    <button
      type="button"
      data-toggle="tooltip"
      title=""
      className="btn crt-dlete1"
      data-original-title="Eliminar"
      onClick={() => { removeItemFromCart(producto) }}
    >
      <BsFillTrashFill/>
    </button>
  )
}
