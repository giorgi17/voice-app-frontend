import React, {Component} from 'react';
import './SearchedUser.css';
import { withRouter } from 'react-router-dom';

class SearchedUser extends Component {
    constructor() {
        super();
        this.searchedUser = React.createRef();
        this.deleteUser = React.createRef();
    }
    
    // openSearchedUserProfile = () => {
    //     const queryParams = 'userId=' + this.props.user_id;
    //     this.props.closeSearchPanel();
    //     this.props.history.push(`/dashboard?${queryParams}`);
    // }

    goToUserProfile = e => {
        console.log(e.target);
        if (e.target !== this.deleteUser.current)
            this.props.history.push(`/profile/${this.props.user_id}`);
    }

    render() {
        return ( <React.Fragment>
                    <div className="user-search-result-profile-info-wrapper"
                     onClick={this.goToUserProfile} ref={this.searchedUser}>

                        <div className="user-search-result-profile-image-wrapper">
                            <img src={this.props.avatarImage} />
                        </div>
                
                        <div className="user-search-result-profile-username">
                        {/* <strong>Username:</strong> */}
                         {this.props.name}
                        </div>

                        <span className="material-icons user-search-result-profile-delete-user"
                            ref={this.deleteUser}>
                            cancel
                        </span>

                        <hr></hr>

                    </div>
                </React.Fragment>);
    }
} 

export default withRouter(SearchedUser);