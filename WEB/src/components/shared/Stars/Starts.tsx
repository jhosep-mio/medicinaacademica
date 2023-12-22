import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'

export default function Estrellas (props: { cantidad: number }): JSX.Element {
  const { cantidad } = props
  return (
        <Stack spacing={1} className='estrellas2'>
            <Rating name="size-large" defaultValue={cantidad} size="large" readOnly/>
        </Stack>
  )
}
