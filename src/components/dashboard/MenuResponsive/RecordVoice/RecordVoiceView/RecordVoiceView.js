import React, { Component } from 'react';
import './RecordVoiceView.css';
import VoiceRecorder, {startRecording} from '../VoiceRecorder/VoiceRecorder';
import Player from '../Player/Player';
import { FilePicker } from 'react-file-picker-preview';
import TextField from '@material-ui/core/TextField';
import { connect } from "react-redux";
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';
import EasyTimer from "easytimer";

class RecordVoiceView extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.recordButtonRef = React.createRef();
        this.afterAddPostMessageRef = React.createRef();
        this.addNewPostContainerRef = React.createRef();
        this.afterAddPostSuccessMessageRef = React.createRef();
        this.recordedTimeDisplayRef = React.createRef();
        this.descriptionRef = React.createRef();
        this.state = {
            recording: false,
            audioBlobUrl: '',
            audioBlob: null,
            imageBlob: null,
            description: '',
            deviceFound: false,
            postImageSrc: 'https://guthme.s3.eu-central-1.amazonaws.com/post-pictures/stripes.png',
            recordButtonText: 'Record',
            afterMessage: null,
            timer: new EasyTimer(),
            currentRecordedTime: '00:00:00'
        }
      }

    changeAudioBlob = audioBlob => {
        if (this._isMounted) {
            this.setState({audioBlob: audioBlob});
        }
    }

    changeRecording = () => {
        if (this._isMounted) {
            this.setState({recording: !this.state.recording});
        }
    }

    deviceNotFound = () => {
        if (this._isMounted) {
            this.setState({deviceFound: false});
        }
    }

    deviceFound = () => {
        if (this._isMounted) {
            this.setState({deviceFound: true});
        }
    }

    changeFileName = (NewAudioBlobUrl) => {
        if (this._isMounted) {
            this.setState({audioBlobUrl: NewAudioBlobUrl});
        }
    }

    changeRecordButtonText = text => {
        if (this._isMounted) {
            this.setState({recordButtonText: text});
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

    // Send new post information 
    addNewPostHandler = () => {
        if (!this.state.audioBlob){
            alert("Voice not recorded!");
            return;      
        }
      // Set parameters to be sent to backend
      const form = new FormData();
      form.append("user_id", this.props.auth.user.id);
      form.append("postPicture", this.state.imageBlob);
      form.append("postSound", this.state.audioBlob);
      form.append("description", this.state.description);

        axios
        .post("http://localhost:8888/api/restricted-users/add-new-post", form)
        .then(res => {
            if (this._isMounted) {
                // hide everything and show the success message
                this.addNewPostContainerRef.current.style.display = 'none';
                this.afterAddPostSuccessMessageRef.current.style.display = 'block';
                this.setState({afterMessage: res.data.message});

                if (res.data.post.user_id === this.props.auth.user.id) {
                    const cacheDataCopy = JSON.parse(localStorage.getItem('mainPageCacheObject'));
                    if (cacheDataCopy.hasOwnProperty('profile/' + this.props.auth.user.id) ||
                        cacheDataCopy.hasOwnProperty('dashboard')) {

                        delete cacheDataCopy['profile/' + this.props.auth.user.id];
                        delete cacheDataCopy['dashboard'];
                        localStorage.setItem('mainPageCacheObject', JSON.stringify(cacheDataCopy));
                    }
                }

                // Bring back to adding new post after couple of seconds
                setTimeout(() => {
                    if (this._isMounted) {
                        this.addNewPostContainerRef.current.style.display = 'block';
                        this.afterAddPostSuccessMessageRef.current.style.display = 'none';
                    }
                }, 3000);

                // Clear the inputs for new post
                this.setState({imageBlob: null, audioBlob: null,
                            description: '', audioBlobUrl: '',
                            postImageSrc: 'https://guthme.s3.eu-central-1.amazonaws.com/post-pictures/stripes.png' });
            }
        }) 
        .catch(err => {
            if (this._isMounted) {
                // hide everything and show the error message
                this.addNewPostContainerRef.current.style.display = 'none';
                this.afterAddPostMessageRef.current.style.display = 'block';
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

    stopWatchEventListener = e => {
        this.setState({currentRecordedTime: this.state.timer.getTimeValues().toString()});
    }

    handleRecordedTimeDisplay = () => {
        if (this.recordedTimeDisplayRef.current) {
            if (this.recordedTimeDisplayRef.current.style.display === 'inline-block') {
                this.recordedTimeDisplayRef.current.style.display = 'none';
                this.state.timer.stop();
                this.state.timer.removeEventListener('secondsUpdated', this.stopWatchEventListener);
                this.setState({currentRecordedTime: '00:00:00'});
            } else if (this.recordedTimeDisplayRef.current.style.display === 'none' || this.recordedTimeDisplayRef.current.style.display === '') {
                    this.recordedTimeDisplayRef.current.style.display = 'inline-block';
                    this.state.timer.start();
                    this.state.timer.addEventListener('secondsUpdated', this.stopWatchEventListener);
            }
        }
    }

    focusDescriptionTextInput = () => {
        this.descriptionRef.current.focus();
    }    

    goBackToDashboard = () => {
        this.props.history.push('/dashboard');
    }

    componentDidMount() {
        this._isMounted = true;
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
                                Create post
                            </div>
                        </div>
                        
                        <div className="responsive-upper-tab-post-button" onClick={this.addNewPostHandler}>
                            <span className="material-icons">
                                maximize
                            </span>
                            Post
                        </div>
                    </div>

                    <div className="responsive-recordvoice-view-post-user-info">
                        <img src={this.props.auth.user.avatarImage}></img>

                        <span className="responsive-recordvoice-view-post-user-info-username">
                            {this.props.auth.user.name}
                        </span>
                    </div>
                    <hr></hr>
                    {/* <div id="recordvoice-view-post-button" onClick={this.addNewPostHandler}>
                        <span id="recordvoice-view-post-button-label">Post</span>
                        <span className="material-icons recordvoice-view-post-button-label-icon">
                            forward
                        </span>
                    </div> */}
                    {/* <h3>Record</h3> */}


                    <div id="responsive-recordvoice-view-post-picture-and-record-container">
                        <div className="responsive-recordvoice-view-post-picture-and-record-top">
                            <span className="responsive-recordvoice-view-post-picture-and-record-top-text">Got something to say, {this.props.auth.user.name}?</span>
                
                            <div ref={this.recordButtonRef} id="responsive-recordvoice-view-record-button" onClick={() => startRecording(this.state, this.changeFileName, this.deviceNotFound, this.deviceFound, this.changeRecording, this.changeRecordButtonText, this.changeAudioBlob, this.handleRecordedTimeDisplay)}>
           
                                    {this.state.recordButtonText}
                            </div>

                            <div id="responsive-recordvoice-view-recorded-time" ref={this.recordedTimeDisplayRef}>
                                <span className="material-icons responsive-recordvoice-view-recorded-time-recording-icon">
                                    fiber_manual_record
                                </span>
                                {this.state.currentRecordedTime}
                            </div>
                        </div>
                        
                        <div id="responsive-recordvoice-view-post-image-wrapper">
                            <span className="material-icons" onClick={() => this.setState({ postImageSrc: 'https://guthme.s3.eu-central-1.amazonaws.com/post-pictures/stripes.png',
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

                    {/* <div id="recordvoice-view-recorded-time" ref={this.recordedTimeDisplayRef}>
                        <span className="material-icons recordvoice-view-recorded-time-recording-icon">
                            fiber_manual_record
                        </span>
                        {this.state.currentRecordedTime}
                    </div> */}

                    <div id="responsive-recordvoice-view-player-container">
                        <Player audioFile={this.state.audioBlobUrl} />
                        {/* <Player audioFile="https://voice-social-network.s3.us-east-2.amazonaws.com/posts-audio/bensound-summer.mp3" /> */}
                    </div>
                    
                    <div className="responsive-recordvoice-view-add-to-your-post-container">
                        <div className="responsive-recordvoice-view-add-to-your-post-icons">
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

                    <div className={`responsive-recordvoice-view-post-button ${this.state.audioBlob ? "" : "responsive-recordvoice-view-post-button-not-set"}`} onClick={this.addNewPostHandler}>
                        <span id="responsive-recordvoice-view-post-button-label">Post</span>
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
  )(RecordVoiceView);