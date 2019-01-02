import React from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import NavMenu from 'components/NavMenu';
import UploadsList from 'components/UploadsList';

class UploadsScreen extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <NavMenu />
        <ScreenWrapper title='My uploads' titleCenter>
          <UploadsList />
        </ScreenWrapper>
      </React.Fragment>
    );
  }
}

export {UploadsScreen};
