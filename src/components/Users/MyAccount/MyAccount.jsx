import React, { useState, useEffect } from 'react';
import { userType } from '@/types';
import {
  Accordion,
  AccordionDetails,
  Grid,
  Box,
  CircularProgress,
  Typography,
} from '@material-ui/core';

import axios from 'axios';
import { connect } from 'react-redux';

import { scrollToTop } from '@/shared/index';

import Header from '../../Header';

import GeneralInformation from './GeneralInformation';
import CustomPanelSummary from './CustomPanelSummary';

import { CustomContainer } from './styles';

function MyAccount(props) {
  const {
    user,
  } = props;

  const [expanded, setExpanded] = useState(false);
  const [userState, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function handleChange(panel) {
    return (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };
  }

  useEffect(() => {
    const source = axios.CancelToken.source();

    async function getUser() {
      const { id } = user;
      const url = `/autores/${id}`;
      setLoading(true);

      try {
        await axios(url, { cancelToken: source.token }).then((res) => {
          setUserState(res.data);
        });

        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }

    if (!userState && !error) getUser();

    return () => source.cancel();
  }, [user, user.userID, userState, error]);

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
      {!loading
          && (
          <Grid item xs={12}>
            <Accordion
              expanded={expanded === 'general_information'}
              onChange={handleChange('general_information')}
            >
              <CustomPanelSummary
                icon="person"
                title="Meu Perfil"
                description="Acesse e gerencie informações relacionadas ao perfil de Autor dos seus artigos"
                expanded={Boolean(expanded === 'general_information')}
              />
              <AccordionDetails>
                { error && (
                  <Box width="100%" display="flex" justifyContent="center" alignItems="center" p={4}>
                    <Typography variant="body2" component="p" align="center">
                      Ops, parece que não foi possível recuperar seu perfil de Autor,
                      por acaso você já criou algum Artigo?
                      Ao criar seu primeiro artigo você possuírá o acesso de editar
                      seu perfil de Autor.
                    </Typography>
                  </Box>
                )}
                { !error && (
                  <GeneralInformation user={userState} />
                )}
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
