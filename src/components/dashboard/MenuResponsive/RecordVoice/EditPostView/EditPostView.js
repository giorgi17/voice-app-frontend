import React, { Component } from 'react';
import './EditPostView.css';
import { FilePicker } from 'react-file-picker-preview';
import TextField from '@material-ui/core/TextField';
import { connect } from "react-redux";
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';
import PageCacher from '../../../../../utils/PageCacher';

class EditPostView  extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.afterAddPostMessageRef = React.createRef();
        this.addNewPostContainerRef = React.createRef();
        this.afterAddPostSuccessMessageRef = React.createRef();
        this.descriptionRef = React.createRef();
        this.state = {
            imageBlob: null,
            description: '',
            postImageSrc: 'https://voice-social-network.s3.us-east-2.amazonaws.com/post-pictures/stripes.png',
            afterMessage: null,
            profilePicture: '',
            username: '',
            post_id: '',
            post_author_id: '',
            indexQueryParam: '',
            cacheRouteQueryParam: ''
        }
      }

    changePostImage = image => {
        const url = URL.createObjectURL(image);
        if (this._isMounted) {
            this.setState({postImageSrc: url,
                        imageBlob: image
                        });
        }
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
        form.append("post_author_id", this.state.post_author_id);
        form.append("post_id", this.state.post_id);
        form.append("description", this.state.description);
  
          axios
          .post("/api/restricted-users/update-post", form)
          .then(res => {
              if (this._isMounted) {
                  console.log(res.data);
                  this.postEditEffect(res.data.picture, res.data.description, this.state.cacheRouteQueryParam);
                  
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

    fetchUserData = () => {
        let dataToSend = {};

        // Send id of the notification author to fetch his profile picture
        dataToSend.id = this.state.post_author_id;

        axios.post("/api/restricted-users/get-user-data", dataToSend).then(response => {
            if (this._isMounted) {
                this.setState({profilePicture: response.data.avatarImage,
                    username: response.data.name});
            }
        }).catch( err => {
            console.log(err.message);
        });
    }  

    // fetchUserProfilePicture = () => {
    //     let dataToSend = {};

    //     // Send id of the notification author to fetch his profile picture
    //     dataToSend.id = this.props.auth.user.id;

    //     axios.post("/api/restricted-users/get-user-profile-picture-for-notifications", dataToSend).then(response => {
    //         if (this._isMounted) {
    //             this.setState({profilePicture: response.data.avatarImage});
    //         }
    //     }).catch( err => {
    //         console.log(err.message);
    //     });
    // }  

    // Fetch single post to display
    fetchPostInfo = (post_id, post_author_id, cacheRouteQueryParam, indexQueryParam) => {
        // Set parameters to be sent to backend
        let dataToSend = {};
        dataToSend.user_id = this.props.auth.user.id;
        dataToSend.post_author_id = post_author_id;
        dataToSend.post_id = post_id;
  
          axios
          .post("/api/restricted-users/fetch-single-post", dataToSend)
          .then(res => {
            if (this._isMounted) {
                this.setState({postImageSrc: res.data.result.picture,
                    description: res.data.result.description, post_author_id, post_id, cacheRouteQueryParam,
                    indexQueryParam}, () => this.fetchUserData());
            }
          }) 
          .catch(err => {

          });
      };
    
    postEditEffect = (postPicture, postDescription, route) => {
        let cacheDataToUpdate = [
            {index: this.state.indexQueryParam, name: 'picture', data: postPicture},
            {index: this.state.indexQueryParam, name: 'description', data: postDescription}
        ]
        if (!postPicture) {
            cacheDataToUpdate = [
                {index: this.state.indexQueryParam, name: 'description', data: postDescription}
            ]
        }

        PageCacher.cachePageUpdate('posts', cacheDataToUpdate, 'Posts', true, route);
        // Update Dashboard posts so deleted post deosn't come up
        const cacheDataCopy = JSON.parse(localStorage.getItem('mainPageCacheObject'));
        if (cacheDataCopy.hasOwnProperty('dashboard')) {
            delete cacheDataCopy['dashboard'];
            localStorage.setItem('mainPageCacheObject', JSON.stringify(cacheDataCopy));
        }
    }

    goBackToDashboard = () => {
        this.props.history.goBack();
    }

    componentDidMount() {
        this._isMounted = true;
        const postIdQueryParam = this.props.match.params.postId;
        const postAuthorIdQueryParam = this.props.match.params.authorId;
        const indexQueryParam = this.props.match.params.index;
        const cacheRouteQueryParam = decodeURIComponent(this.props.match.params.cacheRoute);

        if (postIdQueryParam && indexQueryParam && postAuthorIdQueryParam)
            this.fetchPostInfo(postIdQueryParam, postAuthorIdQueryParam, cacheRouteQueryParam,
                indexQueryParam);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className="responsive-recordvoice-view-container">
                <div id="responsive-add-post-message-after" ref={this.afterAddPostMessageRef}>
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        <strong>{this.state.afterMessage}</strong>
                    </Alert>
                </div>
                <div id="responsive-add-post-message-after-success" ref={this.afterAddPostSuccessMessageRef}>
                    <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        <strong>{this.state.afterMessage}</strong>
                    </Alert>
                </div>
                
                <div id="responsive-add-post-container" ref={this.addNewPostContainerRef}>
                    <div className="responsive-upper-tab">
                        <div className="responsive-upper-tab-go-back-container">
                            <div className="responsive-upper-tab-go-back"
                                onClick={this.goBackToDashboard}>
                                <span className="material-icons">
                                arrow_back_ios
                                </span>
                            </div>
                            <div className="responsive-upper-tab-title">
                                Update post
                            </div>
                        </div>
                        
                        <div className="responsive-upper-tab-post-button" onClick={this.editPostHandler}>
                            <span className="material-icons">
                                maximize
                            </span>
                            Save
                        </div>
                    </div>

                    <div className="responsive-recordvoice-view-post-user-info">
                        <img src={this.state.profilePicture}></img>

                        <span className="responsive-recordvoice-view-post-user-info-username">
                            {this.state.username}
                        </span>
                    </div>
                    <hr></hr>


                    <div id="responsive-recordvoice-view-post-picture-and-record-container">                
                        <div id="responsive-recordvoice-view-post-image-wrapper">
                            <span className="material-icons" onClick={() => this.setState({ postImageSrc: 'https://voice-social-network.s3.us-east-2.amazonaws.com/post-pictures/stripes.png',
                                        imageBlob: null})}>
                                close
                            </span> 
                            <img src={this.state.postImageSrc} id="responsive-recordvoice-view-post-image"></img>
                        </div>

                        <div id="responsive-recordvoice-view-post-description-input-container">
                            <TextField
                                id="responsive-recordvoice-view-post-description-input"
                                label="Description"
                                multiline
                                rows={5}
                                placeholder="Write description"
                                variant="outlined"
                                value={this.state.description}
                                onChange={this.descriptionInputHandler}
                                inputRef={this.descriptionRef} 
                                />
                        </div>
                    </div>
                    
                    <div className="responsive-recordvoice-view-add-to-your-post-container">
                        <div className="responsive-recordvoice-view-add-to-your-post-icons">
                            <FilePicker
                            extensions={['image/jpg', 'image/jpeg', 'image/png', 'image/gif']}
                            maxSize={50}
                            dims={{minWidth: 50, maxWidth: 3000, minHeight: 50, maxHeight: 3000}}
                            onChange={blob => {this.changePostImage(blob)}}
                            onError={errMsg => (console.log(errMsg))}
                            onClear={() => this.setState({ postImageSrc: 'https://voice-social-network.s3.us-east-2.amazonaws.com/post-pictures/stripes.png',
                                        imageBlob: null})}
                            // triggerReset={console.log("RESET!")}
                        >
                                <div id="responsive-recordvoice-view-post-image-icon">
                                    <div className="responsive-recordvoice-view-post-image-icon-container">
                                        <span className="material-icons">
                                            insert_photo
                                        </span>
                                        <span id="responsive-recordvoice-view-post-image-icon-label">
                                            Photo
                                        </span>
                                    </div>
                                </div>
                            </FilePicker>

                            <hr></hr>
                           
                            <div id="responsive-recordvoice-view-post-description-icon-container">
                                <div id="responsive-recordvoice-view-post-description-icon" onClick={this.focusDescriptionTextInput}>
                                    <div className="responsive-recordvoice-view-post-description-icon-labels-container">
                                        <span className="material-icons">
                                            description
                                        </span>
                                        <span id="responsive-recordvoice-view-post-description-icon-label">
                                            Description
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="responsive-recordvoice-view-post-button" onClick={this.editPostHandler}>
                        <span id="responsive-recordvoice-view-post-button-label">Save</span>
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
  )(EditPostView );