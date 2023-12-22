
interface Errores {
  errors: string | undefined
  touched: boolean | undefined
}

export const Errors2 = (props: Errores): JSX.Element => {
  return (
      <p className="text-lg p-0 m-0 mt-0 pl-2">{props.errors !== null && props.errors !== undefined && props.errors !== '' &&
       props.touched !== null && props.touched !== undefined && props.touched && <span className="text-red-400">{props.errors}</span>}</p>
  )
}
