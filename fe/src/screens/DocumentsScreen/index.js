import React from 'react';
import {connect} from 'react-redux';
import Spinner from 'react-activity/lib/Spinner';
import ScreenWrapper from 'components/ScreenWrapper';
import NavMenu from 'components/NavMenu';
import {permissionsActions} from 'redux/actions/permissions';
import DocumentsList from 'components/DocumentsList';
import ShareForm from 'components/ShareForm';

class DocumentsScreenComponent extends React.Component {
  state = {
    sharingDoc: null,
  };

  componentDidMount() {
    this.props.getPermissionsAndDocuments();
  }

  _renderConent = () => {
    const {sharingDoc} = this.state;
    if (sharingDoc) {
      return <ShareForm doc={sharingDoc} />;
    }
    const {documents} = this.props;
    return documents ? (
      <DocumentsList documents={documents} openShareForm={sharingDoc => this.setState({sharingDoc})} />
    ) : (
      <Spinner color='black' />
    );
  };

  render() {
    return (
      <React.Fragment>
        <NavMenu />
        <ScreenWrapper title='My documents' titleCenter>
          {this._renderConent()}
        </ScreenWrapper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({document}) => ({documents: document.myDocuments});

const mapDispatchToProps = dispatch => ({
  getPermissionsAndDocuments: () => dispatch(permissionsActions.getPermissions()),
});

const DocumentsScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentsScreenComponent);

export {DocumentsScreen};
