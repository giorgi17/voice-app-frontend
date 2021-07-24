import React, { Component } from 'react';
import './Followings.css';
import { connect } from "react-redux";
import Following from './Following/Following';
import axios from 'axios';
import PageCacher from '../../../../utils/PageCacher';
import MenuResponsive from '../../MenuResponsive/Menu';

class Followings extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.followingLoadingRef = React.createRef();
        this.state = {
            following: [],
            page: 0,
            hasMore: true,
            userIdQueryParam: ''
        }
    }

    getFollowingData = () => {
        let dataToSend = {};
        // dataToSend.user_id = this.props.userId;
        // const userIdQueryParam = window.location.href.split("/").pop();
        const params = this.props.match.params;

        if (!params.userId)
            return;

        dataToSend.user_id = params.userId;
        dataToSend.page = this.state.page;

        if (this.followingLoadingRef.current)
            this.followingLoadingRef.current.style.display = 'block';

        axios.post("http://localhost:8888/api/restricted-users/get-user-following", dataToSend).then(response => {
            // Check if there were any new followers added after mounting this component which would 
            // cause database array to shift and remove any duplicate elements from array
            const newFollowingArray = [...this.state.following, ...response.data];
            const newUniqueFollowingArray = Array.from(new Set(newFollowingArray.map(a => a._id)))
            .map(_id => {
                return newFollowingArray.find(a => a._id === _id);
            });
            console.log(response.data);
            if (response.data.length > 0) {
                if (this._isMounted) {
                    this.followingLoadingRef.current.style.display = 'none';
                    this.setState({
                        // posts: this.state.posts.concat(response.data),
                        following: newUniqueFollowingArray,
                        page: this.state.page + 10
                    }, () => {
                        PageCacher.cachePageUpdate(null, [
                            {name: 'hasMore', data: this.state.hasMore},
                            {name: 'following', data: this.state.following},
                            {name: 'page', data: this.state.page}
                        ], 'Following');
                        window.addEventListener('scroll', this.scrollListener); 
                    });
                }
            } else {
                if (this._isMounted) {
                    this.followingLoadingRef.current.innerHTML = 'You\'ve seen all followings.';
                    this.setState({
                        hasMore: false
                    }, () => {
                        PageCacher.cachePageUpdate(null, [
                            {name: 'hasMore', data: this.state.hasMore},
                            {name: 'following', data: this.state.following},
                            {name: 'page', data: this.state.page}
                        ],
                        'Following');
                        window.addEventListener('scroll', this.scrollListener); 
                    });
                }
            }
        }).catch( err => {
            console.log(err);
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
                    this.getFollowingData();
                }
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

        const cachedData = PageCacher.cachePageOnMount('Following');
        const propertyNamesToBeCached = ['following', 'page', 'hasMore'];

        if (PageCacher.areAllPropertiesCached(propertyNamesToBeCached, cachedData.data)) {
            console.log("CACHED!");
            this.setState({...cachedData.data}, () => {
                window.scrollTo(cachedData.scroll.scrollX, cachedData.scroll.scrollY);
                window.addEventListener('scroll', this.scrollListener); 
                if (!this.state.hasMore) {
                    this.followingLoadingRef.current.innerHTML = 'You\'ve seen all followings.';
                    this.followingLoadingRef.current.style.display = 'block';
                } 
            });
        } else {
            console.log("NOT CACHED!");
            // Getting query parameter
            // const parsed = queryString.parse(window.location.search);
            const params = this.props.match.params;
            if (params.userId) {
                this.setState({userIdQueryParam: params.userId}, () => {
                    PageCacher.cachePageUpdate(null, [{name: 'userIdQueryParam', data: this.state.userIdQueryParam}],
                             'Following')
                    this.getFollowingData();
                });
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
                <React.Fragment>
                    <MenuResponsive history={{...this.props.history}} />

                    <div className="responsive-menu-section-name">
                        <span className="material-icons" onClick={() => this.props.history.goBack()}>
                            arrow_back_ios
                        </span>

                       <div className="user-profile-page-user-following-responsive-section-name">
                            Following
                       </div>
                    </div>

                <div className="user-profile-page-user-following-responsive"> 
                    {/* Display fetched followings */}
                    {this.state.following.map((data, index) => (                
                        <Following   
                                user_id={data._id}
                                profile_img={data.avatarImage}
                                name={data.name}
                                key={data._id}
                                history={this.props.history}></Following>

                        ))}

                    <h4 className="user-profile-page-user-following-responsive-loading" ref={this.followingLoadingRef}>
                        Loading...
                    </h4>

                    {/* <Modal history={this.props.history} userId={this.props.match.params.userId} /> */}
                </div>
                </React.Fragment>
            );
        }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(Followings);