import React, {Component} from 'react';
import FirstWelcomeImage from '../../img/welcomePage.png';
import { connect } from "react-redux";
import './Welcome.css';
import Header from '../Header/Header';
import AboutInfo from '../About/AboutInfo/AboutInfo';

class Welcome extends Component {

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    render() {
        return (
            <React.Fragment>
                <Header authenticated={false} logoutMethod={this.onLogoutClick} homeActive={true} />
                <div className="welcome-page-wrapper">
                    <div className="welcome-page-first-image-wrapper">
                        <img src={FirstWelcomeImage} className="welcome-page-first-image"/>
                    </div>
                    <div className="welcome-page-content-wrapper">
                        <div className="welcome-page-content-features">
                            <div className="welcome-page-content-features-feature-wrapper">
                                <span className="material-icons">
                                    mic
                                </span>
                                <p>RECORD</p>
                                <p>Record your voice and save it as a post</p>
                            </div>

                            <div className="welcome-page-content-features-feature-wrapper">
                                <span className="material-icons">
                                    description
                                </span>
                                <p>DESCRIBE</p>
                                <p>Add description to your post</p>
                            </div>

                            <div className="welcome-page-content-features-feature-wrapper">
                                <span className="material-icons">
                                    insert_photo
                                </span>
                                <p>VISUALIZE</p>
                                <p>Add pictures to your post</p>
                            </div>

                            <div className="welcome-page-content-features-feature-wrapper">
                                <span className="material-icons">
                                    share
                                </span>
                                <p>SHARE</p>
                                <p>Share your post with everyone</p>
                            </div>
                        </div>
                    </div>
                    <AboutInfo></AboutInfo>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps 
)(Welcome);