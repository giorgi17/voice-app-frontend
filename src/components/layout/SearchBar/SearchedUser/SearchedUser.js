import React, {Component} from 'react';
import './SearchedUser.css';
import { withRouter } from 'react-router-dom';

class SearchedUser extends Component {
    constructor() {
        super();
    }
    
    // openSearchedUserProfile = () => {
    //     const queryParams = 'userId=' + this.props.user_id;
    //     this.props.closeSearchPanel();
    //     this.props.history.push(`/dashboard?${queryParams}`);
    // }

    goToUserProfile = () => {
        this.props.history.push(`/profile/${this.props.user_id}`);
    }

    render() {
        return ( <React.Fragment>
                    <div className="user-search-result-profile-info-wrapper" onClick={this.goToUserProfile}>
                        <div className="user-search-result-profile-image-wrapper">
                            <img src={this.props.avatarImage} />
                        </div>
                
                        <div className="user-search-result-profile-username">
                        <strong>Username:</strong> {this.props.name}
                        </div>
                
                        <hr></hr>
                    </div>
                </React.Fragment>);
    }
} 

export default withRouter(SearchedUser);