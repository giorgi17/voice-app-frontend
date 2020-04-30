import React, {Component} from 'react';
import './SearchedUser.css';
import UserModal from '../../../dashboard/Posts/Post/UserModal/UserModal';

class SearchedUser extends Component {
    constructor() {
        super();
    }

    state = {
        modal: null
    }
    
    openModal = () => {
        const modal = (<UserModal closeModal={this.closeModal}
            user_id={this.props.user_id}></UserModal>);
        this.setState({modal: modal});
    }

    closeModal = () => {
        this.setState({modal: false});
    }

    render() {
        return ( <React.Fragment>
                    {this.state.modal}
                    <div className="user-search-result-profile-info-wrapper" onClick={this.openModal}>
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

export default SearchedUser;