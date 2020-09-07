import React, { useState, useEffect } from 'react';

import { Box } from '@material-ui/core';
import { Redirect, useLocation } from 'react-router-dom';

import ButtonMobileAppBar from './ButtonMobileAppBar';

import { AppBarBottom } from './styles';

function AppBarMobile() {
  const location = useLocation();
  const [redirect, setRedirect] = useState('');

  function setActiveLocation(intended) {
    setRedirect(intended);
  }

  function getActiveLocation(intended) {
    return location.pathname === intended;
  }

  useEffect(() => {
    if (redirect) setRedirect('');
  }, [redirect]);

  return (
    <AppBarBottom
      position="fixed"
      color="inherit"
    >
      {redirect && <Redirect to={redirect} />}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ButtonMobileAppBar
          onClick={() => setActiveLocation('/')}
          isActive={getActiveLocation('/')}
          icon="article"
          label="Artigos"
        />
        <ButtonMobileAppBar
          onClick={() => setActiveLocation('/themes')}
          isActive={getActiveLocation('/themes')}
          icon="bookmark"
          label="Temas"
        />
        <ButtonMobileAppBar
          onClick={() => setActiveLocation('/my-account')}
          isActive={getActiveLocation('/my-account')}
          icon="person_outlined"
          label="Minha conta"
        />
      </Box>
    </AppBarBottom>
  );
}

export default AppBarMobile;
