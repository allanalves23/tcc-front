import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';
import {
  MenuItem,
  Grid,
  Icon,
  Tooltip,
  Box,
  CircularProgress,
  InputAdornment,
  Typography,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import { celphoneMask } from '@/config/masks';

import CustomButton from '@/components/Buttons/Button.jsx';

import axios from 'axios';
import { defineErrorMsg } from '@/config/backend';

import { connect } from 'react-redux';
import { setUser as storeUser } from '@/redux/user/userActions';
import { bindActionCreators } from 'redux';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error, info } from '@/config/toasts';

import InputFileButton from '@/components/InputFiles.jsx';

import DialogRemoveImage from './DialogRemoveImage';

import {
  ImageButton,
  CustomTextField,
  CustomKeyboardDatePicker,
  FullTextField,
} from './styles';

function GeneralInformation(props) {
  const {
    user,
    callToast,
    setUser,
  } = props;

  const [userState, setUserState] = useState({});
  const [sendingPhoto, setSendingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [emailHelper, setEmailHelper] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [cancelingChangeEmail, setCancelingChangeEmail] = useState(false);
  const [showRemoveImg, setShowRemoveImg] = useState(false);

  function handleChange(evt, attr) {
    const { value } = evt.target;
    setUserState({ ...userState, [attr]: value });
  }

  function handleChangeMaskData(evt, attr) {
    if (typeof attr !== 'string') return;
    const { value } = evt.target;
    setUserState({ ...userState, [attr]: celphoneMask(value) });
  }

  function handleDate(date) {
    setUserState({ ...userState, birthDate: date });
  }

  function formatData() {
    const data = { ...userState };

    if (data.cellphone) {
      data.cellphone = data.cellphone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
    }

    return data;
  }

  async function save() {
    setSaving(true);
    try {
      const url = `/users/${user.userID}`;

      const data = await formatData();

      await axios.patch(url, data).then((res) => {
        callToast(success('Informações salvas com sucesso'));
        if (res.data.confirmEmail) {
          setUserState(res.data);
        }

        const updatedUser = {
          user: res.data,
        };

        setUser(updatedUser);
      });
    } catch (err) {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    }

    setSaving(false);
  }

  async function addPhoto(image) {
    // Only first image
    const img = image.target.files[0];
    if (!img) return callToast(info('Selecione uma imagem'));

    const id = user.userID;

    const formData = new FormData();
    formData.append('profilePhoto', img);

    // Overriding content-type https header for uploading images
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    const url = `/users/img/${id}`;

    setSendingPhoto(true);

    await axios.patch(url, formData, config).then(async (res) => {
      callToast(success('Operação realizada com sucesso'));

      const { profileImageUrl } = res.data;
      setUserState({ ...userState, profilePhoto: profileImageUrl });
      const updatedUser = {
        user: {
          ...user, profilePhoto: profileImageUrl,
        },
      };

      // Change user in global state (redux)
      setUser(updatedUser);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setSendingPhoto(false);

    return null;
  }

  function showConfirmRemoveImage() {
    if (!userState.profilePhoto) return;
    setShowRemoveImg(true);
  }

  function hideConfirmRemoveImage(callback) {
    if (callback.removed) {
      const updatedUser = { ...user, profilePhoto: '' };

      setUserState(updatedUser);
      setUser({ user: updatedUser });
    }
    setShowRemoveImg(false);
  }

  function displayEmailHelpMessage() {
    if (user.confirmEmail) {
      setEmailHelper(true);
    }
  }

  function hideEmailHelpMessage() {
    setEmailHelper(false);
  }

  async function resendEmail() {
    if (resendingEmail) return;

    const id = user.userID;
    const url = `/users/emails/${id}`;

    setResendingEmail(true);

    await axios.post(url, userState).then(() => {
      callToast(success('Enviamos um novo e-mail, verifique sua caixa de entrada'));
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setResendingEmail(false);
  }

  async function cancelChangeEmail() {
    if (cancelingChangeEmail) return;

    const id = user.userID;
    const url = `/users/emails/${id}`;

    setCancelingChangeEmail(true);

    await axios.delete(url).then(() => {
      let updatedUser = userState;
      delete updatedUser.confirmEmail;
      setUserState(updatedUser);

      updatedUser = {
        user: updatedUser,
      };
      setUser(updatedUser);
      callToast(success('Solicitação de alteração de e-mail removida com sucesso!'));
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setCancelingChangeEmail(false);
  }

  useEffect(() => {
    if (!userState.id) {
      const newUser = user;

      if (user.cellphone) {
        newUser.cellphone = celphoneMask(user.cellphone);
      }

      setUserState(newUser);
    }
  }, [user, userState]);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
      >
        <DialogRemoveImage
          open={showRemoveImg}
          closeDialog={hideConfirmRemoveImage}
          user={user}
        />
        { user.confirmEmail
          && (
            <Box width="100%">
              <Alert severity="warning">
                <Typography component="p" variant="body2">
                  Existe uma confirmação de e-mail pendente para
                  {' '}
                  <strong>{user.confirmEmail}</strong>
                  , para trocar seu e-mail visite sua caixa de
                  entrada e clique no link para confirmar o novo e-mail.
                </Typography>
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" mt={2}>
                  <Button
                    onClick={resendEmail}
                    variant="outlined"
                    color="inherit"
                    size="small"
                  >
                    { resendingEmail ? 'Reenviando e-mail...' : 'Reenviar e-mail'}
                  </Button>
                  <Button
                    onClick={cancelChangeEmail}
                    variant="outlined"
                    color="inherit"
                    size="small"
                  >
                    { cancelingChangeEmail ? 'Cancelando...' : 'Cancelar alteração de e-mail'}
                  </Button>
                </Box>
              </Alert>
            </Box>
          )
        }
        <Grid item xs={12} md={3}>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Tooltip
              title={user.profilePhoto
                ? (
                  <Typography component="span" variant="body2">
                    Remover Imagem
                  </Typography>
                ) : ''}
              placement="top"
            >
              <Box>
                { !sendingPhoto
                  && (
                    <ImageButton
                      haveImg={Boolean(user.profilePhoto)}
                      size={150}
                      round
                      name={user.userName}
                      src={userState.profilePhoto || null}
                      alt="Foto de perfil"
                      onClick={showConfirmRemoveImage}
                    />
                  )}
                { sendingPhoto
                  && (
                    <Box mt={1} mb={2}>
                      <CircularProgress color="primary" />
                    </Box>
                  )}
              </Box>
            </Tooltip>
            <Box mt={2} mb={2}>
              <InputFileButton onChange={addPhoto} name="profilePhoto">
                <Button size="small" color="primary" variant="contained">
                  {user.profilePhoto ? 'Alterar imagem' : 'Adicionar imagem'}
                </Button>
              </InputFileButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          <FullTextField>
            <CustomTextField
              label="E-mail"
              value={userState.email || ''}
              onFocus={displayEmailHelpMessage}
              onBlur={hideEmailHelpMessage}
              fullWidth
              InputProps={userState.confirmEmail ? {
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon fontSize="small" color="primary">
                      warning
                    </Icon>
                  </InputAdornment>
                ),
              } : {}}
              helperText={emailHelper ? 'Existe uma confirmação de e-mail pendente, caso não seja o e-mail desejado informe um novo e salve, depois basta olhar sua caixa de entrada' : ''}
              onChange={(evt) => handleChange(evt, 'email')}
            />
          </FullTextField>
          <CustomTextField
            label="Nome"
            inputProps={{ maxLength: 50 }}
            value={userState.name || ''}
            onChange={(evt) => handleChange(evt, 'name')}
          />
          <CustomTextField
            label="Genero"
            value={userState.gender || ''}
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
            label="Número de celular"
            placeholder="Ex: (11) 12355-5321"
            value={userState.cellphone || ''}
            onChange={(evt) => handleChangeMaskData(evt, 'cellphone')}
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
        </Grid>
      </Box>

      <Box width="100%" display="flex" alignItems="center" justifyContent="flex-end">
        <CustomButton
          color="primary"
          icon="done"
          iconSize="small"
          text={saving ? 'Salvando...' : 'Salvar'}
          onClick={save}
          loading={saving}
        />
      </Box>
    </Box>
  );
}

GeneralInformation.propTypes = {
  user: userType.isRequired,
  callToast: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) =>
  ({
    toast: state.config,
  });

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    setUser: storeUser,
    callToast: toastEmitter,
  },
  dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInformation);
