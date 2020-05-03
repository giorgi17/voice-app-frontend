import React, { Component } from 'react';
import logo from '../../logo.svg';
import './Header.css';
import {Link} from 'react-router-dom';
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
                    <Link to="/" id="site-logo-link"><img src={Logo} id="site-logo" /></Link>
                    <Link to="/" className="active">Home</Link>
                    <a href="#news">News</a>
                    <a href="#contact">Contact</a>
                    <Link to="/about">About</Link>
                    <a href="#" onClick={this.myFunction} className="icon" ref={this.responsiveMenuIconRef}>
                    <span className="material-icons">
                        menu
                    </span>
                    </a>
                    { (this.props.authenticated) ? <a id="logout" onClick={this.props.logoutMethod}>Logout</a> : null }
                    { (!this.props.authenticated) ? <Link to="/register" id="topnav-register-button">Register</Link> : null }
                    { (!this.props.authenticated) ? <Link to="/login" id="topnav-login-button">Login</Link> : null }
                </nav>
            </React.Fragment>);
    }
};

export default header;