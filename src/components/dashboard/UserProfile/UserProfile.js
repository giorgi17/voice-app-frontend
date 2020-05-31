import React, { Component } from 'react';
import './UserProfile.css';
import { connect } from "react-redux";
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../Posts/Post/Post';
import UserActivityInfo from '../Menu/Profile/ProfileView/UserActivityInfo/UserActivityInfo';
import Button from '@material-ui/core/Button';
import queryString from 'query-string';
import Header from '../../Header/Header';
import { logoutUser } from '../../../actions/authActions';
import ActivityCounter from './ActivityCounter/ActivityCounter';
import PageCacher from '../../../utils/PageCacher';
import MenuResponsive from '../MenuResponsive/Menu';  

class UserProfile extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.userPostModalCloseButtonRef = React.createRef();
        this.followButtonRef = React.createRef();
        this.postsLoadingRef = React.createRef();
        this.state = {
            postAuthorData: {
                avatarImage: null,
                email: null,
                name: null,
                user_id: null
            },
            postAuthorStatistics: {
                posts: 0,
                followers: 0,
                following: 0,
                likes: 0,
                dislikes: 0,
                comments: 0,
                views: 0
            },
            posts: [],
            page: 0,
            hasMore: true,
            following: null,
            showFollowButton: false,
            queryUserId: ''
        }
    }

    // Logout method for Header component
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    // Perform following or unfollowing on certain user
    followOrUnfollow = () => {
        let dataToSend = {};

        dataToSend.user_id = this.state.queryUserId;

        // Send logged in user id and username to follow or unfollow
        dataToSend.current_user_id = this.props.auth.user.id;
        dataToSend.current_user_name = this.props.auth.user.name;

        axios.post("/api/restricted-users/follow-or-unfollow", dataToSend).then(response => {
            if (this._isMounted) { 
                this.setState({following: response.data.following},
                    () => PageCacher.cachePageUpdate(null, [
                           {name: 'following', data: this.state.following}
                       ], 'Posts'));
            }
        }).catch( err => {
            console.log(err);
        });
    }

    // Fetch following information of certain user
    getFollowingInfo = () => {
        // Check if profile belongs to logged in user and if so, don't show follow button
        if (!this.state.postAuthorData.user_id || 
            this.state.postAuthorData.user_id === this.props.auth.user.id) {
                PageCacher.cachePageUpdate(null, [
                    {name: 'following', data: this.state.following},
                    {name: 'showFollowButton', data: this.state.showFollowButton}
                ], 'Posts')
                return;
        } 

        let dataToSend = {};

        dataToSend.user_id = this.state.queryUserId;

        // Send user id to determine wether he is following this user or not
        dataToSend.current_user_id = this.props.auth.user.id;

        axios.post("/api/restricted-users/get-user-following-data", dataToSend).then(response => {
            if (this._isMounted) { 
                this.setState({following: response.data.following, showFollowButton: true},
                    () => PageCacher.cachePageUpdate(null, [
                           {name: 'following', data: this.state.following},
                           {name: 'showFollowButton', data: this.state.showFollowButton}
                       ], 'Posts'));
                // this.followButtonRef.current.style.display = 'inline-block';
            }
        }).catch( err => {
            console.log(err);
        });
    }

    // Fetch statistics for certain user
    getUserStatistics = () => {
        let dataToSend = {};
        dataToSend.user_id = this.state.queryUserId;

        axios.post("/api/restricted-users/get-user-statistics", dataToSend).then(response => {
            if (this._isMounted) { 
                const postAuthorStatistics = {...this.state.postAuthorStatistics};
                postAuthorStatistics.posts = response.data.posts;
                postAuthorStatistics.followers = response.data.followers;
                postAuthorStatistics.following = response.data.following;
                postAuthorStatistics.likes = response.data.likes;
                postAuthorStatistics.dislikes = response.data.dislikes;
                postAuthorStatistics.comments = response.data.comments;
                postAuthorStatistics.views = response.data.views;
                this.setState({postAuthorStatistics},
                    () => PageCacher.cachePageUpdate('postAuthorStatistics', [
                           {name: 'comments', data: this.state.postAuthorStatistics.comments},
                           {name: 'dislikes', data: this.state.postAuthorStatistics.dislikes},
                           {name: 'followers', data: this.state.postAuthorStatistics.followers},
                           {name: 'following', data: this.state.postAuthorStatistics.following},
                           {name: 'likes', data: this.state.postAuthorStatistics.likes},
                           {name: 'posts', data: this.state.postAuthorStatistics.posts},
                           {name: 'views', data: this.state.postAuthorStatistics.views},
                       ], 'Posts'));
                // console.log(response.data);
            } 
        }).catch( err => {
            console.log(err);
        });
    }

    // Fetch information of certain user
    getUserInfo = () => {
        let dataToSend = {};
        dataToSend.user_id = this.state.queryUserId;

        axios.post("/api/restricted-users/get-post-author-user-data", dataToSend).then(response => {
            if (this._isMounted) { 
                this.setState({postAuthorData: response.data},
                    () => PageCacher.cachePageUpdate('postAuthorData', [
                           {name: 'avatarImage', data: this.state.postAuthorData.avatarImage},
                           {name: 'email', data: this.state.postAuthorData.email},
                           {name: 'name', data: this.state.postAuthorData.name},
                           {name: 'user_id', data: this.state.postAuthorData.user_id}
                       ], 'Posts'));
                this.getFollowingInfo();  
            } 
        }).catch( err => {
            console.log(err);
        });
    }

    // Fetch posts of post author
    getUserPosts = () => {
        let dataToSend = {};
        dataToSend.user_id = this.state.queryUserId;
        dataToSend.logged_in_user_id = this.props.auth.user.id;
        dataToSend.page = this.state.page;

        if (this.postsLoadingRef.current)
            this.postsLoadingRef.current.style.display = 'block';

        axios.post("/api/restricted-users/get-post-author-user-posts", dataToSend).then(response => {
                // Check if there were any new posts added after mounting this component which would 
                // cause database array to shift and remove any duplicate elements from array
                const newPostsArray = [...this.state.posts, ...response.data];
                const newUniquePostsArray = Array.from(new Set(newPostsArray.map(a => a._id)))
                .map(_id => {
                    return newPostsArray.find(a => a._id === _id);
                })

                // window.removeEventListener('scroll', this.scrollListener); 

                if (response.data.length > 0) {
                    if (this._isMounted) {
                        this.postsLoadingRef.current.style.display = 'none';
                        this.setState({
                            // posts: this.state.posts.concat(response.data),
                            posts: newUniquePostsArray,
                            page: this.state.page + 10
                        },
                        () => {
                            PageCacher.cachePageUpdate(null, [
                                {name: 'hasMore', data: this.state.hasMore},
                                {name: 'posts', data: this.state.posts},
                                {name: 'page', data: this.state.page}
                            ], 'Posts');
                            window.addEventListener('scroll', this.scrollListener); 
                        });
                    }
                } else {
                    this.postsLoadingRef.current.innerHTML = 'You\'ve seen all posts.';
                    if (this._isMounted) {
                        this.setState({
                            hasMore: false
                        }, () => {
                            PageCacher.cachePageUpdate(null, [
                                {name: 'hasMore', data: this.state.hasMore},
                                {name: 'posts', data: this.state.posts},
                                {name: 'page', data: this.state.page}
                            ],
                            'Posts');
                            window.addEventListener('scroll', this.scrollListener); 
                    });
                    }
                }
        }).catch(e => {
            console.log(e.message);
        });
    }

    componentDidUpdate() {
        const userIdQueryParam = this.props.match.params.userId;
        
        if (this.state.queryUserId !== userIdQueryParam) {
            if (this._isMounted) {
                this.postsLoadingRef.current.innerHTML = 'Loading...';
                this.setState({ 
                    postAuthorData: {
                        avatarImage: null,
                        email: null,
                        name: null,
                        user_id: null
                    },
                    posts: [],
                    page: 0,
                    hasMore: true,
                    following: true,
                    queryUserId: userIdQueryParam
                }, () => {
                    this.getUserInfo();
                    this.getUserPosts();
                    this.getUserStatistics();  
                })
            }
        }
    }

    scrollListener = () => {
        const lastScrollY = window.scrollY;
        var body = document.body,
        html = document.documentElement;

        var height = Math.max( body.scrollHeight, body.offsetHeight, 
                            html.clientHeight, html.scrollHeight, html.offsetHeight );
    
        // console.log(height);
        // console.log(lastScrollY);

        if ((lastScrollY + 1000) >= height) {
            // alert("you're at the bottom of the page");
            if (this.state.hasMore){
                if (this._isMounted) {
                    window.removeEventListener('scroll', this.scrollListener); 
                    this.getUserPosts();
                }
            }
        }
    }

    goBack = () => {
        this.props.history.push('/dashboard');
    }

    componentDidMount() {
        this._isMounted = true;
        // window.addEventListener('scroll', this.scrollListener);        

        // Set route name in state for "PageCacher.cachePageSaveScroll" to see while unmounting
        const fullThisRoute = window.location.href.split("/");
        fullThisRoute.splice(0,3);
        const thisRoute = fullThisRoute.join('/');
        this.setState({thisRoute});

        const cachedData = PageCacher.cachePageOnMount('Posts');
        const propertyNamesToBeCached = ['posts', 'page', 'postAuthorData', 'following',
            'showFollowButton', 'postAuthorStatistics'];

        if (PageCacher.areAllPropertiesCached(propertyNamesToBeCached, cachedData.data)) {
            console.log("CACHED!");
            this.setState({... cachedData.data}, () => {
                window.scrollTo(cachedData.scroll.scrollX, cachedData.scroll.scrollY);
                window.addEventListener('scroll', this.scrollListener);  
            });
        } else {
            console.log("NOT CACHED!");
            // Getting query parameter
            // const parsed = queryString.parse(window.location.search);
            const params = this.props.match.params;
            if (params.userId) {
                this.setState({queryUserId: params.userId}, () => {
                    PageCacher.cachePageUpdate(null, [{name: 'queryUserId', data: this.state.queryUserId}],
                             'Posts')
                    this.getUserInfo();
                    this.getUserPosts();
                    this.getUserStatistics();
                });
            }
        }

        // this.getUserInfo();
        // this.getUserPosts();
        // this.getUserStatistics();
    }

    componentWillUnmount() {
        this._isMounted = false;
        // Save the latest scroll position right before unmounting
        // PageCacher.cachePageSaveScroll(this.state.thisRoute);
        // const lastScrollY = window.scrollY;
        // console.log(lastScrollY);
    }

    render() {
        return (
            <React.Fragment>
                <Header authenticated={this.props.auth.isAuthenticated} logoutMethod={this.onLogoutClick} aboutActive={true} />
                <MenuResponsive history={{...this.props.history}} menuName="home" />

                <div className="responsive-menu-section-name">
                    <div className="user-profile-page-section-items">
                        <span className="material-icons responsive-menu-section-go-back"
                            onClick={this.goBack}>
                            arrow_back_ios
                        </span>
                        <div className="responsive-menu-section-name-user-name">
                            {this.props.auth.user.name} 
                        </div>
                    </div>
                </div>
                <div className="user-profile-page">
                        <div className="user-profile-page-user-pic-and-basic">
                            <div className="user-profile-page-profile-image-wrapper">
                                <img src={this.state.postAuthorData.avatarImage} />
                            </div>

                            <div className="user-profile-page-info-wrapper">
                                    <h2 className="user-profile-page-profile-username"> 
                                        {this.state.postAuthorData.name}                                      
                                    </h2>

                                    {/* <div className="user-profile-page-profile-email">
                                    <strong>Email:</strong> {this.state.postAuthorData.email}
                                    </div> */}
                                    {this.state.showFollowButton ? 
                                        <div className="user-profile-page-follow-button" ref={this.followButtonRef}>
                                            <Button variant="contained" 
                                            color={`${this.state.following ? "secondary" : "primary"}`}
                                            onClick={this.followOrUnfollow} >
                                                {this.state.following ? 'Unfollow' : 'Follow'}
                                            </Button>
                                        </div> : null
                                    }

                                    {/* <ul className="user-profile-page-basic-activity-info-wrapper">
                                        <li><strong>1880</strong> posts</li>
                                        <li><strong>256</strong> followers</li>
                                        <li><strong>12324</strong> following</li>
                                    </ul> */}
                                    <ActivityCounter userStatistics={this.state.postAuthorStatistics} history={this.props.history}/>
                            </div>
                        </div>
                        

                        <div className="user-profile-page-user-description">
                            that guy from that thing you’ve seen.that guy from that thing you’ve seen.that guy from that thing you’ve seen.
                        </div>
                        
                        <hr className="user-profile-page-line"></hr>

                        <div className="user-profile-page-basic-activity-info-wrapper-2">
                            <ActivityCounter userStatistics={this.state.postAuthorStatistics} history={this.props.history}/>
                            <hr className="user-profile-page-line"></hr>
                        </div>
                        {/* <UserActivityInfo postAuthorStatistics={this.state.postAuthorStatistics}></UserActivityInfo> */}
                        
                        <div className="user-profile-content-wrapper">
            
                            <div className="user-profile-page-posts-container">
                                        {/* <InfiniteScroll
                                            height="auto"
                                            dataLength={this.state.posts.length}
                                            next={this.getUserPosts}
                                            hasMore={this.state.hasMore}
                                            loader={<h4>Loading...</h4>}
                                            endMessage={
                                                <p style={{ textAlign: "center" }}>
                                                <b><br />You have seen it all !</b>
                                                </p>
                                            }
                                            > */}
                                            
                                            {/* Display fetched posts */}
                                            {this.state.posts.map((data, index) => (
                                                
                                                    <Post   
                                                            post_id={data._id}
                                                            post_author_id={data.user_id}
                                                            picture={data.picture}
                                                            audio={data.sound}
                                                            description={data.description}
                                                            audio_duration={data.audio_duration}
                                                            profile_picture={data.profile_picture}
                                                            user_name={data.user_name}
                                                            liked={data.liked}
                                                            disliked={data.disliked}
                                                            created_at={data.created_at}
                                                            notify={data.notify}
                                                            key={data._id}></Post>
                                            ))}

                                            <h4 className="user-profile-page-posts-loading" ref={this.postsLoadingRef}>
                                                Loading...
                                            </h4>
                                        {/* </InfiniteScroll> */}
                            </div>

                        </div>

                </div>
            </React.Fragment>
        );
    }
    
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
  )(UserProfile);
