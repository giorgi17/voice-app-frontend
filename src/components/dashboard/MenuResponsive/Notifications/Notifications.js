import React, {Component} from 'react';
import NotificationsView from './NotificationsView/NotificationsView';
import { connect } from "react-redux";
import axios from 'axios';

class Notifications extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = {
            notification: null
        }
    }

    componentDidMount() {
        this._isMounted = true;

        let dataToSend = {};

        // Send user id to fetch notifications
        dataToSend.user_id = this.props.auth.user.id;

        axios.post("/api/restricted-users/get-notification-number-data", dataToSend).then(response => {
            if (this._isMounted) {
                this.setState({notification: response.data.notification});
            }
        }).catch( err => {
            console.log(err);
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
            // TODO: Check if there are any notifications with redux 

        let notificationsIcon = (<span className={`notifications-icon ${this.props.isNotificationActive ? "material-icons" : "material-icons-outlined"}`}>
                                    notifications
                                </span>);
        if (this.state.notification && this.state.notification > 0) {
  
            notificationsIcon = (<div className="material-label mdl-badge" data-badge={this.state.notification}>
                                    <span className={`notifications-icon ${this.props.isNotificationActive ? "material-icons" : "material-icons-outlined"}`}>
                                        notifications
                                    </span>
                                </div>);
        }

        return (
            <div id="notifications-container" 
                className={`responsive-menu-item ${this.props.isNotificationActive ? "active" : ""}`}
                onClick={() => {this.props.onClick(); this.setState({notification: 0});}}
            >
                {notificationsIcon}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(Notifications);