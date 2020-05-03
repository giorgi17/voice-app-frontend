import React from 'react';
import './ContentContainer.css';
import Menu from '../Menu/Menu';

let menuComponent = null;
if (window.innerWidth >= 600) {
    menuComponent = <Menu />;
}

const ContentContainer = (props) => (
    <div className="content-container">
        {menuComponent}
        {props.children}
        {/* <Menu /> */}
    </div>
);

export default ContentContainer;