import React from 'react';
import './ContentContainer.css';
import Menu from '../Menu/Menu';

const ContentContainer = (props) => (
    <div className="content-container">
        {props.children}
        <Menu />
    </div>
);

export default ContentContainer;