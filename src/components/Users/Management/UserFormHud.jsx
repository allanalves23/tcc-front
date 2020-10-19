import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import {
  IconButton,
  Icon,
  Menu,
  MenuItem,
  Typography,
  Box,
  useMediaQuery,
} from '@material-ui/core';

import { devices } from '@/config/devices';
import CustomButton from '@/components/Buttons/Button.jsx';
import { FormHudButtons } from './styles';

function UserFormHud(props) {
  const {
    save,
    changePass,
    remove,
    toogleSendEmail,
    sendEmail,
    isSaving,
    user,
  } = props;

  const [anchorMenu, setAnchorMenu] = useState(null);
  const matches = useMediaQuery(devices.tablet);

  function showMenu(evt) {
    setAnchorMenu(evt.currentTarget);
  }

  function hideMenu() {
    setAnchorMenu(null);
  }

  function removeAndHideMenu() {
    remove();
    hideMenu();
  }

  function changePassAndHideMenu() {
    changePass();
    hideMenu();
  }

  return (
    <FormHudButtons>
      { matches && (
        <Box
          display="flex"
          justifyContent="flex-end"
          width="100%"
        >
          <IconButton
            onClick={showMenu}
            size="small"
          >
            <Icon>more_vert</Icon>
          </IconButton>
        </Box>
      )}
      { !matches && (
      <Box>
        <CustomButton
          color="primary"
          size="small"
          iconSize="small"
          icon="save"
          onClick={save}
          disabled={isSaving}
        />
        { user.userID
        && (
          <CustomButton
            color="secondary"
            size="small"
            iconSize="small"
            icon="delete"
            onClick={remove}
            disabled={isSaving}
          />
        )
        }
        { user.userID
        && (
          <CustomButton
            color="default"
            size="small"
            iconSize="small"
            icon="lock"
            onClick={changePass}
            disabled={isSaving}
          />
        )
      }

        <IconButton
          onClick={showMenu}
          size="small"
        >
          <Icon>more_vert</Icon>
        </IconButton>
      </Box>
      )}
      <Menu
        anchorEl={anchorMenu}
        keepMounted
        open={Boolean(anchorMenu)}
        onClose={hideMenu}
      >
        <MenuItem onClick={toogleSendEmail}>
          <Box display="flex" flexDirection="column" flexWrap="wrap">
            <Typography component="span" variant="body1">
              Notificar
              {' '}
              {user.userID ? 'mudanças' : 'cadastro'}
              :
              {' '}
              {sendEmail ? 'ativado' : 'desativado'}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              style={{
                maxWidth: '225px',
                whiteSpace: 'normal',
              }}
              align="center"
            >
              {user.userID
                ? 'Se ativo o usuário receberá uma notificação de mudanças no cadastro.'
                : 'Se ativo, o usuário receberá um e-mail de notificação contendo as credenciais de acesso ao painel'}
            </Typography>
          </Box>
        </MenuItem>
        { user.userID && <MenuItem onClick={changePassAndHideMenu}>Alterar senha</MenuItem>}
        { user.userID && <MenuItem onClick={removeAndHideMenu}>Remover conta</MenuItem>}
      </Menu>
    </FormHudButtons>
  );
}

UserFormHud.propTypes = {
  save: PropTypes.func.isRequired,
  changePass: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  toogleSendEmail: PropTypes.func.isRequired,
  sendEmail: PropTypes.bool,
  isSaving: PropTypes.bool,
  user: userType.isRequired,
};

UserFormHud.defaultProps = {
  sendEmail: false,
  isSaving: false,
};

export default UserFormHud;
