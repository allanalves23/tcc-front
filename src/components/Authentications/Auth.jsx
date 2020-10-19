import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  Grid,
  Box,
  LinearProgress,
  useMediaQuery,
} from '@material-ui/core';

import { Redirect, useHistory } from 'react-router-dom';

import { connect } from 'react-redux';

import axios from 'axios';

import Recaptcha from 'react-google-invisible-recaptcha';
import { CAPTCHA_SITE_KEY } from '@/config/dataProperties';

import { devices } from '@/config/devices';
import CustomButtonBase from '@/components/Authentications/AuthButton.jsx';
import PasswordField from '@/components/PasswordField.jsx';

import { defineErrorMsg } from '@/config/backend';

import Logo from '@/assets/logo-unicarioca.png';

import { bindActionCreators } from 'redux';
import { setUser as defineUser } from '@/redux/user/userActions';
import { setMenu as defineMenu } from '@/redux/menu/menuActions';

import {
  GridPresentation,
  AuthSection,
  LogoArea,
  FormArea,
  AuthTextField,
  SpecialButton,
  SubmitArea,
  CustomAlert,
  CustomFormControl,
  AuthLabel,
} from './styles';

function Auth(props) {
  const {
    appError,
    setUser,
    setMenu,
  } = props;

  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const matches = useMediaQuery(devices.mobileLarge);
  const recaptchaRef = useRef(null);

  const history = useHistory();

  function resolve(event) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);

    if (error) recaptchaRef.current.reset();

    recaptchaRef.current.execute();
  }

  function captchaError() {
    recaptchaRef.current.reset();
    setError('Ocorreu um erro no recaptcha, se persistir reporte');
  }

  function handleChange(setAttr) {
    return (event) => {
      const { value } = event.target;
      setAttr(value);
    };
  }

  function authFormFocus() {
    const input = document.querySelector('#coder-mind-username');
    if (input) input.focus();
    if (!matches) {
      window.scrollTo(0, window.screen.height);
    }
  }

  function defineRef(ref) {
    recaptchaRef.current = ref;
  }

  useEffect(() => {
    async function verifyUser() {
      const user = localStorage.getItem('user');
      if (user && !appError) setRedirect(true);
    }

    verifyUser();
  }, [redirect, appError]);

  useEffect(() => {
    async function signIn() {
      const response = recaptchaToken;

      setRecaptchaToken('');

      const user = {
        userID,
        password,
        response,
      };

      const url = '/auth';

      await axios.post(url, user).then((res) => {
        localStorage.setItem('user', JSON.stringify({ token: res.data.accessToken, user: res.data.user }));
        setUser(res.data);
        setMenu(true);
        history.push('/');
      }).catch((err) => {
        const msg = defineErrorMsg(err);
        setError(msg);
        setLoading(false);
      });
    }

    if (recaptchaToken) {
      signIn();
    }
  }, [userID, loading, password, recaptchaToken, setMenu, setUser, history]);

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap" height="100%">
      {redirect
          && <Redirect to="/" />
      }
      <GridPresentation item xs={12} md={4}>
        <Box display="flex" flexDirection="column" height="60vh" justifyContent="flex-end" alignItems="center">
          <Box display="flex" alignItems="center" flexDirection="column" mt={2} mb={2}>
            <SpecialButton onClick={authFormFocus} color="inherit" variant="outlined" fullWidth>Já tenho uma conta</SpecialButton>
          </Box>
        </Box>
      </GridPresentation>
      <Grid item xs={12} md={8}>
        <AuthSection>
          { loading && <LinearProgress color="primary" />}
          <LogoArea error={error}>
            <img src={Logo} alt="Painel Coder Mind" className="logo-img" />
          </LogoArea>
          <FormArea>
            <form onSubmit={resolve} className="custom-form">
              <AuthLabel>E-mail</AuthLabel>
              <AuthTextField
                variant="outlined"
                size="small"
                onChange={handleChange(setUserID)}
                inputProps={{ autoComplete: 'email', id: 'coder-mind-username' }}
              />
              <AuthLabel>Senha</AuthLabel>
              <CustomFormControl>
                <PasswordField
                  inputId="cm-password"
                  variant="outlined"
                  size="small"
                  inputAutoComplete="password"
                  value={password}
                  onChange={handleChange(setPassword)}
                />
              </CustomFormControl>
              <Recaptcha
                sitekey={CAPTCHA_SITE_KEY}
                ref={defineRef}
                onResolved={((token) => setRecaptchaToken(token))}
                style={{ zIndex: 1 }}
                onError={() => captchaError()}
                onExpired={() => captchaError()}
                locale="pt-br"
              />
              { Boolean(error)
                && (
                  <CustomAlert severity="warning">
                    {error}
                  </CustomAlert>
                )
              }
              <SubmitArea item xs={12}>
                <CustomButtonBase
                  type="submit"
                  onClick={resolve}
                  fullWidth
                  disabledIcon
                  severity="primary"
                  loading={loading}
                  text={loading ? 'Entrando...' : 'Entrar'}
                />
              </SubmitArea>
            </form>
          </FormArea>
        </AuthSection>
      </Grid>
    </Box>

  );
}

Auth.propTypes = {
  appError: PropTypes.bool,
  setUser: PropTypes.func.isRequired,
  setMenu: PropTypes.func.isRequired,
};

Auth.defaultProps = {
  appError: false,
};

const mapStateToProps = (state) => ({ appError: state.error, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({
  setUser: defineUser,
  setMenu: defineMenu,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
