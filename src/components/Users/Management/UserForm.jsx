import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { reactRouterParams } from '@/types';

import { Redirect } from 'react-router-dom';

import {
  Container,
  MenuItem,
  Divider,
  Icon,
  Box,
  Breadcrumbs,
  Typography,
  CircularProgress,
  LinearProgress,
} from '@material-ui/core';

import axios from 'axios';
import { defineErrorMsg } from '@/config/backend';
import { CODER_MIND_URL } from '@/config/dataProperties';
import {
  formatCustomURL,
  displayFullDate,
} from '@/config/masks';
import { scrollToTop } from '@/shared/index';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error } from '@/config/toasts';

import Header from '@/components/Header.jsx';
import PasswordField from '@/components/PasswordField.jsx';

import UserFormSection from './UserFormSection';
import UserFormHud from './UserFormHud';
import DialogConfirmRemoveUser from './DialogConfirmRemoveUser';
import DialogSetPassword from './DialogSetPassword';

import {
  CustomLink,
  CustomTextField,
  CustomGrid,
  Form,
  CustomTooltip,
} from './styles';

function UserForm(props) {
  const {
    callToast,
    match,
  } = props;

  const [userState, setUserState] = useState({});
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmRemoveUserDialog, setConfirmRemoveUserDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [redirect, setRedirect] = useState(false);

  function hideConfirmRemoveUserDialog(event) {
    const { removed } = event;
    setConfirmRemoveUserDialog(false);

    if (removed) {
      setTimeout(() => setRedirect(true), 500);
    }
  }

  function hideSetPasswordDialog() {
    setPasswordDialog(false);
  }

  function handleChange(evt, attr) {
    let { value } = evt.target;

    // eslint-disable-next-line default-case
    switch (attr) {
      case 'customUrl': {
        value = formatCustomURL(value);
        break;
      }
    }

    setUserState({ ...userState, [attr]: value });
  }

  function formatData() {
    const data = { ...userState };

    data.perfilDeAcesso = data.perfilDeAcesso || 'Comum';

    return data;
  }

  async function save() {
    if (saving) return;

    const method = userState.id ? 'put' : 'post';
    const url = method === 'post' ? '/usuarios' : `/usuarios/${userState.id}`;

    const data = formatData();

    setSaving(true);

    await axios[method](url, data).then(() => {
      callToast(success('Informações salvas com sucesso'));
      if (method === 'post') {
        setTimeout(() => {
          setRedirect(true);
        }, 1000);
      }
    }).catch(async (err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setSaving(false);
  }

  useEffect(() => {
    const { id } = match && match.params;

    async function getUser() {
      const url = `/usuarios/${id}`;
      setLoading(true);
      await axios(url).then((res) => {
        setUserState({
          ...res.data,
        });
      }).catch((err) => {
        const msg = defineErrorMsg(err);
        callToast(error(msg));
      });

      setLoading(false);
    }

    if (reload) {
      scrollToTop();
    }

    if (id && reload) {
      getUser();
    }

    setReload(false);
  }, [userState, match, reload, callToast]);

  return (
    <Container className="page">
      <Header
        title="Usuário"
        description="Consulte, altere, crie e remova usuários do sistema"
        icon="person_add"
      />
      { redirect && <Redirect to="/users" />}
      <DialogConfirmRemoveUser
        open={confirmRemoveUserDialog}
        closeDialog={hideConfirmRemoveUserDialog}
        user={userState}
      />
      <DialogSetPassword
        open={passwordDialog}
        closeDialog={hideSetPasswordDialog}
        user={userState}
      />
      <Form>
        { saving && <LinearProgress color="primary" /> }
        <Box
          display="flex"
          alignItems="center"
          p={2}
        >
          <Breadcrumbs separator={<Icon fontSize="small">navigate_next_icon</Icon>}>
            <CustomLink to="/management">
              <Typography component="span" variant="body2">Configurações</Typography>
            </CustomLink>
            <CustomLink to="/users">
              <Typography component="span" variant="body2">Usuários</Typography>
            </CustomLink>
            <Typography component="span" variant="body2">
              {userState.id ? 'Editar usuário' : 'Cadastrar usuário'}
            </Typography>
          </Breadcrumbs>
        </Box>
        { loading
          && (
            <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="300px">
              <CircularProgress color="primary" size={80} />
            </Box>
          )
        }
        { !loading
          && (
          <Container>
            <UserFormHud
              save={save}
              isSaving={saving}
            />
            <CustomGrid item xs={12}>
              <UserFormSection
                icon="person_outlined"
                title="Informações principais"
                description="Informações obrigatórias para manter o cadastro do usuário"
              />
              <CustomTextField
                label="E-mail"
                value={userState.email || ''}
                helperText="Esta informação será usada para a autenticação no sistema"
                onChange={(evt) => handleChange(evt, 'email')}
              />
              <CustomTextField
                label="Perfil de Acesso"
                value={userState.perfilDeAcesso || 'Comum'}
                helperText="Perfil de Acesso do usuário ao sistema"
                select
                onChange={(evt) => handleChange(evt, 'perfilDeAcesso')}
              >
                <MenuItem key="Admin" value="Admin">
                  Administrador
                </MenuItem>
                <MenuItem key="Comum" value="Comum">
                  Comum
                </MenuItem>
              </CustomTextField>
            </CustomGrid>
            <Divider />
            { !userState.id
              && (
                <CustomGrid item xs={12}>
                  <UserFormSection
                    icon="lock"
                    title="Informações sigilosas"
                    description="Senhas e outras informações de identificação"
                  />
                  <PasswordField
                    label="Senha"
                    inputId="new-password"
                    inputAutoComplete="new-password"
                    value={userState.senha}
                    fullWidth
                    onChange={(evt) => handleChange(evt, 'senha')}
                  />
                </CustomGrid>
              )}
              { userState.id
              && (
                <CustomGrid item xs={12}>
                  <UserFormSection
                    icon="security"
                    title="Informações de gerenciamento"
                    description="Informações de identificação e gerenciamento"
                  />
                  <CustomTextField
                    label="Identificador (ID)"
                    value={userState.id}
                    disabled
                  />
                  <CustomTextField
                    label="Usuário criado em"
                    value={userState.dataDeCadastro ? displayFullDate(userState.dataDeCadastro) : 'N/D'}
                    disabled
                  />
                  <CustomTextField
                    label="Ultima atualização de cadastro"
                    value={userState.dataDeAtualizacao ? displayFullDate(userState.dataDeAtualizacao) : 'N/D'}
                    disabled
                  />
                  <CustomTextField
                    label="Status"
                    value={userState.ativo ? 'Ativo' : 'Inativo'}
                    disabled
                  />
                  { false && (
                    <CustomTooltip
                      placement="top-start"
                      arrow
                      title={(
                        <Typography component="span" variant="caption">
                          A url customizada ficará:
                          {' '}
                          {CODER_MIND_URL}
                          /autores/
                          <strong>{userState.customUrl ? formatCustomURL(userState.customUrl) : ''}</strong>
                        </Typography>
                    )}
                    >
                      <CustomTextField
                        label="URL customizada"
                        value={userState.customUrl}
                        onChange={(evt) => handleChange(evt, 'customUrl')}
                      />
                    </CustomTooltip>
                  )}
                </CustomGrid>
              )}
          </Container>
          )}
      </Form>
    </Container>
  );
}

UserForm.propTypes = {
  callToast: PropTypes.func.isRequired,
  match: reactRouterParams,
};

UserForm.defaultProps = {
  match: null,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
