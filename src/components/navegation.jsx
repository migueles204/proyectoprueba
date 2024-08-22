import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { GiTreeBeehive } from "react-icons/gi";
import { FaMoon, FaSun } from 'react-icons/fa';
import { MdOutlineLogout } from "react-icons/md";

import Profile from '../components/modules/profile';
import Users from '../components/modules/users';
import Roles from '../components/modules/roles';
import Employees from '../components/modules/employees';
import Clients from '../components/modules/clients';
import Services from '../components/modules/services';
import Venues from '../components/modules/venues';
import Categoryofspecimens from '../components/modules/categoryofspecimens';
import Transfers from '../components/modules/transfers';
import Records from '../components/modules/records';
import Dashboard from '../components/modules/dashboard';
import Logout from '../components/modules/logout';

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
              <Navbar.Brand href="#home">
                <GiTreeBeehive style={{ marginRight: '10px', color: '#FFD700', fontSize: '3.80rem' }} />
                H-Honey
              </Navbar.Brand>
              <Nav className="mx-auto">
                <Nav.Link as={Link} to="/Profile" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Profile</Nav.Link>
                <Nav.Link as={Link} to="/Users" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Users</Nav.Link>
                <Nav.Link as={Link} to="/Roles" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Roles</Nav.Link>
                <Nav.Link as={Link} to="/Employees" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Employees</Nav.Link>
                <Nav.Link as={Link} to="/Clients" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Clients</Nav.Link>
                <Nav.Link as={Link} to="/Services" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Services</Nav.Link>
                <Nav.Link as={Link} to="/Venues" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Venues</Nav.Link>
                <Nav.Link as={Link} to="/Categoryofspecimens" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Category of Specimens</Nav.Link>
                <Nav.Link as={Link} to="/Transfers" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Transfers</Nav.Link>
                <Nav.Link as={Link} to="/Records" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Records</Nav.Link>
                <Nav.Link as={Link} to="/Dashboard" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/Logout" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>
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
            <Route path='/Users' element={<Users />} />
            <Route path='/Roles' element={<Roles />} />
            <Route path='/Employees' element={<Employees />} />
            <Route path='/Clients' element={<Clients />} />
            <Route path='/Services' element={<Services />} />
            <Route path='/Venues' element={<Venues />} />
            <Route path='/Categoryofspecimens' element={<Categoryofspecimens />} />
            <Route path='/Transfers' element={<Transfers />} />
            <Route path='/Records' element={<Records />} />
            <Route path='/Dashboard' element={<Dashboard />} />
            <Route path='/Logout' element={<Logout />} />
          </Routes>
        </div>
        <p></p>
      </Router>
    );
  }
}
  