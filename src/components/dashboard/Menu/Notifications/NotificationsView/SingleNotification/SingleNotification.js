import React, {Component} from 'react';
import './SingleNotification.css';
import axios from 'axios';

class SingleNotification extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.singleNotificationRef = React.createRef();
        this.notificationImageRef = React.createRef();
        this.state = {
            date: '',
            profilePicture: '',
            postPicture: ''
        }
    }

    createTextMarkup = () => {
         return {__html: this.text_truncate(this.props.text, 106)};
    };

    appendLeadingZeroes = (n) => {
        if(n <= 9){
            return "0" + n;
        }
        return n
    }

    text_truncate = (str, length, ending) => {
        if (length == null) {
          length = 100;
        }
        if (ending == null) {
          ending = '...';
        }
        if (str.length > length) {
          return str.substring(0, length - ending.length) + ending;
        } else {
          return str;
        }
    };

    transform_date = () => {
        // transform date 
        let date = new Date(this.props.date);
        // let formatted_date = date.getFullYear() + "-" + this.appendLeadingZeroes((date.getMonth() + 1)) + "-" + this.appendLeadingZeroes(date.getDate()) + " " + this.appendLeadingZeroes(date.getHours()) + ":" + this.appendLeadingZeroes(date.getMinutes()) + ":" + this.appendLeadingZeroes(date.getSeconds());
        // this.setState({date: formatted_date});
        if (this._isMounted) {
            this.setState({date: date.toLocaleString()});
        }
    }

    notificationUnseenToSeen = () => {
        setInterval(() => {
            if (this.singleNotificationRef.current)
                this.singleNotificationRef.current.style.backgroundColor = "#E4E9F1";
        }, 3000);
    }

    fetchUserProfilePicture = () => {
        let dataToSend = {};

        // Send id of the notification author to fetch his profile picture
        dataToSend.id = this.props.action_taker_user_id;

        axios.post("/api/restricted-users/get-user-profile-picture-for-notifications", dataToSend).then(response => {
            if (this._isMounted) {
                this.setState({profilePicture: response.data.avatarImage});
            }
        }).catch( err => {
            console.log(err.message);
        });
    }

    fetchPostPicture = () => {
        let dataToSend = {};

        // Send post id to receive post picture
        dataToSend.post_id = this.props.target;

        axios.post("/api/restricted-users/get-post-picture-for-notifications", dataToSend).then(response => {
            if (this._isMounted) {
                this.setState({postPicture: response.data.postPicture});
                this.notificationImageRef.current.style.display = 'block';
                // console.log(response.data.postPicture);
            }
        }).catch( err => {
            console.log(err.message);
        });
    }

    componentDidMount() {
        this._isMounted = true;

        this.transform_date();
        this.fetchUserProfilePicture();
        if (!this.props.seen)
            this.notificationUnseenToSeen();
        if (this.props.type === 'post-liking' || this.props.type === 'post-disliking'
            || this.props.type === 'post-commenting')
            this.fetchPostPicture();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
                <React.Fragment>
                    <div 
                        className={`single-notification ${this.props.seen ? "" : "unseen-notification"}`}
                        ref={this.singleNotificationRef}>

                        <div className="single-notification-image-wrapper">
                            <img src={this.state.profilePicture}></img>
                        </div>
                        <div className="single-notification-text">
                            <p dangerouslySetInnerHTML={this.createTextMarkup()}>
                            </p>

                            <div className="single-notification-date-wrapper">
                                {this.state.date}
                            </div>
                        </div>
                        <div className="single-notification-right-image-wrapper" ref={this.notificationImageRef}>
                            <img className="single-notification-image" 
                            src={this.state.postPicture} />
                        </div>
                        
                    </div>
                    <hr className="single-notification-hr"></hr>
                </React.Fragment>
            );  
    }
};

export default SingleNotification;