import React, {Component} from 'react';
import './Posts.css';
import Post from './Post/Post';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { connect } from "react-redux";
import PostsFilter from './PostsFilter/PostsFilter';

class Posts extends Component {
    _isMounted = false;

    constructor() {
        super();
    }
    
    state = {
        posts: [],
        page: 0,
        hasMore: true,
        activeIcons: {
            showAll: true,
            following: false,
            myPosts: false
        },
        filter: 'all'
    }

    // Fetch more posts from database according to page number
    fetchMoreData = () => {
        const currentFilter = this.state.filter;
        axios.get("/api/restricted-users/get-posts-with-page/?page=" + this.state.page
                 + "&user_id=" + this.props.auth.user.id + "&filter=" + this.state.filter).then(response => {

            // Check if there were any new posts added after mounting this component which would 
                // cause database array to shift and remove any duplicate elements from array
                const newPostsArray = [...this.state.posts, ...response.data];
                const newUniquePostsArray = Array.from(new Set(newPostsArray.map(a => a._id)))
                .map(_id => {
                    return newPostsArray.find(a => a._id === _id);
                })

            if (response.data.length > 0) {
                if (this.state.filter === currentFilter) {
                    this.setState({
                        // posts: this.state.posts.concat(response.data),
                        posts: newUniquePostsArray,
                        page: this.state.page + 10
                    });
                }
            } else {
                if (this.state.filter === currentFilter) {
                    this.setState({
                        hasMore: false
                    });
                }
            }
          });
    };

    // Switching icon styles to "active" and displaying specific menu content on clicking icon
    setMenuIconActive = (iconName) => {
        const stateCopy = {...this.state.activeIcons};
        for (var key in stateCopy) {
            if (stateCopy.hasOwnProperty(key)) {
                if (key === iconName) {
                    stateCopy[key] = true;
                } else {
                    stateCopy[key] = false;
                }
            }
        }
        this.setState({activeIcons: {...stateCopy}});
    }

    changeFilter = filter => {
        this.setState({filter}, () => {
            this.setState({posts: [], page: 0, hasMore: true}, () => {
                this.fetchMoreData();
            });
        });
    }

    componentDidMount() {
        this._isMounted = true;
        // Fetch initial number of posts after component render
        this.fetchMoreData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        console.log(document.body);
        return (
            <div className="posts-container">

                <PostsFilter onClick={this.setMenuIconActive}
                    isShowAllActive={this.state.activeIcons.showAll}
                    isFollowingActive={this.state.activeIcons.following}
                    isMyPostsActive={this.state.activeIcons.myPosts}
                    changeFilter={this.changeFilter}></PostsFilter>

                 <InfiniteScroll
                        // height="100%"
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
                                    created_at={data.created_at}
                                    notify={data.notify}
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