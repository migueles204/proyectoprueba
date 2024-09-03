import { useState } from 'react'; // Importa React
import NavbarComp from './components/navegation';
import Dashboard from './components/modules/dashboard'; // Importa el componente Dashboard

function App() {
  return (
    <>
      <NavbarComp />
      <Dashboard /> {/* Agrega el componente Dashboard */}
    </>
  );
}

export default App;
