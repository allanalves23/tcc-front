import React from 'react';

import PropTypes from 'prop-types';
import { userType } from '@/types';

import { connect } from 'react-redux';

import {
  List,
  Divider,
  Box,
  Typography,
  Icon,
} from '@material-ui/core';

import {
  DrawerList,
  CustomLink,
  CustomListItem,
  CustomDrawer,
} from './styles';

function DrawerMenu(props) {
  const {
    user,
    logout,
  } = props;

  return (
    <CustomDrawer
      open
      variant="permanent"
    >
      <CustomLink to="/">
        <Box id="coder-mind-logo" display="flex" alignItems="flex-start" justifyContent="center" mt={2} mb={1} />
      </CustomLink>
      <Divider />
      <DrawerList>
        <List>
          <CustomLink
            to="/articles"
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <Icon color="action">
                  article
                </Icon>
                <Typography component="span" variant="body2">
                  Artigos
                </Typography>
              </Box>
            </CustomListItem>
          </CustomLink>
          <CustomLink
            to="/themes"
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <Icon color="action">
                  bookmark
                </Icon>
                <Typography component="span" variant="body2">
                  Temas
                </Typography>
              </Box>
            </CustomListItem>
          </CustomLink>
          <CustomLink
            to="/categories"
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <Icon color="action">
                  category
                </Icon>
                <Typography component="span" variant="body2">
                  Categorias
                </Typography>
              </Box>
            </CustomListItem>
          </CustomLink>
          <CustomLink
            to="/my-account"
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <Icon color="action">
                  person_outline
                </Icon>
                <Typography component="span" variant="body2">
                  Minha conta
                </Typography>
              </Box>
            </CustomListItem>
          </CustomLink>
          { user.profileAccess === 'ADMIN' && (
            <CustomLink
              to="/management"
            >
              <CustomListItem
                button
              >
                <Box display="flex" alignItems="center">
                  <Icon color="action">
                    settings
                  </Icon>
                  <Typography component="span" variant="body2">
                    Configurações
                  </Typography>
                </Box>
              </CustomListItem>
            </CustomLink>
          )}
        </List>
        <List>
          <CustomListItem
            onClick={logout}
            button
            id="logout-button"
          >
            <Box display="flex" alignItems="center">
              <Icon color="action">
                exit_to_app
              </Icon>
              <Typography component="span" variant="body2">
                Sair
              </Typography>
            </Box>
          </CustomListItem>
        </List>
      </DrawerList>
    </CustomDrawer>
  );
}

DrawerMenu.propTypes = {
  user: userType.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user, theme: state.theme });

export default connect(mapStateToProps)(DrawerMenu);
