import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import './Dashboard.css';

import Header from '../Header/Header';
import SearchBar from '../layout/SearchBar/SearchBar';
import Posts from './Posts/Posts';
import ContentContainer from './ContentContainer/ContentContainer';

class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
render() {
    const { user } = this.props.auth;
return (
      <React.Fragment>
        <Header authenticated={true} logoutMethod={this.onLogoutClick} />
        <SearchBar />
        <ContentContainer>
          <Posts />
        </ContentContainer>
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