import React, { Component } from "react";
import './RecordVoice.css';
import RecordVoiceView from './RecordVoiceView/RecordVoiceView';

const RecordVoice = props => {

    
        return (
            <React.Fragment>
                <div id="record-voice-container" 
                    className={`responsive-menu-item ${props.isRecordVoiceActive ? "active" : ""}`}
                    onClick={() => {props.onClick("recordVoice"); props.changeDisplayedContent(<RecordVoiceView></RecordVoiceView>);
                                props.handleScroll();}} >
                    <span className={`material-icons record-voice-icon ${props.isRecordVoiceActive ? "active" : ""}`} >
                        mic
                    </span>
                </div>
            </React.Fragment>
        );
    
    
};

export default RecordVoice;