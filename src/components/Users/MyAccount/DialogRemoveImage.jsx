import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { userType, appTheme } from '@/types';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  LinearProgress,
  DialogContentText,
} from '@material-ui/core';

import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineErrorMsg } from '@/config/backend';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error } from '@/config/toasts';

function RemoveImage(props) {
  const {
    open,
    closeDialog,
    user,
    callToast,
    theme,
  } = props;

  const [removing, setRemoving] = useState(false);

  async function remove() {
    const id = user.userID;
    const url = `/users/img/${id}`;

    setRemoving(true);

    await axios.delete(url).then(() => {
      callToast(success('Operaçao realizada com sucesso'));

      closeDialog({ removed: true });
    }).catch((err) => {
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
        Remover imagem
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deseja realmente remover sua imagem de perfil?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          disabled={removing}
          size="small"
        >
          Fechar
        </Button>
        <Button
          onClick={remove}
          color="primary"
          size="small"
          variant={theme === 'dark' ? 'contained' : 'text'}
          disabled={removing}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RemoveImage.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  user: userType.isRequired,
  callToast: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
};

RemoveImage.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ toast: state.toast, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(RemoveImage);
