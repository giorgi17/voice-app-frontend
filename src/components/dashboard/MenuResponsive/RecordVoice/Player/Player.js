import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const Player = (props) => {
    
    return (
        <AudioPlayer
        autoPlay
        src={props.audioFile}
        onPlay={e => console.log("onPlay")}
        // other props here
      />
    );
}

export default Player;