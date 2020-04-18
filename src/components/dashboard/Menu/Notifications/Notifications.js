import React from 'react';
import NotificationsView from './NotificationsView/NotificationsView';

const Notifications = (props) => {

    // TODO: Check if there are any notifications with redux 
    // const notification = null;
    const notification = 5;
    let notificationsIcon = (<span className={`material-icons notifications-icon ${props.isNotificationActive ? "active" : ""}`}>
                                notifications
                            </span>);
    if (notification && notification > 0) {
        // TODO: get the number of notifications
        let notificationsNumber = 2;

        notificationsIcon = (<div className="material-label mdl-badge" data-badge={notificationsNumber}>
                                <span className={`material-icons notifications-icon ${props.isNotificationActive ? "active" : ""}`}>
                                    notifications
                                </span>
                            </div>);
    }

    return (
        <div id="notifications-container" 
            className={`menu-item ${props.isNotificationActive ? "active" : ""}`}
            onClick={() => {props.onClick("notification"); props.changeDisplayedContent(<NotificationsView></NotificationsView>)}}
        >
            {notificationsIcon}
        </div>
    );
}

export default Notifications;