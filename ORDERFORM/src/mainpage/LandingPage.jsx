import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from '../assets/bg.jpg';

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        name,
        password,
      });

      if (res.data.success) {
        const { role } = res.data;

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', role);
        localStorage.setItem('userName', name); // ✅ Save executive/admin/designer/account name here

        // Navigate based on the role
        if (role === 'Executive') {
          navigate('/order');
        } else if (role === 'Admin') {
          navigate('/admin-dashboard');
        } else if (role === 'Designer') {
          navigate('/designer-dashboard');
        } else if (role === 'Account') {
          navigate('/account-dashboard');
        } else if (role === 'Service Executive') {
          navigate('/service-executive-dashboard');
        } else if (role === 'Service Manager') {
          navigate('/service-manager-dashboard');
        } else if (role === 'Sales Manager') {
          navigate('/sales-manager-dashboard');
        } else {
          alert('Unknown role. Please contact administrator.');
        }
        
      } else {
        alert('Login failed: Invalid credentials');
      }
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  const styles = {
    pageContainer: {
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#003366',
      color: 'white',
      padding: '2vh 4vw',
    },
    navbarTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    loginBtn: {
      backgroundColor: 'white',
      color: '#003366',
      padding: '1vh 2vw',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'pointer',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '2vh',
    },
    modal: {
      background: 'white',
      padding: '5vh 4vw',
      borderRadius: '10px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      position: 'relative',
    },
    closeBtn: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      color: '#003366',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 6px rgba(0,0,0,0.2)',
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      fontWeight: 'bold',
      fontSize: '1rem',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      boxSizing: 'border-box',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    buttons: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
      gap: '10px',
    },
    modalBtn: {
      flex: 1,
      padding: '10px',
      backgroundColor: '#003366',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.pageContainer}>
      <nav style={styles.navbar}>
        <h1 style={styles.navbarTitle}>Global Marketing Solution</h1>
        <button style={styles.loginBtn} onClick={() => setShowLogin(true)}>Login</button>
      </nav>

      {showLogin && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button style={styles.closeBtn} onClick={() => setShowLogin(false)}>&times;</button>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>

            <label style={styles.label}>
              Name:
              <input
                type="text"
                autoComplete="off"
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label style={styles.label}>
              Password:
              <input
                type="password"
                autoComplete="new-password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <div style={styles.buttons}>
              <button style={styles.modalBtn} onClick={handleLogin}>Login</button>
              <button style={styles.modalBtn} onClick={() => setShowLogin(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
