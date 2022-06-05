import React, { Component } from 'react';
import { NavLink } from "react-router-dom";

class Navbar extends Component {

    render() {
        return (
            <>
                <div className={'mainNavDiv'}>
                    <div className={'innerNavDiv'}>
                        <NavLink to={'/'} className={'navLink'}>
                            <span>Entry Toll</span>
                        </NavLink>
                        <NavLink to={'/exitToll'} className={'navLink'}>
                            <span>Exit Toll</span>
                        </NavLink>
                    </div>
                </div>
            </>
        );
    }
}

export default Navbar;