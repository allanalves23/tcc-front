import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userType, appTheme } from '@/types';

import {
  Container,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  TableFooter,
  TablePagination,
  Paper,
  Box,
  LinearProgress,
  Typography,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import axios from 'axios';

import {
  OPTIONS_LIMIT,
  DEFAULT_LIMIT,
  LIMIT_LABEL,
  DISPLAYED_ROWS,
} from '@/config/dataProperties';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { info } from '@/config/toasts';

import { scrollToTop } from '@/shared/index';

import LoadingList from '@/components/LoadingList.jsx';
import CustomIconButton from '@/components/Buttons/IconButton.jsx';
import NotFound from '@/components/NotFound/DataNotFound.jsx';
import ErrorFromData from '@/components/Errors/ErrorFromData.jsx';
import CustomButton from '@/components/Buttons/Button.jsx';
import CustomChip from '@/components/Chip.jsx';
import Header from '@/components/Header.jsx';
import RemovedUsers from '@/components/Users/Management/RemovedUsers.jsx';
import DialogConfirmAdminPassword from './DialogConfirmAdminPassword';
import DialogConfirmRemoveUser from './DialogConfirmRemoveUser';
import DialogConfirmRestoreUser from './DialogConfirmRestoreUser';

import {
  HudLink,
  HudSearchBar,
  HudButtons,
  TableIcon,
  TableWrapper,
  CustomLink,
} from './styles';

function Users(props) {
  const {
    user,
    callToast,
    theme,
  } = props;

  const [users, setUsers] = useState([]);
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState(0);
  const [take, setTake] = useState(DEFAULT_LIMIT);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userSelected, setUserSelected] = useState({});
  const [validateDialog, setValidateDialog] = useState(false);
  const [removedUsersDialog, setRemovedUsersDialog] = useState(false);
  const [confirmRestoreUserDialog, setConfirmRestoreUserDialog] = useState(false);
  const [confirmRemoveUserDialog, setConfirmRemoveUserDialog] = useState(false);
  const [reload, setReload] = useState(true);

  async function changeQueryValue(term) {
    setQuery(term);
    setSkip(0);
    setReload(true);
  }

  function changeSkip(event, page) {
    if (page) {
      if (!take) {
        setSkip(0);
      } else {
        const newSkip = page < (skip / take) ? (skip - take) : (skip + take);
        setSkip(newSkip);
      }
    } else {
      setSkip(0);
    }

    setReload(true);
  }

  function changeTake(event) {
    const { value } = event.target;
    setTake(value);
    setSkip(0);
    setReload(true);
  }

  function showRemovedUsersDialog() {
    setRemovedUsersDialog(true);
  }

  function hideRemovedUsersDialog(event) {
    const { needsReload } = event;

    if (needsReload) setReload(true);
    setRemovedUsersDialog(false);
  }

  function hideValidadeDialog(event) {
    setValidateDialog(false);
    const { authorized } = event;

    if (authorized) {
      showRemovedUsersDialog();
    }
  }

  function showConfirmRemoveUserDialog(userNotYetSelected) {
    if (loading) return;

    // The User logged is trying remove their own account
    if (userNotYetSelected.id === user.userID) {
      callToast(info('Não é possível remover sua propria conta'));
      return;
    }
    setUserSelected(userNotYetSelected);
    setConfirmRemoveUserDialog(true);
  }

  function showConfirmRestoreUserDialog(userNotYetSelected) {
    if (loading) return;

    setUserSelected(userNotYetSelected);
    setConfirmRestoreUserDialog(true);
  }

  function hideConfirmUserDialog(event) {
    const { removed, restored } = event;
    if (removed || restored) {
      setSkip(0);
      setTake(DEFAULT_LIMIT);
      setReload(true);
    }
    setConfirmRemoveUserDialog(false);
    setConfirmRestoreUserDialog(false);
  }

  useEffect(() => {
    const source = axios.CancelToken.source();
    const sourceCount = axios.CancelToken.source();

    async function getCountUsers() {
      const url = `/usuarios/quantidade?termo=${query}`;

      await axios(url, { cancelToken: sourceCount.token })
        .then((res) => {
          setCount(res.data);
        });
    }

    async function searchUsers() {
      const url = `/usuarios?skip=${skip}&termo=${query}&take=${take}`;
      setLoading(true);
      await axios(url, { cancelToken: source.token }).then((res) => {
        setUsers(res.data);
      }).catch(() => {
        setError(true);
      });

      setLoading(false);
    }

    if (reload) {
      scrollToTop();
      setError(false);
      setReload(false);
      searchUsers();
      getCountUsers();
    }
  }, [reload, users, count, skip, error, take, query]);

  return (
    <Container className="page">
      <Header
        title="Usuários"
        description="Usuários do painel"
        icon="people"
      />
      <DialogConfirmAdminPassword
        open={validateDialog}
        closeDialog={hideValidadeDialog}
      />
      <DialogConfirmRemoveUser
        open={confirmRemoveUserDialog}
        closeDialog={hideConfirmUserDialog}
        user={userSelected}
      />
      <DialogConfirmRestoreUser
        open={confirmRestoreUserDialog}
        closeDialog={hideConfirmUserDialog}
        user={userSelected}
      />
      <RemovedUsers
        open={removedUsersDialog}
        closeDialog={hideRemovedUsersDialog}
      />
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" width="100%">
          <HudButtons>
            <HudLink to="/user">
              <CustomButton
                color="primary"
                icon="add_circle_outline"
                fullWidth
              />
            </HudLink>
          </HudButtons>
          <HudSearchBar
            id="search_field"
            fullWidth
            placeholder="Pesquisar"
            value={query}
            onChange={(q) => changeQueryValue(q)}
            onCancelSearch={() => changeQueryValue('')}
          />
        </Box>
      </Box>
      {loading && users.length === 0
        && <LoadingList />
      }
      {!loading && !error && users.length === 0
        && (
          <NotFound msg="Ops, Nenhum usuário encontrado" />
        )
      }
      { error
        && (
          <ErrorFromData
            msg="Ops, ocorreu um erro ao obter os usuários"
            reload={() => setReload(true)}
          />
        )
      }
      <Paper>
        { users.length > 0 && loading && <LinearProgress />}
        { users.length > 0 && !error
            && (
            <TableWrapper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TableIcon fontSize="small" color="action">
                          alternate_email
                        </TableIcon>
                        <Typography component="span" variant="body1">
                          E-mail
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TableIcon fontSize="small" color="action">
                          bookmarks
                        </TableIcon>
                        <Typography component="span" variant="body1">
                          Perfil
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TableIcon fontSize="small" color="action">
                          status
                        </TableIcon>
                        <Typography component="span" variant="body1">
                          Status
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TableIcon fontSize="small" color="action">
                          build
                        </TableIcon>
                        <Typography component="span" variant="body1">
                          Ações
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((elem) => (
                    <TableRow key={elem.id} hover>
                      <TableCell scope="email">
                        {elem.email}
                      </TableCell>
                      <TableCell scope="perfilDeAcesso">
                        {elem.perfilDeAcesso === 'Admin' ? 'ADMINISTRADOR' : 'COMUM'}
                      </TableCell>
                      <TableCell scope="ativo">
                        <CustomChip
                          size="small"
                          color={elem.ativo ? 'primary' : 'default'}
                          sizeIcon="small"
                          icon={elem.ativo ? 'done' : 'delete'}
                          text={elem.ativo ? 'Ativo' : 'Inativo'}
                        />
                      </TableCell>
                      <TableCell scope="id">
                        <CustomLink to={`/user/${elem.id}`}>
                          <CustomIconButton
                            icon="edit"
                            color={theme === 'dark' ? 'inherit' : 'primary'}
                            tooltip={<Typography component="span" variant="body2">Editar</Typography>}
                          />
                        </CustomLink>
                        {elem.ativo && (
                          <CustomIconButton
                            icon="delete_forever"
                            tooltip={<Typography component="span" variant="body2">Remover</Typography>}
                            onClick={() => showConfirmRemoveUserDialog(elem)}
                          />
                        )}
                        {!elem.ativo && (
                          <CustomIconButton
                            icon="restore_from_trash"
                            tooltip={<Typography component="span" variant="body2">Reativar</Typography>}
                            onClick={() => showConfirmRestoreUserDialog(elem)}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={OPTIONS_LIMIT}
                      colSpan={4}
                      count={count}
                      rowsPerPage={take}
                      labelRowsPerPage={LIMIT_LABEL}
                      labelDisplayedRows={DISPLAYED_ROWS}
                      page={skip / take}
                      onChangePage={changeSkip}
                      onChangeRowsPerPage={changeTake}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableWrapper>
            )
        }
      </Paper>
    </Container>
  );
}

Users.propTypes = {
  user: userType.isRequired,
  callToast: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user, toast: state.config, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Users);
