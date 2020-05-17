import React, { Component } from "react";
import './Home.css';

const Home = props => {
    
        return (
            <React.Fragment>
            <div id="responsive-home-container" 
                className={`responsive-menu-item ${props.isHomeActive ? "active" : ""}`}
                onClick={() => {props.onClick("home"); props.changeDisplayedContent(null); props.hideMenuItems()}} >
                <span className={`material-icons home-icon ${props.isHomeActive ? "active" : ""}`} >
                    home
                </span>
            </div>
            </React.Fragment>
        );
    
};

export default Home;