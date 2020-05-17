import React from 'react';
import './ContentContainer.css';
import Menu from '../Menu/Menu';
import MenuResponsive from '../MenuResponsive/Menu';

let menuComponent = null;
let responsiveMenuComponent = null;
if (window.innerWidth >= 950) {
    menuComponent = <Menu />;
} else {
    responsiveMenuComponent = <MenuResponsive />
}

const ContentContainer = (props) => (
    <React.Fragment>
        {responsiveMenuComponent}
        <div className="content-container">
            {menuComponent}
            {props.children}
            {/* <Menu /> */}
        </div>
    </React.Fragment>
);

export default ContentContainer;