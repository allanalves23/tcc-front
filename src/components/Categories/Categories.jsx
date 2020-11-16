import React, { useState, useEffect } from 'react';
import { appTheme, userType } from '@/types';
import {
  Container,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  Paper,
  Box,
  LinearProgress,
  Typography,
} from '@material-ui/core';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { scrollToTop } from '@/shared/index';

import CustomButton from '@/components/Buttons/Button.jsx';
import CustomIconButton from '@/components/Buttons/IconButton.jsx';
import Header from '@/components/Header.jsx';
import DataNotFound from '@/components/NotFound/DataNotFound.jsx';
import LoadingList from '@/components/LoadingList.jsx';

import {
  OPTIONS_LIMIT,
  DEFAULT_LIMIT,
  LIMIT_LABEL,
  DISPLAYED_ROWS,
} from '@/config/dataProperties';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import Form from './Form';
import RemoveConfirmation from './RemoveConfirmation';

import {
  HudButtons,
  HudSearchBar,
  HudLink,
  TableIcon,
  TableWrapper,
} from './styles';

function Categories(props) {
  const {
    user,
    theme,
  } = props;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState(0);
  const [take, setTake] = useState(DEFAULT_LIMIT);
  const [error, setError] = useState(false);
  const [categorySelected, setCategorySelected] = useState({});
  const [reload, setReload] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openRemoveConfirm, setOpenRemoveConfirm] = useState(false);

  function changeQueryValue(term) {
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

  function handleOpenForm(isOpen = false, succeeded = false) {
    if (loading) return;

    if (!isOpen) {
      setCategorySelected({});
      setReload(succeeded);
    }

    setOpenForm(isOpen);
  }

  function handleOpenRemoveConfirm(isOpen = false, stack = null) {
    if (loading) return;

    if (!isOpen) {
      setCategorySelected({});

      if (stack && stack.removed) {
        if (stack.newPage) {
          setSkip(stack.newPage);
        }
        setReload(true);
      }
    }
    setOpenRemoveConfirm(isOpen);
  }

  function selectCategory(newCategory, reason) {
    switch (reason) {
      case 'remove': {
        handleOpenRemoveConfirm(true);
        break;
      }
      default: {
        handleOpenForm(true);
      }
    }
    setCategorySelected(newCategory);
  }

  useEffect(() => {
    const source = axios.CancelToken.source();
    const sourceCount = axios.CancelToken.source();

    async function getCountCategories() {
      const url = `/categorias/quantidade?termo=${query}`;

      await axios(url, { cancelToken: sourceCount.token })
        .then((res) => {
          setCount(res.data);
        });
    }

    async function searchCategories() {
      try {
        setLoading(true);
        const url = `/categorias?skip=${skip}&termo=${query}&take=${take}`;

        await axios(url, { cancelToken: source.token })
          .then(async (res) => {
            setReload(false);

            setCategories(res.data);
            setError(false);
          });

        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(true);
        }
      }
    }

    if (reload) {
      scrollToTop();
      searchCategories();
      getCountCategories();
    }

    return () => source.cancel();
  }, [skip, query, take, loading, error, categories, reload]);

  return (
    <Container id="component">
      <Header title="Categorias" description="Categorias para artigos" icon="category" />
      <Form
        open={openForm}
        onClose={(succeeded) => handleOpenForm(false, succeeded)}
        propCategory={categorySelected}
      />
      <RemoveConfirmation
        open={openRemoveConfirm}
        propCategory={categorySelected}
        categoriesQuantity={categories.length}
        onClose={(stack) => handleOpenRemoveConfirm(false, stack)}
        skip={skip}
      />
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" width="100%">
          <HudButtons>
            { user.profileAccess === 'ADMIN'
              && (
              <CustomButton
                color="primary"
                icon="add_circle_outline"
                onClick={() => handleOpenForm(true)}
              />
              )
            }
            { user.profileAccess === 'ADMIN'
              && (
                <HudLink to="/management">
                  <CustomButton
                    color="default"
                    icon="settings"
                    fullWidth
                  />
                </HudLink>
              )
            }
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
      {loading && categories.length === 0 && <LoadingList /> }
      {!loading && categories.length === 0 && (
        <DataNotFound msg="Nenhuma categoria encontrada" />
      )}
      <Paper>
        {loading && categories.length > 0 && <LinearProgress color="primary" />}
        {categories.length > 0 && (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <TableIcon fontSize="small" color="action">
                      category
                    </TableIcon>
                    <Typography component="span" variant="body1">
                      Categoria
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <TableIcon fontSize="small" color="action">
                      bookmark_border
                    </TableIcon>
                    <Typography component="span" variant="body1">
                      Descrição
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <TableIcon fontSize="small" color="action">
                      bookmark
                    </TableIcon>
                    <Typography component="span" variant="body1">
                      Tema
                    </Typography>
                  </Box>
                </TableCell>
                {user.profileAccess === 'ADMIN'
                  && (
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
                  )}
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((elem) => (
                <TableRow key={elem.id}>
                  <TableCell scope="name">
                    {elem.nome}
                  </TableCell>
                  <TableCell scope="alias">
                    {elem.descricao}
                  </TableCell>
                  <TableCell scope="theme">
                    {elem.tema ? elem.tema.nome : ''}
                  </TableCell>
                  {user.profileAccess === 'ADMIN'
                    && (
                      <TableCell scope="id">
                        <CustomIconButton
                          icon="edit"
                          color={theme === 'dark' ? 'inherit' : 'primary'}
                          tooltip={<Typography component="span" variant="body2">Editar</Typography>}
                          onClick={() => selectCategory(elem, 'edit')}
                        />
                        <CustomIconButton
                          icon="delete_forever"
                          tooltip={<Typography component="span" variant="body2">Remover</Typography>}
                          onClick={() => selectCategory(elem, 'remove')}
                        />
                      </TableCell>
                    )}
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
        )}
      </Paper>
    </Container>
  );
}

Categories.propTypes = {
  user: userType.isRequired,
  theme: appTheme.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user, toast: state.config, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
