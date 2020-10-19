import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { appTheme, articleType } from '@/types';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Button,
} from '@material-ui/core';

import axios from 'axios';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { error, success } from '@/config/toasts';
import { callToast as ToastEmitter } from '@/redux/toast/toastActions';

import { defineErrorMsg } from '@/config/backend';

function RemoveArticleDialog(props) {
  const {
    open,
    onClose,
    theme,
    callToast,
    article,
    imageType,
  } = props;

  const [loading, setLoading] = useState(false);

  function close(evt) {
    onClose(evt);
  }

  function getTranslatedImageType() {
    if (imageType === 'secondary') return 'recomendação';
    if (imageType === 'header') return 'cabeçalho';

    return imageType;
  }

  async function remove() {
    const url = `/articles/images/${article.id}?type=${imageType}`;

    setLoading(true);

    await axios.delete(url).then(() => {
      callToast(success('Imagem removida com sucesso'));
      close({ reason: 'removed' });
    }).catch((err) => {
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
      fullWidth
      maxWidth="xs"
    >
      { loading && <LinearProgress color="primary" />}
      <DialogTitle>
        Remover imagem do artigo
      </DialogTitle>
      <DialogContent>
        Tem certeza que deseja remover a imagem de
        {' '}
        {getTranslatedImageType()}
        {' '}
        do artigo
        {' '}
        {article.title}
        ?
      </DialogContent>
      <DialogActions>
        <Button
          variant={theme === 'dark' ? 'contained' : 'text'}
          size="small"
          onClick={close}
          disabled={loading}
        >
          Fechar
        </Button>
        <Button
          color="primary"
          variant={theme === 'dark' ? 'contained' : 'text'}
          size="small"
          onClick={remove}
          disabled={loading}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RemoveArticleDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
  article: articleType.isRequired,
  imageType: PropTypes.string,
};

RemoveArticleDialog.defaultProps = {
  open: false,
  imageType: '',
};

const mapStateToProps = (state) => ({ theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: ToastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RemoveArticleDialog);
