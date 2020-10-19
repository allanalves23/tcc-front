import React from 'react';

import {
  Grid, Box, Icon, CardContent,
  Typography, CardActions,
  Divider,
} from '@material-ui/core';

import { CustomGrid, CustomCard, FakeLink } from './styles';

import Button from '../Buttons/Button';

const ThemesAndCategories = (props) => {
  const { user } = { ...props };

  return (
    <CustomGrid item xs={12}>
      <Box mb={3}>
        <Box id="themes" width="100%" display="flex" alignItems="center">
          <Box mr={1}>
            <Icon>folder_open</Icon>
          </Box>
          <Typography variant="h6" component="h3">Temas & Categorias</Typography>
        </Box>
        <Typography variant="body2" component="span">
          {user && true
            ? 'Visualize, altere e remova temas e categorias para artigos.' : 'Visualize temas e categorias para artigos.'
          }
        </Typography>
      </Box>
      <Box width="100%" display="flex" flexWrap="wrap" alignItems="center">
        <Grid item xs={12} md={6}>
          <CustomCard>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Box mr={1} display="flex" alignItems="center">
                  <Icon>
                    bookmark
                  </Icon>
                </Box>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6" component="h4">
                    Temas
                  </Typography>
                </Box>
              </Box>
              { user && true
                  && (
                    <Typography component="p" variant="body2">
                      Temas estão relacionados aos artigos,
                      isto é, estarão disponíveis para inclusão durante
                      a criação dos artigos.
                    </Typography>
                  )
              }
            </CardContent>
            <CardActions>
              <Box width="100%" ml={2} mr={2}>
                <FakeLink to="/themes">
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
        <Grid item xs={12} md={6}>
          <CustomCard>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Box mr={1} display="flex" alignItems="center">
                  <Icon>
                    category
                  </Icon>
                </Box>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6" component="h4">
                    Categorias
                  </Typography>
                </Box>
              </Box>
              { user && true
                && (
                  <Typography component="p" variant="body2">
                    Categorias estão relacionados aos artigos,
                    isto é, estarão disponíveis para inclusão durante
                    a criação dos artigos.
                  </Typography>
                )
              }
            </CardContent>
            <CardActions>
              <Box width="100%" ml={2} mr={2}>
                <FakeLink to="/categories">
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
      { user && true
          && (
          <Box width="100%" mt={2}>
            <Divider />
          </Box>
          )
      }
    </CustomGrid>
  );
};

export default ThemesAndCategories;
