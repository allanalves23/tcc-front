import React, { useState, useEffect } from 'react';
import { userType } from '@/types';
import {
  Accordion,
  AccordionDetails,
  Grid,
  Box,
  CircularProgress,
} from '@material-ui/core';

import axios from 'axios';
import { connect } from 'react-redux';

import { scrollToTop } from '@/shared/index';

import Header from '../../Header';

import GeneralInformation from './GeneralInformation';
import ExtraInformation from './ExtraInformation';
import Configurations from './Configurations';
import CustomPanelSummary from './CustomPanelSummary';

import { CustomContainer } from './styles';

function MyAccount(props) {
  const {
    user,
  } = props;

  const [expanded, setExpanded] = useState(false);
  const [userState, setUserState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function handleChange(panel) {
    return (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };
  }

  useEffect(() => {
    const source = axios.CancelToken.source();

    async function getUser() {
      const id = user.userID;
      const url = `/users/${id}`;
      setLoading(true);

      try {
        await axios(url, { cancelToken: source.token }).then((res) => {
          setUserState(res.data);
        });

        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(true);
        }
      }
    }

    if (!userState && !error) getUser();

    return () => source.cancel();
  }, [user.userID, userState, error]);

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <CustomContainer>
      <Header
        icon="account_box"
        title="Minha conta"
        description="Acesse e gerencie informações da sua conta"
      />
      {loading
          && (
            <Box
              height="300px"
              width="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress size={80} color="primary" />
            </Box>
          )
      }
      {userState && !loading
          && (
          <Grid item xs={12}>
            <Accordion
              expanded={expanded === 'general_information'}
              onChange={handleChange('general_information')}
            >
              <CustomPanelSummary
                icon="person"
                title="Informações principais"
                description="Dados gerais e essenciais para seu cadastro"
                expanded={Boolean(expanded === 'general_information')}
              />
              <AccordionDetails>
                <GeneralInformation user={userState} />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === 'extra_information'}
              onChange={handleChange('extra_information')}
            >
              <CustomPanelSummary
                icon="public"
                title="Redes sociais e comunicação"
                description="Informações complementares, estarão públicas para qualquer leitor"
                expanded={Boolean(expanded === 'extra_information')}
              />
              <AccordionDetails>
                <ExtraInformation isActive={expanded === 'extra_information'} />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === 'configurations'}
              onChange={handleChange('configurations')}
            >
              <CustomPanelSummary
                icon="settings"
                title="Configurações"
                description="Opções avançadas sobre sua conta e preferências"
                expanded={Boolean(expanded === 'configurations')}
              />
              <AccordionDetails>
                <Configurations />
              </AccordionDetails>
            </Accordion>
          </Grid>
          )
      }
    </CustomContainer>
  );
}

MyAccount.propTypes = {
  user: userType.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(MyAccount);
