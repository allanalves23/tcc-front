import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { articleType } from '@/types';
import { useDebounce } from '@/hooks';
import { devices } from '@/config/devices';

import { Box, useMediaQuery } from '@material-ui/core';

import CustomButton from '@/components/Buttons/Button.jsx';
import SavedIndicator from './SavedIndicator';

import {
  ArticleTitleTextField,
  ArticleDescriptionTextField,
  ArticleIcon,
  ArticleLogo,
  CustomDivider,
  HudButtons,
} from './styles';

function ArticleHeader(props) {
  const {
    article,
    isSaving,
    onPublish,
    onBoost,
    onShowSettings,
    onSaveChanges,
    onTooglePreview,
    isPreviewed,
  } = props;

  /**
   * @description Controller states
   */
  const [mounted, setMounted] = useState(false);
  const [enabledChanges, setEnabledChanges] = useState(false);
  const [emitChanges, setEmitChanges] = useState(false);

  /**
   * @description Data states
   */
  const [articleState, setArticleState] = useState({ titulo: '', descricao: '' });
  const debouncedArticle = useDebounce(articleState, 1000);

  const matches = useMediaQuery(devices.tablet);

  function changeTitleOrDescription(evt, attr) {
    setEnabledChanges(true);
    const { value } = evt.target;
    setArticleState({ ...articleState, [attr]: value });
  }

  function isPublished() {
    return article.estado === 'PUBLICADO';
  }

  function isBoosted() {
    return article.estado === 'IMPULSIONADO';
  }

  useEffect(() => {
    if (emitChanges) {
      setEmitChanges(false);
      onSaveChanges(debouncedArticle);
    }
  }, [emitChanges, onSaveChanges, debouncedArticle]);

  useEffect(() => {
    if (enabledChanges) {
      setEmitChanges(true);
    }
  }, [debouncedArticle, enabledChanges]);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      const { titulo, descricao } = article;
      setArticleState({ titulo: titulo || '', descricao: descricao || '' });
    }
  }, [article, articleState, mounted]);

  return (
    <Box marginBottom={1} minHeight="85px">
      <Box marginBottom={1} display="flex" flexDirection="column">
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center" width="100%">
            <ArticleLogo onClick={() => onShowSettings('images')}>
              { !article.logoImg && <ArticleIcon color="action">text_snippet</ArticleIcon>}
              { article.logoImg && <img src={article.logoImg} alt={article.titulo} />}
            </ArticleLogo>
            <ArticleTitleTextField
              value={articleState.titulo}
              placeholder={articleState.titulo || 'Artigo sem título'}
              onChange={(evt) => changeTitleOrDescription(evt, 'titulo')}
              fullWidth
            />
            <SavedIndicator saving={isSaving} />
          </Box>
          <Box display="flex" alignItems="center">
            <HudButtons smalldevices={matches.toString()}>
              <Box marginX={1} marginBottom={matches ? 1 : 0}>
                {!isPublished() && !isBoosted() && (
                  <CustomButton
                    color="primary"
                    text={matches ? '' : 'Publicar'}
                    icon="publish"
                    variant="contained"
                    size={matches ? 'small' : 'medium'}
                    onClick={onPublish}
                  />
                )}
                {isPublished() && !isBoosted() && (
                  <CustomButton
                    color="primary"
                    text={matches ? '' : 'Impulsionar'}
                    icon="star_rate"
                    variant="contained"
                    size={matches ? 'small' : 'medium'}
                    onClick={onBoost}
                  />
                )}
              </Box>
              { !matches && (
                <Box marginX={1} marginBottom={matches ? 1 : 0}>
                  <CustomButton
                    variant="contained"
                    color="default"
                    text={matches ? '' : 'Preview'}
                    icon={isPreviewed ? 'visibility_off' : 'visibility'}
                    onClick={onTooglePreview}
                    size={matches ? 'small' : 'medium'}
                  />
                </Box>
              )}
              <Box marginX={1}>
                <CustomButton
                  icon="settings"
                  color="primary"
                  size={matches ? 'small' : 'medium'}
                  onClick={onShowSettings}
                  marginBottom="0"
                />
              </Box>
            </HudButtons>
          </Box>
        </Box>
        <Box marginY={1} width="100%">
          <ArticleDescriptionTextField
            fontSize={0.9}
            value={articleState.descricao}
            placeholder={articleState.descricao || 'Nenhuma descrição definida'}
            onChange={(evt) => changeTitleOrDescription(evt, 'descricao')}
          />
        </Box>
      </Box>
      <CustomDivider />
    </Box>
  );
}

ArticleHeader.propTypes = {
  article: articleType.isRequired,
  isSaving: PropTypes.bool,
  onPublish: PropTypes.func.isRequired,
  onBoost: PropTypes.func.isRequired,
  onSaveChanges: PropTypes.func.isRequired,
  onShowSettings: PropTypes.func.isRequired,
  onTooglePreview: PropTypes.func.isRequired,
  isPreviewed: PropTypes.bool,
};

ArticleHeader.defaultProps = {
  isPreviewed: false,
  isSaving: false,
};

export default ArticleHeader;
