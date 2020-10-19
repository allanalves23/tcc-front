import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  LinearProgress,
  DialogContentText,
} from '@material-ui/core';

import PasswordField from '@/components/PasswordField.jsx';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineErrorMsg } from '@/config/backend';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error } from '@/config/toasts';

function RemoveAccount(props) {
  const {
    open,
    closeDialog,
    user,
    callToast,
  } = props;

  const [removing, setRemoving] = useState(false);
  const [password, setPassword] = useState('');

  async function remove() {
    setRemoving(true);

    const url = `/users/configs/${user.userID}`;

    const payload = { password };

    await axios.put(url, payload).then(() => {
      callToast(success('Conta removida com sucesso, aguarde alguns segundos... Estamos lhe redirecionando'));
      setTimeout(() => {
        localStorage.removeItem('user');
        window.open('/', '_self');
      }, 3000);
    }).catch(async (err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setRemoving(false);
  }

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      disableBackdropClick={removing}
      disableEscapeKeyDown={removing}
    >
      { removing && <LinearProgress color="primary" />}
      <DialogTitle>
        Remover conta
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Ao excluir sua conta você perderá o acesso a esta plataforma,
          seus artigos e publicações não estarão mais diponíveis para visualização
          e sua conta será congelada por 30 dias até a efetivação da exclusão permanente,
          após este prazo não é possível recuperar sua conta.
          <br />
          <strong>Confirme a exclusão informando sua senha atual.</strong>
        </DialogContentText>
        <PasswordField
          inputId="current-password"
          inputAutoComplete="current-password"
          fullWidth
          onChange={(evt) => setPassword(evt.target.value)}
          autoFocus
          value={password}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          disabled={removing}
        >
          Fechar
        </Button>
        <Button
          onClick={remove}
          color="primary"
          disabled={removing}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RemoveAccount.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  user: userType.isRequired,
  callToast: PropTypes.func.isRequired,
};

RemoveAccount.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ toast: state.toast });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(RemoveAccount);
