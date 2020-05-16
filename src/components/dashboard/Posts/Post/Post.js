import React, { Component } from 'react';
import './Post.css';
import Player from '../../Menu/RecordVoice/Player/Player';
import axios from 'axios';
import { connect } from "react-redux";
import CommentsSection from './CommentsSection/CommentsSection';
import { withRouter } from 'react-router-dom';

class Post extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.playerRef = React.createRef();
        this.postEditButtonRef = React.createRef();
        this.postEditRef = React.createRef();
        this.postEditNotificationsSwitchRef = React.createRef();
        this.postEditDeleteRef = React.createRef();
        this.postEditOptionRef = React.createRef();
        this.postEditNotificationsMessageRef = React.createRef();
        this.state = {
            player: null,
            liked: false,
            disliked: false,
            notify: false,
            notifyOptionText: '',
            notifyMessageText: ''
        }
    }

    notificationsSwitchHandler = () => {
        let dataToSend = {};

        // Send post id and user id to dislike
        dataToSend.id = this.props.auth.user.id;
        dataToSend.target = this.props.post_id;
        dataToSend.option = !this.state.notify;

        axios.post("/api/restricted-users/change-notification-state-for-post", dataToSend).then(response => {
            if (this._isMounted) {
                // Close post edit menu
                this.postEditRef.current.style.display = 'none';
                document.removeEventListener("click", this.documentClickEventHandler);

                this.setState({notify: response.data.notify});
                if (response.data.notify) {
                    this.setState({notifyOptionText: 'Turn off notifications for this post',
                    notifyMessageText: 'Notifications turned on for this post'});
                    this.postEditNotificationsMessageRef.current.style.display = 'block';
                    setTimeout(() => {
                         this.postEditNotificationsMessageRef.current.style.display = 'none';
                         }, 3000);
                } else {
                    this.setState({notifyOptionText: 'Turn on notifications for this post',
                    notifyMessageText: 'Notifications turned off for this post'});
                    this.postEditNotificationsMessageRef.current.style.display = 'block';
                    setTimeout(() => { 
                        this.postEditNotificationsMessageRef.current.style.display = 'none'; 
                    }, 3000);
                }
            }
        }).catch( err => {
            console.log(err);
        });
    }

    documentClickEventHandler = (event) => {
        if (event.target !== this.postEditRef.current 
            && !this.postEditRef.current.contains(event.target)) {
            this.postEditRef.current.style.display = 'none';
            document.removeEventListener("click", this.documentClickEventHandler);
        }
    }

    openProfileEdit = () => {
        this.postEditRef.current.style.display = 'block';
        // Detect all clicks on the document
        document.addEventListener("click", this.documentClickEventHandler);
    }

    transform_date = (dateToTransform) => {
        // transform date 
        let date = new Date(dateToTransform);
        // let formatted_date = date.getFullYear() + "-" + this.appendLeadingZeroes((date.getMonth() + 1)) + "-" + this.appendLeadingZeroes(date.getDate()) + " " + this.appendLeadingZeroes(date.getHours()) + ":" + this.appendLeadingZeroes(date.getMinutes()) + ":" + this.appendLeadingZeroes(date.getSeconds());
        // this.setState({date: formatted_date});
        return date.toLocaleString();
    }
    
    // Perform disliking the post
    dislikePost = () => {
        let dataToSend = {};
        
        // Send post id and user id to dislike
        dataToSend.post_id = this.props.post_id;
        dataToSend.user_id = this.props.auth.user.id;
        dataToSend.current_user_name = this.props.auth.user.name;
        dataToSend.post_author_id = this.props.post_author_id;

        axios.post("/api/restricted-users/post-dislike", dataToSend).then(response => {
            if (this._isMounted) {
                this.setState({disliked: response.data.disliked, liked: false});
            }
        }).catch( err => {
            console.log(err);
        });
    }

    // Perform liking the post
    likePost = () => {
        let dataToSend = {};

        // Send post id and user id to like
        dataToSend.post_id = this.props.post_id;
        dataToSend.user_id = this.props.auth.user.id;
        dataToSend.current_user_name = this.props.auth.user.name;
        dataToSend.post_author_id = this.props.post_author_id;
        console.log(dataToSend);

        axios.post("/api/restricted-users/post-like", dataToSend).then(response => {
            if (this._isMounted) {
                this.setState({liked: response.data.liked, disliked: false});
                // console.log(response.data);
            }
        }).catch( err => {
            console.log(err);
        });
    }

    playAudio = () => {
        if (this._isMounted) {
            this.playerRef.current.style.display = 'none';
            this.setState({player: (
                <div id="user-post-player-container">
                    <Player audioFile={this.props.audio} />
                </div>)});
        }
    }

    redirectToUserProfile = () => {
        const queryParams = 'userId=' + this.props.post_author_id;
        this.props.history.push(`/dashboard?${queryParams}`);
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.props.post_author_id === this.props.auth.user.id) {
            this.postEditDeleteRef.current.style.display = 'block';
            this.postEditOptionRef.current.style.display = 'block';
        }

        this.setState({liked: this.props.liked, disliked: this.props.disliked,
                notify: this.props.notify}, () => {
                    if (this.state.notify)
                        this.setState({notifyOptionText: 'Turn off notifications for this post'});
                    else
                        this.setState({notifyOptionText: 'Turn on notifications for this post'});
                });
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.removeEventListener("click", this.documentClickEventHandler);
    }

    render() {
        return (
            <div className="single-post">
                <div className="notifications-message" ref={this.postEditNotificationsMessageRef}>
                    {this.state.notifyMessageText}
                </div>

                <div className="user-post-image-wrapper">
                    <div className="user-post-play-and-time" ref={this.playerRef}>
                        <span className="material-icons user-post-play-button" onClick={this.playAudio}>
                            play_circle_outline
                        </span>
                        <span className="user-post-video-time">{this.props.audio_duration}</span>
                    </div>
                    <img src={this.props.picture}></img>
                </div>

                <div className="user-post-edit-button-container" ref={this.postEditButtonRef}
                        onClick={this.openProfileEdit}>    
                    <span className="material-icons">
                        more_horiz
                    </span>
                </div>

                <div className="user-post-edit-options-modal-container" ref={this.postEditRef}>
                    <ul className="user-post-edit-options-modal-menu-items">
                        <li className="user-post-edit-options-modal-menu-items-edit-post"
                                ref={this.postEditOptionRef}>
                            Edit post
                        </li>
                        <li className="user-post-edit-options-modal-menu-items-delete-post"
                                ref={this.postEditDeleteRef}>
                            Delete post
                        </li>
                        <li className="user-post-edit-options-modal-menu-items-notifications-switch-post"
                                ref={this.postEditNotificationsSwitchRef}
                                onClick={this.notificationsSwitchHandler}>
                            {this.state.notifyOptionText}
                        </li>
                    </ul>
                </div>

                <div className="user-post-profile-image-wrapper"
                     onClick={this.redirectToUserProfile}>
                    <img src={this.props.profile_picture} />
                </div>
    
                <strong className="user-post-username" onClick={this.redirectToUserProfile}>{this.props.user_name}</strong>
    
                <div className="user-post-viewer-options">
                    <span className={`material-icons like ${this.state.liked ? "liked" : ""}`}
                        onClick={this.likePost}>
                        thumb_up
                    </span>
                    <span className={`material-icons dislike ${this.state.disliked ? "disliked" : ""}`}
                        onClick={this.dislikePost}>
                        thumb_down
                    </span>
                    <span className="material-icons comment">
                        mode_comment
                    </span>
                    <span className="material-icons share">
                        share
                    </span>
                </div>
    
                 {this.state.player}
    
                <div className="user-post-info">
                    <span className="user-post-info-likes">1 Likes</span>
                    <span className="user-post-info-dislikes">17 Dislikes</span>
                    <span className="user-post-info-comments">15 Comments</span>
                    <span className="user-post-info-views">502 Views</span>
                </div>
                <hr></hr>
    
                <div className="user-post-description">
                    <span>{this.props.description}</span>
                </div>

                <hr></hr>

                <CommentsSection post_author_id={this.props.post_author_id}
                                 post_id={this.props.post_id}></CommentsSection>

                <div className="user-post-created-at">
                    {this.transform_date(this.props.created_at)}
                </div>
            </div>)
    }
    
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(withRouter(Post));