import React from 'react'
import { type carrito } from '../Interfaces'
import useAuth from '../../../hooks/useAuth'
import { BsFillTrashFill } from 'react-icons/bs'
import Swal from 'sweetalert2'

interface ComponentProps {
  producto: carrito
}

export const RemoveItem: React.FC<ComponentProps> = ({
  producto
}): JSX.Element => {
  const { cart, setCart } = useAuth()
  function removeItemFromCart (producto: carrito): void {
    const updatedItems = cart.filter(
      (item) =>
        item.id !== producto.id ||
        item.nombre !== producto.nombre
    )
    setCart(updatedItems)
    Swal.fire('Producto eliminado', '', 'success')
    localStorage.setItem('cart', JSON.stringify(updatedItems))
  }
  return (
    <button
      onClick={() => {
        removeItemFromCart(producto)
      }}
    >
      <BsFillTrashFill />
    </button>
  )
}
