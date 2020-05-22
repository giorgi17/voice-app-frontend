import React, {Component} from 'react';
import './Comment.css';
import axios from 'axios';
import PageCacher from '../../../../../../../utils/PageCacher';

class Comment extends Component {
    _isMounted = false;

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
        if (this._isMounted) {
            this.setState({date: date.toLocaleString()},
            () => PageCacher.cachePageUpdate([
                {name: 'date', data: this.state.date}
            ], 'Comment' + this.props.comment_id));
        }
    }

    fetchUserProfilePicture = () => {
        let dataToSend = {};

        // Send id of the comment author to fetch his profile picture
        dataToSend.id = this.props.comment_author_user_id;

        axios.post("/api/restricted-users/get-user-profile-picture-for-notifications", dataToSend).then(response => {
            if (this._isMounted) {
                this.setState({commentAuthorProfilePicture: response.data.avatarImage},
                    () => PageCacher.cachePageUpdate([
                        {name: 'commentAuthorProfilePicture', data: response.data.avatarImage}
                    ], 'Comment' + this.props.comment_id));
            }
        }).catch( err => {
            console.log(err.message);
        });
    }

    componentDidMount() {
        this._isMounted = true;
        // Set route name in state for "PageCacher.cachePageSaveScroll" to see while unmounting
        this.setState({thisRoute: window.location.href.split("/").pop()});

        const cachedData = PageCacher.cachePageOnMount('Comment' + this.props.comment_id);
        const propertyNamesToBeCached = ['commentAuthorProfilePicture', 'date'];

        if (PageCacher.areAllPropertiesCached(propertyNamesToBeCached, cachedData.data)) {
            this.setState({... cachedData.data}, () => window.scrollTo(cachedData.scroll.scrollX, cachedData.scroll.scrollY));
        } else {
            this.transform_date();
            this.fetchUserProfilePicture();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // Save the latest scroll position right before unmounting
        PageCacher.cachePageSaveScroll(this.state.thisRoute);
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