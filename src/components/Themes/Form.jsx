import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { themeType } from '@/types';

import {
  Icon,
  Dialog,
  DialogActions,
  DialogContent,
  Box,
  Divider,
  Typography,
  Button,
  LinearProgress,
} from '@material-ui/core';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { defineErrorMsg } from '../../config/backend';

import { callToast as toastEmitter } from '../../redux/toast/toastActions';
import { success, error as toastError } from '../../config/toasts';

import { CustomTextField } from './styles';

function ThemeForm(props) {
  const {
    callToast,
    propTheme,
    open,
    onClose,
  } = props;

  const [theme, setTheme] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  function handleChange(event, attr) {
    const { value } = { ...event.target };
    setTheme({
      ...theme,
      [attr]: value,
    });
  }

  function close(saved = false) {
    if (loading) return;
    onClose(saved);
  }

  async function save() {
    if (loading) return;

    const method = theme.id ? 'put' : 'post';
    const url = method === 'post' ? '/temas' : `/temas/${theme.id}`;
    setLoading(true);

    await axios[method](url, theme).then(() => {
      callToast(success('Operação realizada com sucesso'));
      close(true);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      setError(err.response.data);
      callToast(toastError(msg));
    });

    setLoading(false);
  }

  useEffect(() => {
    if (open) {
      if (!propTheme.id) setTheme({ nome: '', descricao: '' });
      else setTheme(propTheme);
    }
  }, [open, propTheme]);

  return (
    <Dialog
      open={open}
      onClose={() => close()}
      onEscapeKeyDown={() => close()}
      onBackdropClick={() => close()}
      maxWidth="md"
    >
      {loading && <LinearProgress color="primary" /> }
      <Box mb={3} p={2}>
        <Box display="flex" alignItems="center">
          <Icon style={{ marginRight: 3, color: '#444' }}>bookmark</Icon>
          <Typography variant="h5" component="h1">{theme.id ? 'Atualizar tema' : 'Inserir tema'}</Typography>
        </Box>
        <Divider style={{ marginTop: 10 }} />
      </Box>
      <DialogContent>
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <CustomTextField
            label="Tema"
            error={Boolean(error.nome)}
            helperText={error.nome
              ? error.msg : ''}
            onBlur={() => setError({})}
            value={theme.nome}
            onChange={(event) => handleChange(event, 'nome')}
          />
          <CustomTextField
            label="Descrição"
            error={Boolean(error.descricao)}
            helperText={error.descricao
              ? error.msg
              : ''}
            onBlur={() => setError({})}
            fullWidth
            value={theme.descricao}
            multiline
            rows={3}
            onChange={(event) => handleChange(event, 'descricao')}
          />
        </Box>
      </DialogContent>
      <DialogActions style={{ margin: 10 }}>
        <Button variant="contained" size="small" onClick={close}>
          Fechar
        </Button>
        <Button variant="contained" size="small" color="primary" onClick={save}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ThemeForm.propTypes = {
  callToast: PropTypes.func.isRequired,
  propTheme: themeType.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

ThemeForm.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ThemeForm);
