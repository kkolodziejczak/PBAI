import React from 'react';
import {connect} from 'react-redux';
import ScreenWrapper from 'components/ScreenWrapper';
import NavMenu from 'components/NavMenu';
import {documentActions} from 'redux/actions/document';
import SharesList from 'components/SharesList';

class SharesScreenComponent extends React.Component {
  get sharedByMe() {
    const {shares} = this.props;
    return shares && shares.filter(share => share.isOwner);
  }

  get sharedWithMe() {
    const {shares} = this.props;
    return shares && shares.filter(share => !share.isOwner);
  }

  componentDidMount() {
    this.props.getShares();
    this.props.updateShares();
  }

  _renderConent = () => {
    return (
      <React.Fragment>
        <h2>Documents shared by me</h2>
        <SharesList shares={this.sharedByMe} myShare={true} />

        <h2>Documents shared with me</h2>
        <SharesList shares={this.sharedWithMe} />
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        <NavMenu />
        <ScreenWrapper title="Shares" titleCenter>
          {this._renderConent()}
        </ScreenWrapper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({document}) => ({shares: document.shares});

const mapDispatchToProps = dispatch => ({
  getShares: () => dispatch(documentActions.getShares()),
  updateShares: () => dispatch(documentActions.updateShares()),
});

const SharesScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SharesScreenComponent);

export {SharesScreen};
