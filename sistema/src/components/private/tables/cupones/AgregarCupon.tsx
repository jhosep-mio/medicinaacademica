import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import Swal from "sweetalert2";
import { Loading } from "../../../shared/Loading";
import { useFormik } from "formik";
import { TitleBriefs } from "../../../shared/TitleBriefs";
import { InputsBriefs } from "../../../shared/InputsBriefs";
import { Errors } from "../../../shared/Errors";
import {
  cuponesValuesModificate,
  productosValues,
} from "../../../shared/Interfaces";
import { SchemaCupones } from "../../../shared/Schemas";

export const AgregarCupon = (): JSX.Element => {
  const navigate = useNavigate();
  const [tipoDescuento, setTipoDescuento] = useState<
    "porcentaje" | "montoFijo"
  >("porcentaje");
  const token = localStorage.getItem("token");
  const [tipoCupon, setTipoCupon] = useState<"producto" | "carrito">(
    "producto"
  );

  const [productos, setProductos] = useState([]);
  const { setTitle, loadingComponents, setLoadingComponents } = useAuth();

  useEffect(() => {
    setTitle("Agregar cupón");
  }, []);

  const getProductos = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/allProductos`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== "" ? token : ""}`,
      },
    });
    setProductos(request.data);
    setLoadingComponents(false);
  };

  useEffect(() => {
    getProductos();
  }, [tipoCupon]);

  const saveCategoria = async (
    values: cuponesValuesModificate
  ): Promise<void> => {
    setLoadingComponents(true);
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("codigo", values.codigo);
    data.append('tipoDescuento', values.tipoDescuento)
    data.append('valorDescuento', values.valorDescuento)
    data.append('fechaInicio', values.fechaInicio)
    data.append('fechaFinal', values.fechaFinal)
    data.append('montoMinimo', values.montoMinimo)
    data.append('tipoCupon', values.tipoCupon)
    data.append('id_producto', values.id_producto)


    try {
      const respuesta = await axios.post(`${Global.url}/saveCupon`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== "" ? token : ""
          }`,
        },
      });

      if (respuesta.data.status == "success") {
        Swal.fire("Agregado correctamente", "", "success");
        navigate("/admin/cupones");
      } else {
        Swal.fire("Error ", "", "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "", "error");
    }
    setLoadingComponents(false);
  };

  const {
    handleSubmit,
    handleChange,
    errors,
    setValues,
    values,
    touched,
    handleBlur,
    isSubmitting,
  } = useFormik({
    initialValues: {
      codigo: "",
      tipoDescuento: "",
      valorDescuento: "",
      fechaFinal: "",
      fechaInicio: "",
      montoMinimo: '',
      tipoCupon: "",
      id_producto: "",
    },
    validationSchema: SchemaCupones,
    onSubmit: saveCategoria,
  });

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0];
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0];
      if (firstErrorElement) {
        firstErrorElement.focus();
      }
    }
  }, [touched, errors, isSubmitting]);

  function generateCouponCode(length: number): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let couponCode = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      couponCode += characters.charAt(randomIndex);
    }

    setValues((prevValues) => ({ ...prevValues, codigo: couponCode }));
    return couponCode;
  }

  const handleTipoDescuentoChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTipoDescuento(e.target.value as "porcentaje" | "montoFijo");
    setValues((prevValues) => ({
      ...prevValues,
      tipoDescuento: e.target.value,
    }));
  };

  const handleTipoCuponChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoCupon(e.target.value as "producto" | "carrito");
    setValues((prevValues) => ({
      ...prevValues,
      tipoCupon: e.target.value,
    }));
  };
  return (
    <>
      {loadingComponents ? (
        <Loading />
      ) : (
        <form
          className="bg-secondary-100 p-8 rounded-xl"
          onSubmit={handleSubmit}
        >
          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row gap-5">
            <div className="w-full lg:w-1/2 flex gap-5 items-center flex-col lg:flex-row">
              <div className="w-full lg:w-2/3">
                <TitleBriefs titulo="Código del cupon" />
                <InputsBriefs
                  name="codigo"
                  type="text"
                  value={values.codigo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.codigo} touched={touched.codigo} />
              </div>
              <div className="w-full lg:w-1/3">
                <button
                  type="button"
                  onClick={() => {
                    generateCouponCode(5);
                  }}
                  className="w-full bg-green-500 active:scale-95 rounded-xl hover:bg-green-700 transition-all text-white py-2"
                >
                  Generar cupón
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <label>
                <TitleBriefs titulo="Tipo de descuento" />

                <select
                  name="tipoDescuento"
                  value={tipoDescuento}
                  onChange={handleTipoDescuentoChange}
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                  rounded-md transition-all"
                >
                  <option value="">Seleccionar</option>
                  <option value="porcentaje">Porcentaje</option>
                  <option value="montoFijo">Monto Fijo</option>
                </select>
              </label>
              <Errors
                errors={errors.tipoDescuento}
                touched={touched.tipoDescuento}
              />
            </div>
          </div>

          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row gap-5">
            <div className="w-full lg:w-1/3">
              {/* ... Otros componentes Formik */}

              {tipoDescuento === "porcentaje" ? (
                <>
                  <label>
                    <TitleBriefs titulo="Valor del Descuento (%):" />

                    <InputsBriefs
                      name="valorDescuento"
                      type="number"
                      value={values.valorDescuento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </label>
                  <Errors
                    errors={errors.valorDescuento}
                    touched={touched.valorDescuento}
                  />
                </>
              ) : (
                <>
                  <label>
                    <TitleBriefs titulo="Valor del Descuento (Monto Fijo):" />

                    <InputsBriefs
                      type="number"
                      name="valorDescuento"
                      value={values.valorDescuento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </label>
                  <Errors
                    errors={errors.valorDescuento}
                    touched={touched.valorDescuento}
                  />
                </>
              )}
            </div>
            <div className="w-full lg:w-2/3 flex gap-2">
              <div className="w-1/2">
                <label>
                  <TitleBriefs titulo="Fecha de inicio" />

                  <InputsBriefs
                    type="date"
                    name="fechaInicio"
                    value={values.fechaInicio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Errors
                    errors={errors.fechaInicio}
                    touched={touched.fechaInicio}
                  />
                </label>
              </div>

              <div className="w-1/2">
                <label>
                  <TitleBriefs titulo="Fecha final" />

                  <InputsBriefs
                    type="date"
                    name="fechaFinal"
                    value={values.fechaFinal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Errors
                    errors={errors.fechaFinal}
                    touched={touched.fechaFinal}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row gap-5">
            <div className="w-full lg:w-1/3">
              <TitleBriefs titulo="Monto Mínimo" />
              <InputsBriefs
                name="montoMinimo"
                type="number"
                value={values.montoMinimo}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors
                errors={errors.montoMinimo}
                touched={touched.montoMinimo}
              />
            </div>
            <div className="w-full lg:w-1/3">
              <label>
                <TitleBriefs titulo="Tipo de cupon" />

                <select
                  name="tipoCupon"
                  value={tipoCupon}
                  onChange={handleTipoCuponChange}
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                  rounded-md transition-all"
                >
                  <option value="">Seleccionar</option>
                  <option value="producto">A un producto</option>
                  <option value="carrito">A todo el carrito</option>
                </select>
              </label>
              <Errors errors={errors.tipoCupon} touched={touched.tipoCupon} />
            </div>

            {tipoCupon === "producto" && (
              <div className="w-full lg:w-1/3">
                <TitleBriefs titulo="Asignar curso" />

                <select
                  name="id_producto"
                  value={values.id_producto}
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                  rounded-md transition-all"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Seleccionar</option>
                  {productos.map((producto: productosValues) => (
                    <option value={`${producto.id}`} key={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/cupones"
              className="bg-red-500 px-4 py-2 rounded-md text-white"
            >
              Cancelar
            </Link>
            <input
              type="submit"
              className="bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="Agregar"
            />
          </div>
        </form>
      )}
    </>
  );
};
