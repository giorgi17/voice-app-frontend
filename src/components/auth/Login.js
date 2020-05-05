import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Header from '../Header/Header';
import './Login.css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

componentDidMount() {
  // If logged in and user navigates to Login page, should redirect them to dashboard
  if (this.props.auth.isAuthenticated) {
    this.props.history.push("/dashboard");
  }
}

componentWillReceiveProps(nextProps) {
  if (nextProps.auth.isAuthenticated) {
    this.props.history.push("/dashboard"); // push user to dashboard when they login
  }
  if (nextProps.errors) {
    this.setState({
      errors: nextProps.errors
    });
  }
}
  
onChange = e => {
    console.log(e.target.name);
    this.setState({ [e.target.name]: e.target.value });
  };

onSubmit = e => {
        e.preventDefault();
    const userData = {
          email: this.state.email,
          password: this.state.password
        };
        this.props.loginUser(userData); // since we handle the redirect 
    console.log(userData);
  };

render() {
    const { errors } = this.state;

    const input_errors_email = {};
    const input_errors_password = {};
    if (errors.email || errors.emailnotfound)
      input_errors_email['error'] = true;
    if (errors.password || errors.passwordincorrect)
      input_errors_password['error'] = true;
      

return (
      <React.Fragment>
        <Header loginActive={true} />
        <form className="login-form" autoComplete="on" onSubmit={this.onSubmit}>
          <h1 className="login-inputs">Login</h1>
          <TextField id="login-email" required name="email"
            {...input_errors_email} className="login-inputs"
             type="email" label="Email" helperText={errors.email || errors.emailnotfound}
             onChange={this.onChange} value={this.state.email} />

          <TextField id="login-password" required name="password"
            {...input_errors_password} className="login-inputs"
             type="password" label="Password" helperText={errors.password || errors.passwordincorrect}
             onChange={this.onChange} value={this.state.password} />

          <Button variant="contained" type="submit" className="login-inputs" color="primary">Submit</Button>
          <p className="login-form-register-link">
              Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);