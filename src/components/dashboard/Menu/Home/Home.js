import React, { Component } from "react";
import './Home.css';

const Home = props => {
    
        return (
            <React.Fragment>
            <div id="home-container" 
                className={`menu-item ${props.isHomeActive ? "active" : ""}`}
                onClick={() => {props.onClick();}} >
                <span className={`home-icon ${props.isHomeActive ? "material-icons" : "material-icons-outlined"}`} >
                    home
                </span>
            </div>
            </React.Fragment>
        );
    
};

export default Home;