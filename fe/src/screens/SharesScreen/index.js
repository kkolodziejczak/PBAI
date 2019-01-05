import React from 'react';
import {connect} from 'react-redux';
import ScreenWrapper from 'components/ScreenWrapper';
import NavMenu from 'components/NavMenu';
import {documentActions} from 'redux/actions/document';

class SharesScreenComponent extends React.Component {
  state = {
    sharingDoc: null,
    shareSuccess: false,
    partnerName: null,
  };

  componentDidMount() {
    this.props.getShares();
  }

  _renderConent = () => {
    return null;
  };

  render() {
    return (
      <React.Fragment>
        <NavMenu />
        <ScreenWrapper title='My shares' titleCenter>
          {this._renderConent()}
        </ScreenWrapper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({document}) => ({documents: document.myDocuments});

const mapDispatchToProps = dispatch => ({
  getShares: () => dispatch(documentActions.getShares()),
});

const SharesScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SharesScreenComponent);

export {SharesScreen};
