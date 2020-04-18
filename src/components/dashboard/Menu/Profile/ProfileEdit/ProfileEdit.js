import React, { Component } from "react";
import './ProfileEdit.css';
import ProfileView from '../ProfileView/ProfileView';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import axios from 'axios'; 
import ProfileImageCrop from './ProfileImageCrop/ProfileImageCrop';

class ProfileEdit extends Component {
    constructor(props) {
        super(props);
        this.cropperDisplayRef = React.createRef();
        this.changePasswordRef = React.createRef();
        this.state = {
            visibility1: 'visibility',
            visibility2: 'visibility',
            visibility3: 'visibility',
            changePasswordDisplay: false,
            profileIconActive: false,
            userData: {
                name: '',
                email: '',
                password: '',
                newPassword: '',
                newPassword2: '',
                avatarImage: '',
                errors: {}
            }
        }
    }

     // Update information for current user
     onChangeUserDataSubmit = e => {
        const newUserInfo = {
            id: this.props.auth.user.id,
            name: this.state.userData.name,
            email: this.state.userData.email
            };

        axios
        .post("/api/restricted-users/update-user-data", newUserInfo)
        .then(res => {
            this.setState({userData: {
                ...this.state.userData,
                errors: {}
            }});
        }) 
        .catch(err => {
            let newErrors = err.response.data;
            this.setState({userData: {
                ...this.state.userData,
                errors: newErrors
            }});
        });
    };

    // Change password for current user
    onChangePasswordSubmit = e => {
        const newUserPassword = {
            id: this.props.auth.user.id,
            password: this.state.userData.password,
            newPassword: this.state.userData.newPassword,
            newPassword2: this.state.userData.newPassword2
            };

        axios
        .post("/api/restricted-users/update-user-password", newUserPassword)
        .then(res => {
            this.setState({userData: {
                ...this.state.userData,
                errors: {},
                password: '',
                newPassword: '',
                newPassword2: ''
            }});
            document.getElementById('profile-edit-activity-info-change-password-button').click();
        }) 
        .catch(err => {
            let newErrors = err.response.data;
            this.setState({userData: {
                ...this.state.userData,
                errors: newErrors
            }});
        });
    };

    onChange = e => {
        let userDataCopy = {...this.state.userData};
        userDataCopy[e.target.name] = e.target.value;
        this.setState({ userData: {...userDataCopy} });
    };

    componentDidMount() {
        // Fetch user data using id to be displayed in inputs
        axios.post('/api/restricted-users/get-user-data', {id: this.props.auth.user.id}).then(res => {
            this.setState({userData: { ...this.state.userData, ...res.data}});
        });
    }
   
