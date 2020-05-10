import React, {Component} from 'react';
import './Posts.css';
import Post from './Post/Post';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { connect } from "react-redux";

class Posts extends Component {
    constructor() {
        super();
    }
    
    state = {
        posts: [],
        page: 0,
        hasMore: true
    }

    // Fetch more posts from database according to page number
    fetchMoreData = () => {
        axios.get("/api/restricted-users/get-posts-with-page/?page=" + this.state.page
                 + "&user_id=" + this.props.auth.user.id).then(response => {

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
          });
    };

    componentDidMount() {
        // Fetch initial number of posts after component render
        this.fetchMoreData();
    }

    render() {
        return (
            <div className="posts-container">
                 <InfiniteScroll
                        height="100%"
                        dataLength={this.state.posts.length}
                        next={this.fetchMoreData}
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
                                    post_author_id={data.user_id}
                                    profile_picture={data.profile_picture}
                                    user_name={data.user_name}
                                    liked={data.liked}
                                    disliked={data.disliked}
                                    key={data._id}></Post>
                        ))}

                </InfiniteScroll>
            </div>
        );
    }
} 

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(Posts);