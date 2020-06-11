import React, { Component } from 'react';
import './AddNewPost.css';
import { connect } from "react-redux";
import axios from 'axios';
import RecordVoiceView from '../../Menu/RecordVoice/RecordVoiceView/RecordVoiceView';

class AddNewPost extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.openModalButtonRef = React.createRef();
        this.modalRef = React.createRef();
        this.modalCloseButtonRef = React.createRef();
        this.modalContentRef = React.createRef();
        this.state = {
   
        }
    }

    // When the user clicks on the button, open the modal
    newPostButtonClick = () => {
        console.log(window.innerWidth);
        if (window.innerWidth <= 600) {
            this.props.history.push('/new-post');
        } else {
            this.modalRef.current.style.display = "block";
            document.body.style.overflowY = "hidden";
        }
    }

    // When the user clicks on <span> (x), close the modal
    newPostModalClose = () => {
        this.modalRef.current.style.display = "none";
        document.body.style.overflowY = "auto";
    }

    overlayClick = e => {
        if (e.target.contains(this.modalRef.current))
            this.newPostModalClose();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <React.Fragment>
                <div className="add-new-post">
                    <div className="add-new-post-top">
                        <img src={this.props.auth.user.avatarImage} className="add-new-post-top-profile-picture"/>
                        <div className="add-new-post-top-post-open-button" ref={this.openModalButtonRef}
                            onClick={this.newPostButtonClick}>
                            <span className="add-new-post-top-post-open-button-label">Got something to say, {this.props.auth.user.name}?</span>
                            <span className="material-icons add-new-post-top-post-open-button-icon">
                                mic
                            </span>
                        </div>
                    </div>
                </div>

                
                <div id="add-new-post-myModal" className="add-new-post-modal" ref={this.modalRef} onClick={this.overlayClick}>
                    <div className="add-new-post-modal-content" ref={this.modalContentRef}>
                        <div className="add-new-post-modal-content-top">
                            <span className="add-new-post-content-title">Create post</span>
                            <span className="add-new-post-close" ref={this.modalCloseButtonRef}
                                onClick={this.newPostModalClose}>&times;</span>
                            <hr></hr>
                        </div>
                        
                        {/* <p>Some text in the Modal..</p> */}
                        <RecordVoiceView profile_picture={this.props.auth.user.avatarImage} postAdded={this.props.postAdded}/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(AddNewPost);
