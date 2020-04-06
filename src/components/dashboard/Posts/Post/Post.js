import React from 'react';
import './Post.css';

const Post = (props) => (
    <div className="single-post">
        <div className="user-post-image-wrapper">
            <div className="user-post-play-and-time">
                <span className="material-icons user-post-play-button">
                    play_circle_outline
                </span>
                <span className="user-post-video-time">00:17:32</span>
            </div>
            <img src="https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/backgroung-concept-for-travel-in-japan-image-anek-suwannaphoom.jpg"></img>
        </div>

        <div className="user-post-profile-image-wrapper">
            <img src="https://images.ladbible.com/thumbnail?type=jpeg&url=http://beta.ems.ladbiblegroup.com/s3/content/1bb3cdf35dc6d4a97a9891fef90de232.png&quality=70&width=720" />
        </div>

        <strong className="user-post-username">Giorgi khachidze</strong>

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

        <div className="user-post-info">
            <span className="user-post-info-likes">1 Likes</span>
            <span className="user-post-info-dislikes">17 Dislikes</span>
            <span className="user-post-info-comments">15 Comments</span>
            <span className="user-post-info-views">502 Views</span>
        </div>
        <hr></hr>

        <div className="user-post-description">
            <span>Esse reprehenderit adipisicing sunt magna. Incididunt laboris dolore nisi dolore minim aliqua est non nostrud eiusmod minim culpa. Ea ullamco consectetur proident consequat cupidatat laboris officia velit. Do consequat id irure laboris proident. Qui ad velit eu cillum quis irure incididunt reprehenderit minim. Lorem quis aute dolore enim fugiat sint consequat adipisicing.
a ullamcnim ea id est minim excepteur magna aute non.</span>
        </div>
    </div>
);

export default Post;