import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import {
  TextField,
  Grid,
  InputAdornment,
  Box,
  Switch,
  Typography,
  FormControlLabel,
  FormHelperText,
} from '@material-ui/core';

import {
  FaTwitterSquare,
  FaYoutube,
  FaGithub,
  FaInstagram,
} from 'react-icons/fa';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { defineErrorMsg } from '@/config/backend';
import { CODER_MIND_URL } from '@/config/dataProperties';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { setUser as storeUser } from '@/redux/user/userActions';
import { success, error } from '@/config/toasts';

import { formatCustomURL } from '@/config/masks';
import CustomButton from '@/components/Buttons/Button.jsx';

import {
  CustomTextField,
  CustomGrid,
  CustomTooltip,
  CustomFormGroup,
} from './styles';

function ExtraInformation(props) {
  const {
    user,
    callToast,
    isActive,
    setUser,
  } = props;

  const [userState, setUserState] = useState({});
  const [saving, setSaving] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  async function handleChange(evt, attr) {
    let { value } = evt.target;

    if (attr === 'customUrl') {
      setOpenTooltip(true);
      value = await formatCustomURL(value);
    }

    setUserState({ ...userState, [attr]: value });
  }

  function handleChecked(evt, attr) {
    const { checked } = evt.target;
    setUserState({ ...userState, [attr]: checked });
  }

  function formatUserToSave() {
    const userToSave = userState;

    delete userToSave.cellphone;

    return userToSave;
  }

  async function save() {
    setSaving(true);

    const url = `/users/${userState.id}`;

    const userToSave = formatUserToSave();
    await axios.patch(url, userToSave).then((res) => {
      callToast(success('Informações salvas com sucesso'));
      setOpenTooltip(false);

      const updatedUser = {
        user: res.data,
      };
      setUser(updatedUser);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setSaving(false);
  }

  useEffect(() => {
    if (!userState.id) {
      setUserState({ ...user });
    }
  }, [user, userState]);

  useEffect(() => {
    if (!isActive) setOpenTooltip(false);
  }, [isActive]);

  return (
    <Grid item xs={12}>
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
      >
        <Grid item xs={12} sm={6} md={4}>
          <CustomFormGroup>
            <FormControlLabel
              control={(
                <Switch
                  color="primary"
                  checked={Boolean(userState.publicProfile)}
                  value={userState.publicProfile}
                  onChange={(evt) => handleChecked(evt, 'publicProfile')}
                />
            )}
              label="Perfil publico?"
            />
            <FormHelperText>
              Marque para deixar seu perfil de autor público na plataforma
            </FormHelperText>
          </CustomFormGroup>
        </Grid>
        <Grid item xs={12} sm={5} md={4}>
          <CustomTooltip
            placement="top-start"
            arrow
            open={openTooltip}
            title={(
              <Typography component="span" variant="caption">
                Sua url ficará:
                {' '}
                {CODER_MIND_URL}
                /autores/
                <strong>{userState.customUrl ? formatCustomURL(userState.customUrl) : ''}</strong>
              </Typography>
          )}
          >
            <CustomTextField
              label="Url Personalizada"
              margin="dense"
              fullWidth
              error={false}
              value={userState.customUrl || ''}
              onChange={(evt) => handleChange(evt, 'customUrl')}
            />
          </CustomTooltip>
        </Grid>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        width="100%"
      >
        <CustomTextField
          label="Instagram"
          margin="dense"
          error={false}
          helperText={(
            <Typography component="span" variant="caption">
              /
              <strong>&lt;seu-username&gt;</strong>
            </Typography>
          )}
          value={userState.instagram || ''}
          onChange={(evt) => handleChange(evt, 'instagram')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaInstagram />
              </InputAdornment>
            ),
          }}
        />
        <CustomTextField
          label="Youtube"
          margin="dense"
          error={false}
          helperText={(
            <Typography component="span" variant="caption">
              /channel/
              <strong>&lt;seu-canal&gt;</strong>
            </Typography>
          )}
          value={userState.youtube || ''}
          onChange={(evt) => handleChange(evt, 'youtube')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaYoutube />
              </InputAdornment>
            ),
          }}
        />
        <CustomTextField
          label="Github"
          margin="dense"
          error={false}
          helperText={(
            <Typography component="span" variant="caption">
              /
              <strong>&lt;seu-username&gt;</strong>
            </Typography>
          )}
          value={userState.github || ''}
          onChange={(evt) => handleChange(evt, 'github')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaGithub />
              </InputAdornment>
            ),
          }}
        />
        <CustomTextField
          label="Twitter"
          margin="dense"
          error={false}
          helperText={(
            <Typography component="span" variant="caption">
              /
              <strong>&lt;seu-username&gt;</strong>
            </Typography>
          )}
          value={userState.twitter || ''}
          onChange={(evt) => handleChange(evt, 'twitter')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaTwitterSquare />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box
        display="flex"
        alignItems="baseline"
        flexWrap="wrap"
      >
        <CustomGrid item xs={12} md={6}>
          <TextField
            label="Ocupação"
            variant="outlined"
            multiline
            rows={7}
            fullWidth
            error={false}
            helperText={(
              <Typography component="span" variant="caption">
                Informe suas atuais atividades
              </Typography>
            )}
            value={userState.occupation || ''}
            onChange={(evt) => handleChange(evt, 'occupation')}
          />
        </CustomGrid>
        <CustomGrid item xs={12} md={6}>
          <TextField
            label="Especialidades"
            variant="outlined"
            multiline
            rows={7}
            fullWidth
            error={false}
            helperText={(
              <Typography component="span" variant="caption">
                Informe suas especialidades, técnicas e profissionais
              </Typography>
            )}
            value={userState.especiality || ''}
            onChange={(evt) => handleChange(evt, 'especiality')}
          />
        </CustomGrid>
      </Box>
      <Box width="100%" display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
        <CustomButton
          color="primary"
          icon="done"
          iconSize="small"
          text={saving ? 'Salvando...' : 'Salvar'}
          onClick={save}
          loading={saving}
        />
      </Box>
    </Grid>
  );
}

ExtraInformation.propTypes = {
  user: userType.isRequired,
  callToast: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  setUser: PropTypes.func.isRequired,
};

ExtraInformation.defaultProps = {
  isActive: false,
};

const mapStateToProps = (state) =>
  ({
    user: state.user,
    toast: state.toast,
  });

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    callToast: toastEmitter,
    setUser: storeUser,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ExtraInformation);
