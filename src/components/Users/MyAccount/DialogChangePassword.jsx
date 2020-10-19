import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import {
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  LinearProgress,
  Slide,
} from '@material-ui/core';

import PasswordField from '@/components/PasswordField.jsx';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { defineErrorMsg } from '@/config/backend';
import { success, error } from '@/config/toasts';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';

function ChangeMyPassword(props) {
  const {
    user,
    closeDialog,
    open,
    callToast,
  } = props;

  const [password, setPassword] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [authorizing, setAuthorizing] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [saving, setSaving] = useState(false);

  function resetState() {
    setPassword('');
    setNewPass('');
    setConfirmNewPass('');
    setAuthorized(false);
    setAuthorizing(false);
  }

  async function verifyPassword() {
    const url = '/auth/logged';
    const payload = {
      id: user.userID,
      password,
    };

    setAuthorizing(true);

    await axios.patch(url, payload).then(() => {
      setAuthorized(true);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setAuthorizing(false);
  }

  async function changePassword() {
    const payload = {
      firstField: newPass,
      secondField: confirmNewPass,
    };

    const url = `/users/${user.userID}`;

    setSaving(true);

    await axios.post(url, payload).then(() => {
      callToast(success('Senha alterada com sucesso'));

      resetState();
      closeDialog();
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setSaving(false);
  }

  function submit(evt) {
    if (evt) evt.preventDefault();
    return authorized ? changePassword() : verifyPassword();
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={closeDialog}
      disableBackdropClick={authorizing || saving}
      disableEscapeKeyDown={authorizing || saving}
    >
      { (authorizing || saving) && <LinearProgress color="primary" />}
      <DialogTitle>
        Alterar senha
      </DialogTitle>
      <DialogContent>
        <Grid item xs={12}>
          { !authorized
              && (
              <form onSubmit={submit}>
                <PasswordField
                  label="Informe sua senha atual"
                  inputId="current-password"
                  inputAutoComplete="current-password"
                  value={password}
                  fullWidth
                  onChange={(evt) => setPassword(evt.target.value)}
                  autoFocus
                />
              </form>
              )
          }
          { authorized
            && (
              <Slide direction="right" in={authorized} mountOnEnter unmountOnExit>
                <Box width="100%">
                  <form onSubmit={submit}>
                    <PasswordField
                      label="Nova senha"
                      inputId="new-password"
                      inputAutoComplete="new-password"
                      value={newPass}
                      fullWidth
                      onChange={(evt) => setNewPass(evt.target.value)}
                      autoFocus
                      margin="dense"
                    />
                  </form>
                  <form onSubmit={submit}>
                    <PasswordField
                      label="Confirme a senha"
                      inputId="confirm-password"
                      inputAutoComplete="new-password"
                      value={confirmNewPass}
                      fullWidth
                      onChange={(evt) => setConfirmNewPass(evt.target.value)}
                      margin="dense"
                    />
                  </form>
                </Box>
              </Slide>
            )
        }
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          disabled={authorizing || saving}
        >
          Fechar
        </Button>
        <Button
          onClick={submit}
          color="primary"
          disabled={authorizing || saving}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ChangeMyPassword.propTypes = {
  user: userType.isRequired,
  closeDialog: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

ChangeMyPassword.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChangeMyPassword);
