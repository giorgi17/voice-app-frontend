import React, { Component } from 'react';
import './EditPostView.css';
import { FilePicker } from 'react-file-picker-preview';
import TextField from '@material-ui/core/TextField';
import { connect } from "react-redux";
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';

class EditPostView extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.afterAddPostMessageRef = React.createRef();
        this.addNewPostContainerRef = React.createRef();
        this.afterAddPostSuccessMessageRef = React.createRef();
        this.descriptionRef = React.createRef();
        this.modalRef = React.createRef();
        this.state = {
            imageBlob: null,
            description: '',
            postImageSrc: '',
            afterMessage: null,
        }
      }

    changePostImage = image => {
        const url = URL.createObjectURL(image);
        this.setState({postImageSrc: url,
                       imageBlob: image
                      });
    }

    descriptionInputHandler = (e) => {
        this.setState({description: e.target.value});
    }

    // Get current picture url to be deleted in aws s3 after updating
    getCurrentImagePath = path => {
        let split = path.split('/');
        const currentImageFileNameInAwsS3 = split[3] + "/" + split[4];
        return decodeURIComponent(currentImageFileNameInAwsS3);
    }

    // Send new post information 
    editPostHandler = () => {
      // Set parameters to be sent to backend
      const form = new FormData();
      form.append("user_id", this.props.auth.user.id);
      form.append("postPicture", this.state.imageBlob);
      form.append("currentPicturePath", this.getCurrentImagePath(this.state.postImageSrc));
      form.append("post_author_id", this.props.post_author_id);
      form.append("post_id", this.props.post_id);
      form.append("description", this.state.description);

        axios
        .post("http://localhost:8888/api/restricted-users/update-post", form)
        .then(res => {
            if (this._isMounted) {
                this.props.postEditEffect(res.data.picture, res.data.description);
                
                // hide everything and show the success message
                this.addNewPostContainerRef.current.style.display = 'none';
                this.afterAddPostSuccessMessageRef.current.style.display = 'block';
                this.setState({afterMessage: res.data.message});

                // Bring back to adding new post after couple of seconds
                setTimeout(() => {
                    if (this._isMounted) {
                        this.addNewPostContainerRef.current.style.display = 'block';
                        this.afterAddPostSuccessMessageRef.current.style.display = 'none';
                    }
                }, 3000);
            }

        }) 
        .catch(err => {
            if (this._isMounted) {
                // hide everything and show the error message
                this.addNewPostContainerRef.current.style.display = 'none';
                this.afterAddPostMessageRef.current.style.display = 'block';
                console.log(err);
                if (err.response)
                    this.setState({afterMessage: err.response.data.errors});

                // Bring back to adding new post after couple of seconds
                setTimeout(() => {
                    if (this._isMounted) {
                        this.addNewPostContainerRef.current.style.display = 'block';
                        this.afterAddPostMessageRef.current.style.display = 'none';
                    }
                }, 3000);
            }
        });
    };

    focusDescriptionTextInput = () => {
        this.descriptionRef.current.focus();
    }    

    overlayClick = e => {
        if (e.target.contains(this.modalRef.current))
            this.props.closeEditModal();
    }

    componentDidMount() {
        this._isMounted = true;
        this.setState({postImageSrc: this.props.picture, description: this.props.description});
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div id="edit-post-myModal" className="edit-post-modal" ref={this.modalRef}
                onClick={this.overlayClick}>
                <div className="edit-post-modal-content">
                    <div className="edit-post-modal-content-top">
                        <span className="edit-post-content-title">Edit post</span>
                        <span className="edit-post-close"
                            onClick={this.props.closeEditModal}>&times;</span>
                        <hr></hr>
                    </div>
                    <div className="edit-recordvoice-view-container">
                        <div id="edit-add-post-message-after" ref={this.afterAddPostMessageRef}>
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                <strong>{this.state.afterMessage}</strong>
                            </Alert>
                        </div>
                        <div id="edit-add-post-message-after-success" ref={this.afterAddPostSuccessMessageRef}>
                            <Alert severity="success">
                                <AlertTitle>Success</AlertTitle>
                                <strong>{this.state.afterMessage}</strong>
                            </Alert>
                        </div>
                        
                        <div id="edit-add-post-container" ref={this.addNewPostContainerRef}>
                            <div className="edit-recordvoice-view-post-user-info">
                                <img src={this.props.profile_picture}></img>

                                <span className="edit-recordvoice-view-post-user-info-username">
                                    {this.props.user_name}
                                </span>
                            </div>

                            <div id="edit-recordvoice-view-post-picture-and-record-container">
                            
                                
                                <div id="edit-recordvoice-view-post-image-wrapper">
                                    <span className="material-icons" onClick={() => this.setState({ postImageSrc: 'https://guthme.s3.eu-central-1.amazonaws.com/post-pictures/stripes.png',
                                                imageBlob: null})}>
                                        close
                                    </span> 
                                    <img src={this.state.postImageSrc} id="edit-recordvoice-view-post-image"></img>
                                </div>

                                <div id="edit-recordvoice-view-post-description-input-container">
                                    <TextField
                                        id="edit-recordvoice-view-post-description-input"
                                        label="Description"
                                        multiline
                                        rows={10}
                                        placeholder="Write description"
                                        variant="outlined"
                                        value={this.state.description}
                                        onChange={this.descriptionInputHandler}
                                        inputRef={this.descriptionRef} 
                                        />
                                </div>
                            </div>
                            
                            <div className="edit-recordvoice-view-add-to-your-post-container">
                                <span>Add to your post</span>

                                <div className="edit-recordvoice-view-add-to-your-post-icons">
                                    <FilePicker
                                    extensions={['image/jpg', 'image/jpeg', 'image/png', 'image/gif']}
                                    maxSize={50}
                                    dims={{minWidth: 50, maxWidth: 3000, minHeight: 50, maxHeight: 3000}}
                                    onChange={blob => {this.changePostImage(blob)}}
                                    onError={errMsg => (console.log(errMsg))}
                                    onClear={() => this.setState({ postImageSrc: 'https://guthme.s3.eu-central-1.amazonaws.com/post-pictures/stripes.png',
                                                imageBlob: null})}
                                    // triggerReset={console.log("RESET!")}
                                >
                                        <div id="edit-recordvoice-view-post-image-icon">
                                            <span className="material-icons">
                                                insert_photo
                                            </span>
                                        </div>
                                    </FilePicker>

                                    <div id="edit-recordvoice-view-post-description-icon" onClick={this.focusDescriptionTextInput}>
                                        <span className="material-icons">
                                            description
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="edit-recordvoice-view-post-button" onClick={this.editPostHandler}>
                                <span id="edit-recordvoice-view-post-button-label">Save</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
    // { logoutUser }
  )(EditPostView);