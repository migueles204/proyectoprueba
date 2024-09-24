// NavbarComp.jsx
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { GiTreeBeehive } from "react-icons/gi";
import { FaMoon, FaSun } from 'react-icons/fa';
import { MdOutlineLogout } from "react-icons/md";
import Swal from 'sweetalert2';

import Profile from '../components/modules/profile';
import Dashboard from '../components/modules/dashboard';
import Users from '../components/modules/users';
import Roles from '../components/modules/roles';
import Clients from '../components/modules/clients';
import Services from '../components/modules/services';
import Packages from '../components/modules/packages'
import Headquarters from '../components/modules/headquarters';
import Tracking from '../components/modules/tracking';
import Transfers from '../components/modules/transfers';
import Records from '../components/modules/records';
import Contracts from '../components/modules/contracts';
import Logout from '../components/modules/logout';
import Categoryofspecimens from '../components/modules/categoryofspecimens';
import Specimens from '../components/modules/specimens';
import DetailsP from '../components/modules/DetailsP';

export default class NavbarComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: true // Estado para el tema
    };
  }

  // Función para alternar el tema
  toggleTheme = () => {
    this.setState(prevState => ({
      darkMode: !prevState.darkMode
    }));
  };

  // Función para manejar el cierre de sesión
  handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás volver a recuperar la sesión!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e7e34',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí puedes agregar la lógica de cierre de sesión (e.g., limpiar tokens)
        Swal.fire(
          '¡Cerrar sesión!',
          'Has cerrado sesión con éxito.',
          'success'
        ).then(() => {
          // Redirige a la página principal después de cerrar sesión
          window.location.href = '/';
        });
      }
    });
  };

  render() {
    // Estilos basados en el tema
    const navbarStyle = {
      backgroundColor: this.state.darkMode ? '#000' : '#fff',
      color: this.state.darkMode ? '#fff' : '#000',
    };

    const navLinkStyle = {
      color: this.state.darkMode ? 'white' : 'black',
    };

    const navLinkHoverStyle = {
      color: this.state.darkMode ? '#FFD700' : '#FFD700', // Color en hover
    };

    return (
      <Router>
        <div>
          <Navbar style={navbarStyle} data-bs-theme={this.state.darkMode ? 'dark' : 'light'}>
            <Container>
            <Navbar.Brand 
              href="#home" 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
              <GiTreeBeehive style={{ color: '#F2C94C', fontSize: '3.80rem' }} />
              <span 
                style={{ 
                  fontSize: '1.8rem', 
                  marginTop: '0.1rem', // Reducción del margen superior
                  fontFamily: '"Dancing Script", cursive', 
                  color: this.state.darkMode ? '#F5F5F0' : '#000' 
                }}
              >
                Honey
              </span>
            </Navbar.Brand>
              <Nav className="mx-auto">
                <Nav.Link as={Link} to="/Profile" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Profile</Nav.Link>
                <Nav.Link as={Link} to="/Dashboard" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/Users" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Users</Nav.Link>
                <Nav.Link as={Link} to="/Roles" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Roles</Nav.Link>
                <Nav.Link as={Link} to="/Clients" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Clients</Nav.Link>
                <Nav.Link as={Link} to="/Services" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Services</Nav.Link>
                <Nav.Link as={Link} to="/Packages" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Packages</Nav.Link>
                <Nav.Link as={Link} to="/Headquarters" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Headquarters</Nav.Link>
                <Nav.Link as={Link} to="/Categoryofspecimens" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Specimens</Nav.Link>
                <Nav.Link as={Link} to="/Tracking" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Tracking</Nav.Link>
                <Nav.Link as={Link} to="/Transfers" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Transfers</Nav.Link>
                <Nav.Link as={Link} to="/Records" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Payments</Nav.Link>
                <Nav.Link as={Link} to="/Contracts" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Contracts</Nav.Link>
                <Nav.Link style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color} onClick={(e) => { e.preventDefault(); this.handleLogout(); }}>
                  Log out
                  <MdOutlineLogout style={{ marginRight: '8px', fontSize: '1.75rem' }} />
                </Nav.Link>
              </Nav>

              <button 
                style={{
                  backgroundColor: this.state.darkMode ? '#FFD700' : '#000',
                  color: this.state.darkMode ? '#000' : '#FFD700',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={this.toggleTheme}
              >
                {this.state.darkMode ? <FaMoon size={20} /> : <FaSun size={20} />}
              </button>
            </Container>
          </Navbar>

          <Routes>
            <Route path='/Profile' element={<Profile />} />
            <Route path='/Dashboard' element={<Dashboard />} />
            <Route path='/Users' element={<Users />} />
            <Route path='/Roles' element={<Roles />} />
            <Route path='/Clients' element={<Clients />} />
            <Route path='/Services' element={<Services />} />
            <Route path='/Packages' element={<Packages />} />
            <Route path='/Headquarters' element={<Headquarters />} />
            <Route path="/Specimens/:id" element={<Specimens />} />
            <Route path='/DetailsP/:id' element={<DetailsP />} />
            <Route path='/Categoryofspecimens' element={<Categoryofspecimens />} /> 
            <Route path='/Tracking' element={<Tracking />} />
            <Route path='/Transfers' element={<Transfers />} />
            <Route path='/Records' element={<Records />} />
            <Route path='/Contracts' element={<Contracts />} />
            <Route path='/Logout' element={<Logout />} />
          </Routes>
        </div>
      </Router>
    );
  }
}
