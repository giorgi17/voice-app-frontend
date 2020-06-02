import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import './Dashboard.css';
import queryString from 'query-string';

import Header from '../Header/Header';
import SearchBar from '../layout/SearchBar/SearchBar';
import Posts from './Posts/Posts';
import ContentContainer from './ContentContainer/ContentContainer';
// import UserProfile from './Posts/Post/UserProfile/UserProfile';
import MenuResponsive from './MenuResponsive/Menu';
import HeaderResponsive from './MenuResponsive/HeaderResponsive/HeaderResponsive';
import HeaderDesktop from './Menu/HeaderDesktop/HeaderDesktop';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
        mainContent: null,
        userIdForProfile: null
    }
}


  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  componentDidUpdate() {
    // const parsed = queryString.parse(window.location.search);

    // if (parsed.userId) {
    //   if (this.state.userIdForProfile === parsed.userId) {
    //     return;
    //   } else {
    //     const userProfile = (<UserProfile user_id={parsed.userId}></UserProfile>);
    //     this.setState({mainContent: userProfile,
    //        userIdForProfile: parsed.userId});
    //   }
    // } else {
    //   if (!this.state.userIdForProfile)
    //     return;
    //   const posts = (<Posts />);
    //   this.setState({mainContent: posts, userIdForProfile: null});
    // }
  }

  componentDidMount() {
    // const parsed = queryString.parse(window.location.search);

    // if (parsed.userId) {
    //   if (this.state.userIdForProfile === parsed.userId) {
    //     return;
    //   } else {
    //     const userProfile = (<UserProfile user_id={parsed.userId}></UserProfile>);
    //     this.setState({mainContent: userProfile, userIdForProfile: parsed.userId});
    //   }
    // } else {
    //   const posts = (<Posts />);
    //   this.setState({mainContent: posts});
    // }
  }

render() {
    return (
          <React.Fragment>
            {/* <Header authenticated={true} logoutMethod={this.onLogoutClick} homeActive={true} /> */}
            <HeaderResponsive />
            <HeaderDesktop history={{...this.props.history}} />
            <MenuResponsive history={{...this.props.history}} menuName="home" />
            {/* <SearchBar /> */}
            <ContentContainer>
              {/* {this.state.mainContent} */}
              <Posts history={this.props.history} />
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