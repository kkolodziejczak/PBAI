import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {compose} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {userActions} from 'redux/actions/user';
import {ROUTE_DASHBOARD, ROUTE_LOGIN, ROUTE_DOCUMENTS, ROUTE_LOGS, ROUTE_SHARES, ROUTE_DB} from 'constants/routes';

class NavMenu extends React.Component {
  get links() {
    return [
      {
        text: 'My documents',
        to: ROUTE_DOCUMENTS,
        requireAdmin: false,
      },
      {
        text: 'Shares',
        to: ROUTE_SHARES,
        requireAdmin: false,
      },
      {
        text: 'Logs',
        to: ROUTE_LOGS,
        requireAdmin: true,
      },{
        text: 'DataBase',
        to: ROUTE_DB,
        requireAdmin: true,
      },
    ];
  }

  _renderLinks = () =>
    this.links.map((link, i) => {
      const {text, to, requireAdmin} = link;
      if (requireAdmin && !this.props.isAdmin) {
        return null;
      }
      return (
        <LinkContainer to={to} key={i}>
          <NavItem eventKey={i + 1}>{text}</NavItem>
        </LinkContainer>
      );
    });

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
          <Nav>{this._renderLinks()}</Nav>
          <Nav pullRight>
            <NavItem eventKey={0}>
              <strong>
                Hello <i>{this.props.login}</i>!
              </strong>
            </NavItem>
            <NavItem eventKey={1} onClick={this._logout}>
              Log out
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = ({user}) => ({isAdmin: user.me.isAdmin, login: user.me.login});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(userActions.logout()),
});

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(NavMenu);
