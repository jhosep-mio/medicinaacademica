import * as Yup from 'yup'

export const SchemaCompras = Yup.object().shape({
  nombre: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Debe tener como minimo 3 digitos'),
  apellido: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Debe tener como minimo 3 digitos'),
  celular1: Yup.string()
    .required('Este campo es requerido')
    .min(9, 'El numero debe tener 9 digitos')
    .max(9, 'El numero debe tener 9 digitos'),
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido'),
  comentario: Yup.string(),
  despacho: Yup.string().required('Este campo es requerido'),
  direccion: Yup.string().min(20, 'Sea mas especifico').nullable(),
  departamento: Yup.string().nullable(),
  distrito: Yup.string().nullable()
})

export const SchemaCompra = Yup.object().shape({
  nombres: Yup.string()
    .required('El campo es requerido')
    .min(3, 'Digite su nombre completo'),
  apellidos: Yup.string()
    .required('El campo es requerido')
    .min(3, 'Digite sus apellidos'),
  dni: Yup.string()
    .required('El campo es requerido')
    .min(8, 'Digite un dni valido'),
  email: Yup.string()
    .email('Digite un email valido')
    .required('El campo es requerido'),
  celular: Yup.string()
    .required('El campo es requerido')
    .min(7, 'Debe tener almenos 7 digitos')
})

export const SchemaCompra2 = Yup.object().shape({
  nombres: Yup.string()
    .required('El campo es requerido')
    .min(3, 'Digite su nombre completo'),
  apellidos: Yup.string()
    .required('El campo es requerido')
    .min(3, 'Digite sus apellidos'),
  dni: Yup.string()
    .required('El campo es requerido')
    .min(8, 'Digite un dni valido'),
  email: Yup.string()
    .email('Digite un email valido')
    .required('El campo es requerido'),
  celular: Yup.string()
    .required('El campo es requerido')
    .min(7, 'Debe tener almenos 7 digitos'),
  nombre_empresa: Yup.string()
    .required('El campo es requerido')
    .min(3, 'Digite el nombre completo'),
  ruc: Yup.string()
    .required('El campo es requerido')
    .min(11, 'Digite un ruc valido'),
  direccion_fiscal: Yup.string()
    .required('El campo es requerido')
    .min(3, 'Debe tener minimo 3 digitos')
})

export const SchemaContacto = Yup.object().shape({
  nombres: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Debe tener como minimo 3 digitos'),

  celular: Yup.string()
    .required('Este campo es requerido')
    .min(9, 'Debe tener como minimo 9 digitos'),
  email: Yup.string()
    .required('Este campo es requerido')
    .email('Introduce un email válido'),
  asunto: Yup.string()
    .required('Este campo es requerido'),
  mensaje: Yup.string().required('Este campo es requerido')

})

export const SchemaBoletin = Yup.object().shape({
  email: Yup.string()
    .required('Este campo es requerido')
    .email('Introduce un email válido')
})

export const SchemaPayment = Yup.object().shape({
  nombres: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Debe tener como minimo 3 digitos'),
  apellidos: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Debe tener como minimo 3 digitos'),
  email: Yup.string()
    .required('Este campo es requerido')
    .email('Introduce un email válido'),
  ruc: Yup.string()
    .required('Este campo es requerido')
    .min(8, 'Debe tener como minimo 8 digitos'),
  direccion: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Debe tener como minimo 3 digitos'),
  celular: Yup.string()
    .required('Este campo es requerido')
    .min(7, 'Debe tener como minimo 7 digitos')
    .max(9, 'Debe tener como maximo 9 digitos')
})

export const SchemaPerfil = Yup.object().shape({
  nombres: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Debe tener como minimo 3 digitos'),
  apellidos: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Debe tener como minimo 3 digitos'),
  ruc: Yup.string()
    .min(8, 'Debe tener como minimo 8 digitos'),
  direccion: Yup.string()
    .min(3, 'Debe tener como minimo 3 digitos'),
  celular: Yup.string()
    .min(7, 'Debe tener como minimo 7 digitos')
    .max(9, 'Debe tener como maximo 9 digitos')
})
