import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { themeType, appTheme } from '@/types';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Container,
  DialogActions,
  Button,
  DialogContentText,
} from '@material-ui/core';

import axios from 'axios';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { error, success } from '../../config/toasts';
import { callToast as ToastEmitter } from '../../redux/toast/toastActions';

import { defineErrorMsg } from '../../config/backend';

function RemoveConfirmation(props) {
  const {
    open,
    onClose,
    propTheme,
    themesQuantity,
    page,
    callToast,
    theme,
  } = props;

  const [loading, setLoading] = useState(false);

  function close(stack) {
    onClose(stack);
  }

  async function remove() {
    setLoading(true);
    const id = propTheme._id;
    const url = `/temas/${id}`;
    let newPage = null;
    await axios
      .delete(url)
      .then(() => {
        callToast(success('Operação realizada com sucesso'));
        if (themesQuantity === 1) newPage = page - 1 === 0 ? 1 : page - 1;
        close({ removed: true, newPage });
      })
      .catch((err) => {
        const msg = defineErrorMsg(err);
        callToast(error(msg));
      });

    setLoading(false);
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      onEscapeKeyDown={close}
      onBackdropClick={close}
      aria-labelledby="title"
      aria-describedby="are_you_sure"
    >
      <DialogTitle id="title">
        {loading ? 'Removendo' : 'Excluir tema'}
      </DialogTitle>
      <DialogContent>
        <Container>
          {!loading
            && (
              <DialogContentText id="are_you_sure">Tem certeza que deseja remover este tema?</DialogContentText>
            )}
          {loading
            && (
              <DialogContentText id="description">Removendo tema, por favor aguarde...</DialogContentText>
            )}
        </Container>
      </DialogContent>
      <DialogActions>
        {!loading && (
          <Button variant={theme === 'dark' ? 'contained' : 'text'} size="small" onClick={close}>
            Fechar
          </Button>
        )}
        {!loading && (
        <Button color="primary" variant={theme === 'dark' ? 'contained' : 'text'} size="small" onClick={remove}>
          Excluir
        </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

RemoveConfirmation.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  propTheme: themeType.isRequired,
  themesQuantity: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  callToast: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
};

RemoveConfirmation.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ user: state.user, toast: state.config, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: ToastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RemoveConfirmation);
