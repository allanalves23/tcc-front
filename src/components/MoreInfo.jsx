import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userType, appTheme } from '@/types';

import {
  Grid,
  Box,
  Divider,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  Typography,
} from '@material-ui/core';

import { connect } from 'react-redux';

import { APP_VERSION, APP_BUILD, APP_DEPENDENCIES } from '@/config/dataProperties';

import LogoSmall from '@/assets/logo-unicarioca-vertical.png';

import { CustomDialogContent } from './styles';

function MoreInfo(props) {
  const {
    opened,
    closeDialog,
    user,
    theme,
  } = props;

  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
    closeDialog();
  }

  function isDarkTheme() {
    return theme === 'dark';
  }

  useEffect(() => {
    setOpen(opened);
  }, [opened, open]);

  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Box width="100%" display="flex" justifyContent="center" alignItems="center">
          <img src={LogoSmall} height="115  px" alt="Coder Mind" />
        </Box>
      </DialogTitle>
      <Divider />
      <CustomDialogContent theme={theme}>
        <Grid item xs={12}>
          <Box mb={2} width="100%" display="flex" alignItems="center">
            <Box>
              <Typography variant="body1" component="p">
                Usuário autenticado:&nbsp;
                <strong>{user.name}</strong>
              </Typography>
              <Typography variant="body1" component="p">
                Perfil do usuário:&nbsp;
                <strong>{user.tagAdmin ? 'Administrador' : 'Autor'}</strong>
              </Typography>
            </Box>
          </Box>
          <Box width="100%" display="flex" alignItems="center">
            <Box>
              <Typography variant="body1" component="p">
                Versão da aplicação:&nbsp;
                <strong>{APP_VERSION}</strong>
              </Typography>
              <Typography variant="body1" component="p">
                Build:&nbsp;
                <strong>{APP_BUILD}</strong>
              </Typography>
              <Typography variant="body1" component="p">
                Dependências:&nbsp;
                <a
                  href={APP_DEPENDENCIES}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textWeigth: 800 }}
                  className="cm-link"
                >
                  <Typography component="span" variant="body1">
                    Visualizar dependências
                  </Typography>
                </a>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Box width="100%" display="flex" flexDirection="column" alignItems="center">
          <Box>
            <Typography component="p" variant="body2" align="center">
              Versão personalizada de &copy; Coder Mind &#38; Colaboradores
            </Typography>
            <Typography component="p" variant="body2" align="center">
              Licenciado sobre a licença BSD 3
            </Typography>
          </Box>
          <a
            href="https://opensource.org/licenses/BSD-3-Clause"
            target="_blank"
            rel="noopener noreferrer"
            className="cm-link"
          >
            <Typography component="p" variant="body2" align="center">
              https://opensource.org/licenses/BSD-3-Clause
            </Typography>
          </a>
        </Box>
      </CustomDialogContent>
      <DialogActions>
        <Button onClick={close} variant={isDarkTheme() ? 'contained' : 'text'} color="primary" autoFocus>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

MoreInfo.propTypes = {
  opened: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  user: userType.isRequired,
  theme: appTheme.isRequired,
};

MoreInfo.defaultProps = {
  opened: false,
};

const mapStateToProps = (state) => ({ theme: state.theme });
export default connect(mapStateToProps)(MoreInfo);
