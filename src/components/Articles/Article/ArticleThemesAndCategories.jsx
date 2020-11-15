import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { appTheme, articleType, userType } from '@/types';

import {
  Accordion,
  Box,
  Typography,
  AccordionDetails,
  Icon,
  Button,
} from '@material-ui/core';

import { connect } from 'react-redux';

import axios from 'axios';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { error } from '@/config/toasts';

import CustomAsyncSelect from '@/components/AsyncSelect.jsx';

import { CustomAccordionSummary, CustomLink } from './styles';

function ArticleThemesAndCategories(props) {
  const {
    article,
    open,
    close,
    expanded,
    themeApp,
    callToast,
    onSaveChanges,
    user,
  } = props;

  const [theme, setTheme] = useState(null);
  const [category, setCategory] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function toogleDetails() {
    if (!expanded) {
      open('themes&categories');
    } else {
      close();
    }
  }

  function onChangeTheme(newTheme) {
    setTheme(newTheme);
  }

  function onChangeCategory(newCategory) {
    setCategory(newCategory);
  }

  async function loadThemes(query) {
    if (category) setCategory(null);

    let themes = [];
    try {
      const url = `/temas?termo=${query}`;
      const response = await axios(url);

      themes = response.data.map((elem) => ({
        ...elem,
        label: elem.nome,
        value: elem.id,
      })) || [];
    } catch (err) {
      callToast(error('Ocorreu um erro ao obter os temas, se persistir reporte'));
    }

    return themes;
  }

  function themeIsDefined() {
    return (theme && theme.id);
  }

  function saveChanges() {
    const articleChanged = {
      tema: theme,
      categoria: category,
      providedInThemesAndCategories: true,
    };

    onSaveChanges(articleChanged);
    setIsSaved(true);
  }

  async function loadCategories(query) {
    let categories = [];
    try {
      const url = `/categorias/temas/${theme.id}?termo=${query}`;
      const response = await axios(url);

      categories = response.data.map((elem) => ({
        ...elem,
        label: elem.nome,
        value: elem.id,
      })) || [];
    } catch (err) {
      callToast(error('Ocorreu um erro ao obter as categorias, se persistir reporte'));
    }

    return categories;
  }

  useEffect(() => {
    if (!mounted) {
      if (article) {
        setTheme(article.tema ? {
          ...article.tema,
          label: article.tema.nome,
          value: article.tema.id,
        } : null);

        setCategory(article.categoria ? {
          ...article.categoria,
          label: article.categoria.nome,
          value: article.categoria.id,
        } : null);
      }
      setMounted(true);
    }
  }, [theme, category, mounted, article, article.tema, article.categoria]);

  useEffect(() => {
    if (!theme && mounted) {
      setCategory(null);
    }
  }, [theme, mounted]);

  useEffect(() => {
    let handler;
    if (isSaved) {
      handler = setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }

    return () => clearTimeout(handler);
  }, [isSaved]);

  return (
    <Accordion expanded={expanded}>
      <CustomAccordionSummary
        onClick={toogleDetails}
        expandIcon={<Icon>expand_more</Icon>}
      >
        <Typography variant="h6" component="h2">Temas & Categorias</Typography>
      </CustomAccordionSummary>
      <AccordionDetails>
        <Box width="100%">
          <Box mb={2}>
            <CustomAsyncSelect
              label="Tema"
              value={theme}
              onChange={onChangeTheme}
              loadOptions={loadThemes}
              helperText={(
                <Typography component="span" variant="caption">
                  Sem ideias? veja a lista de
                  {' '}
                  <CustomLink to="/themes" theme={themeApp} target="_blank">temas disponíveis</CustomLink>
                </Typography>
                )}
            />
          </Box>
          { themeIsDefined() && (
            <Box mb={2}>
              <CustomAsyncSelect
                label="Categoria"
                value={category}
                onChange={onChangeCategory}
                loadOptions={loadCategories}
                helperText={(
                  <Typography component="span" variant="caption">
                    Sem ideias? veja a lista de
                    {' '}
                    <CustomLink to="/categories" theme={themeApp} target="_blank">categorias disponíveis</CustomLink>
                  </Typography>
                  )}
              />
            </Box>
          )}
          {(article && article.autor && article.autor.usuarioId === user.id) && (
            <Box
              width="100%"
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              marginY={2}
            >
              {!isSaved && (
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={saveChanges}
                >
                  Salvar

                </Button>
              )}
            </Box>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

ArticleThemesAndCategories.propTypes = {
  themeApp: appTheme.isRequired,
  article: articleType.isRequired,
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  onSaveChanges: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
  callToast: PropTypes.func.isRequired,
  user: userType.isRequired,
};

ArticleThemesAndCategories.defaultProps = {
  expanded: false,
};

const mapStateToProps = (state) => ({ themeApp: state.theme, user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArticleThemesAndCategories);
