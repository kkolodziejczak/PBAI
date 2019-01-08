import React from 'react';
import Dropzone from 'react-dropzone';

const baseStyle = {
  width: 300,
  height: 200,
  padding: 20,
  marginLeft: 'auto',
  marginRight: 'auto',
  borderWidth: 2,
  borderColor: '#666',
  borderStyle: 'dashed',
  borderRadius: 5,
};
const activeStyle = {
  borderStyle: 'solid',
  borderColor: '#6c6',
  backgroundColor: '#eee',
};
const rejectStyle = {
  borderStyle: 'solid',
  borderColor: '#c66',
  backgroundColor: '#eee',
};

class DropzoneComponent extends React.Component {
  state = {
    file: null,
  };

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.setState({file: acceptedFiles[0]});
  };

  getFile = () => this.state.file;

  render() {
    const {file} = this.state;
    return (
      <Dropzone onDrop={this.onDrop} accept='text/plain'>
        {({getRootProps, getInputProps, isDragActive, isDragReject}) => {
          let styles = {...baseStyle};
          styles = isDragActive ? {...styles, ...activeStyle} : styles;
          styles = isDragReject ? {...styles, ...rejectStyle} : styles;
          return (
            <div {...getRootProps()} style={styles}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop files here...</p>
              ) : (
                <p>Try dropping some txt file here, or click to select file to upload.</p>
              )}
              {file && (
                <p>
                  <strong>Uploaded file: </strong>
                  {file.name}
                </p>
              )}
            </div>
          );
        }}
      </Dropzone>
    );
  }
}

export default DropzoneComponent;
