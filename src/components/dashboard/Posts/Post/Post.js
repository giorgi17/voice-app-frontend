import React, { Component } from 'react';
import './Post.css';
import Player from '../../Menu/RecordVoice/Player/Player';

class Post extends Component {
    constructor() {
        super();
        this.playerRef = React.createRef();
        this.state = {
            player: null
        }
    }
    
    playAudio = () => {
        this.playerRef.current.style.display = 'none';
        this.setState({player: (
            <div id="user-post-player-container">
                <Player audioFile={this.props.audio} />
            </div>)});
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
    
                <div className="user-post-profile-image-wrapper">
                    <img src={this.props.profile_picture} />
                </div>
    
                <strong className="user-post-username">{this.props.user_name}</strong>
    
                <div className="user-post-viewer-options">
                    <span className="material-icons like">
                        thumb_up
                    </span>
                    <span className="material-icons dislike">
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
            </div>)
    }
    
};

export default Post;