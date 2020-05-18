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

    constructor() {
        super();
        this.recordButtonRef = React.createRef();
        this.afterAddPostMessageRef = React.createRef();
        this.addNewPostContainerRef = React.createRef();
        this.afterAddPostSuccessMessageRef = React.createRef();
        this.recordedTimeDisplayRef = React.createRef();
        this.state = {
            recording: false,
            audioBlobUrl: '',
            audioBlob: null,
            imageBlob: null,
            description: '',
            deviceFound: false,
            postImageSrc: 'https://voice-social-network.s3.us-east-2.amazonaws.com/post-pictures/stripes.png',
            recordButtonText: 'Record',
            afterMessage: null,
            timer: new EasyTimer(),
            currentRecordedTime: '00:00:00'
        }
      }

    changeAudioBlob = audioBlob => {
        this.setState({audioBlob: audioBlob});
    }

    changeRecording = () => {
        this.setState({recording: !this.state.recording});
    }

    deviceNotFound = () => {
        this.setState({deviceFound: false});
    }

    deviceFound = () => {
        this.setState({deviceFound: true});
    }

    changeFileName = (NewAudioBlobUrl) => {
        this.setState({audioBlobUrl: NewAudioBlobUrl});
    }

    changeRecordButtonText = text => {
        this.setState({recordButtonText: text});
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
        .post("/api/restricted-users/add-new-post", form)
        .then(res => {
            // hide everything and show the success message
            this.addNewPostContainerRef.current.style.display = 'none';
            this.afterAddPostSuccessMessageRef.current.style.display = 'block';
            this.setState({afterMessage: res.data});

            // Bring back to adding new post after couple of seconds
            setTimeout(() => {
                this.addNewPostContainerRef.current.style.display = 'block';
                this.afterAddPostSuccessMessageRef.current.style.display = 'none';
            }, 3000);

            // Clear the inputs for new post
            this.setState({imageBlob: null, audioBlob: null,
                         description: '', audioBlobUrl: '',
                         postImageSrc: 'https://voice-social-network.s3.us-east-2.amazonaws.com/post-pictures/stripes.png' });
        }) 
        .catch(err => {
            // hide everything and show the error message
            this.addNewPostContainerRef.current.style.display = 'none';
            this.afterAddPostMessageRef.current.style.display = 'block';
            this.setState({afterMessage: err.response.data.errors});

            // Bring back to adding new post after couple of seconds
            setTimeout(() => {
                this.addNewPostContainerRef.current.style.display = 'block';
                this.afterAddPostMessageRef.current.style.display = 'none';
            }, 3000);
        });
    };

    handleRecordedTimeDisplay = () => {
        if (this.recordedTimeDisplayRef.current) {
            if (this.recordedTimeDisplayRef.current.style.display === 'block') {
                this.recordedTimeDisplayRef.current.style.display = 'none';
                this.state.timer.stop();
                this.setState({currentRecordedTime: '00:00:00'});
            } else if (this.recordedTimeDisplayRef.current.style.display === 'none' || this.recordedTimeDisplayRef.current.style.display === '') {
                this.recordedTimeDisplayRef.current.style.display = 'block';
                this.state.timer.start();
                this.state.timer.addEventListener('secondsUpdated', (e) => {
                    this.setState({currentRecordedTime: this.state.timer.getTimeValues().toString()});
                });
            }
        }
    }

    render() {
        return (
            <div className="recordvoice-view-container">
                <div id="add-post-message-after" ref={this.afterAddPostMessageRef}>
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        <strong>{this.state.afterMessage}</strong>
                    </Alert>
                </div>
                <div id="add-post-message-after-success" ref={this.afterAddPostSuccessMessageRef}>
                    <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        <strong>{this.state.afterMessage}</strong>
                    </Alert>
                </div>
                
                <div id="add-post-container" ref={this.addNewPostContainerRef}>
                    <div id="recordvoice-view-post-button" onClick={this.addNewPostHandler}>
                        <span id="recordvoice-view-post-button-label">Post</span>
                        <span className="material-icons recordvoice-view-post-button-label-icon">
                            forward
                        </span>
                    </div>
                    <h3>Record</h3>
                    <div id="recordvoice-view-post-picture-and-record-container">
                        <img src={this.state.postImageSrc} id="recordvoice-view-post-image"></img>
                        <div ref={this.recordButtonRef} id="recordvoice-view-record-button" onClick={() => {startRecording(this.state, this.changeFileName, this.deviceNotFound, this.deviceFound, this.changeRecording, this.changeRecordButtonText, this.changeAudioBlob);
                            this.handleRecordedTimeDisplay();}}>
                            {this.state.recordButtonText}
                        </div>
                    </div>

                    <div id="recordvoice-view-recorded-time" ref={this.recordedTimeDisplayRef}>
                        <span className="material-icons recordvoice-view-recorded-time-recording-icon">
                            fiber_manual_record
                        </span>
                        {this.state.currentRecordedTime}
                    </div>

                    <div id="recordvoice-view-player-container">
                        <Player audioFile={this.state.audioBlobUrl} />
                        {/* <Player audioFile="https://voice-social-network.s3.us-east-2.amazonaws.com/posts-audio/bensound-summer.mp3" /> */}
                    </div>
                    
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
                        <div id="recordvoice-view-post-image-icon">
                            <span className="material-icons">
                            insert_photo
                            </span>
                        </div>
                    </FilePicker>
                    <div id="recordvoice-view-post-description-input-container">
                        <TextField
                            id="recordvoice-view-post-description-input"
                            label="Description"
                            multiline
                            rows={10}
                            placeholder="Write description"
                            variant="outlined"
                            value={this.state.description}
                            onChange={this.descriptionInputHandler}
                            />
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