import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import UpcomingEvents from '../pages/UpcomingEvents';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';
import RequestsAdmin from '../pages/RequestsAdmin';
import CreateClub from '../pages/CreateClub';
import RegisterEvent from '../pages/RegisterEvent';
import RegisterAdmin from '../pages/RegisterAdmin';
import JoinClub from '../pages/JoinClub';
import EditClub from '../pages/EditClub';
import ClubInformation from '../pages/ClubInformation';
import EventInformation from '../pages/EventInformation';
import Profile from '../pages/Profile';
import MemberList from '../pages/MemberList';
import TagManagement from '../pages/TagManagement';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
        <Router>
          <div>
            <NavBar/>
            <Switch>
              <Route exact path="/" component={Landing}/>
              <Route path="/signin" component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <ProtectedRoute path="/upcomingevents" component={UpcomingEvents}/>
              <ProtectedRoute path="/create" component={CreateClub}/>
              <ProtectedRoute path="/clubinfo/:_id" component={ClubInformation}/>
              <ProtectedRoute path="/eventinformation/:_id" component={EventInformation}/>
              <ProtectedRoute path="/register/:_id" component={RegisterEvent}/>
              <ProtectedRoute path="/joinclub" component={JoinClub}/>
              <ProtectedRoute path='/editclub/:_id' component={EditClub}/>
              <AdminProtectedRoute path="/requests" component={RequestsAdmin}/>
              <AdminProtectedRoute path="/registrants" component={RegisterAdmin}/>
              <ProtectedRoute path="/signout" component={Signout}/>
              <ProtectedRoute path="/profile" component={Profile}/>
              <ProtectedRoute path="/members_list/:_id" component={MemberList}/>
              <AdminProtectedRoute path="/manage_tags" component={TagManagement}/>
              <Route component={NotFound}/>
            </Switch>
            <Footer/>
          </div>
        </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
          (<Component {...props} />) :
          (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
      );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
          const isLogged = Meteor.userId() !== null;
          const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
          return (isLogged && isAdmin) ?
              (<Component {...props} />) :
              (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
              );
        }}
    />
);

/** Require a component and location to be passed to each ProtectedRoute. */
ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

/** Require a component and location to be passed to each AdminProtectedRoute. */
AdminProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

export default App;
