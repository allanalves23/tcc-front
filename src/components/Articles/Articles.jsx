import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { Container, Icon } from '@material-ui/core';

import { OPTIONS_LIMIT, DEFAULT_LIMIT } from '@/config/dataProperties';
import { scrollToTop } from '@/shared/index';

import axios from 'axios';
import { connect } from 'react-redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error as toastError } from '@/config/toasts';
import { defineErrorMsg } from '@/config/backend';

import MaterialTable from 'material-table';

import Header from '@/components/Header.jsx';
import NotFound from '@/components/NotFound/DataNotFound.jsx';
import Chip from '@/components/Chip.jsx';
import { bindActionCreators } from 'redux';
import ArticleHeaderTableCell from './ArticleHeaderTableCell';
import CreateArticleDialog from './CreateArticleDialog';

import { TableWrapper } from './styles';

function Articles(props) {
  const { callToast } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(true);
  const [createArticleDialog, setCreateArticleDialog] = useState(false);

  const history = useHistory();

  function getArticleState(article) {
    let state;
    let icon;
    let color;

    switch (article.state) {
      case 'published': {
        state = 'Publicado';
        icon = 'public';
        color = 'primary';
        break;
      }
      case 'inactivated': {
        state = 'Inativo';
        icon = 'public_off';
        color = 'default';
        break;
      }
      case 'boosted': {
        state = 'Impulsionado';
        icon = 'star_rate';
        color = 'primary';
        break;
      }
      case 'Removed': {
        state = 'Removido';
        icon = 'delete';
        color = 'secondary';
        break;
      }
      default: {
        state = 'Rascunho';
        icon = 'drafts';
        color = 'default';
      }
    }

    return { state, icon, color };
  }

  function getArticleListColumns() {
    const authorColumns = [
      {
        title: <ArticleHeaderTableCell icon="article" label="Artigo" />,
        field: 'title',
      },
      {
        title: <ArticleHeaderTableCell icon="label" label="Status" />,
        field: 'state',
        render: (rowData) => {
          const { state, color, icon } = getArticleState(rowData);
          return (<Chip className="cm-chip" text={state} icon={icon} color={color} size="small" sizeIcon="small" />);
        },
      },
      {
        title: <ArticleHeaderTableCell icon="bookmark" label="Tema" />,
        field: 'theme.name',
      },
      {
        title: <ArticleHeaderTableCell icon="category" label="Categoria" />,
        field: 'category.name',
      },
    ];

    const adminColumns = [
      {
        title: <ArticleHeaderTableCell icon="article" label="Artigo" />,
        field: 'title',
      },
      {
        title: <ArticleHeaderTableCell icon="person" label="Autor" />,
        field: 'author.name',
      },
      {
        title: <ArticleHeaderTableCell icon="label" label="Status" />,
        field: 'state',
        render: (rowData) => {
          const { state, color, icon } = getArticleState(rowData);
          return (<Chip className="cm-chip" text={state} icon={icon} color={color} size="small" sizeIcon="small" />);
        },
      },
      {
        title: <ArticleHeaderTableCell icon="bookmark" label="Tema" />,
        field: 'theme.name',
      },
      {
        title: <ArticleHeaderTableCell icon="category" label="Categoria" />,
        field: 'category.name',
      },
    ];

    return true ? adminColumns : authorColumns;
  }

  function openCreateArticleDialog() {
    setCreateArticleDialog(true);
  }

  function closeArticleDialog(stack) {
    setCreateArticleDialog(false);
    if (stack && stack.reason === 'articleCreated') {
      history.push(`/articles/${stack.customUri}`);
    }
  }

  function changePage(futurePage) {
    setPage(futurePage + 1);
    setReload(true);
  }

  function changeLimit(futureLimit) {
    setLimit(futureLimit);
    setReload(true);
  }

  function getBySearch(q) {
    setQuery(q);
    setPage(1);
    setReload(true);
  }

  function removeArticles(articlesToRemove) {
    const state = 'removed';
    const url = '/artigos';

    const articlesId = articlesToRemove.map((elem) => elem.id);

    axios.put(url, { state, articlesId }).then(() => {
      const msg = `Artigo${articlesId.length > 1 ? 's' : ''} removido${articlesId.length > 1 ? 's' : ''} com sucesso`;
      callToast(success(msg));
      setReload(true);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(toastError(msg));
    });
  }

  function changeState(articlesToChange, state) {
    const url = '/artigos';

    const articlesId = articlesToChange.map((elem) => elem.id);

    axios.put(url, { state, articlesId }).then(() => {
      callToast(success('Operação realizada com sucesso'));
      setReload(true);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(toastError(msg));
    });
  }

  function openArticle(article) {
    history.push(`/articles/${article.customUri}`);
  }

  useEffect(() => {
    const source = axios.CancelToken.source();

    async function getArticles() {
      try {
        const url = `/artigos?query=${query}&page=${page}&limit=${limit}&op=all`;
        setLoading(true);

        await axios(url, { cancelToken: source.token })
          .then((res) => {
            setReload(false);

            setArticles(res.data);
            setError(res.data.error);
            setCount(res.data.count);
            setLimit(res.data.limit);
          })
          .catch(() => {
            setReload(false);
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
      getArticles();
    }
    return () => source.cancel();
  }, [articles, loading, count, page, limit, reload, error, query]);

  return (
    <Container id="component">
      <Header
        title="Artigos"
        description="Consulte, altere e crie novos artigos"
        icon="article"
      />
      <CreateArticleDialog open={createArticleDialog} onClose={closeArticleDialog} />
      <TableWrapper>
        <MaterialTable
          columns={getArticleListColumns()}
          data={articles}
          totalCount={count}
          isLoading={loading}
          page={page - 1}
          onChangeRowsPerPage={changeLimit}
          onChangePage={changePage}
          onSearchChange={getBySearch}
          customFilterAndSearch={() => null}
          showFirstLastPageButtons={false}
          icons={{
            ResetSearch: () => (query ? <Icon color="action">clear</Icon> : ''),
            FirstPage: () => <Icon color="action">first_page</Icon>,
            PreviousPage: () => <Icon color="action">chevron_left</Icon>,
            NextPage: () => <Icon color="action">chevron_right</Icon>,
            LastPage: () => <Icon color="action">last_page</Icon>,
          }}
          options={{
            selection: true,
            showTitle: false,
            showTextRowsSelected: false,
            pageSize: DEFAULT_LIMIT,
            pageSizeOptions: OPTIONS_LIMIT,
            toolbarButtonAlignment: 'left',
            selectionProps: {
              color: 'primary',
            },
            headerStyle: {
              zIndex: 1,
            },
            debounceInterval: 500,
            maxBodyHeight: 750,
            paginationType: 'normal',
          }}
          localization={{
            body: {
              emptyDataSourceMessage: (<NotFound msg="Ops! Nenhum artigo encontrado" disableboxshadow />),
            },
            toolbar: {
              searchPlaceholder: 'Titulo ou descrição',
            },
            pagination: {
              lastTooltip: 'Última página',
              firstTooltip: 'Primeira página',
              previousTooltip: 'Página anterior',
              nextTooltip: 'Próxima página',
              labelRowsSelect: 'Linhas',
              labelDisplayedRows: '{from}-{to} de {count}',
            },
          }}
          onRowClick={((evt, selectedRow) => openArticle(selectedRow))}
          actions={[
            {
              tooltip: 'Novo artigo',
              icon: 'add_circle',
              onClick: openCreateArticleDialog,
              position: 'toolbar',
            },
            {
              tooltip: 'Publicar artigos', icon: 'publish', onClick: (evt, data) => changeState(data, 'published'), position: 'toolbarOnSelect',
            },
            {
              tooltip: 'Impulsionar artigos', icon: 'star_rate', onClick: (evt, data) => changeState(data, 'boosted'), position: 'toolbarOnSelect',
            },
            {
              tooltip: 'Inativar artigos', icon: 'not_interested', onClick: (evt, data) => changeState(data, 'inactivated'), position: 'toolbarOnSelect',
            },
            {
              tooltip: 'Remover artigos', icon: 'delete', onClick: (evt, data) => removeArticles(data), position: 'toolbarOnSelect',
            },
          ]}
        />
      </TableWrapper>
    </Container>
  );
}

Articles.propTypes = {
  callToast: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Articles);
