import React, { Component } from 'react';
import './Post.css';
import Player from '../../Menu/RecordVoice/Player/Player';
import axios from 'axios';
import { connect } from "react-redux";
import CommentsSection from './CommentsSection/CommentsSection';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import EditPostView from '../../Menu/RecordVoice/EditPostView /EditPostView';
import PageCacher from '../../../../utils/PageCacher';
import DeletePostView from '../../Menu/RecordVoice/DeletePostView/DeletePostView';


class Post extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.playerRef = React.createRef();
        this.profileImageRef = React.createRef();
        this.profileUsernameRef = React.createRef();
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
            notifyMessageText: '',
            postInfo: {
                likes: 0,
                dislikes: 0,
                comments: 0,
                views: 0
            },
            editModalOpen: false,
            deleteModalOpen: false,
            postPicture: '',
            postDescription: ''
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
                const postInfo = {...this.state.postInfo};
                if (response.data.disliked) {
                    postInfo.dislikes+=1;
                    if (this.state.liked && this.state.postInfo.likes !== 0)
                        postInfo.likes-=1;
                } else {
                    postInfo.dislikes-=1;
                }
                this.setState({disliked: response.data.disliked, liked: false, postInfo});
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

        axios.post("/api/restricted-users/post-like", dataToSend).then(response => {
            if (this._isMounted) {
                const postInfo = {...this.state.postInfo};
                if (response.data.liked) {
                    postInfo.likes+=1;
                    if (this.state.disliked && this.state.postInfo.dislikes !== 0)
                        postInfo.dislikes-=1;
                } else {
                    postInfo.likes-=1;
                }
                this.setState({liked: response.data.liked, disliked: false, postInfo});
                // console.log(response.data);
            }
        }).catch( err => {
            console.log(err);
        });
    }

    // Perform viewing the post
    viewPost = () => {
        let dataToSend = {};

        // Send post id and user id to view
        dataToSend.post_id = this.props.post_id;
        dataToSend.user_id = this.props.auth.user.id;
        dataToSend.current_user_name = this.props.auth.user.name;
        dataToSend.post_author_id = this.props.post_author_id;

        axios.post("/api/restricted-users/post-view", dataToSend).then(response => {
            if (this._isMounted) {
                if (response.data.newView) {
                    const postInfo = {...this.state.postInfo};
                    postInfo.views+=1;
                    this.setState({postInfo});
                }
            }
        }).catch( err => {
            console.log(err);
        });
    }

    // Perform viewing the post
    getPostLikesDislikesCommentsViews = () => {
        let dataToSend = {};

        // Send post id to fetch information about post
        dataToSend.post_id = this.props.post_id;

        axios.post("/api/restricted-users/get-post-likes-dislikes-comments-views", dataToSend).then(response => {
            if (this._isMounted) {
                const postInfo = {...response.data};
                this.setState({postInfo});
                // console.log(response.data);
            }
        }).catch( err => {
            console.log(err);
        });
    }

    changeCommentsNumber = postInfo => {
        this.setState({postInfo});
    }
    
    closeEditModal = () => {
        this.setState({editModalOpen: false});
    }

    closeDeleteModal = () => {
        this.setState({deleteModalOpen: false});
    }

    playAudio = () => {
        if (this._isMounted) {
            this.playerRef.current.style.display = 'none';
            this.setState({player: (
                <div id="user-post-player-container">
                    <Player audioFile={this.props.audio} />
                </div>)});  
            // If user has viewed the post - pass, if not save the new view
            this.viewPost();
        }
    }

    postEditEffect = (postPicture, postDescription) => {
        let cacheDataToUpdate = [
            {index: this.props.index, name: 'picture', data: postPicture},
            {index: this.props.index, name: 'description', data: postDescription}
        ]
        if (postPicture) {
            this.setState({postPicture, postDescription});
        } else {
            this.setState({postDescription});
            cacheDataToUpdate = [
                {index: this.props.index, name: 'description', data: postDescription}
            ]
        }
        PageCacher.cachePageUpdate('posts', cacheDataToUpdate, 'Posts', true);

        // delete cache information for user profile page or dashboard to fetch updated posts
        const fullThisRoute = window.location.href.split("/");
        fullThisRoute.splice(0,3);
        const thisRoute = fullThisRoute.join('/');
        const cacheDataCopy = JSON.parse(localStorage.getItem('mainPageCacheObject'));
        if (thisRoute === 'profile/' + this.props.auth.user.id) {
            if (cacheDataCopy.hasOwnProperty('dashboard')) {
                delete cacheDataCopy['dashboard'];
                localStorage.setItem('mainPageCacheObject', JSON.stringify(cacheDataCopy));
            }
        } else if (thisRoute === 'dashboard') {
            if (cacheDataCopy.hasOwnProperty('profile/' + this.props.auth.user.id)) {
                delete cacheDataCopy['profile/' + this.props.auth.user.id];
                localStorage.setItem('mainPageCacheObject', JSON.stringify(cacheDataCopy));
            }
        }   
    }

    openEditPost = () => {
        // Getting route information 
        const fullThisRoute = window.location.href.split("/");
        fullThisRoute.splice(0,3);
        const thisRoute = fullThisRoute.join('/');

        if (window.innerWidth >= 600)
            this.setState({editModalOpen: true});
        else
            this.props.history.push(`/edit-post/${this.props.post_id}/${this.props.post_author_id}/${this.props.index}/${encodeURIComponent(thisRoute)}`);
    }

    componentDidMount() {
        this._isMounted = true;

        this.setState({postPicture: this.props.picture,
            postDescription: this.props.description});
        console.log(this.props.auth.user.isAdmin);
        if (this.props.post_author_id === this.props.auth.user.id ||
            this.props.auth.user.isAdmin) {
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

        this.getPostLikesDislikesCommentsViews();
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.removeEventListener("click", this.documentClickEventHandler);
    }

    render() {
        return (
            <div className="single-post-outer-layer"> 
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
                        <img src={this.state.postPicture}></img>

                        <Link to={`/profile/${this.props.post_author_id}`}>
                            <div className="user-post-profile-image-wrapper"
                                ref={this.profileImageRef}>
                                <img src={(this.props.auth.user.id === this.props.post_author_id)
                                     ? this.props.auth.user.avatarImage : this.props.profile_picture} />
                            </div>
                        
                        

                        <strong className="user-post-username" 
                        ref={this.profileUsernameRef}>{this.props.user_name}</strong>
                        </Link> 

                        <div className="user-post-edit-button-container" ref={this.postEditButtonRef}
                                onClick={this.openProfileEdit}>    
                            <span className="material-icons">
                                more_horiz
                            </span>
                        </div>

                        <div className="user-post-edit-options-modal-container" ref={this.postEditRef}>
                            <ul className="user-post-edit-options-modal-menu-items">
                                <li className="user-post-edit-options-modal-menu-items-edit-post"
                                        ref={this.postEditOptionRef} onClick={this.openEditPost}>
                                    Edit post
                                </li>
                                <li className="user-post-edit-options-modal-menu-items-delete-post"
                                        ref={this.postEditDeleteRef} onClick={() => this.setState({deleteModalOpen: true})}> 
                                    Delete post
                                </li>
                                <li className="user-post-edit-options-modal-menu-items-notifications-switch-post"
                                        ref={this.postEditNotificationsSwitchRef}
                                        onClick={this.notificationsSwitchHandler}>
                                    {this.state.notifyOptionText}
                                </li>
                            </ul>
                        </div>
                    </div>
        
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
                        <span className="user-post-info-likes">{this.state.postInfo.likes} Likes</span>
                        <span className="user-post-info-dislikes">{this.state.postInfo.dislikes} Dislikes</span>
                        <span className="user-post-info-comments">{this.state.postInfo.comments} Comments</span>
                        <span className="user-post-info-views">{this.state.postInfo.views} Views</span>
                    </div>
                    <hr></hr>
        
                    <div className="user-post-description">
                        <span>{this.state.postDescription}</span>
                    </div>

                    <hr></hr>

                    <CommentsSection post_author_id={this.props.post_author_id}
                                    post_id={this.props.post_id}
                                    comments_number={this.state.postInfo}
                                    changeCommentsNumber={this.changeCommentsNumber}></CommentsSection>

                    <div className="user-post-created-at">
                        {this.transform_date(this.props.created_at)}
                    </div>
                    
                </div>

                {this.state.editModalOpen ? <EditPostView closeEditModal={this.closeEditModal}
                    profile_picture={this.props.profile_picture} picture={this.state.postPicture}
                    description={this.state.postDescription} post_id={this.props.post_id}
                    picture={this.props.picture} postEditEffect={this.postEditEffect}
                    post_author_id={this.props.post_author_id} user_name={this.props.user_name}/> : null}

                {this.state.deleteModalOpen ? <DeletePostView closeDeleteModal={this.closeDeleteModal}
                 index={this.props.index} deleteSpecificElementFromArray={this.props.deleteSpecificElementFromArray}
                 post_id={this.props.post_id} post_author_id={this.props.post_author_id} /> : null}
            </div>)
    }
    
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(withRouter(Post));