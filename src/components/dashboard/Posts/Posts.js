import React, {Component} from 'react';
import './Posts.css';
import Post from './Post/Post';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

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
        axios.get("/api/restricted-users/get-posts-with-page/?page=" + this.state.page).then(response => {
            console.log(response);
            console.log(response.data);
            if (response.data.length > 0) {
                this.setState({
                    posts: this.state.posts.concat(response.data),
                    page: this.state.page + 10
                });
                console.log("this is data " + this.state['posts'][0]);
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
                            <Post   picture={data.picture}
                                    audio={data.sound}
                                    description={data.description}
                                    audio_duration={data.audio_duration}
                                    profile_picture={data.profile_picture}
                                    user_name={data.user_name}
                                    key={data._id}></Post>
                        ))}

                </InfiniteScroll>
            </div>
        );
    }
} 

export default Posts;