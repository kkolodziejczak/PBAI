import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {compose} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {userActions} from 'redux/actions/user';
import {ROUTE_DASHBOARD, ROUTE_LOGIN, ROUTE_UPLOADS} from 'constants/routes';

class NavMenu extends React.Component {
  _logout = e => {
    e.preventDefault();
    const {logout, history} = this.props;
    logout();
    history.push(ROUTE_LOGIN);
  };

  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={ROUTE_DASHBOARD}>DOCUMENTS SHARING APP</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to={ROUTE_UPLOADS}>
              <NavItem eventKey={1}>My uploads</NavItem>
            </LinkContainer>
            <NavItem eventKey={2}>Link</NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} onClick={this._logout}>
              Log out
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(userActions.logout()),
});
export default compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps,
  ),
)(NavMenu);
