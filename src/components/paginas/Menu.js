import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
//Importamos el producto para tener acceso a sus datos
import Producto from "../ui/Producto";
const Menu = () => {
  // definir el state para los productos
  const [productos, guardarProductos] = useState([]);
  const { firebaseInstance } = useContext(FirebaseContext);
  // consultar la base de datos al cargar
  useEffect(() => {
    const obtenerProductos = () => {
      firebaseInstance.db.collection("productos").onSnapshot(manejarSnapshot);
    };
    obtenerProductos();
  }, [firebaseInstance.db]);
  // Snapshot nos permite utilizar la base de datos en tiempo real de firestore
  function manejarSnapshot(snapshot) {
    const productos = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    // almacenar los resultados en el state
    guardarProductos(productos);
  }
  return (
    <>
      <h1 className="text-3xl font-light mb-4">Menu</h1>{" "}
      <Link
        to="/nuevo-producto"
        className=" bg-blue-800 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold"
      >
        Agregar Producto
      </Link>
      {productos.map((producto) => (
        <Producto key={producto.id} producto={producto} />
      ))}
    </>
  );
};
export default Menu;
