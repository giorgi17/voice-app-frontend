import React, {Component} from 'react';
import './Comment.css';
import axios from 'axios';

class Comment extends Component {
    constructor() {
        super();
        this.state = {
            commentAuthorProfilePicture: '',
            date: ''
        }
    }

    transform_date = () => {
        // transform date 
        let date = new Date(this.props.comment_date);
        // let formatted_date = date.getFullYear() + "-" + this.appendLeadingZeroes((date.getMonth() + 1)) + "-" + this.appendLeadingZeroes(date.getDate()) + " " + this.appendLeadingZeroes(date.getHours()) + ":" + this.appendLeadingZeroes(date.getMinutes()) + ":" + this.appendLeadingZeroes(date.getSeconds());
        // this.setState({date: formatted_date});
        this.setState({date: date.toLocaleString()});
    }

    fetchUserProfilePicture = () => {
        let dataToSend = {};

        // Send id of the comment author to fetch his profile picture
        dataToSend.id = this.props.comment_author_user_id;

        axios.post("/api/restricted-users/get-user-profile-picture-for-notifications", dataToSend).then(response => {
            this.setState({commentAuthorProfilePicture: response.data.avatarImage});
        }).catch( err => {
            console.log(err.message);
        });
    }

    componentDidMount() {
        this.transform_date();
        this.fetchUserProfilePicture();
    }

    render() {
        return (
            <div className="single-comment">
                <div className="single-comment-profile-image-wrapper">
                    <img className="single-comment-profile-image"
                            src={this.state.commentAuthorProfilePicture}>
                    </img>
                </div>
                <p className="single-comment-comment-text">
                    <b>{this.props.comment_author_user_name}</b> {this.props.comment_content}
                    <br></br><br></br>
                    {this.state.date}
                </p>
            </div>
        );
    }
};

export default Comment;