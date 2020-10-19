import React from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import { Breadcrumbs, Typography, Icon } from '@material-ui/core';
import { CustomLink } from './styles';


function UserFormBreadCrumbs(props) {
  const {
    user,
    nextIcon,
    steps,
  } = props;

  return (
    <Breadcrumbs
      separator={(
        <Icon fontSize="small">
          {nextIcon}
        </Icon>
      )}
    >
      { steps.map((elem, index) => {
        index + 1 === steps.length
          ? (
            <Typography component="span" variant="body2">
              {user.userID ? 'Editar usuário' : 'Criar usuário'}
            </Typography>
          )
          : (
            <CustomLink to="/management">
              <Typography component="span" variant="body2">Configurações</Typography>
            </CustomLink>
          );
      })
      }
    </Breadcrumbs>
  );
}

UserFormBreadCrumbs.propTypes = {
  user: userType.isRequired,
  nextIcon: PropTypes.string,
};

UserFormBreadCrumbs.defaultProps = {
  nextIcon: 'navigate_next_icon',
};

export default UserFormBreadCrumbs;
