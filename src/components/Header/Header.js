import React, { Component } from 'react';
import logo from '../../logo.svg';
import './Header.css';
import {Link} from 'react-router-dom';
// import Logo from '../../img/logos/white_logo_transparent_background.png';
import Logo from '../../img/logos/Guth_4.png';
import Search from '../layout/SearchBar/SearchBar';

class header extends Component {

    constructor() {
        super();
        this.backdropRef = React.createRef();
        this.responsiveMenuIconRef = React.createRef();
        this.state = {
            showSearchIcon: true
        }
    }

    myFunction = () => {
        var x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive"
            this.backdropRef.current.style.display = 'block';
            this.setState({showSearchIcon: false});
        } else {
            this.setState({showSearchIcon: true});
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
                    <Link to="/" className={`${this.props.homeActive ? "active" : ""}`}>Home</Link>
                    {/* <a href="#news">News</a> */}
                    {/* <a href="#contact" className={`${this.props.contactActive ? "active" : ""}`}>Contact</a> */}
                    <Link to="/about" className={`${this.props.aboutActive ? "active" : ""}`}>About</Link>
                    <a href="#" onClick={this.myFunction} className="icon" ref={this.responsiveMenuIconRef}>
                        <span className="material-icons">
                            menu
                        </span>
                    </a>
                    {/* <Search/> */}
                    { (this.props.authenticated) ? <a id="logout" onClick={this.props.logoutMethod}>Logout</a> : null }
                    { (!this.props.authenticated) ? <Link to="/register" id="topnav-register-button" className={`${this.props.registerActive ? "active" : ""}`}>Register</Link> : null }
                    { (!this.props.authenticated) ? <Link to="/login" id="topnav-login-button" className={`${this.props.loginActive ? "active" : ""}`}>Login</Link> : null }
                    {/* { this.state.showSearchIcon ? <Search/> : null} */}
                </nav>
            </React.Fragment>);
    }
};

export default header;