import useAuth from '../../../hooks/useAuth'

export const TotalDelivery = (delivery: any): JSX.Element => {
  const { cart } = useAuth()

  function calculateTotal (): string {
    let total = 0
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i]
      if (item.precio !== null && item.cantidad) {
        const subtotal = item.precio * item.cantidad
        total += subtotal
      }
    }
    total = total + parseFloat(delivery.delivery)
    return total.toFixed(2) // Redondeamos a dos decimales
  }

  return <span className="price_total">S/. {calculateTotal()}</span>
}
