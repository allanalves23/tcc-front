import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Container,
  Switch,
  FormGroup,
  FormControlLabel,
  Grid,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toogleTheme } from '@/redux/theme/themeActions';

import { userType, appTheme } from '@/types';

import CustomButton from '@/components/Buttons/Button.jsx';

import ChangeMyPassoword from './DialogChangePassword';
import RemoveAccount from './DialogConfirmRemoveAccount';

import {
  CustomIcon,
  CustomDivider,
  IsolatedGrid,
  FakeLink,
} from './styles';

function Configurations(props) {
  const {
    user,
    theme,
    setTheme,
  } = props;

  const [userState, setUserState] = useState(null);
  const [changePass, setChangePass] = useState(false);
  const [removeAccount, setRemoveAccount] = useState(false);

  function swapTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  function confirmRemoveAccount() {
    setRemoveAccount(true);
  }

  function closeRemoveAccount() {
    setRemoveAccount(false);
  }

  function displayDialogChangePass() {
    setChangePass(true);
  }

  function closeDialogChangePass() {
    setChangePass(false);
  }

  useEffect(() => {
    if (!userState) setUserState(user);
  }, [user, userState]);

  return (
    <Container>
      { true && (
        <Box mb={2}>
          <Grid>
            <Box width="100%" mb={2}>
              <Box display="flex" alignItems="center">
                <CustomIcon color="action">
                  admin_panel_settings
                </CustomIcon>
                <Typography component="h3" variant="h6">
                  Configurações de administrador
                </Typography>
              </Box>
              <Typography component="span" variant="body2">
                Acesse as configurações de administrador do painel.
              </Typography>
            </Box>
            <FakeLink to="/management">
              <CustomButton
                color="primary"
                icon="exit_to_app"
                iconSize="small"
                text="Acessar"
              />
            </FakeLink>
          </Grid>
        </Box>
      )}
      <Grid>
        <Box width="100%">
          <Box display="flex" alignItems="center">
            <CustomIcon color="action">
              settings_brightness
            </CustomIcon>
            <Typography component="h3" variant="h6">
              Temas
            </Typography>
          </Box>
          <Typography component="span" variant="body2">
            Você já experimentou o modo escuro?
            Você pode ativá-lo clicando no botão abaixo,
            caso não goste basta clicar novamente para voltar ao tema claro.
          </Typography>
        </Box>
        <FormGroup>
          <FormControlLabel
            control={
              (
                <Switch
                  onClick={swapTheme}
                  checked={theme === 'dark'}
                  color="primary"
                />
              )
            }
            label={
              (
                <Typography
                  component="label"
                  variant="body2"
                >
                  Modo escuro:
                  {' '}
                  {theme === 'dark' ? 'ativado' : 'desativado'}
                </Typography>
              )
            }
          />
        </FormGroup>
      </Grid>
      <CustomDivider />
      <Grid>
        <Box width="100%" mb={2}>
          <Box display="flex" alignItems="center">
            <CustomIcon color="action">
              lock_open
            </CustomIcon>
            <Typography component="h3" variant="h6">
              Alterar senha
            </Typography>
          </Box>
          <Typography component="span" variant="body2">
            Nunca repasse sua senha para terceiros, este é o meio de garantir que
            somente você será o autor de seus contéudos.
            Nunca iremos pedir senhas e informações sigilosas sobre sua conta.
          </Typography>
        </Box>
        <CustomButton
          color="primary"
          icon="refresh"
          iconSize="small"
          text="Alterar senha"
          onClick={displayDialogChangePass}
        />
      </Grid>
      <IsolatedGrid>
        <Box width="100%" mb={2}>
          <Box display="flex" alignItems="center">
            <CustomIcon color="action">
              delete_outlined
            </CustomIcon>
            <Typography component="h3" variant="h6">
              Excluir minha conta
            </Typography>
          </Box>
          <Typography component="span" variant="body2">
            Ao excluir sua conta você perderá o acesso a esta plataforma,
            seus artigos e publicações não estarão mais diponíveis para visualização
            e sua conta será congelada por 30 dias até a efetivação da exclusão permanente,
            após este prazo não é possível recuperar sua conta.
          </Typography>
        </Box>
        <CustomButton
          color="secondary"
          icon="delete_forever"
          iconSize="small"
          text="Excluir conta"
          onClick={confirmRemoveAccount}
        />
      </IsolatedGrid>
      <ChangeMyPassoword
        closeDialog={closeDialogChangePass}
        user={user}
        open={changePass}
      />
      <RemoveAccount
        closeDialog={closeRemoveAccount}
        user={user}
        open={removeAccount}
      />
    </Container>
  );
}

Configurations.propTypes = {
  user: userType.isRequired,
  theme: appTheme.isRequired,
  setTheme: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ theme: state.theme, user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators({ setTheme: toogleTheme }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Configurations);
