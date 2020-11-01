import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';
import {
  MenuItem,
  Grid,
  Icon,
  Box,
  InputAdornment,
} from '@material-ui/core';

import CustomButton from '@/components/Buttons/Button.jsx';

import axios from 'axios';
import { defineErrorMsg } from '@/config/backend';

import { connect } from 'react-redux';
import { setUser as storeUser } from '@/redux/user/userActions';
import { bindActionCreators } from 'redux';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error } from '@/config/toasts';

import {
  CustomTextField,
  FullTextField,
} from './styles';

function GeneralInformation(props) {
  const {
    user,
    callToast,
  } = props;

  const [userState, setUserState] = useState({});
  const [saving, setSaving] = useState(false);

  function handleChange(evt, attr) {
    const { value } = evt.target;
    setUserState({ ...userState, [attr]: value });
  }

  async function save() {
    setSaving(true);
    try {
      const url = `/autores/${userState.id}`;

      await axios.put(url, userState).then(() => {
        callToast(success('Informações salvas com sucesso'));
      });
    } catch (err) {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    }

    setSaving(false);
  }

  useEffect(() => {
    if (!userState.id) {
      const newUser = user;

      setUserState(newUser);
    }
  }, [user, userState]);

  return (
    <Box width="100%">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        width="100%"
      >
        <Grid item xs={12}>
          <FullTextField>
            <CustomTextField
              label="E-mail"
              value={userState.email || ''}
              onChange={(evt) => handleChange(evt, 'email')}
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
            />
          </FullTextField>
          <CustomTextField
            label="Nome"
            inputProps={{ maxLength: 50 }}
            value={userState.nome || ''}
            onChange={(evt) => handleChange(evt, 'nome')}
          />
          <CustomTextField
            label="Genero"
            value={userState.genero || ''}
            select
            onChange={(evt) => handleChange(evt, 'genero')}
          >
            <MenuItem key="Masculino" value="Masculino">
              Masculino
            </MenuItem>
            <MenuItem key="Feminino" value="Feminino">
              Feminino
            </MenuItem>
            <MenuItem key="Outros" value="Outros">
              Outros
            </MenuItem>
            <MenuItem key="PrefereNaoInformar" value="PrefereNaoInformar">
              Prefere não informar
            </MenuItem>
          </CustomTextField>
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
