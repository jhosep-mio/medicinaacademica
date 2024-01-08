import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import { RiFilter2Fill } from "react-icons/ri";
import { Loading } from "../../../shared/Loading";
import { Paginacion } from "../../../shared/Paginacion";
import { cuponesValues } from "../../../shared/Interfaces";
import { DeleteItems } from "../../../shared/DeleteItems";
import { LoadingSmall } from "../../../shared/LoadingSmall";

export const ListaCupones = (): JSX.Element => {
  const token = localStorage.getItem("token");
  const [cupones, setCupones] = useState([]);
  const { setTitle, loadingComponents, setLoadingComponents } = useAuth();
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [paginaActual, setpaginaActual] = useState(1);
  const [search, setSearch] = useState("");
  const [cantidadRegistros] = useState(4);

  const navigate = useNavigate();

  const getAllCupones = async (): Promise<void> => {
    setLoadingComponents(true);
    const data = new FormData();
    data.append("buscar", search);
    const request = await axios.post(`${Global.url}/getCupones`, data, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== "" ? token : ""}`,
      },
    });
    setCupones(request.data);
    setTotalRegistros(request.data.length);
    setLoadingComponents(false);
  };

  const indexOfLastPost = paginaActual * cantidadRegistros;
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros;
  const totalPosts = cupones.length;

  const filterDate = (): never[] => {
    return cupones.slice(indexOfFirstPost, indexOfLastPost);
  };

  const onSeachChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1);
    setSearch(target.value);
  };

  const preguntar = (id: number): void => {
    DeleteItems({
      ruta: "deleteCupon",
      id,
      token,
      getData: getAllCupones,
      totalPosts,
      cantidadRegistros,
      paginaActual,
      setpaginaActual,
    });
  };

  useEffect(() => {
    setTitle("Listado de cupones");
    getAllCupones();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 mb-5 ">
        <div>
          {/* <h1 className="font-bold text-gray-100 text-xl">Lista de Productos</h1> */}
        </div>
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4">
          <button className="bg-secondary-100/50 hover:bg-secondary-100  w-full md:w-fit flex items-center  gap-2 py-2 px-4 rounded-lg hover:text-white transition-colors">
            <RiFilter2Fill />
            <input
              placeholder="Buscar ..."
              className="bg-transparent outline-none"
              value={search}
              onChange={onSeachChange}
              type="search"
            />
            <button
              className="text-white bg-main h-full px-3 py-1 rounded-lg"
              onClick={() => {
                !loadingComponents && getAllCupones();
              }}
            >
              {!loadingComponents ? (
                "Buscar"
              ) : (
                <div>
                  <LoadingSmall />
                </div>
              )}
            </button>
          </button>
          <button
            className="bg-main text-white hover:bg-main w-full lg:w-fit flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors"
            onClick={() => {
              navigate("agregar");
            }}
          >
            Crear
          </button>
        </div>
      </div>
      {loadingComponents ? (
        <Loading />
      ) : (
        <div className="bg-secondary-100 p-8 rounded-xl">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-5 gap-4 mb-10 p-4">
            <h5 className="md:text-center">ID</h5>
            <h5 className="md:text-center">Código</h5>
            <h5 className="md:text-center">Tipo de descuento</h5>
            <h5 className="md:text-center">Monto mínimo</h5>
            <h5 className="md:text-center">Acciones</h5>
          </div>
          {filterDate().map((pro: cuponesValues) => (
            <div
              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4 bg-secondary-900 p-4 rounded-xl"
              key={pro.id}
            >
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">ID</h5>
                <span>#{pro.id}</span>
              </div>
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">Código</h5>
                <span>{pro.codigo}</span>
              </div>

              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-white font-bold mb-2">
                  Tipo de descuento
                </h5>
                <span>{pro.tipoDescuento}</span>
              </div>
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">
                  Monto mínimo
                </h5>
                <span>{pro.montoMinimo}</span>
              </div>
              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-white font-bold mb-2">
                  Acciones
                </h5>
                <Menu
                  menuButton={
                    <MenuButton className="flex items-center gap-x-2 bg-secondary-100 p-2 rounded-lg transition-colors">
                      Acciones
                    </MenuButton>
                  }
                  align="end"
                  arrow
                  transition
                  menuClassName="bg-secondary-100 p-4"
                >
                  <MenuItem className="p-0 hover:bg-transparent">
                    <Link
                      to=""
                      onClick={() => {
                        preguntar(pro.id);
                      }}
                      className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 p-2 flex-1"
                    >
                      Eliminar
                    </Link>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-between content_buttons ">
            <p className="text-md ml-1"> {totalRegistros} Registros </p>
            <Paginacion
              totalPosts={totalPosts}
              cantidadRegistros={cantidadRegistros}
              paginaActual={paginaActual}
              setpaginaActual={setpaginaActual}
            />
          </div>
        </div>
      )}
    </>
  );
};
