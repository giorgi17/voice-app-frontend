import React, { Component } from 'react';
import './Followers.css';
import { connect } from "react-redux";
import Follower from './Follower/Follower';
import axios from 'axios';
import PageCacher from '../../../../utils/PageCacher';
import MenuResponsive from '../../MenuResponsive/Menu';

class Followers extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.followersLoadingRef = React.createRef();
        this.state = {
            followers: [],
            page: 0,
            hasMore: true,
            userIdQueryParam: ''
        }
    }

    getFollowersData = () => {
        let dataToSend = {};
        // dataToSend.user_id = this.props.userId;
        // const userIdQueryParam = window.location.href.split("/").pop();
        const params = this.props.match.params;

        if (!params.userId)
            return;

        dataToSend.user_id = params.userId;
        dataToSend.page = this.state.page;

        if (this.followersLoadingRef.current)
            this.followersLoadingRef.current.style.display = 'block';

        axios.post("http://localhost:8888/api/restricted-users/get-user-followers", dataToSend).then(response => {
            // Check if there were any new followers added after mounting this component which would 
            // cause database array to shift and remove any duplicate elements from array
            const newFollowersArray = [...this.state.followers, ...response.data];
            const newUniqueFollowersArray = Array.from(new Set(newFollowersArray.map(a => a._id)))
            .map(_id => {
                return newFollowersArray.find(a => a._id === _id);
            });
            console.log(response.data);
            if (response.data.length > 0) {
                if (this._isMounted) {
                    this.followersLoadingRef.current.style.display = 'none';
                    this.setState({
                        // posts: this.state.posts.concat(response.data),
                        followers: newUniqueFollowersArray,
                        page: this.state.page + 10
                    }, () => {
                        PageCacher.cachePageUpdate(null, [
                            {name: 'hasMore', data: this.state.hasMore},
                            {name: 'followers', data: this.state.followers},
                            {name: 'page', data: this.state.page}
                        ], 'Followers');
                        window.addEventListener('scroll', this.scrollListener); 
                    });
                }
            } else {
                if (this._isMounted) {
                    this.followersLoadingRef.current.innerHTML = 'You\'ve seen all followers.';
                    this.setState({
                        hasMore: false
                    }, () => {
                        PageCacher.cachePageUpdate(null, [
                            {name: 'hasMore', data: this.state.hasMore},
                            {name: 'followers', data: this.state.followers},
                            {name: 'page', data: this.state.page}
                        ],
                        'Followers');
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
                    this.getFollowersData();
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

        const cachedData = PageCacher.cachePageOnMount('Followers');
        const propertyNamesToBeCached = ['followers', 'page', 'hasMore'];

        if (PageCacher.areAllPropertiesCached(propertyNamesToBeCached, cachedData.data)) {
            console.log("CACHED!");
            this.setState({...cachedData.data}, () => {
                window.scrollTo(cachedData.scroll.scrollX, cachedData.scroll.scrollY);
                window.addEventListener('scroll', this.scrollListener); 
                if (!this.state.hasMore) {
                    this.followersLoadingRef.current.innerHTML = 'You\'ve seen all followers.';
                    this.followersLoadingRef.current.style.display = 'block';
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
                             'Followers')
                    this.getFollowersData();
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
                       <div className="user-profile-page-user-followers-responsive-section-name">
                            Followers
                       </div>
                    </div>

                    <div className="user-profile-page-user-followers-responsive"> 
                        
                        {/* Display fetched followers */}
                        {this.state.followers.map((data, index) => (                
                            <Follower   
                                    user_id={data._id}
                                    profile_img={data.avatarImage}
                                    name={data.name}
                                    key={data._id}
                                    history={this.props.history}></Follower>

                            ))}

                        <h4 className="user-profile-page-user-followers-responsive-loading" ref={this.followersLoadingRef}>
                            Loading...
                        </h4>
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
  )(Followers);