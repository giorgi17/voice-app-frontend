import React, { Component } from 'react';
import './ChangePassword.css';
import { connect } from "react-redux";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import HeaderDesktop from '../../../HeaderDesktop/HeaderDesktop';
import MenuResponsive from '../../../../MenuResponsive/Menu';
import { Alert, AlertTitle } from '@material-ui/lab';

class ChangePassword extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        // this.cropperDisplayRef = React.createRef();
        this.passwordInput1Ref = React.createRef();
        this.passwordInput2Ref = React.createRef();
        this.passwordInput3Ref = React.createRef();
        this.changePasswordRef = React.createRef();
        this.passwordUpdateSuccessRef = React.createRef();
        this.passwordUpdateErrorRef = React.createRef();      
        this.state = {
            visibility1: 'visibility',
            visibility2: 'visibility',
            visibility3: 'visibility',
            userData: {
                password: '',
                newPassword: '',
                newPassword2: '',
                errors: {}
            },
            profilePicture: ''
        }
    }   

    onChange = e => {
        let userDataCopy = {...this.state.userData};
        userDataCopy[e.target.name] = e.target.value;
        if (this._isMounted) {
            this.setState({ userData: {...userDataCopy} });
        }
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
            if (this._isMounted) {
                this.setState({userData: {
                    ...this.state.userData,
                    errors: {},
                    password: '',
                    newPassword: '',
                    newPassword2: ''
                }});

                // Check if error message is open and close if it is and show success message instead
                this.passwordUpdateSuccessRef.current.style.display = 'flex';
                this.passwordUpdateErrorRef.current.style.display = 'none';
                console.log("Success");
                // document.getElementById('profile-edit-activity-info-change-password-button').click();
            }
        }) 
        .catch(err => {
            let newErrors = err.response.data;
            if (this._isMounted) {
                this.setState({userData: {
                    ...this.state.userData,
                    errors: newErrors
                }});

                // Check if success message is open and close if it is and show error message instead
                this.passwordUpdateSuccessRef.current.style.display = 'none';
                this.passwordUpdateErrorRef.current.style.display = 'flex';
            }
            
        });
    };

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
        const { errors } = this.state.userData;

        const input_errors_password = {};
        const input_errors_newPassword = {};
        const input_errors_newPassword2 = {};

        if (errors.password)
          input_errors_password['error'] = true;
        if (errors.newPassword)
            input_errors_newPassword['error'] = true;
        if (errors.newPassword2)
          input_errors_newPassword2['error'] = true;

        return (
            <React.Fragment>
                <HeaderDesktop history={{...this.props.history}} menuName="profile" />
                <MenuResponsive history={{...this.props.history}} menuName="profile" />

                <div className="responsive-menu-section-name">
                    <span className="material-icons profile-edit-change-password-responsive-back-icon"
                        onClick={() => this.props.history.goBack()}>
                        arrow_back_ios
                    </span>

                    <span className="profile-edit-change-password-responsive-title">
                        Change Password
                    </span>
                </div>

                <div id="profile-edit-activity-info-change-password-wrapper" ref={this.changePasswordRef} >
                    <div className="profile-edit-activity-info-change-password-user-info">
                        <img src={this.state.profilePicture} />
                        <span>
                            {this.props.auth.user.name}
                        </span>
                    </div>

                    <div className="profile-edit-activity-info-change-password-field">
                        <TextField id="profile-edit-activity-info-password" required name="password" {...input_errors_password}
                        helperText={errors.password} value={this.state.userData.password}
                        className="profile-edit-activity-info-inputs" type="password" onChange={this.onChange}
                        label="Current password" ref={this.passwordInput1Ref} />
                        <span className="material-icons profile-edit-activity-info-password-visibility-icon" onClick={() => this.makePasswordVisible(1)}>
                            {this.state.visibility1}
                        </span>
                    </div>

                    <div className="profile-edit-activity-info-change-password-field">
                        <TextField id="profile-edit-activity-info-new-password" required name="newPassword" {...input_errors_newPassword}
                        helperText={errors.newPassword} value={this.state.userData.newPassword}
                        className="profile-edit-activity-info-inputs" type="password" onChange={this.onChange}
                        label="New password" ref={this.passwordInput2Ref} />
                        <span className="material-icons profile-edit-activity-info-password-visibility-icon" onClick={() => this.makePasswordVisible(2)}>
                            {this.state.visibility2}
                        </span>
                    </div>                

                    <div className="profile-edit-activity-info-change-password-field">
                        <TextField id="profile-edit-activity-info-new-password2" required name="newPassword2" {...input_errors_newPassword2}
                        helperText={errors.newPassword2} value={this.state.userData.newPassword2}
                        className="profile-edit-activity-info-inputs" type="password" onChange={this.onChange}
                        label="Repeat new password" ref={this.passwordInput3Ref} />
                        <span className="material-icons profile-edit-activity-info-password-visibility-icon" onClick={() => this.makePasswordVisible(3)}>
                            {this.state.visibility3}
                        </span>
                    </div>

                    <Alert severity="success" id="profile-edit-activity-password-success" className="profile-edit-activity-info-alert" 
                        ref={this.passwordUpdateSuccessRef}>
                        <AlertTitle>Success</AlertTitle>
                        Successfully changed user password.
                    </Alert>

                    <Alert severity="error" id="profile-edit-activity-password-error" className="profile-edit-activity-info-alert"
                     ref={this.passwordUpdateErrorRef}>
                        <AlertTitle>Error</AlertTitle>
                        Error occured while changing user information.
                    </Alert>

                    <Button variant="contained" type="submit" id="profile-edit-activity-info-change-password-submit" onClick={this.onChangePasswordSubmit}
                    className="profile-edit-activity-info-inputs" color="primary">Update password</Button>
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
  )(ChangePassword);