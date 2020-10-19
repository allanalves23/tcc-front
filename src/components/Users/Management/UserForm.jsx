import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { reactRouterParams, userType } from '@/types';

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
  celphoneMask,
  formatCustomURL,
  displayFullDate,
} from '@/config/masks';
import { scrollToTop } from '@/shared/index';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error, info } from '@/config/toasts';

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import Header from '@/components/Header.jsx';
import PasswordField from '@/components/PasswordField.jsx';
import FloatingButton from '@/components/Buttons/FloatingButton.jsx';

import UserFormSection from './UserFormSection';
import UserFormHud from './UserFormHud';
import DialogConfirmRemoveUser from './DialogConfirmRemoveUser';
import DialogSetPassword from './DialogSetPassword';

import {
  CustomLink,
  CustomTextField,
  CustomGrid,
  CustomKeyboardDatePicker,
  Form,
  CustomTooltip,
} from './styles';

function UserForm(props) {
  const {
    callToast,
    match,
    user,
  } = props;

  const [userState, setUserState] = useState({});
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [confirmRemoveUserDialog, setConfirmRemoveUserDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [redirect, setRedirect] = useState(false);

  function toogleSendEmailState() {
    localStorage.setItem('users-send-email', !sendEmail);
    setSendEmail(!sendEmail);
  }

  function showConfirmRemoveUserDialog() {
    if (saving || loading) return;

    // The User logged is trying remove their own account
    if (userState._id === user.userID) {
      callToast(info("Para remover sua conta acesse a opção 'Meus dados' e 'Configurações'"));
      return;
    }

    setConfirmRemoveUserDialog(true);
  }

  function hideConfirmRemoveUserDialog(event) {
    const { removed } = event;
    setConfirmRemoveUserDialog(false);

    if (removed) {
      setTimeout(() => setRedirect(true), 500);
    }
  }

  function showSetPasswordDialog() {
    if (saving || loading) return;
    setPasswordDialog(true);
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
      case 'cellphone': {
        value = celphoneMask(value);
        break;
      }
    }

    setUserState({ ...userState, [attr]: value });
  }

  function handleDate(birthDate) {
    setUserState({ ...userState, birthDate });
  }

  function formatData() {
    const data = { ...userState };

    if (data.cellphone) {
      data.cellphone = data.cellphone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
    }

    data.gender = data.gender || 'undefined';
    data.type = data.type || 'author';

    return data;
  }

  async function save() {
    if (saving) return;

    const method = userState._id ? 'put' : 'post';
    const url = method === 'post' ? `/users?sm=${sendEmail ? 'yes' : 'no'}` : `/users/${userState._id}?sm=${sendEmail ? 'yes' : 'no'}`;

    const data = await formatData();

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
      const url = `/users/${id}`;
      setLoading(true);
      await axios(url).then((res) => {
        setUserState({
          ...res.data,
          type: res.data.tagAdmin ? 'admin' : 'author',
        });
      }).catch((err) => {
        const msg = defineErrorMsg(err);
        callToast(error(msg));
      });

      setLoading(false);
    }

    if (reload) {
      scrollToTop();
      const preference = localStorage.getItem('users-send-email') === 'true';
      setSendEmail(preference);
    }

    if (id && reload) {
      getUser();
    }

    setReload(false);
  }, [userState, match, reload, sendEmail, callToast]);

  return (
    <Container className="page">
      <Header
        title="Usuário"
        description="Consulte, altere, crie e remova usuários do sistema"
        icon="person_add"
      />
      { redirect && <Redirect to="/users" />}
      { !loading && <FloatingButton action={save} icon="save" loading={saving} />}
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
              {userState._id ? 'Editar usuário' : 'Cadastrar usuário'}
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
              changePass={showSetPasswordDialog}
              remove={showConfirmRemoveUserDialog}
              toogleSendEmail={toogleSendEmailState}
              sendEmail={sendEmail}
              isSaving={saving}
              user={userState}
            />
            <CustomGrid item xs={12}>
              <UserFormSection
                icon="person_outlined"
                title="Informações principais"
                description="Informações obrigatórias para manter o cadastro do usuário"
              />
              <CustomTextField
                label="Nome"
                helperText="Nome completo"
                value={userState.name || ''}
                onChange={(evt) => handleChange(evt, 'name')}
              />
              <CustomTextField
                label="E-mail"
                value={userState.email || ''}
                helperText="Esta informação será usada para a autenticação no sistema"
                onChange={(evt) => handleChange(evt, 'email')}
              />
              <CustomTextField
                label="Genero"
                value={userState.gender || 'undefined'}
                select
                onChange={(evt) => handleChange(evt, 'gender')}
              >
                <MenuItem key="male" value="male">
                  Masculino
                </MenuItem>
                <MenuItem key="female" value="female">
                  Feminino
                </MenuItem>
                <MenuItem key="undefined" value="undefined">
                  Prefere não informar
                </MenuItem>
              </CustomTextField>
              <CustomTextField
                label="Tipo"
                value={userState.type || 'author'}
                helperText="Tipo de conta do usuário"
                select
                onChange={(evt) => handleChange(evt, 'type')}
              >
                <MenuItem key="admin" value="admin">
                  Administrador
                </MenuItem>
                <MenuItem key="author" value="author">
                  Autor
                </MenuItem>
              </CustomTextField>
            </CustomGrid>
            <Divider />
            <CustomGrid item xs={12}>
              <UserFormSection
                icon="location_city"
                title="Informações complementares"
                description="Informações não obrigatórias, somente preencha estes campos caso o usuário autorize a operação"
              />
              <CustomTextField
                label="Número de telefone"
                value={userState.cellphone || ''}
                helperText="Telefone fixo ou celular"
                onChange={(evt) => handleChange(evt, 'cellphone')}
                inputProps={{ maxLength: 15 }}
              />
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <CustomKeyboardDatePicker
                  label="Data de nascimento"
                  clearable
                  cancelLabel="Cancelar"
                  clearLabel="Limpar"
                  value={userState.birthDate || null}
                  onChange={handleDate}
                  mask="__/__/____"
                  maxDate={new Date()}
                  maxDateMessage="Data acima do permitido"
                  minDateMessage="Data abaixo do permitido"
                  format="DD/MM/YYYY"
                  invalidDateMessage="Formato de data inválido"
                />
              </MuiPickersUtilsProvider>
              <CustomTextField
                label="Endereço"
                value={userState.address || ''}
                onChange={(evt) => handleChange(evt, 'address')}
              />
              <CustomTextField
                label="Número"
                type="number"
                value={userState.number || ''}
                onChange={(evt) => handleChange(evt, 'number')}
              />
            </CustomGrid>
            <Divider />
            { !userState._id
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
                    value={userState.password}
                    fullWidth
                    onChange={(evt) => handleChange(evt, 'password')}
                  />
                </CustomGrid>
              )}
              { userState._id
              && (
                <CustomGrid item xs={12}>
                  <UserFormSection
                    icon="security"
                    title="Informações de gerenciamento"
                    description="Informações de identificação e gerenciamento"
                  />
                  <CustomTextField
                    label="Identificador (ID)"
                    value={userState._id}
                    disabled
                  />
                  <CustomTextField
                    label="Usuário criado em"
                    value={displayFullDate(userState.createdAt)}
                    disabled
                  />
                  <CustomTextField
                    label="Ultima atualização de cadastro"
                    value={displayFullDate(userState.updatedAt)}
                    disabled
                  />
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
  user: userType.isRequired,
};

UserForm.defaultProps = {
  match: null,
};

const mapStateToProps = (state) => ({ toast: state.config, user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
