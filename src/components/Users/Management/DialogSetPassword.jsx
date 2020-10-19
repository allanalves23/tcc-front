/**
 * @description This component is similar to "DialogConfirmAdminPassword",
 * but it changes the password of any account without confirmation
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userType, appTheme } from '@/types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error } from '@/config/toasts';

import axios from 'axios';
import { defineErrorMsg } from '@/config/backend';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  InputLabel,
  Box,
} from '@material-ui/core';

import PasswordField from '@/components/PasswordField.jsx';

function DialogSetPassword(props) {
  const {
    open,
    closeDialog,
    user,
    callToast,
    theme,
  } = props;

  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  async function changePassword(evt) {
    if (saving) return;
    if (evt) evt.preventDefault();

    setSaving(true);
    const url = `/users/configs/${user.userID}`;

    await axios.post(url, { password }).then(() => {
      callToast(success('Senha alterada com sucesso!'));
      setPassword('');
      closeDialog();
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setSaving(false);
  }

  useEffect(() => {
    if (!user || (user && !true)) closeDialog();
  }, [user, closeDialog]);

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      disableBackdropClick={saving}
      disableEscapeKeyDown={saving}
    >
      { saving && <LinearProgress color="primary" />}
      <DialogTitle>
        Informe a nova senha
      </DialogTitle>
      <DialogContent>
        <form onSubmit={changePassword}>
          <Box mb={1}>
            <InputLabel>Senha</InputLabel>
          </Box>
          <PasswordField
            inputId="new-password"
            inputAutoComplete="new-password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant={theme === 'dark' ? 'contained' : 'text'}
          size="small"
          onClick={closeDialog}
          disabled={saving}
        >
          Fechar
        </Button>
        <Button
          color="primary"
          variant={theme === 'dark' ? 'contained' : 'text'}
          size="small"
          onClick={changePassword}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogSetPassword.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  user: userType.isRequired,
  callToast: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
};

DialogSetPassword.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ user: state.user, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DialogSetPassword);
