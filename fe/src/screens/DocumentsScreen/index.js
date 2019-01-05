import React from 'react';
import {connect} from 'react-redux';
import ScreenWrapper from 'components/ScreenWrapper';
import NavMenu from 'components/NavMenu';
import {permissionsActions} from 'redux/actions/permissions';
// import UploadsList from 'components/UploadsList';

class DocumentsScreenComponent extends React.Component {
  componentDidMount() {
    this.props.getPermissions();
  }

  render() {
    return (
      <React.Fragment>
        <NavMenu />
        <ScreenWrapper title='My documents' titleCenter>
          {/* <UploadsList /> */}
        </ScreenWrapper>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getPermissions: () => dispatch(permissionsActions.getPermissions()),
});

const DocumentsScreen = connect(
  null,
  mapDispatchToProps,
)(DocumentsScreenComponent);

export {DocumentsScreen};
