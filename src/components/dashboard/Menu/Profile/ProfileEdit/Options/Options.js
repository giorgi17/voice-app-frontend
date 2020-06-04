import React, { Component } from 'react';
import './Options.css';
import { connect } from "react-redux";
import { logoutUser } from '../../../../../../actions/authActions';

class Options extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="responsive-menu-section-name">
                    <span className="material-icons profile-edit-menu-responsive-close-icon"
                        onClick={() => this.props.history.goBack()}>
                        close
                    </span>

                    <span className="profile-edit-menu-responsive-title">
                        Options
                    </span>
                </div>

                <div className="profile-edit-menu-responsive-list-wrapper">
                    <div className="profile-edit-menu-responsive-list">
                        <span className="profile-edit-menu-responsive-list-header">
                            ACCOUNT
                        </span> 

                        <span className="profile-edit-menu-responsive-list-item" onClick={() => this.props.history.push('/account/edit')}>
                            <span className="profile-edit-menu-responsive-list-item-name">
                                Edit Profile
                            </span>

                            <span className="material-icons profile-edit-menu-responsive-list-item-arrow">
                                keyboard_arrow_right
                            </span>
                        </span>

                        <span className="profile-edit-menu-responsive-list-item" onClick={() => this.props.history.push('/account/edit/avatarImage')}>
                            <span className="profile-edit-menu-responsive-list-item-name">
                                Edit Profile Picture
                            </span>

                            <span className="material-icons profile-edit-menu-responsive-list-item-arrow">
                                keyboard_arrow_right
                            </span>
                        </span>

                        <span className="profile-edit-menu-responsive-list-item" onClick={() => this.props.history.push('/account/edit/password')}>
                            <span className="profile-edit-menu-responsive-list-item-name">
                                Change Password
                            </span>

                            <span className="material-icons profile-edit-menu-responsive-list-item-arrow">
                                keyboard_arrow_right
                            </span>
                        </span>

                        <span className="profile-edit-menu-responsive-list-item profile-options-logout-item" onClick={() => this.props.logoutUser()}>
                            <span className="profile-edit-menu-responsive-list-item-name profile-options-logout">
                                Log Out
                            </span>

                            <span className="material-icons profile-edit-menu-responsive-list-item-arrow">
                                keyboard_arrow_right
                            </span>
                        </span>
                    </div>
                    
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(
    mapStateToProps,
    { logoutUser }
  )(Options);