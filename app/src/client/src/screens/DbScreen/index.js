import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {withRouter} from 'react-router';

import ScreenWrapper from 'components/ScreenWrapper';
import NavMenu from 'components/NavMenu';

class DbScreenComponent extends React.Component {
  componentDidMount() {
    const {isAdmin, history} = this.props;
    if (!isAdmin) {
      history.goBack();
      return null;
    }
    // workarounded
    window.location = "/db"
  }

  render() {
    return (
      <React.Fragment>
         <NavMenu />
        <ScreenWrapper title='redirecting to database management site...' titleCenter>
        </ScreenWrapper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({user}) => ({isAdmin: user.me.isAdmin});

const DbScreen = compose(
  withRouter,
  connect(mapStateToProps),
)(DbScreenComponent);

export {DbScreen};
