import React, {Component} from 'react';
import './Posts.css';
import Post from './Post/Post';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { connect } from "react-redux";
import PostsFilter from './PostsFilter/PostsFilter';
import PageCacher from '../../../utils/PageCacher';
import AddNewPost from './AddNewPost/AddNewPost';

class Posts extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.postsLoadingRef = React.createRef();
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
        filter: 'following'
    }

    // Fetch more posts from database according to page number
    fetchMoreData = () => {
        if (this.postsLoadingRef.current)
            this.postsLoadingRef.current.style.display = 'block';

        // const currentFilter = this.state.filter;

        axios.get("/api/restricted-users/get-posts-with-page/?page=" + this.state.page
                 + "&user_id=" + this.props.auth.user.id + "&filter=" + this.state.filter).then(response => {
            if (this._isMounted) {
                    // Check if there were any new posts added after mounting this component which would 
                    // cause database array to shift and remove any duplicate elements from array
                    const newPostsArray = [...this.state.posts, ...response.data];
                    const newUniquePostsArray = Array.from(new Set(newPostsArray.map(a => a._id)))
                    .map(_id => {
                        return newPostsArray.find(a => a._id === _id);
                    })

                if (response.data.length > 0) {
                    this.postsLoadingRef.current.style.display = 'none';
                    // if (this.state.filter === currentFilter) {
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
                    // }
                } else {
                    this.postsLoadingRef.current.innerHTML = 'You\'ve seen all posts.';
                    // if (this.state.filter === currentFilter) {
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
                    // }
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
                    if (this.props.auth.user.isAdmin) {
                        this.setState({filter: 'all'}, () => {
                            this.fetchMoreData();
                        })
                    } else {
                        this.fetchMoreData();
                    }
                }
            }
        }
    }

    deleteSpecificElementFromArray = index => {
        const postsArrayCopy = [...this.state.posts];
        postsArrayCopy.splice(index, 1);
        this.setState({posts: postsArrayCopy}, () => {
            // Update the posts data in cache
            PageCacher.cachePageUpdate(null, [
                {name: 'posts', data: this.state.posts}
            ], 'Posts');
        });
    }

    componentDidMount() {
        this._isMounted = true;
        console.log(this.state.filter);
        // window.addEventListener('scroll', this.scrollListener); 

        // Set route name in state for "PageCacher.cachePageSaveScroll" to see while unmounting
        const fullThisRoute = window.location.href.split("/");
        fullThisRoute.splice(0,3);
        const thisRoute = fullThisRoute.join('/');
        this.setState({thisRoute});

        const cachedData = PageCacher.cachePageOnMount('Posts');
        const propertyNamesToBeCached = ['posts', 'page'];
        // console.log(cachedData);
  
        if (PageCacher.areAllPropertiesCached(propertyNamesToBeCached, cachedData.data)) {  
            this.setState({... cachedData.data}, () => {
                window.scrollTo(cachedData.scroll.scrollX, cachedData.scroll.scrollY);
                window.addEventListener('scroll', this.scrollListener);
            });
        } else {
            if (this.props.auth.user.isAdmin) {
                this.setState({filter: 'all'}, () => {
                    this.fetchMoreData();
                })
            } else {
                this.fetchMoreData();
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // Save the latest scroll position right before unmounting
        PageCacher.cachePageSaveScroll(this.state.thisRoute);
    }

    render() {
        return (
            <div className="posts-container">

                {/* <PostsFilter onClick={this.setMenuIconActive}
                    isShowAllActive={this.state.activeIcons.showAll}
                    isFollowingActive={this.state.activeIcons.following}
                    isMyPostsActive={this.state.activeIcons.myPosts}
                    changeFilter={this.changeFilter}></PostsFilter> */}

                <AddNewPost history={this.props.history} />

                 {/* <InfiniteScroll
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
                        > */}
                        
                        {/* Display fetched posts */}
                         {this.state.posts.map((data, index) => (
                            <Post   
                                    index={index}
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
                                    key={data._id}
                                    deleteSpecificElementFromArray={this.deleteSpecificElementFromArray}
                                    ></Post>
                        ))}

                        <h4 className="user-profile-page-posts-loading" ref={this.postsLoadingRef}>
                            Loading...
                        </h4>
                {/* </InfiniteScroll> */}
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