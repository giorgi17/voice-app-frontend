import React, {Component} from 'react';
import './Comments.css';
import Comment from './Comment/Comment';
import axios from 'axios';

class Comments extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.viewMorePreviousCommentsButtonRef = React.createRef();
        this.state = {
            comments: [],
            page: 0,
            hasMore: true,
            initialCleanupDone: false
        }
    }
    // Handle more comments after clicking "View previous comments"
    viewMoreCommentsHandler = () => {
        if (this.state.hasMore)
            this.fetchMoreComments();
    }

    // Fetch more comments from database according to page number
    fetchMoreNextComments = () => {
        axios.get("/api/restricted-users/get-next-comments-with-page/?page=" + this.state.page
        + "&post_id=" + this.props.post_id).then(response => {
                // console.log(response.data.comments);
                if (response.data.comments.length > 0) {
                    if (this._isMounted) {
                        this.setState({ comments: response.data.comments, page: this.state.page + 10 });
                    }   
                }
            });
    };

    // Fetch more previous comments from database according to page number
    fetchMoreComments = () => {
        axios.get("/api/restricted-users/get-comments-with-page/?page=" + this.state.page
                    + "&post_id=" + this.props.post_id).then(response => {
                
                if (!this.state.initialCleanupDone)
                    this.setState({comments: []}, () => this.setState({initialCleanupDone: true}));
                
                // Check if there were any new comments added after mounting this component which would 
                // cause database array to shift and remove any duplicate elements from array
                const newCommentsArray = [...response.data.comments, ...this.state.comments];
                const newUniqueCommentsArray = Array.from(new Set(newCommentsArray.map(a => a._id)))
                .map(_id => {
                    return newCommentsArray.find(a => a._id === _id);
                })

                if (response.data.comments.length > 0) {
                    if (this._isMounted) {
                        this.setState({
                            comments: newUniqueCommentsArray,
                            page: this.state.page + 10
                        });
                    }
            
                    // make "View previous comments" button dissapear if there are no more comments
                    if (response.data.comments.length < 10) {
                        if (this.viewMorePreviousCommentsButtonRef.current);
                            this.viewMorePreviousCommentsButtonRef.current.style.display = 'none';

                    }
                } else {
                    this.setState({
                        hasMore: false
                    }, () => { 
                        if (this.viewMorePreviousCommentsButtonRef.current);
                            this.viewMorePreviousCommentsButtonRef.current.style.display = 'none';
                    });
                }
            });
    };

    // Fetch initial comments for post
    FetchComments = () => {
        let dataToSend = {};

        // Send user id to fetch profile picture
        dataToSend.post_id = this.props.post_id;

        axios.post("/api/restricted-users/fetch-initial-comments-for-post", dataToSend).then(response => {
            if (this._isMounted) {
                this.setState({comments: response.data.comments,
                    hasMore: response.data.hasMore});
            }
        
            if (response.data.hasMore) {
                if (this.viewMorePreviousCommentsButtonRef.current)
                    this.viewMorePreviousCommentsButtonRef.current.style.display = 'inline-block';
            }
        }).catch( err => {
            console.log(err);
        });
    }

    componentDidUpdate() {
        if (this.props.commentSent) {
            this.props.commentAddedResetHandler();
            if (this.state.page === 0) {
                this.setState({comments: [], page: 0, hasMore: true, initialCleanupDone: false},
                    () => { 
                        // this.fetchMoreNextComments();
                        this.FetchComments();
                     });
            } else {
                this.fetchMoreNextComments();
            }
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.FetchComments();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className="all-comments-wrapper">
                <div className="all-comments-more-comments-button" 
                    onClick={this.viewMoreCommentsHandler}
                    ref={this.viewMorePreviousCommentsButtonRef}>
                    View previous comments
                </div>
                {this.state.comments.map(comment => (
                    <Comment    comment_author_user_id={comment.user_id}
                                comment_author_user_name={comment.user_name}
                                comment_content={comment.content}
                                comment_date={comment.created_at}
                                key={comment._id}>
                                
                    </Comment>
                ))}
            </div>
        );
    }
}

export default Comments;