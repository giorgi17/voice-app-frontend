import React from 'react';
import logo from '../../logo.svg';
import './Header.css';
import {NavLink} from 'react-router-dom';

var myFunction = () => {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive"
    } else {
        x.className = "topnav"
    }
}

const header = () => (

        <nav className="topnav" id="myTopnav">
            <a href="#home" className="active">Home</a>
            <a href="#news">News</a>
            <a href="#contact">Contact</a>
            <a href="#about">About</a>
            <a href="#" onClick={myFunction} className="icon" onClick={myFunction}>
            <span className="material-icons">
                menu
            </span>
            </a>
        </nav>
);

export default header;