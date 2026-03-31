import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>
                <Link to='/' style={styles.link}>GR8 COMMUNITY</Link>
            </div>
            <ul style={styles.navLinks}>
                <li><Link to='/' style={styles.link}>Hem</Link></li>
                <li><Link to='/login' style={styles.link}>Logga in</Link></li>
                <li><Link to='/register' style={styles.link}>Registrering</Link></li>
            </ul>
        </nav>
    )
}

/* Super simple design. delete this later. */
const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#333',
        color: '#fff'
    },
    navLinks: {
        display: 'flex',
        listStyle: 'none',
        gap: '15px',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold'
    }
}

export default Navbar;