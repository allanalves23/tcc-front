import React from 'react';

import {
  Grid,
  Box,
  Icon,
  CardContent,
  Typography,
  CardActions,
} from '@material-ui/core';

import Button from '../Buttons/Button';

import { CustomGrid, CustomCard, FakeLink } from './styles';

function Settings() {
  return (
    <CustomGrid item xs={12}>
      <Box mb={3}>
        <Box width="100%" display="flex" alignItems="center">
          <Box mr={1}>
            <Icon>work_outline</Icon>
          </Box>
          <Typography variant="h6" component="h3">Gerenciamento</Typography>
        </Box>
        <Typography variant="body2" component="span">
          Gerencie usuários da plataforma.
        </Typography>
      </Box>
      <Box width="100%" display="flex" flexWrap="wrap" alignItems="center">
        <Grid item xs={12} md={6}>
          <CustomCard>
            <CardContent>
              <Box id="users" display="flex" alignItems="center">
                <Box mr={1} display="flex" alignItems="center">
                  <Icon>
                    people
                  </Icon>
                </Box>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6" component="h4">
                    Usuários
                  </Typography>
                </Box>
              </Box>
              <Typography component="p" variant="body2">
                Crie perfis para autores,
                administradores para acesso a plataforma.
                Usuários de tipos diferentes possui acesso a diferentes funcionalidades.
              </Typography>
            </CardContent>
            <CardActions>
              <Box width="100%" ml={2} mr={2}>
                <FakeLink to="/users">
                  <Button
                    color="primary"
                    icon="exit_to_app"
                    text="Acessar"
                  />
                </FakeLink>
              </Box>
            </CardActions>
          </CustomCard>
        </Grid>
      </Box>
    </CustomGrid>
  );
}

export default Settings;
