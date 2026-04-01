import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
    return (
        <nav>
            <div>
                <NavLink to="/">GR8 COMMUNITY</NavLink>
            </div>

            <ul>
                <li><NavLink to="/">Hem</NavLink></li>
                <li><NavLink to="/login">Logga in</NavLink></li>
                <li><NavLink to="/register">Registrering</NavLink></li>
            </ul>
        </nav>
    )
}

export default Navbar;