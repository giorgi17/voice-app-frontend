import React, { Component } from 'react';
import './UserProfile.css';
import { connect } from "react-redux";
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../Post';
import UserActivityInfo from '../../../Menu/Profile/ProfileView/UserActivityInfo/UserActivityInfo';
import Button from '@material-ui/core/Button';

class UserProfile extends Component {
    constructor() {
        super();
        this.userPostModalCloseButtonRef = React.createRef();
        this.followButtonRef = React.createRef();
        this.state = {
            postAuthorData: {
                avatarImage: null,
                email: null,
                name: null,
                user_id: null
            },
            posts: [],
            page: 0,
            hasMore: true,
            following: true
        }
    }

    // When the user clicks on <span> (x), close the modal
    modalClose = () => {
       
    }

    // Perform following or unfollowing on certain user
    followOrUnfollow = () => {
        let dataToSend = {};

        dataToSend.user_id = this.props.user_id;

        // Send logged in user id and username to follow or unfollow
        dataToSend.current_user_id = this.props.auth.user.id;
        dataToSend.current_user_name = this.props.auth.user.name;

        axios.post("/api/restricted-users/follow-or-unfollow", dataToSend).then(response => {
            this.setState({following: response.data.following});
        }).catch( err => {
            console.log(err);
        });
    }

    // Fetch following information of certain user
    getFollowingInfo = () => {
        // Check if profile belongs to logged in user and if so, don't show follow button
        if (!this.state.postAuthorData.user_id || 
            this.state.postAuthorData.user_id === this.props.auth.user.id) {
                return;
        } 

        let dataToSend = {};

        dataToSend.user_id = this.props.user_id;

        // Send user id to determine wether he is following this user or not
        dataToSend.current_user_id = this.props.auth.user.id;

        axios.post("/api/restricted-users/get-user-following-data", dataToSend).then(response => {
            this.setState({following: response.data.following});
            this.followButtonRef.current.style.display = 'block';
        }).catch( err => {
            console.log(err);
        });
    }

    // Fetch information of certain user
    getUserInfo = () => {
        let dataToSend = {};
        dataToSend.user_id = this.props.user_id;

        axios.post("/api/restricted-users/get-post-author-user-data", dataToSend).then(response => {
            this.setState({postAuthorData: response.data});
            this.getFollowingInfo();   
        }).catch( err => {
            console.log(err);
        });
    }

    // Fetch posts of post author
    getUserPosts = () => {
        let dataToSend = {};
        dataToSend.user_id = this.props.user_id;
        dataToSend.logged_in_user_id = this.props.auth.user.id;
        dataToSend.page = this.state.page;

        axios.post("/api/restricted-users/get-post-author-user-posts", dataToSend).then(response => {
                // Check if there were any new posts added after mounting this component which would 
                // cause database array to shift and remove any duplicate elements from array
                const newPostsArray = [...this.state.posts, ...response.data];
                const newUniquePostsArray = Array.from(new Set(newPostsArray.map(a => a._id)))
                .map(_id => {
                    return newPostsArray.find(a => a._id === _id);
                })

                if (response.data.length > 0) {
                    this.setState({
                        // posts: this.state.posts.concat(response.data),
                        posts: newUniquePostsArray,
                        page: this.state.page + 10
                    });
                } else {
                    this.setState({
                        hasMore: false
                    });
                }
        }).catch(e => {
            console.log(e.message);
        });
    }

    componentDidUpdate(prevProps) {
        // If query parameter user_id is changed then load another user info
        //  after cleaning up old one
        if (prevProps.user_id !== this.props.user_id) {
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
                following: true
            }, () => {
                this.getUserInfo();
                this.getUserPosts();  
            })
        }
    }

    componentDidMount() {
        this.getUserInfo();
        this.getUserPosts();
    }

    render() {
        return (
            <div className="user-profile-page">
                <div className="user-profile-page-content">
                    <div className="user-profile-page-info-wrapper">
                        <div className="user-profile-page-profile-image-wrapper">
                            <img src={this.state.postAuthorData.avatarImage} />
                        </div>

                        <div className="user-profile-page-profile-username">
                        <strong>Username:</strong> {this.state.postAuthorData.name}
                        </div>

                        <div className="user-profile-page-profile-email">
                        <strong>Email:</strong> {this.state.postAuthorData.email}
                        </div>
                    </div>

                    <UserActivityInfo></UserActivityInfo>
                    <div className="user-profile-page-follow-button" ref={this.followButtonRef}>
                        <Button variant="contained" 
                        color={`${this.state.following ? "secondary" : "primary"}`}
                        onClick={this.followOrUnfollow} >
                            {this.state.following ? 'Unfollow' : 'Follow'}
                        </Button>
                    </div>

                    <hr></hr>

                    <div className="user-profile-page-posts-container">
                        <InfiniteScroll
                            height="100%"
                            dataLength={this.state.posts.length}
                            next={this.getUserPosts}
                            hasMore={this.state.hasMore}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{ textAlign: "center" }}>
                                <b><br />You have seen it all !</b>
                                </p>
                            }
                            >
                            
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
                                        key={data._id}></Post>
                            ))}

                        </InfiniteScroll>
                    </div>
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
    // { logoutUser }
  )(UserProfile);
