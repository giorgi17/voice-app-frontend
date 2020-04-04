import React from 'react';

const Notifications = (props) => {

    // TODO: Check if there are any notifications with redux 
    // const notification = null;
    const notification = 5;
    let notificationsIcon = (<span className="material-icons">
                                notifications
                            </span>);
    if (notification && notification > 0) {
        // TODO: get the number of notifications
        let notificationsNumber = 2;

        notificationsIcon = (<div className="material-label mdl-badge" data-badge={notificationsNumber}>
                            <span className="material-icons">
                                notifications
                            </span>
                        </div>);
    }

    return (
        <div id="notifications-container" className="menu-item">
            {notificationsIcon}
        </div>
    );
}

export default Notifications;