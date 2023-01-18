import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import { Link } from 'react-router-dom';


const Menu = () => {
    const [
        isOpen,
        setIsOpen,
    ] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar
                className='sticky-top'
                color="light"
                light
                expand="md"
            >
                <NavbarBrand href="/">Rustyplayer</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse
                    isOpen={isOpen}
                    navbar
                >
                    <Nav
                        className="me-auto"
                        navbar
                    >
                        <NavItem>
                            <NavLink
                                tag={Link}
                                to="/"
                            >Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                tag={Link}
                                to="/items/"
                            >Media</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
};

export default Menu;
