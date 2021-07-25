import React, { Component } from 'react';
import './Modal.scss';
import { connect } from "react-redux";
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Following from '../Following/Following';

class Modal extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.mainModal = React.createRef();
        this.mainWindow = React.createRef();
        this.state = {
            following: [],
            page: 0,
            hasMore: true,
            userIdQueryParam: ''
        }
    }

    goBackCloseModal = (e) => {
        if (this._isMounted) 
            this.props.closeFollowingModal();
    }

    closeWithBackdrop = e => {
        if (this.mainModal) {
            if (e.target === this.mainModal.current) {
                if (this._isMounted) {
                    this.props.closeFollowingModal();
                }
            }
        }
    }

    getFollowingData = () => {
        let dataToSend = {};
        const userIdQueryParam = window.location.href.split("/").pop();
        dataToSend.user_id = userIdQueryParam;
        dataToSend.page = this.state.page;

        axios.post("/api/restricted-users/get-user-following", dataToSend).then(response => {
            // Check if there were any new followers added after mounting this component which would 
            // cause database array to shift and remove any duplicate elements from array
            const newFollowingArray = [...this.state.following, ...response.data];
            const newUniqueFollowingArray = Array.from(new Set(newFollowingArray.map(a => a._id)))
            .map(_id => {
                return newFollowingArray.find(a => a._id === _id);
            });

            if (response.data.length > 0) {
                if (this._isMounted) {
                    this.setState({
                        // posts: this.state.posts.concat(response.data),
                        following: newUniqueFollowingArray,
                        page: this.state.page + 10
                    });
                }
            } else {
                if (this._isMounted) {
                    this.setState({
                        hasMore: false
                    });
                }
            }
        }).catch( err => {
            console.log(err);
        });
    }

    componentDidUpdate() {
        const userIdQueryParam = window.location.href.split("/").pop();

        if (this.state.userIdQueryParam !== userIdQueryParam) {
            if (this._isMounted) {
                this.setState({userIdQueryParam, following: [],
                    page: 0,
                    hasMore: true}, () => this.getFollowingData());
            }
        }
    }

    componentDidMount() {
        this.getFollowingData();
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return  (
            <div className={`modal-component ${this.props.showFollowingModal ? 'open' : ''}`} 
             ref={this.mainModal} onClick={this.closeWithBackdrop}>
                <div className="modal-component-window" ref={this.mainWindow}>
                    <div className="modal-component-header">
                        Following
                    <button className="modal-component-close" onClick={this.goBackCloseModal}>&times;</button>
                </div>
                    <div className="modal-component-body">
                        <InfiniteScroll
                                                    height="100%"
                                                    dataLength={this.state.following.length}
                                                    next={this.getFollowingData}
                                                    hasMore={this.state.hasMore}
                                                    loader={<h4>Loading...</h4>}
                                                    endMessage={
                                                        <p style={{ textAlign: "center" }}>
                                                        <b><br />You have seen it all !</b>
                                                        </p>
                                                    }
                                                    >
                                                    
                                                    {/* Display fetched posts */}
                                                    {this.state.following.map((data, index) => (

                                                        <Following   
                                                                user_id={data._id}
                                                                profile_img={data.avatarImage}
                                                                name={data.name}
                                                                key={data._id}
                                                                history={this.props.history}></Following>

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
  )(Modal);