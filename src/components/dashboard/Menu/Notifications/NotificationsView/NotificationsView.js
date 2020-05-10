import React, {Component} from 'react';
import './NotificationsView.css';
import { connect } from "react-redux";
import axios from 'axios';
import SingleNotification from './SingleNotification/SingleNotification';
import InfiniteScroll from 'react-infinite-scroll-component';

class NotificationsView extends Component {
    constructor() {
        super();
        this.state = {
            notifications: [],
            page: 0,
            hasMore: true
        }
    }

    // Fetch notifications
    getUserNotifications = () => {
        let dataToSend = {};
        
        // Send user id to fetch notifications
        dataToSend.user_id = this.props.auth.user.id;
        // Send current page
        dataToSend.page = this.state.page;

        axios.post("/api/restricted-users/get-notification-data", dataToSend).then(response => {
                // Check if there were any new notifications added after mounting this component which would 
                // cause database array to shift and remove any duplicate elements from array
                const newNotificationsArray = [...this.state.notifications, ...response.data.notifications];
                const newUniqueNotificationsArray = Array.from(new Set(newNotificationsArray.map(a => a._id)))
                .map(_id => {
                    return newNotificationsArray.find(a => a._id === _id);
                })

                if (response.data.notifications.length > 0) {
                    this.setState({
                        // notifications: this.state.notifications.concat(response.data.notifications),
                        notifications: newUniqueNotificationsArray,
                        page: this.state.page + 10
                    }, () => { this.notificationSeen(); });
                } else {
                    this.setState({
                        hasMore: false
                    });
                }
        }).catch(e => {
            console.log(e.message);
        });
    }

    notificationSeen = () => {
        let dataToSend = {};

        // Check which ones are 'unseen'
        const unseenNotifications = [];
        this.state.notifications.forEach(element => {
            if (!element.seen)
                unseenNotifications.push(element._id);
        });
        if (unseenNotifications.length === 0)
            return;
        // Send notification ids as an array to make notifications 'seen'
        dataToSend.ids = unseenNotifications;

        axios.post("/api/restricted-users/seen-notification", dataToSend).then(response => {
                console.log(response);
        }).catch(e => {
            console.log(e.message);
        });
    }

    componentDidMount() {
        this.getUserNotifications();
    }

    render() {
        return (
            <div className="notifications-view-container">

                        <InfiniteScroll
                            height="100%"
                            dataLength={this.state.notifications.length}
                            next={this.getUserNotifications}
                            hasMore={this.state.hasMore}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{ textAlign: "center" }}>
                                <b><br />You have seen it all !</b>
                                </p>
                            }
                            >

                            {this.state.notifications.map((data, index) => (
                                        <SingleNotification _id={data._id}
                                            action_taker_user_id={data.action_taker_user_id}
                                            date={data.created_at}
                                            seen={data.seen}
                                            target={data.target}
                                            text={data.text}
                                            type={data.type}
                                            key={data._id}
                                            ></SingleNotification>
                                    ))}
                        </InfiniteScroll>

            </div>
        );
    }
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(NotificationsView);