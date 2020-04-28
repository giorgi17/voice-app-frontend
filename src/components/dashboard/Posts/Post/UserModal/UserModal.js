import React, { Component } from 'react';
import './UserModal.css';
import { connect } from "react-redux";
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../Post';

class UserModal extends Component {
    constructor() {
        super();
        this.userPostModalRef = React.createRef();
        this.userPostModalCloseButtonRef = React.createRef();
    }

    state = {
        postAuthorData: {
            avatarImage: null,
            email: null,
            name: null
        },
        posts: [],
        page: 0,
        hasMore: true
    }

    // When the user clicks on <span> (x), close the modal
    modalClose = () => {
        this.props.closeModal();
    }

    // Fetch information of certain user
    getUserInfo = () => {
        axios.post("/api/restricted-users/get-post-author-user-data", {id: this.props.post_id}).then(response => {
            this.setState({postAuthorData: response.data});
        }).catch( err => {
            console.log(err);
        });
    }

    // Fetch posts of post author
    getUserPosts = () => {
        axios.post("/api/restricted-users/get-post-author-user-posts",
             {id: this.props.post_id, page: this.state.page}).then(response => {
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
