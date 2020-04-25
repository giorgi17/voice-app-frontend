import MicRecorder from 'mic-recorder-to-mp3';

// New instance
const recorder = new MicRecorder({
    bitRate: 128
  });
   
const VoiceRecorder = (props) => {
    startRecording(props);
    return null;
}

export const startRecording = (props, changeFileName, deviceNotFound, deviceFound, changeRecording, changeRecordButtonText, changeAudioBlob) => {
    if (!props.recording) {
        // Start recording. Browser will request permission to use your microphone.
        recorder.start().then(() => {
            // something else
            deviceFound();
            changeRecording();
            changeRecordButtonText("Stop");
        }).catch((e) => {
            console.error(e);
            deviceNotFound();
            alert("Microphone not found!");
        });
    } else {
        if (!props.deviceFound){
            alert("Microphone not found!");
            return;
        }
        changeRecordButtonText("Record");
        // Once you are done singing your best song, stop and get the mp3.
        recorder
        .stop()
        .getMp3().then(([buffer, blob]) => {

        // do what ever you want with buffer and blob
        // Example: Create a mp3 file and play
        // const file = new File(buffer, 'post-audio.mp3', {
        //     type: blob.type,
        //     lastModified: Date.now()
        // });

        // changeFileName(URL.createObjectURL(file));
        // Set recorded audio blob as blob state and blob url for player to play
        changeAudioBlob(blob);
        changeFileName(URL.createObjectURL(blob));
        // player.play();

        }).catch((e) => {
        alert('We could not retrieve your message');
        console.log(e);
        });

        changeRecording();
    }
} 

export default VoiceRecorder;