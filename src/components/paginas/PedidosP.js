import React, { useState, useEffect, useContext } from "react";

import { FirebaseContext } from "../../firebase";
import Pedido from "../ui/Pedido";

const Menu = () => {
  const [pedidos, guardarPedidos] = useState([]);
  const { firebaseInstance } = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerPedidos = () => {
      firebaseInstance.db.collection("Recibo").onSnapshot(manejarSnapshot);
    };

    obtenerPedidos();
  }, [firebaseInstance.db]);

  function manejarSnapshot(snapshot) {
    const pedidos = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    guardarPedidos(pedidos);
  }
  const pedidosFiltrados = pedidos.filter((pedido) => pedido.estado);
  return (
    <>
      <h1 className="text-3xl font-light mb-4">Pedidos Realizados</h1>
      {pedidosFiltrados.map((pedido) => (
        <div key={pedido.id}>
          <Pedido pedido={pedido} />
        </div>
      ))}
    </>
  );
};

export default Menu;