import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Navbar.css'

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav>
            <div>
                <NavLink to="/">GR8 COMMUNITY</NavLink>
            </div>

            <ul>
                <li><NavLink to="/">Hem</NavLink></li>
                {isAuthenticated ? (
                    <>
                        <li><NavLink to="/settings">Inställningar</NavLink></li>
                        <li><NavLink to="/forum">Forum</NavLink></li>
                        <li><button onClick={logout}>Logga ut</button></li>
                    </>
                ) : (
                    <>
                        <li><NavLink to="/login">Logga in</NavLink></li>
                        <li><NavLink to="/register">Registrering</NavLink></li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Navbar;