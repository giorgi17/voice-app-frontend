import React, { Component } from 'react';
import './Post.css';
import Player from '../../Menu/RecordVoice/Player/Player';
import axios from 'axios';
import { connect } from "react-redux";
import CommentsSection from './CommentsSection/CommentsSection';
import { withRouter } from 'react-router-dom';

class Post extends Component {
    constructor() {
        super();
        this.playerRef = React.createRef();
        this.state = {
            player: null,
            liked: false,
            disliked: false
        }
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
            this.setState({disliked: response.data.disliked, liked: false});
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
            this.setState({liked: response.data.liked, disliked: false});
            console.log(response.data);
        }).catch( err => {
            console.log(err);
        });
    }

    playAudio = () => {
        this.playerRef.current.style.display = 'none';
        this.setState({player: (
            <div id="user-post-player-container">
                <Player audioFile={this.props.audio} />
            </div>)});
    }

    redirectToUserProfile = () => {
        const queryParams = 'userId=' + this.props.post_author_id;
        this.props.history.push(`/dashboard?${queryParams}`);
    }

    componentDidMount() {
        this.setState({liked: this.props.liked, disliked: this.props.disliked});
    }

    render() {
        return (
            <div className="single-post">
                <div className="user-post-image-wrapper">
                    <div className="user-post-play-and-time" ref={this.playerRef}>
                        <span className="material-icons user-post-play-button" onClick={this.playAudio}>
                            play_circle_outline
                        </span>
                        <span className="user-post-video-time">{this.props.audio_duration}</span>
                    </div>
                    <img src={this.props.picture}></img>
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
            </div>)
    }
    
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(withRouter(Post));