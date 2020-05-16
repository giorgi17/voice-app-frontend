import React from 'react';
import './About.css';
import { connect } from "react-redux";
import Header from '../Header/Header';
import { logoutUser } from '../../actions/authActions';
import AboutImage from '../../img/about.jpg';
import AboutInfo from './AboutInfo/AboutInfo';

const About = props => {

    const onLogoutClick = e => {
        e.preventDefault();
        props.logoutUser();
    };

    return (
        <React.Fragment>
            <Header authenticated={props.auth.isAuthenticated} logoutMethod={onLogoutClick} aboutActive={true} />
            <div className="about-page-wrapper">
                <img src={AboutImage} />
                <h1>ABOUT GUTH</h1>

                <AboutInfo></AboutInfo>
            </div>
        </React.Fragment>
    )
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { logoutUser } 
)(About);