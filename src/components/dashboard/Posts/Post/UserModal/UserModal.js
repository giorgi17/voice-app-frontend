import React, { Component } from 'react';
import './UserModal.css';
import { connect } from "react-redux";
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../Post';
import UserActivityInfo from '../../../Menu/Profile/ProfileView/UserActivityInfo/UserActivityInfo';
import Button from '@material-ui/core/Button';

class UserModal extends Component {
    constructor() {
        super();
        this.userPostModalRef = React.createRef();
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
        this.props.closeModal();
    }

    // Perform following or unfollowing on certain user
    followOrUnfollow = () => {
        let dataToSend = {};

        // If user profile is opened through search send 'user_id' else send 'id' for post id
        if (this.props.post_id)
            dataToSend.id = this.props.post_id;
        else if (this.props.user_id)
            dataToSend.user_id = this.props.user_id;

        // Send user id to follow or unfollow
        dataToSend.current_user_id = this.props.auth.user.id;

        axios.post("/api/restricted-users/follow-or-unfollow", dataToSend).then(response => {
            this.setState({following: response.data.following});
        }).catch( err => {
            console.log(err);
        });
    }

    // Fetch following information of certain user
    getFollowingInfo = () => {
        // Check if profile belongs to logged in user and if so, don't show follow button
        if (this.state.postAuthorData.user_id && 
            this.state.postAuthorData.user_id !== this.props.auth.user.id) {
                this.followButtonRef.current.style.display = 'block';
        } else {
            return;
        }

        let dataToSend = {};

        // If user profile is opened through search send 'user_id' else send 'id' for post id
        if (this.props.post_id)
            dataToSend.id = this.props.post_id;
        else if (this.props.user_id)
            dataToSend.user_id = this.props.user_id;

        // Send user id to determine wether he is following this user or not
        dataToSend.current_user_id = this.props.auth.user.id;

        axios.post("/api/restricted-users/get-user-following-data", dataToSend).then(response => {
            this.setState({following: response.data.following});
        }).catch( err => {
            console.log(err);
        });
    }

    // Fetch information of certain user
    getUserInfo = () => {
        let dataToSend = {};
        // If user profile is opened through search send 'user_id' else send 'id' for post id
        if (this.props.post_id)
            dataToSend.id = this.props.post_id;
        else if (this.props.user_id)
            dataToSend.user_id = this.props.user_id;

        axios.post("/api/restricted-users/get-post-author-user-data", dataToSend).then(async response => {
            this.setState({postAuthorData: response.data});
            this.getFollowingInfo();   
        }).catch( err => {
            console.log(err);
        });
    }

    // Fetch posts of post author
    getUserPosts = () => {
        let dataToSend = {};
        // If user profile is opened through search send 'user_id' else send 'id' for post id
        if (this.props.post_id)
            dataToSend.id = this.props.post_id;
        else if (this.props.user_id)
            dataToSend.user_id = this.props.user_id;

        dataToSend.page = this.state.page;

        axios.post("/api/restricted-users/get-post-author-user-posts", dataToSend).then(response => {
                if (response.data.length > 0) {
                    this.setState({
                        posts: this.state.posts.concat(response.data),
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

    componentDidMount() {
        this.getUserInfo();
        this.getUserPosts();
    }

    render() {
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = (event) => {
            if (event.target.className === 'user-post-modal') {
                this.props.closeModal();
            }
        }
        return (
            <div id="user-post-modal" className="user-post-modal" ref={this.userPostModalRef}>
                <div className="user-post-modal-content">
                    <span className="user-post-modal-close" ref={this.userPostModalCloseButtonRef}
                            onClick={this.modalClose}>&times;</span>
                    {/* <p>Some text in the Modal..</p> */}
                    <div className="user-post-modal-profile-info-wrapper">
                        <div className="user-post-modal-profile-image-wrapper">
                            <img src={this.state.postAuthorData.avatarImage} />
                        </div>

                        <div className="user-post-modal-profile-username">
                        <strong>Username:</strong> {this.state.postAuthorData.name}
                        </div>

                        <div className="user-post-modal-profile-email">
                        <strong>Email:</strong> {this.state.postAuthorData.email}
                        </div>
                    </div>

                    <UserActivityInfo></UserActivityInfo>
                    <div className="user-post-modal-follow-button" ref={this.followButtonRef}>
                        <Button variant="contained" 
                        color={`${this.state.following ? "secondary" : "primary"}`}
                        onClick={this.followOrUnfollow} >
                            {this.state.following ? 'Unfollow' : 'Follow'}
                        </Button>
                    </div>

                    <hr></hr>

                    <div className="user-post-modal-posts-container">
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
                                        picture={data.picture}
                                        audio={data.sound}
                                        description={data.description}
                                        audio_duration={data.audio_duration}
                                        profile_picture={data.profile_picture}
                                        user_name={data.user_name}
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
  )(UserModal);