    makePasswordVisible = (visibilityNumber) => {
        let passwordInput = null;

        if (visibilityNumber === 1) 
            passwordInput = document.getElementById('profile-edit-activity-info-password');
        else if (visibilityNumber === 2) 
            passwordInput = document.getElementById('profile-edit-activity-info-new-password');
        else if (visibilityNumber === 3) 
            passwordInput = document.getElementById('profile-edit-activity-info-new-password2');

        let visibilityStateNumber = 'visibility' + visibilityNumber;
        if (passwordInput) {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                this.setState({[visibilityStateNumber]: 'visibility_off'})
              } else {
                passwordInput.type = "password";
                this.setState({[visibilityStateNumber]: 'visibility'})
              }

        }
    }

    changePasswordDisplay = () => {
        const computed = window.getComputedStyle(this.changePasswordRef.current).getPropertyValue("display");
        if (computed === 'flex') 
            this.changePasswordRef.current.style.display = 'none';
        else if (computed === 'none') 
            this.changePasswordRef.current.style.display = 'flex';
    }

    changeImageCropperDisplay = () => {
        const computed = window.getComputedStyle(this.cropperDisplayRef.current).getPropertyValue("display");
		if (computed === 'flex') 
		    this.cropperDisplayRef.current.style.display = 'none';
		else if (computed === 'none') 
            this.cropperDisplayRef.current.style.display = 'flex';
    }
  

    render() {

        const { errors } = this.state.userData;

        const input_errors_name = {};
        const input_errors_email = {};
        const input_errors_password = {};
        const input_errors_newPassword = {};
        const input_errors_newPassword2 = {};
    
        if (errors.name)
          input_errors_name['error'] = true;
        if (errors.email)
          input_errors_email['error'] = true;
        if (errors.password)
          input_errors_password['error'] = true;
        if (errors.newPassword)
            input_errors_newPassword['error'] = true;
        if (errors.newPassword2)
          input_errors_newPassword2['error'] = true;

          console.log(this.state.userData.avatarImage);
        return (
            <div className="profile-edit-container">
                <div id="profile-edit-go-back-container" onClick={() => this.props.changeDisplayedContent(<ProfileView changeDisplayedContent={this.props.changeDisplayedContent} ></ProfileView>)}>
                    <span className="material-icons profile-edit-go-back-icon">
                        arrow_back_ios
                    </span>
                </div>

                <div id="profile-edit-picture-cropper-container" ref={this.cropperDisplayRef}>
                    <ProfileImageCrop avatarImageFullPath={this.state.userData.avatarImage}></ProfileImageCrop>
                    {/* <Button variant="contained" type="submit" id="profile-edit-picture-cropper-button"
                    className="profile-edit-activity-info-inputs" color="primary">Update picture</Button> */}
                </div>

                <div className="profile-edit-image-wrapper" onClick={this.changeImageCropperDisplay}>
                    <span className="material-icons profile-edit-edit-image-icon">
                        edit
                    </span>
                    <img src={this.state.userData.avatarImage} />
                </div>
             
                <div className="profile-edit-activity-info-wrapper">
                    <TextField id="profile-edit-activity-info-name" required name="name"
                    className="profile-edit-activity-info-inputs" type="text" helperText={errors.name}
                    label="Name" onChange={this.onChange} {...input_errors_name}
                    value={this.state.userData.name} />
    
                    <TextField id="profile-edit-activity-info-email" required name="email"
                    className="profile-edit-activity-info-inputs" type="email"
                    label="Email" disabled
                     value={this.state.userData.email} />
    
                    <Button variant="contained" type="submit" onClick={this.changePasswordDisplay} id="profile-edit-activity-info-change-password-button"
                    className="profile-edit-activity-info-inputs" color="primary">Change password</Button>

                    <div id="profile-edit-activity-info-change-password-wrapper" ref={this.changePasswordRef} >
                        <TextField id="profile-edit-activity-info-password" required name="password" {...input_errors_password}
                        helperText={errors.password} value={this.state.userData.password}
                        className="profile-edit-activity-info-inputs" type="password" onChange={this.onChange}
                        label="Current password" />
                        <span className="material-icons profile-edit-activity-info-password-visibility-icon" onClick={() => this.makePasswordVisible(1)}>
                            {this.state.visibility1}
                        </span>

                        <TextField id="profile-edit-activity-info-new-password" required name="newPassword" {...input_errors_newPassword}
                        helperText={errors.newPassword} value={this.state.userData.newPassword}
                        className="profile-edit-activity-info-inputs" type="password" onChange={this.onChange}
                        label="New password" />
                        <span className="material-icons profile-edit-activity-info-password-visibility-icon" onClick={() => this.makePasswordVisible(2)}>
                            {this.state.visibility2}
                        </span>
 
                        <TextField id="profile-edit-activity-info-new-password2" required name="newPassword2" {...input_errors_newPassword2}
                        helperText={errors.newPassword2} value={this.state.userData.newPassword2}
                        className="profile-edit-activity-info-inputs" type="password" onChange={this.onChange}
                        label="Repeat new password" />
                        <span className="material-icons profile-edit-activity-info-password-visibility-icon" onClick={() => this.makePasswordVisible(3)}>
                            {this.state.visibility3}
                        </span>

                        <Button variant="contained" type="submit" id="profile-edit-activity-info-change-password-submit" onClick={this.onChangePasswordSubmit}
                        className="profile-edit-activity-info-inputs" color="primary">Update password</Button>
                    </div>

                    <Button variant="contained" type="submit" onClick={this.onChangeUserDataSubmit}
                    className="profile-edit-activity-info-inputs" color="primary">Update</Button>

                </div>
    
            </div>
        );
    }
    
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
    // { logoutUser }
  )(ProfileEdit);