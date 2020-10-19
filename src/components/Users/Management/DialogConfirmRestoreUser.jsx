import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { userType, appTheme } from '@/types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error as toastError } from '@/config/toasts';

import axios from 'axios';

import { defineErrorMsg } from '@/config/backend';
import {
  Dialog,
  LinearProgress,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';

function ConfirmRestore(props) {
  const {
    open,
    closeDialog,
    callToast,
    user,
    theme,
  } = props;

  const [restoring, setRestoring] = useState(false);

  async function restore() {
    const { id } = user;
    setRestoring(true);
    const url = `/users/configs/${id}`;

    await axios.patch(url).then(() => {
      callToast(success('Usuário restaurado com sucesso'));
      closeDialog({ restored: true });
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(toastError(msg));
    });

    setRestoring(false);
  }

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      disableBackdropClick={restoring}
      disableEscapeKeyDown={restoring}
      maxWidth="md"
    >
      { restoring && <LinearProgress color="primary" />}
      <DialogTitle>
        Resturar usuário
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deseja realmente resturar o usuário
          {` ${user.userName} (${user.email}) ?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          disabled={restoring}
          variant={theme === 'dark' ? 'contained' : 'text'}
          size="small"
        >
          Fechar
        </Button>
        <Button
          onClick={restore}
          color="primary"
          variant={theme === 'dark' ? 'contained' : 'text'}
          size="small"
          disabled={restoring}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmRestore.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  user: userType.isRequired,
  theme: appTheme.isRequired,
};

ConfirmRestore.defaultProps = {
  open: false,
};


const mapStateToProps = (state) => ({ toast: state.config, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmRestore);
