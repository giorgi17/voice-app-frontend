import React from 'react';
import './HeaderDesktop.css';
import Logo from '../../../../img/logos/Guth_1.png';
import Search from '../../../layout/SearchBar/SearchBar';
import MenuNew from '../MenuNew';

const HeaderDesktop = props => (
    <div className="header-desktop">
        <div className="header-desktop-menu">
            <img src={Logo} onClick={() => props.history.push('/dashboard')}></img>
            <Search />
            <MenuNew history={{...props.history}} menuName={props.menuName} />
        </div>
    </div>
);

export default HeaderDesktop;