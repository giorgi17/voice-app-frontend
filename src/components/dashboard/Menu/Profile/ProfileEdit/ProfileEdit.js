import React, { Component } from "react";
import './ProfileEdit.css';
import ProfileView from '../ProfileView/ProfileView';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import axios from 'axios'; 
import ProfileImageCrop from './ProfileImageCrop/ProfileImageCrop';
import { Alert, AlertTitle } from '@material-ui/lab';
import HeaderDesktop from '../../HeaderDesktop/HeaderDesktop';
import MenuResponsive from '../../../MenuResponsive/Menu';

class ProfileEdit extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        // this.cropperDisplayRef = React.createRef();
        // this.changePasswordRef = React.createRef();
        this.profileInfoUpdateSuccessRef = React.createRef();
        this.profileInfoUpdateErrorRef = React.createRef();      
        this.state = {
            visibility1: 'visibility',
            visibility2: 'visibility',
            visibility3: 'visibility',
            // changePasswordDisplay: false,
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
            if (this._isMounted) {
                this.setState({userData: {
                    ...this.state.userData,
                    errors: {}
                }});
            }
            
            // Check if error message is open and close if it is and show success message instead
            this.profileInfoUpdateSuccessRef.current.style.display = 'flex';
            this.profileInfoUpdateErrorRef.current.style.display = 'none';
        }) 
        .catch(err => {
            let newErrors = err.response.data;
            if (this._isMounted) {
                this.setState({userData: {
                    ...this.state.userData,
                    errors: newErrors
                }});
            }
            
            // Check if success message is open and close if it is and show error message instead
            this.profileInfoUpdateSuccessRef.current.style.display = 'none';
            this.profileInfoUpdateErrorRef.current.style.display = 'flex';
        });
    };

    onChange = e => {
        let userDataCopy = {...this.state.userData};
        userDataCopy[e.target.name] = e.target.value;
        if (this._isMounted) {
            this.setState({ userData: {...userDataCopy} });
        }
    };

    changePasswordDisplay = () => {
        const computed = window.getComputedStyle(this.changePasswordRef.current).getPropertyValue("display");
        if (computed === 'flex') 
            this.changePasswordRef.current.style.display = 'none';
        else if (computed === 'none') 
            this.changePasswordRef.current.style.display = 'flex';
    }

    changeImageCropperDisplay = () => {
        // const computed = window.getComputedStyle(this.cropperDisplayRef.current).getPropertyValue("display");
		// if (computed === 'flex') 
		//     this.cropperDisplayRef.current.style.display = 'none';
		// else if (computed === 'none') 
        //     this.cropperDisplayRef.current.style.display = 'flex';
        this.props.history.push('/account/edit/avatarImage');
    }
  
    componentDidMount() {
        this._isMounted = true;

        // Fetch user data using id to be displayed in inputs
        axios.post('/api/restricted-users/get-user-data', {id: this.props.auth.user.id}).then(res => {
            if (this._isMounted) {
                this.setState({userData: { ...this.state.userData, ...res.data}});
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
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

          
        return (
            <React.Fragment>
                <HeaderDesktop history={{...this.props.history}} menuName="profile" />
                <MenuResponsive history={{...this.props.history}} menuName="profile" />

                <div className="responsive-menu-section-name">
                    <span className="material-icons" onClick={() => this.props.history.goBack()}>
                        keyboard_backspace
                    </span>

                    <span className="profile-edit-general-section-title">
                        Edit Profile
                    </span>
                </div>

                <div className="profile-edit-container">
                    {/* <div id="profile-edit-go-back-container" onClick={() => this.props.changeDisplayedContent(<ProfileView changeDisplayedContent={this.props.changeDisplayedContent} ></ProfileView>)}>
                        <span className="material-icons profile-edit-go-back-icon">
                            arrow_back_ios
                        </span>
                    </div> */}

    

                    <div className="profile-edit-user-info-wrapper">
                        <div className="profile-edit-image-wrapper" onClick={this.changeImageCropperDisplay}>
                            <span className="material-icons profile-edit-edit-image-icon">
                                edit
                            </span>
                            <img src={this.state.userData.avatarImage} />
                        </div>

                        <div className="profile-edit-user-name-wrapper">
                            {this.props.auth.user.name}
                        </div>
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
                  

                        <Alert severity="success" id="profile-edit-activity-info-success" className="profile-edit-activity-info-alert" ref={this.profileInfoUpdateSuccessRef}>
                            <AlertTitle>Success</AlertTitle>
                            Successfully changed user information.
                        </Alert>

                        <Alert severity="error" id="profile-edit-activity-info-error" className="profile-edit-activity-info-alert" ref={this.profileInfoUpdateErrorRef}>
                            <AlertTitle>Error</AlertTitle>
                            Error occured while changing user information.
                        </Alert>

                        <Button variant="contained" type="submit" onClick={this.onChangeUserDataSubmit}
                        className="profile-edit-activity-info-inputs" color="primary">Update</Button>

                    </div>
        
                </div>
            </React.Fragment>
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