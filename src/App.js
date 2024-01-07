import React from "react";
import { Routes, Route } from "react-router";
import Ordenes from "./components/paginas/Ordenes";
import Menu from "./components/paginas/Menu";
import NuevoProductos from "./components/paginas/NuevoProducto";
import Sidebar from "./components/ui/Sidebar";
import PedidosP from "./components/paginas/PedidosP";
//Importamos Firebase en nuestra App
import firebaseInstance, { FirebaseContext } from './firebase';
function App() {
  return (
    <FirebaseContext.Provider value={{ firebaseInstance }}>
      <div className=
        "md:flex min-h-screen">
        <Sidebar />
        <div className="md:w-2/5 xl:w-4/5 p-6">
          <Routes>
            <Route path="/" element={<Ordenes />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/nuevo-producto" element={<NuevoProductos />} />
            <Route path="/pedido" element={<PedidosP />} />
          </Routes>
        </div>
      </div>
    </FirebaseContext.Provider>
  );
}
export default App;