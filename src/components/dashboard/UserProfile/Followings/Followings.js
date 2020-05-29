import React, { Component } from 'react';
import './Followings.css';
import Modal from './Modal/Modal';
import { connect } from "react-redux";

class Followings extends Component {
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
            return (
                <div className="user-profile-page-user-following"> 
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
  )(Followings);