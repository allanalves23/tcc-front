import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userType, appTheme, toastConfig } from '@/types';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import {
  Grid,
  Fade,
  CircularProgress,
} from '@material-ui/core';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ErrorBoundary from '@/components/Errors/ErrorBoundary.jsx';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { standard } from '@/config/themes';

import { WHITE_LIST_ROUTES } from './config/dataProperties';

import { setUser as defineUser } from './redux/user/userActions';
import { setError as dispatchError } from './redux/error/errorActions';
import { setMenu as callMenu } from './redux/menu/menuActions';
import { callToast as toastEmitter } from './redux/toast/toastActions';

import Menu from './components/Menu/Menu';
import Toast from './components/Toast';

import Themes from './components/Themes/Themes';
import Management from './components/Management/Management';
import Error from './components/Errors/Error';
import Auth from './components/Authentications/Auth';
import RouteNotFound from './components/NotFound/RouteNotFound';
import Users from './components/Users/Management/Users';
import UserForm from './components/Users/Management/UserForm';
import Categories from './components/Categories/Categories';
import Articles from './components/Articles/Articles';
import Article from './components/Articles/Article/Article';
import MyAccount from './components/Users/MyAccount/MyAccount';

import './index.css';
import { AppContent, AppContainer } from './styles';

function App(props) {
  const {
    setMenu,
    setUser,
    setError,
    callToast,
    toast,
    error,
    user,
    theme,
  } = props;

  const themeConfig = standard(user && user._id ? theme : 'light');

  const [validatingToken, setValidatingToken] = useState(true);
  const [path, setPath] = useState('');

  function validateRoutes() {
    let top = 0;
    for (let i = 0; i < WHITE_LIST_ROUTES.length; i++) {
      if (WHITE_LIST_ROUTES[i] !== path) top++;
    }

    return Boolean(top === WHITE_LIST_ROUTES.length);
  }

  function getPath() {
    const url = window.location.href;
    return `/${url.split('/')[3].split('?')[0]}`;
  }

  function closeToast() {
    const config = {
      type: 'success',
      msg: '',
      display: false,
    };

    callToast(config);
  }

  useEffect(() => {
    async function validateToken() {
      const token = await JSON.parse(localStorage.getItem('user'));

      if (token) {
        const url = '/auth/logged';
        await axios.post(url, token).then((res) => {
          if (res.data.user) {
            setUser(res.data);
            setMenu(true);
          } else {
            localStorage.removeItem('user');
            setUser(null);
            setMenu(false);
          }
        }).catch(() => {
          setError(true);
        });
      }

      setValidatingToken(false);
    }

    const currentPath = getPath();
    setPath(currentPath);
    if (validatingToken) validateToken();
  }, [setMenu, setUser, setError, validatingToken]);

  return (
    <MuiThemeProvider theme={themeConfig}>
      <AppContainer theme={theme}>
        { !validatingToken
            && (
              <Router>
                <ErrorBoundary>
                  {getPath() !== '/confirm-email' && <Menu />}
                  <Toast
                    show={toast.display}
                    color={toast.type}
                    text={toast.msg}
                    closeToast={closeToast}
                  />
                  { !user._id && validateRoutes()
                    && (
                      <Redirect to="/auth" />
                    )
                  }
                  { error
                    && <Redirect to="/error" />
                  }
                  <AppContent
                    user={getPath() === '/confirm-email' ? {} : user}
                    isvalidating={validatingToken ? 'true' : ''}
                    theme={theme}
                  >
                    <Switch>
                      <Route path="/" exact component={Articles} />
                      <Route path="/auth" exact component={Auth} />
                      <Route path="/user" exact component={UserForm} />
                      <Route path="/user/:id" exact component={UserForm} />
                      <Route path="/users" exact component={Users} />
                      <Route path="/articles" exact component={Articles} />
                      <Route path="/articles/:key" exact component={Article} />
                      <Route path="/management" exact component={Management} />
                      <Route path="/themes" exact component={Themes} />
                      <Route path="/categories" exact component={Categories} />
                      <Route path="/my-account" exact component={MyAccount} />
                      <Route path="/error" exact component={Error} />
                      <Route component={RouteNotFound} />
                    </Switch>
                  </AppContent>
                </ErrorBoundary>
              </Router>
            )
          }
        { validatingToken
            && (
            <Fade in={validatingToken}>
              <Grid item xs={12} className="loading-app-area">
                <CircularProgress size={70} />
              </Grid>
            </Fade>
            )
          }
      </AppContainer>
    </MuiThemeProvider>
  );
}

App.propTypes = {
  user: userType.isRequired,
  error: PropTypes.bool,
  theme: appTheme.isRequired,
  setMenu: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  toast: toastConfig.isRequired,
};

App.defaultProps = {
  error: false,
};

const mapStateToProps = (state) => ({
  user: state.user,
  error: state.error,
  menu: state.menu,
  toast: state.toast,
  theme: state.theme,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setUser: defineUser,
  setError: dispatchError,
  setMenu: callMenu,
  callToast: toastEmitter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
