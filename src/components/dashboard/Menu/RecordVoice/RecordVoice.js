import React, { Component } from "react";
import './RecordVoice.css';
import VoiceRecorder, {startRecording} from './VoiceRecorder/VoiceRecorder';
import Player from './Player/Player';

class RecordVoice extends Component {

    constructor() {
        super();
        this.state = {
            recording: false,
            fileUrl: '',
            deviceFound: false
        }
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

    changeFileName = (newFileName) => {
        this.setState({fileUrl: newFileName});
    }

    render () {
        return (
            <React.Fragment>
            <div id="record-voice-container" 
                className={`menu-item ${this.props.isRecordVoiceActive ? "active" : ""}`}
                onClick={() => {startRecording(this.state, this.changeFileName, this.deviceNotFound, this.deviceFound, this.changeRecording); this.props.onClick("recordVoice")}} >
                <span className={`material-icons record-voice-icon ${this.props.isRecordVoiceActive ? "active" : ""}`} >
                    mic
                </span>
            </div>
    
            {/* <Player audioFile={this.state.fileUrl} /> */}
            </React.Fragment>
        );
    }
    
};

export default RecordVoice;