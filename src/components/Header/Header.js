import React, { Component } from 'react';
import logo from '../../logo.svg';
import './Header.css';
import {NavLink} from 'react-router-dom';
import Logo from '../../img/logos/white_logo_transparent_background.png';

class header extends Component {

    constructor() {
        super();
        this.backdropRef = React.createRef();
        this.responsiveMenuIconRef = React.createRef();
    }

    myFunction = () => {
        var x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive"
            this.backdropRef.current.style.display = 'block';
        } else {
            x.className = "topnav"
            this.backdropRef.current.style.display = 'none';
        }
    }

    backdropClose = () => {
        this.backdropRef.current.style.display = 'none';
        this.responsiveMenuIconRef.current.click();
    }

    render() {
        window.addEventListener("resize", () => {
            if (window.innerWidth >= 600 && this.backdropRef.current) {
                this.backdropRef.current.style.display = 'none';
            }
        });
        return (
            <React.Fragment>
                <div id="top-nav-overlay" ref={this.backdropRef} onClick={this.backdropClose}></div>
                <nav className="topnav" id="myTopnav">
                    <a href="#home" id="site-logo-link"><img src={Logo} id="site-logo" /></a>
                    <a href="#home" className="active">Home</a>
                    <a href="#news">News</a>
                    <a href="#contact">Contact</a>
                    <a href="#about">About</a>
                    <a href="#" onClick={this.myFunction} className="icon" ref={this.responsiveMenuIconRef}>
                    <span className="material-icons">
                        menu
                    </span>
                    </a>
                    { (this.props.authenticated) ? <a id="logout" onClick={this.props.logoutMethod}>Logout</a> : null }
                </nav>
            </React.Fragment>);
    }
};

export default header;