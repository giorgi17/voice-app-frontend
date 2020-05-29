import React, { Component } from 'react';
import './Followers.css';
import Modal from './Modal/Modal';
import { connect } from "react-redux";

class Followers extends Component {
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
            return (
                <div className="user-profile-page-user-followers"> 
                    <Modal history={this.props.history} userId={this.props.match.params.userId} />
                </div>
            );
        }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(Followers);