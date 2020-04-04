import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Header from '../Header/Header';
import './Register.css';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

componentDidMount() {
  // If logged in and user navigates to Register page, should redirect them to dashboard
  if (this.props.auth.isAuthenticated) {
    this.props.history.push("/dashboard");
  }
}

componentWillReceiveProps(nextProps) {
  if (nextProps.errors) {
    this.setState({
      errors: nextProps.errors
    });
  }
}

onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

onSubmit = e => {
      e.preventDefault();
  const newUser = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        password2: this.state.password2
      };
  console.log(newUser);
  this.props.registerUser(newUser, this.props.history); 
  };
  
render() {
    const { errors } = this.state;

    const input_errors_name = {};
    const input_errors_email = {};
    const input_errors_password = {};
    const input_errors_password2 = {};

    if (errors.name)
      input_errors_name['error'] = true;
    if (errors.email)
      input_errors_email['error'] = true;
    if (errors.password)
      input_errors_password['error'] = true;
    if (errors.password2)
      input_errors_password2['error'] = true;
      

return (

    <React.Fragment>
        <Header />
        <form className="register-form" autoComplete="on" onSubmit={this.onSubmit}>
          <h1 className="register-inputs">Register</h1>

          <TextField id="register-name" required name="name"
            {...input_errors_name} className="register-inputs" type="text"
            label="Name" helperText={errors.name}
            onChange={this.onChange} value={this.state.name} />

          <TextField id="register-email" required name="email"
            {...input_errors_email} className="register-inputs" type="email"
            label="Email" helperText={errors.email}
            onChange={this.onChange} value={this.state.email} />

          <TextField id="register-password" required name="password"
            {...input_errors_password} className="register-inputs" type="password"
            label="Password" helperText={errors.password}
            onChange={this.onChange} value={this.state.password} />

          <TextField id="register-confirm-password" required name="password2"
            {...input_errors_password2} className="register-inputs" type="password"
            label="Confirm Password" helperText={errors.password2}
            onChange={this.onChange} value={this.state.password2} />

          <Button variant="contained" type="submit" value="Submit"
            className="register-inputs" color="primary">Submit</Button>

          <p className="register-form-login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </React.Fragment>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));