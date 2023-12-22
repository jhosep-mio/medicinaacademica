import React from 'react'
import { FaPlus } from 'react-icons/fa'
import useAuth from '../../../hooks/useAuth'
import { type carrito } from '../Interfaces'

interface ComponentProps {
  producto: carrito
}

export const IncrementProducto: React.FC<ComponentProps> = ({
  producto
}): JSX.Element => {
  const { cart, setCart } = useAuth()

  function increaseItemQuantity (producto: carrito): void {
    const itemIndex = cart.findIndex(
      (item) => item.id === producto.id && item.nombre === producto.nombre
    )

    if (itemIndex !== -1) {
      const updatedItems = [...cart]
      const item = updatedItems[itemIndex]
      if (item.cantidad !== null) {
        item.cantidad += 1
      }
      setCart(updatedItems)
      localStorage.setItem('cart', JSON.stringify(updatedItems))
    }
  }
  return (
    <FaPlus
      onClick={() => {
        increaseItemQuantity(producto)
      }}
    />
  )
}
