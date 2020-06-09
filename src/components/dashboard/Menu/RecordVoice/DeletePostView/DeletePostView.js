import React, { Component } from 'react';
import './DeletePostView.css';
import axios from 'axios';
import { connect } from "react-redux";

class DeletePostView extends Component {
    constructor() {
        super();
        this.modalContainerRef = React.createRef();
        this.state = {
     
        }
    }

    // Delete post  
    DeletePostHandler = () => {
        // Set parameters to be sent to backend
        let dataToSend = {};
        dataToSend.user_id = this.props.auth.user.id;
        dataToSend.post_author_id = this.props.post_author_id;
        dataToSend.post_id = this.props.post_id;
  
          axios
          .post("/api/restricted-users/delete-post", dataToSend)
          .then(res => {
            console.log(res.data.message);
            this.props.deleteSpecificElementFromArray(this.props.index);
          }) 
          .catch(err => {

          });
      };

    overlayClick = e => {
        if (e.target.contains(this.modalContainerRef.current))
            this.props.closeDeleteModal();
    }

    render() {
        return (
            <div className="delete-post-view" ref={this.modalContainerRef}
                onClick={this.overlayClick}>

                <div className="delete-post-view-modal">
                    <span className="delete-post-view-modal-text">
                        Are you sure you want to delete this post?
                    </span>
                    <div className="delete-post-view-modal-button"
                        onClick={this.DeletePostHandler}>
                        Yes
                    </div>
                    <div className="delete-post-view-modal-button" 
                        onClick={this.props.closeDeleteModal}>
                        No
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
    // { logoutUser }
  )(DeletePostView);