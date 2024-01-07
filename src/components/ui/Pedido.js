import React, { useContext, useRef, useState, useEffect } from "react";
import { FirebaseContext } from "../../firebase";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

const Pedido = ({ pedido }) => {
  // Existencia ref para acceder al valor directamente
  const existenciaRef = useRef(pedido.existencia);
  // context de firebase para cambios en la BD
  const { firebaseInstance } = useContext(FirebaseContext);
  const { id, PrecioTotal, articulos, estado } = pedido;
  const articulosConSaltoDeLinea = articulos.split(",").join("\n");
  let msgEstado = pedido.estado ? 'En curso' : 'Finalizado';

  //Timer

  const Ref = useRef(null);
  const [timer, setTimer] = useState('00:00');

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);


  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total, minutes, seconds
    };
  }
  const startTimer = (e) => {
    let { total, minutes, seconds }
      = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (minutes > 9 ? minutes : '0' + minutes) + ':'
        + (seconds > 9 ? seconds : '0' + seconds)
      )
    }
  }

  const clearTimer = (e) => {
    setTimer('05:00');
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000)
    Ref.current = id;
  }

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + 5);
    return deadline;
  }

  const editarProducto = async (id, estado) => {
    try {
      await firebaseInstance.db
        .collection("Recibo")
        .doc(id)
        .update(estado);

      console.log("Producto actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };


  useEffect(() => {
    if (estado) {
      clearTimer(getDeadTime());
    } else {
      //clearTimer(getDeadTime());
    }
  }, [estado]);

  return (
    <div className="w-full px-3 mb-4 pl-5 shadow-md" style={{ textAlign: "center" }}>
      <span className="text-black-100 font-bold">Orden: {id.toUpperCase()}</span>
      <p className="text-black-100 mb-4">
        <table className="table-auto w-full border-collapse">
          <thead >
            <tr>
              <th className="px-4 py-2">Artículos</th>
            </tr>
          </thead>
          <tbody>
            {articulosConSaltoDeLinea.split('\n').map((articulo, index) => (
              <tr key={index}>
                <td>{articulo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <span className="text-black-100">Tiempo del pedido: {timer} </span>
        <p className="text-black-100 mb-4">Precio Total: {PrecioTotal}</p>
        <p className="text-black-100 mb-4">Estado Pedido: {msgEstado}</p>
        <Button color="false" onClick={toggle} className="ml-2">
          <i style={{ fontSize: '20px', color: '#2E4850', border: '1px solid #2E4850', padding: '10px', borderRadius: '50%', backgroundColor:"red"}} class="fa-regular fa-hand"></i>
        </Button>
      </p>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>¿Finalizar la orden?</ModalHeader>
        <ModalBody>
          <div style={{ textAlign: "center" }}>
            <span className="text-black-100 font-bold">Orden: {id.toUpperCase()}</span>
            <p className="text-black-100 mb-4">
              <table className="table-auto w-full border-collapse">
                <thead >
                  <tr>
                    <th className="px-4 py-2">Artículos</th>
                  </tr>
                </thead>
                <tbody>
                  {articulosConSaltoDeLinea.split('\n').map((articulo, index) => (
                    <tr key={index}>
                      <td>{articulo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-black-100 mb-4">Precio Total: {PrecioTotal}</p>
              <p className="text-black-100 mb-4">Estado Pedido: {msgEstado}</p>
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-center">

          <Button
            color="primary"
            onClick={() => {
              editarProducto(pedido.id, { estado: false });
              toggle();
            }}
          >
            Aceptar
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>

  );
};

export default Pedido;
