import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import './Dashboard.css';

import Header from '../Header/Header';
import SearchBar from '../layout/SearchBar/SearchBar';

class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
render() {
    const { user } = this.props.auth;
return (
      <React.Fragment>
        <Header />
        <SearchBar />
        <div style={{ height: "75vh" }} className="container">
          <div className="row valign-wrapper" id="dashboard-row">
            <div className="col s12 center-align valign">
              <h4>
                <b>Hey there,</b> {user.name.split(" ")[0]}
                <p className="flow-text grey-text text-darken-1">
                  You are logged into a full-stack{" "}
                  <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏
                </p>
              </h4>
              <button
                style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem"
                }}
                onClick={this.onLogoutClick}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Logout
              </button>
            </div>
            {/*  */}
                        {/* <div className="col s12 m12 l12 xl12 center-align" id="r">
                          <h4>
                            <b>Hey there,</b> {user.name.split(" ")[0]}
                            <p className="flow-text grey-text text-darken-1">
                              You are logged into a full-stack{" "}
                              <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏
                            </p>
                          </h4>
                          <button
                            style={{
                              width: "150px",
                              borderRadius: "3px",
                              letterSpacing: "1.5px",
                              marginTop: "1rem"
                            }}
                            onClick={this.onLogoutClick}
                            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                          >
                            Logout
                          </button>
                        </div> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);