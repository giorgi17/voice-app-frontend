import React, {Component} from 'react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import './ProfileImageCrop.css';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { Alert, AlertTitle } from '@material-ui/lab';
import { connect } from "react-redux";

const MAX_IMAGE_SIZE = 1024 * 1024 * 16;

class ProfileImageCrop extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.moreThan16mbRef = React.createRef();
        this.gifWontBeCroppedRef = React.createRef();
        this.imageNotSetRef = React.createRef();
        this.imageWrongExtensionRef = React.createRef();
        this.imageUploadSuccessRef = React.createRef();
        this.imageUploadErrorRef = React.createRef();
        this.state = {
            image: null,
            pixelCrop: null,
            src: null,
            imageBlobSrc: null,
            blob: null,
            originalFileName: null,
            imageType: null,
            imageSize: null,
            crop: {
                x: 10,
                y: 10,
                // width: 30,
                // height: 30,
                aspect: 4/4
            }
        }
    }

    // Get current picture url to be deleted in aws s3 after updating
    getCurrentImagePath = path => {
      let split = path.split('/');
      const currentImageFileNameInAwsS3 = split[3] + "/" + split[4];
      return decodeURIComponent(currentImageFileNameInAwsS3);
    }

    // Convert base64 to blob
    b64toBlob = dataURI => {
      var byteString = atob(dataURI.split(',')[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
  
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: this.state.imageType });
    }

    // Upload the image 
    uploadAvatarImage = async () => {
      // Check if image is not more than 16mb
      if (this.state.imageSize >= MAX_IMAGE_SIZE){
        this.moreThan16mbRef.current.style.display = 'flex';
        return;
      }
      // Check image is selected or cropped and show warning if not
      if (!this.state.blob || !this.state.originalFileName) {
        this.imageNotSetRef.current.style.display = 'flex';
        return;
      } else {
        this.imageNotSetRef.current.style.display = 'none';
      }
      
      // Check if currently chosen picture is in right format
      if (this.state.imageType !== 'image/gif' && this.state.imageType !== 'image/png'
      && this.state.imageType !== 'image/jpeg' && this.state.imageType !== 'image/jpg'){
        this.imageWrongExtensionRef.current.style.display = 'flex';
        return;
      } else {
        this.imageWrongExtensionRef.current.style.display = 'none';
      }
      // Set parameters to be sent to backend
      const form = new FormData();
      form.append("avatarPicture", this.state.blob);
      form.append("avatarPictureOriginalName", this.state.originalFileName);
      form.append("id", this.props.auth.user.id);
      form.append("currentPicturePath", this.getCurrentImagePath(this.props.avatarImageFullPath));
      
      axios
        .post("http://localhost:8888/api/restricted-users/update-user-avatar-picture", form)
        .then(res => {
            // console.log("RESPONSE - " + res);
            // console.log(res.data);
            if (this._isMounted) {
              this.imageUploadSuccessRef.current.style.display = 'flex';
              this.imageUploadErrorRef.current.style.display = 'none';
            }
        }) 
        .catch(err => {
            // console.log("ERROR RESPONSE - " + err);
            // console.log(err);
            if (this._isMounted) {
              this.imageUploadSuccessRef.current.style.display = 'none';
              this.imageUploadErrorRef.current.style.display = 'flex';
            }
        });
    }

    // Crop image or turn gif into blob to be uploaded
    getCroppedImg = (image, pixelCrop, fileName) => {
        // Check if currently chosen picture is in right format
        if (this.state.imageType !== 'image/gif' && this.state.imageType !== 'image/png'
        && this.state.imageType !== 'image/jpeg' && this.state.imageType !== 'image/jpg'){
          this.imageWrongExtensionRef.current.style.display = 'flex';
          return;
        } else {
          this.imageWrongExtensionRef.current.style.display = 'none';
        }

        // Check if all variables are set
        if (!image || !pixelCrop || !fileName)
          return

        // Hide picture not chosen/cropped error
        this.imageNotSetRef.current.style.display = 'none';

        // If image is a gif, it won't be cropped and will be uploaded directly
        if (this.state.imageType === 'image/gif') {
          this.gifWontBeCroppedRef.current.style.display = 'flex';
          // Check if image is not more than 16mb
          if (this.state.imageSize >= MAX_IMAGE_SIZE){
            this.moreThan16mbRef.current.style.display = 'flex';
            return;
          } else {
            this.moreThan16mbRef.current.style.display = 'none';
          }

          // Turn gif base64 into blob
          const blob = this.b64toBlob(this.state.src);
          const url = URL.createObjectURL(blob);
          this.setState({
            imageBlobSrc: url,
            blob: blob
          });
          return;
        } 

        // If image is not a gif, drawing on canvas and returning cropped blob
        this.gifWontBeCroppedRef.current.style.display = 'none';

        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');
       
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        // As Base64 string
        // const base64Image = canvas.toDataURL(this.state.imageType);
        // let base64result = base64Image.split(',')[1];
        // console.log("this is base 64 - " + base64result);

        // As a blob
        const promise = new Promise((resolve, reject) => {
                canvas.toBlob(file => {
                    if (!file)
                      return
                    // Check if image is not more than 16mb
                    if (file.size >= MAX_IMAGE_SIZE) {
                      this.moreThan16mbRef.current.style.display = 'flex';
                    }
                    file.name = fileName;
                    const url = URL.createObjectURL(file);
                    this.setState({
                      imageBlobSrc: url,
                      blob: file,
                      imageSize: file.size
                    });
                    resolve(file);
                  }, this.state.imageType);
        });
        return promise;
    }

    onSelectFile = async e => {
        if (e.target.files && e.target.files.length > 0) {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            () =>
              this.setState({
                src: reader.result
              }),
            false
          );
          reader.readAsDataURL(e.target.files[0]);
          
          await this.setState({
            imageType: e.target.files[0].type,
            originalFileName: e.target.files[0].name,
            imageSize: e.target.files[0].size
          });

        // Check if currently chosen picture is in right format
        if (this.state.imageType !== 'image/gif' && this.state.imageType !== 'image/png'
        && this.state.imageType !== 'image/jpeg' && this.state.imageType !== 'image/jpg'){
          this.imageWrongExtensionRef.current.style.display = 'flex';
          return;
        } else {
          this.imageWrongExtensionRef.current.style.display = 'none';
        }

        }
    }

    onImageLoaded = image => {
        this.setState({image: image});
        this.imageUploadSuccessRef.current.style.display = 'none';
        this.imageUploadErrorRef.current.style.display = 'none';
    }

    onCropComplete = async (crop, pixelCrop) => {
        this.setState({pixelCrop: pixelCrop});
        const croppedImg = await this.getCroppedImg(this.state.image, this.state.pixelCrop, "pic");
    }

    onCropChange = crop => {
        this.setState({ crop });
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
                <img src={this.state.imageBlobSrc} width="91px" height="91px" id="responsive-cropped_image_preview" />
              <div id="responsive-cropped_image_file_input">
                <input type="file" onChange={this.onSelectFile} />
              </div>
              {this.state.src && (
                <ReactCrop
                  src={this.state.src}
                  crop={this.state.crop}
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                />
              )}

              <Alert severity="error" id="responsive-profile-edit-picture-cropper-error" className="responsive-profile-edit-picture-cropper-alert" ref={this.moreThan16mbRef}>
                <AlertTitle>Error</AlertTitle>
                Image can't be more than 16mb.
              </Alert>

              <Alert severity="warning" id="responsive-profile-edit-picture-cropper-warning" className="responsive-profile-edit-picture-cropper-alert" ref={this.gifWontBeCroppedRef}>
                <AlertTitle>Warning</AlertTitle>
                Gif won't be cropped.
              </Alert>

              <Alert severity="error" id="responsive-profile-edit-picture-cropper-error-uploading" className="responsive-profile-edit-picture-cropper-alert" ref={this.imageNotSetRef}>
                <AlertTitle>Error</AlertTitle>
                Please choose and crop an image.
              </Alert>

              <Alert severity="error" id="responsive-profile-edit-picture-cropper-error-wrong-extension" className="responsive-profile-edit-picture-cropper-alert" ref={this.imageWrongExtensionRef}>
                <AlertTitle>Error</AlertTitle>
                Please only choose png, jpeg, jpg or gif.
              </Alert>

              <Alert severity="success" id="responsive-profile-edit-picture-cropper-success" className="responsive-profile-edit-picture-cropper-alert" ref={this.imageUploadSuccessRef}>
                <AlertTitle>Success</AlertTitle>
                Successfully uploaded new profile image.
              </Alert>

              <Alert severity="error" id="responsive-profile-edit-picture-cropper-error-while-upload" className="responsive-profile-edit-picture-cropper-alert" ref={this.imageUploadErrorRef}>
                <AlertTitle>Error</AlertTitle>
                Error while uploading image.
              </Alert>

              <Button variant="contained" type="submit" id="responsive-profile-edit-picture-cropper-button"
              onClick={this.uploadAvatarImage} className="profile-edit-activity-info-inputs" color="primary">Update picture</Button>
            </React.Fragment>
          )
    }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(ProfileImageCrop);
