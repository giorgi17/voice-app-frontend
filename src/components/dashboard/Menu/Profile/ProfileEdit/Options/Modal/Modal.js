import React, { Component } from 'react';
import './Modal.scss';
import { connect } from "react-redux";
import { logoutUser } from '../../../../../../../actions/authActions';

class Modal extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.mainModal = React.createRef();
        this.mainWindow = React.createRef();
    }

    goBackCloseModal = (e) => {
        if (this._isMounted) 
            this.props.closeOptionsModal();
    }
    
    closeWithBackdrop = e => {
        if (this.mainModal) {
            if (e.target === this.mainModal.current) {
                if (this._isMounted) {
                    this.props.closeOptionsModal();
                    // this.mainModal.current.classList.remove("open");
                }
            }
        }
    }


    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className={`options-modal-component ${this.props.showOptionsModal ? 'open' : ''}`}        
            ref={this.mainModal} onClick={this.closeWithBackdrop}>
                <div className="options-modal-component-window" ref={this.mainWindow}>
                    {/* <div className="options-modal-component-header">
                            Followers
                        <button className="options-modal-component-close" onClick={this.goBackCloseModal}>&times;</button>
                    </div> */}
                    <div className="options-modal-component-body">
                        <div className="profile-edit-menu-list-wrapper">
                            <div className="profile-edit-menu-list-item-name" 
                                onClick={() => this.props.history.push('/account/edit')}>
                                Edit Profile
                            </div>

                            <div className="profile-edit-menu-list-item-name"
                                onClick={() => this.props.history.push('/account/edit/avatarImage')}>
                                Edit Profile Picture
                            </div>

                            <div className="profile-edit-menu-list-item-name"
                                onClick={() => this.props.history.push('/account/edit/password')}>
                                Change Password
                            </div>

                            <div className="profile-edit-menu-list-item-name" 
                                onClick={() => this.props.logoutUser()}>
                                Log Out
                            </div>

                            <div className="profile-edit-menu-list-item-name" 
                                onClick={() => this.goBackCloseModal()}>
                                Cancel
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
};

const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(
    mapStateToProps,
    { logoutUser }
  )(Modal);