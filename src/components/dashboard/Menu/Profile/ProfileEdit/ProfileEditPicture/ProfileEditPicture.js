import React, { Component } from 'react';
import ProfileImageCrop from '../ProfileImageCrop/ProfileImageCrop';
import { connect } from "react-redux";
import axios from 'axios';
import HeaderDesktop from '../../../HeaderDesktop/HeaderDesktop';
import MenuResponsive from '../../../../MenuResponsive/Menu';

class ProfileEditPicture extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);      
        this.state = {
            avatarImage: ''
        }
    }


    fetchUserProfilePicture = () => {
        let dataToSend = {};

        // Send id of the notification author to fetch his profile picture
        dataToSend.id = this.props.auth.user.id;

        axios.post("/api/restricted-users/get-user-profile-picture-for-notifications", dataToSend).then(response => {
            if (this._isMounted) {
                this.setState({profilePicture: response.data.avatarImage});
            }
        }).catch( err => {
            console.log(err.message);
        });
    }   

    componentDidMount() {
        this._isMounted = true;

        this.fetchUserProfilePicture();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <React.Fragment>
                <HeaderDesktop history={{...this.props.history}} menuName="profile" />
                <MenuResponsive history={{...this.props.history}} menuName="profile" />

                <div className="responsive-menu-section-name">
                    <div className="profile-edit-picture-section-items">
                        <span className="material-icons" onClick={() => this.props.history.goBack()}>
                            arrow_back_ios
                        </span>

                        <span className="profile-edit-picture-section-title">
                            Choose photo
                        </span>
                    </div>
                </div>

                <div id="profile-edit-picture-cropper-container">
                    <ProfileImageCrop avatarImageFullPath={this.state.avatarImage}></ProfileImageCrop>
                    {/* <Button variant="contained" type="submit" id="profile-edit-picture-cropper-button"
                    className="profile-edit-activity-info-inputs" color="primary">Update picture</Button> */}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(ProfileEditPicture);