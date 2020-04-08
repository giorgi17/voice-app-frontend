import MicRecorder from 'mic-recorder-to-mp3';

// New instance
const recorder = new MicRecorder({
    bitRate: 128
  });
   
const VoiceRecorder = (props) => {
    startRecording(props);
    return null;
}

export const startRecording = (props, changeFileName, deviceNotFound, deviceFound, changeRecording) => {
    if (!props.recording) {
            // Start recording. Browser will request permission to use your microphone.
            recorder.start().then(() => {
            // something else
            deviceFound();
        }).catch((e) => {
            console.error(e);
            deviceNotFound();
            alert("Microphone not found!");
        });

        changeRecording();
    } else {
        if (!props.deviceFound)
            alert("Microphone not found!");
        // Once you are done singing your best song, stop and get the mp3.
        recorder
        .stop()
        .getMp3().then(([buffer, blob]) => {

        // do what ever you want with buffer and blob
        // Example: Create a mp3 file and play
        const file = new File(buffer, 'me-at-thevoice.mp3', {
            type: blob.type,
            lastModified: Date.now()
        });

        changeFileName(URL.createObjectURL(file));
        // player.play();

        }).catch((e) => {
        alert('We could not retrieve your message');
        console.log(e);
        });

        changeRecording();
    }


    // Added
    // navigator.getUserMedia({ audio: true },
    //     () => {
    //       console.log('Permission Granted');
    //     //   this.setState({ isBlocked: false });
    //     },
    //     () => {
    //       console.log('Permission Denied');
    //     //   this.setState({ isBlocked: true })
    //     },
    //   );

    // navigator.mediaDevices.getUserMedia({ audio: true })
    //   .then(function(stream) {
    //     console.log('You let me use your mic!')
    //   })
    //   .catch(function(err) {
    //     console.log('No mic for you!')
    //   });
} 

// // Once you are done singing your best song, stop and get the mp3.
// recorder
// .stop()
// .getMp3().then(([buffer, blob]) => {
// // do what ever you want with buffer and blob
// // Example: Create a mp3 file and play
// const file = new File(buffer, 'me-at-thevoice.mp3', {
//     type: blob.type,
//     lastModified: Date.now()
// });

// const player = new Audio(URL.createObjectURL(file));
// player.play();

// }).catch((e) => {
// alert('We could not retrieve your message');
// console.log(e);
// });

export default VoiceRecorder;