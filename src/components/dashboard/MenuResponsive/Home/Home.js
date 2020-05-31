import React, { Component } from "react";
import './Home.css';

const Home = props => {
    
        return (
            <React.Fragment>
            <div id="responsive-home-container" 
                className={`responsive-menu-item ${props.isHomeActive ? "active" : ""}`}
                onClick={() => {props.onClick(); props.changeDisplayedContent(null); props.hideMenuItems()}} >
                <span className={`home-icon ${props.isHomeActive ? "material-icons" : "material-icons-outlined"}`} >
                    home
                </span>
            </div>
            </React.Fragment>
        );
    
};

export default Home;