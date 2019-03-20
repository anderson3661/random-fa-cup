import React from 'react';
import { NavLink } from 'react-router-dom';

import { SCARF_HELP, SCARF_CONTACT, SCARF_ABOUT, COPYRIGHT } from '../../utilities/constants';

import './footer.scss';


const Footer = () => {
    return (
        <footer>
            <div className="links">
                <div><NavLink to="/help" className="nav-link"><img src={SCARF_HELP} alt="" /></NavLink></div>
                <div><NavLink to="/contact" className="nav-link"><img src={SCARF_CONTACT} alt="" /></NavLink></div>
                <div><NavLink to="/about" className="nav-link"><img src={SCARF_ABOUT} alt="" /></NavLink></div>
            </div>
            &copy; {COPYRIGHT}
        </footer>
    );
};

export default Footer;