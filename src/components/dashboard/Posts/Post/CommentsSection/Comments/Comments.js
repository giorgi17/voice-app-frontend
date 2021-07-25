import React, {Component} from 'react';
import './Comments.css';
import Comment from './Comment/Comment';
import axios from 'axios';
import CircularProgressBar from '../../../../../../img/progressbar2.gif';
import PageCacher from '../../../../../../utils/PageCacher';

class Comments extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.viewMorePreviousCommentsButtonRef = React.createRef();
        this.expandLessCommentsButtonRef = React.createRef();
        this.circularProgressBarRef = React.createRef();
        this.state = {
            comments: [],
            page: 0,
            hasMore: true,
            initialCleanupDone: false,
            viewPreviousCommentsButton: false
        }
    }
    // Handle more comments after clicking "View previous comments"
    viewMoreCommentsHandler = () => {
        if (this.state.hasMore)
            this.fetchMoreComments();
    }

    // Expand less comments
    expandLessHandler = () => {
        this.setState({comments: [], page: 0, hasMore: true, initialCleanupDone: false},
            () => { 
                this.FetchComments();
                this.expandLessCommentsButtonRef.current.style.display = 'none';
                PageCacher.cachePageUpdate(null, [
                    {name: 'comments', data: this.state.comments},
                    {name: 'page', data: this.state.page},
                    {name: 'hasMore', data: this.state.hasMore},
                    {name: 'initialCleanupDone', data: this.state.initialCleanupDone}
                ], 'Comments' + this.props.post_id);
             });
    }

    // Fetch more comments from database according to page number
    fetchMoreNextComments = () => {
        this.circularProgressBarRef.current.style.display = 'inline-block';

        axios.get("/api/restricted-users/get-next-comments-with-page/?page=" + this.state.page
        + "&post_id=" + this.props.post_id).then(response => {

                this.circularProgressBarRef.current.style.display = 'none';

                // console.log(response.data.comments);
                if (response.data.comments.length > 0) {
                    if (this._isMounted) {
                        this.setState({ comments: response.data.comments, page: this.state.page + 10 },
                            () => PageCacher.cachePageUpdate([null, 
                                {name: 'comments', data: this.state.comments},
                                {name: 'page', data: this.state.page}
                            ], 'Comments' + this.props.post_id));
                    }   
                }
            });
    };

    // Fetch more previous comments from database according to page number
    fetchMoreComments = () => {
        this.circularProgressBarRef.current.style.display = 'inline-block';
        axios.get("/api/restricted-users/get-comments-with-page/?page=" + this.state.page
                    + "&post_id=" + this.props.post_id).then(response => {

                this.circularProgressBarRef.current.style.display = 'none';

                if (!this.state.initialCleanupDone)
                    this.setState({comments: []}, () => this.setState({initialCleanupDone: true}, 
                        () => PageCacher.cachePageUpdate(null, [
                            {name: 'comments', data: this.state.comments},
                            {name: 'initialCleanupDone', data: this.state.initialCleanupDone}
                        ], 'Comments' + this.props.post_id)));
                
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
                        }, () => PageCacher.cachePageUpdate(null, [
                            {name: 'comments', data: this.state.comments},
                            {name: 'page', data: this.state.page},
                            // {name: 'viewPreviousCommentsButton', data: this.state.viewPreviousCommentsButton}
                        ], 'Comments' + this.props.post_id));
                    }
            
                    // make "View previous comments" button dissapear if there are no more comments
                    if (response.data.comments.length < 10) {
                        this.setState({viewPreviousCommentsButton: false}, 
                            () => PageCacher.cachePageUpdate(null, [
                                {name: 'viewPreviousCommentsButton', data: this.state.viewPreviousCommentsButton}
                            ], 'Comments' + this.props.post_id));

                        // if (this.viewMorePreviousCommentsButtonRef.current);
                        //     this.viewMorePreviousCommentsButtonRef.current.style.display = 'none';

                    }
                } else {
                    this.setState({
                        hasMore: false
                    }, () => { 
                        this.setState({viewPreviousCommentsButton: false}, 
                            () => PageCacher.cachePageUpdate(null, [
                                {name: 'viewPreviousCommentsButton', data: this.state.viewPreviousCommentsButton}
                            ], 'Comments' + this.props.post_id));

                        // if (this.viewMorePreviousCommentsButtonRef.current);
                        //     this.viewMorePreviousCommentsButtonRef.current.style.display = 'none';
                    });
                }
            });
    };

    // Fetch initial comments for post
    FetchComments = () => {
        let dataToSend = {};

        // Send user id to fetch profile picture
        dataToSend.post_id = this.props.post_id;

        if (this.circularProgressBarRef.current)
            // this.circularProgressBarRef.current.style.display = 'inline-block';
        axios.post("/api/restricted-users/fetch-initial-comments-for-post", dataToSend).then(response => {
            if (this.circularProgressBarRef.current)
                // this.circularProgressBarRef.current.style.display = 'none';
            if (this._isMounted) {
                this.setState({comments: response.data.comments,
                    hasMore: response.data.hasMore},
                     () => PageCacher.cachePageUpdate(null, [
                        {name: 'comments', data: this.state.comments},
                        {name: 'hasMore', data: this.state.hasMore},
                        // {name: 'viewPreviousCommentsButton', data: this.state.viewPreviousCommentsButton}
                    ], 'Comments' + this.props.post_id));
        
                if (response.data.hasMore) {
                    this.setState({viewPreviousCommentsButton: true}, 
                        () => PageCacher.cachePageUpdate(null, [
                            {name: 'viewPreviousCommentsButton', data: this.state.viewPreviousCommentsButton}
                        ], 'Comments' + this.props.post_id));
                }
            }
        }).catch( err => {
            console.log(err);
        });
    }

    componentDidUpdate() {

        if (this.state.viewPreviousCommentsButton && this.viewMorePreviousCommentsButtonRef.current)
            this.viewMorePreviousCommentsButtonRef.current.style.display = 'inline-block';
        else
            this.viewMorePreviousCommentsButtonRef.current.style.display = 'none';


        if (this.state.comments.length > 3)
            this.expandLessCommentsButtonRef.current.style.display = 'block';

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
        // Set route name in state for "PageCacher.cachePageSaveScroll" to see while unmounting
        const fullThisRoute = window.location.href.split("/");
        fullThisRoute.splice(0,3);
        const thisRoute = fullThisRoute.join('/');
        this.setState({thisRoute});

        const cachedData = PageCacher.cachePageOnMount('Comments' + this.props.post_id);
        const propertyNamesToBeCached = ['hasMore', 'comments'];
        
        if (cachedData) {
            if (PageCacher.areAllPropertiesCached(propertyNamesToBeCached, cachedData.data))
                this.setState({...cachedData.data}, () => window.scrollTo(cachedData.scroll.scrollX, cachedData.scroll.scrollY));
            else
                this.FetchComments();
        } else {
            this.FetchComments();
        }
    } 

    componentWillUnmount() {
        this._isMounted = false;
        // Save the latest scroll position right before unmounting
        PageCacher.cachePageSaveScroll(this.state.thisRoute);
    }

    render() {
        return (
            <div className="all-comments-wrapper">
                <div className="all-comments-more-comments-button" 
                    onClick={this.viewMoreCommentsHandler}
                    ref={this.viewMorePreviousCommentsButtonRef}>
                    View previous comments
                </div>

                <img src={CircularProgressBar} className="all-comments-circular-progressbar"
                    ref={this.circularProgressBarRef}></img>

                <div className="all-comments-wrapper-expand-less"
                    onClick={this.expandLessHandler}
                    ref={this.expandLessCommentsButtonRef}>
                    <span className="material-icons">
                        expand_less
                    </span>
                </div>

                {this.state.comments.map(comment => (
                    <Comment    comment_id={comment._id}
                                comment_author_user_id={comment.user_id}
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