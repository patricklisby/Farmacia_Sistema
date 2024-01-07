import React, { useContext, useRef, useState } from "react";
import { FirebaseContext } from "../../firebase";
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);
const Producto = ({ producto }) => {
  // Existencia ref para acceder al valor directamente
  //const existenciaRef = useRef(producto.existencia);
  //
  // context de firebase para cambios en la BD
  const { firebaseInstance } = useContext(FirebaseContext);
  const { id, nombre, imagen, existencia, categoria, precio, descripcion, cantidad } =
    producto;
  let estado = producto.cantidad > 0 ? producto.existencia = true : producto.existencia = false;
  //console.log(estado);
  let nombreEstado = estado === true ? "Disponible" : "Sin stock";

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const editarProducto = (id, datosActualizados) => {
    try {

      firebaseInstance.db
        .collection("productos")
        .doc(id)
        .update(datosActualizados);
    } catch (error) {
      console.log(error);
    }
  };



  const deleteProduct = async (ids) => {
    try {
      firebaseInstance.db
        .collection("productos")
        .doc(ids)
        .delete();
    } catch (error) {
      console.log(error);
    }
  }

  //5 - Funcion de confirmacion para Sweet Alert 2
  const confirmDelete = (ids) => {
    MySwal.fire({
      title: '¿Elimina el producto?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        //llamamos a la fcion para eliminar   
        deleteProduct(ids)
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }
  return (
    <div className="w-full px-3 mb-4" style={{ textAlign: 'center' }}>
      <div className="p-5 shadow-md bg-white">
        <div className="lg:flex">
          <div className="lg:w-2/12 xl:w-2/12">
            <img src={imagen} alt=" imagen producto " />
            <div className="xl:flex sm:-mx-25 pl-10 gri down: auto">
              <button onClick={() => { confirmDelete(id) }}>
                <i style={{ fontSize: '20px', color: '#2E4850', border: '1px solid #2E4850', padding: '10px',borderRadius: '50%'}} className="fa-solid fa-trash"></i></button>
              <Button color = "false" onClick={toggle} className="ml-2">
                <i style={{ fontSize: '20px', color: '#2E4850', border: '1px solid #2E4850', padding: '10px',borderRadius: '50%' }} class="fa-solid fa-pen-to-square"></i>
              </Button>
            </div>
          </div>
          <div className="lg:w-7/12 xl:w-9/12 pl-5">
            <p className="font-bold text-2xl text-yellow-600 mb-4">{nombre} </p>
            <p className="text-gray-600 mb-4">
              Categoría: {""}
              <span className="text-gray-700 font-bold">
                {categoria.toUpperCase()}
              </span>
            </p>
            <p className="text-gray-600 mb-4">{descripcion} </p>
            <p className="text-gray-600 mb-4">
              Precio: {""}
              <span className="text-gray-700 font-bold">₡ {precio}</span>
            </p>{" "}
            <p className="text-gray-600 mb-4">
              Cantidad: {""}
              <span className="text-gray-700 font-bold">{cantidad}</span>
            </p>{" "}
            <p className="text-gray-600 mb-4">
              Estado: {""}
              <span className="text-gray-700 font-bold">{nombreEstado}</span>
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Editar Pan</ModalHeader>
        <ModalBody>

          <div className="lg:flex">
            <div className="lg:w-5/12 xl:w-3/12">
              <img src={producto.imagen} alt="imagen platillo" />
            </div>
            <div className="lg:w-7/12 xl:w-9/12 pl-5">
              <p className="text-gray-600 mb-4">
                Nombre:
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 
  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nombre"
                  type="text"
                  value={producto.nombre}
                  onChange={(e) =>
                    editarProducto(producto.id, { nombre: e.target.value })
                  }
                ></input>
              </p>
              <p className="text-gray-600 mb-4">
                Cantidad:
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 
  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="cantidad"
                  type="text"
                  value={producto.cantidad}
                  onChange={(e) =>
                    editarProducto(producto.id, { cantidad: e.target.value })
                  }
                ></input>
              </p>
              <p className="text-gray-600 mb-4">
                Categoría:
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 
text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="categoria"
                  name="categoria"
                  value={producto.categoria}
                  onChange={(e) =>
                    editarProducto(producto.id, { categoria: e.target.value })
                  }
                >
                <option value="">-- Seleccione --</option>
                <option value="cuidadoPersonal">Cuidado Personal</option>{" "}
                <option value="infantil">Infantil</option>{" "}
                <option value="ortopedia">Ortopedia</option>{" "}
                <option value="natural">Natural</option>{" "}
                <option value="cosmeticoDietetica">Cosmético y dietético</option>{" "}
                </select>
              </p>
              <p className="text-gray-600 mb-4">
                Descripcion:
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 
  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="descripcion"
                  type="text"
                  value={producto.descripcion}
                  onChange={(e) =>
                    editarProducto(producto.id, { descripcion: e.target.value })
                  }
                ></input>
              </p>
              <p className="text-gray-600 mb-4">
                Precio:
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 
  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="precio"
                  type="text"
                  value={producto.precio}
                  onChange={(e) =>
                    editarProducto(producto.id, { precio: e.target.value })
                  }
                ></input>
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Guardar
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>



  );
};
export default Producto;
