import React, {Component} from 'react';
import './CommentsSection.css';
import TextField from '@material-ui/core/TextField';
import { connect } from "react-redux";
import axios from 'axios';
import Comments from './Comments/Comments';

class CommentsSection extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.commentPostButtonRef = React.createRef();
        this.state = {
            commentInput: '',
            commentSent: false
        }
    }

    commentAddedResetHandler = () => {
        this.setState({commentSent: false});
        this.commentPostButtonRef.current.style.color = '#87766F';
        this.commentPostButtonRef.current.style.cursor = 'default';
    }

    controlCommentInput = e => {
        this.setState({commentInput: e.target.value});
        if (e.target.value !== '') {
            this.commentPostButtonRef.current.style.color = '#4E93F3';
            this.commentPostButtonRef.current.style.cursor = 'pointer';
        }
        else {
            this.commentPostButtonRef.current.style.color = '#87766F';
            this.commentPostButtonRef.current.style.cursor = 'default';
        }
    }

    // Add a new comment
    addNewComment = () => {
        // Check if comment content is empty
        if (this.state.commentInput === '')
            return;
            
        let dataToSend = {};

        // Send post id and user id to add a new comment and notification
        dataToSend.post_id = this.props.post_id;
        dataToSend.user_id = this.props.auth.user.id;
        dataToSend.content = this.state.commentInput;
        dataToSend.current_user_name = this.props.auth.user.name;
        dataToSend.post_author_id = this.props.post_author_id;

        axios.post("/api/restricted-users/add-new-comment", dataToSend).then(response => {
            if (this._isMounted) {
                const postInfo = {...this.props.comments_number};
                postInfo.comments+=1;
                this.props.changeCommentsNumber(postInfo);
                
                this.setState({commentSent: true, commentInput: ''});
            }
        }).catch( err => {
            console.log(err);
        });
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className="post-comments-wrapper">

                <Comments post_id={this.props.post_id} commentSent={this.state.commentSent}
                          commentAddedResetHandler={this.commentAddedResetHandler} ></Comments>
                <div className="post-comments-add-new-comment-wrapper">
                    <div className="post-comments-profile-image-wrapper">
                        <img className="post-comments-profile-image"
                            src={this.props.auth.user.avatarImage}></img>
                    </div>

                    <div className="post-comments-comment-input">
                        <TextField
                            id="outlined-textarea"
                            label="Add a comment"
                            placeholder="Write something..."
                            multiline
                            variant="outlined"
                            onChange={this.controlCommentInput}
                            value={this.state.commentInput}
                            />
                    </div>

                    <span className="material-icons post-comments-post-button" 
                        ref={this.commentPostButtonRef} onClick={this.addNewComment}>
                        send
                    </span>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(CommentsSection);