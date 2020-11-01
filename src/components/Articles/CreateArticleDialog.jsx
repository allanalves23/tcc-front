import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { appTheme } from '@/types';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  DialogActions,
  Button,
  TextField,
  Typography,
  LinearProgress,
} from '@material-ui/core';

import axios from 'axios';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { error, success } from '../../config/toasts';
import { callToast as ToastEmitter } from '../../redux/toast/toastActions';

import { defineErrorMsg } from '../../config/backend';

function CreateArticleDialog(props) {
  const {
    open,
    onClose,
    callToast,
    theme,
  } = props;

  const [loading, setLoading] = useState(false);
  const [articleTitle, setArticleTitle] = useState('');

  function clearFields() {
    setArticleTitle('');
  }

  function close(stack) {
    if (loading) return;
    clearFields();
    onClose(stack);
  }


  async function createArticle() {
    const url = '/artigos';
    setLoading(true);
    await axios.post(url, { titulo: articleTitle }).then((res) => {
      const articleCreated = res.data;
      callToast(success('Artigo criado com sucesso'));
      clearFields();
      close({ reason: 'articleCreated', url: articleCreated.url });
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
      setLoading(false);
    });
  }

  function handleChange(evt) {
    const { value } = evt.target;
    setArticleTitle(value);
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
        {loading ? 'Criando artigo' : 'Criar artigo'}
      </DialogTitle>
      <DialogContent>
        <Box width="100%">
          <Box mb={2}>
            <Typography variant="body2" component="p">
              Para começar é necessário informar o titulo do artigo
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Titulo do artigo"
            value={articleTitle}
            onChange={handleChange}
          />
        </Box>
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
          onClick={createArticle}
          disabled={loading}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreateArticleDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
};

CreateArticleDialog.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: ToastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CreateArticleDialog);
