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
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  LinearProgress,
} from '@material-ui/core';

function ConfirmRestoreUser(props) {
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
    const url = `/usuarios/${id}/restauracoes`;
    setRestoring(true);
    await axios.put(url).then(() => {
      callToast(success('Usuário removido com sucesso'));
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
        Reativar usuário
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tem certeza que deseja reativar o usuário
          {' '}
          {` ${user.userName} (${user.email}) ?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant={theme === 'dark' ? 'contained' : 'text'}
          size="small"
          onClick={closeDialog}
          disabled={restoring}
        >
          Fechar
        </Button>
        <Button
          color="primary"
          variant={theme === 'dark' ? 'contained' : 'text'}
          size="small"
          disabled={restoring}
          onClick={restore}
        >
          Remover
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmRestoreUser.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  user: userType.isRequired,
  theme: appTheme.isRequired,
};

ConfirmRestoreUser.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ toast: state.config, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmRestoreUser);
