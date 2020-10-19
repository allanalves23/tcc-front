import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { reactRouterParams } from '@/types';
import { Redirect } from 'react-router-dom';

import {
  Container,
  Box,
  useMediaQuery,
} from '@material-ui/core';

import axios from 'axios';
import { defineErrorMsg } from '@/config/backend';
import { useDebounce } from '@/hooks';

import { devices } from '@/config/devices';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error } from '@/config/toasts';

import { Scrollbars } from 'react-custom-scrollbars';
import MarkdownView from 'react-showdown';
import LoadingList from '@/components/LoadingList.jsx';
import ArticleHeader from './ArticleHeader';
import ArticleSettings from './ArticleSettings';

import {
  ArticleContent,
  CustomPaper,
  ArticleEditArea,
} from './styles';

function Article(props) {
  const {
    match,
    callToast,
  } = props;

  /**
   * @description Controller states
   */
  const [loading, setLoading] = useState(false);
  const [enableChanges, setEnableChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsReason, setSettingsReason] = useState(null);
  const [reload, setReload] = useState(true);
  const [redirect, setRedirect] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [shouldSaveChanges, setShouldSaveChanges] = useState(false);

  /**
   * @description Data states
   */
  const [article, setArticle] = useState({});
  const [articleChanged, setArticleChanged] = useState({});
  const [articleContent, setArticleContent] = useState('');
  const debounceArticleContent = useDebounce(articleContent, 1000);

  const previewRef = useRef(null);
  const matches = useMediaQuery(devices.mobileExtraLarge);

  function changeContent(evt) {
    const { value } = evt.target;
    if (!enableChanges) setEnableChanges(true);
    setArticleContent(value);
  }

  function setScrollTopPreview(scrollTop) {
    const previewArea = previewRef.current;
    if (previewArea) {
      previewArea.scrollTop(scrollTop);
    }
  }

  function scrollContent(evt) {
    const { scrollTop } = evt.target;
    setScrollTopPreview(scrollTop);
  }

  function tooglePreview() {
    setShowPreview(!showPreview);
  }

  function defineChangeStateSuccessMsg(state) {
    return state === 'published' ? 'Artigo publicado com sucesso' : 'Operação realizada com sucesso';
  }

  function changeState(newState) {
    const { id } = article;
    const url = `/artigos/${id}?state=${newState}`;

    axios.patch(url).then(() => {
      callToast(success(defineChangeStateSuccessMsg(newState)));
      setArticle({ ...article, state: newState });
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });
  }

  function saveChangesFromChild(articleFromChild) {
    setArticleChanged(articleFromChild);
    setShouldSaveChanges(true);
  }

  function removeReason() {
    setSettingsReason(null);
  }

  function openSettings(reason = null) {
    if (typeof reason === 'string') {
      setSettingsReason(reason);
    }
    setShowSettings(true);
  }

  function closeSettings() {
    removeReason();
    setShowSettings(false);
  }

  useEffect(() => {
    function isDiffCustomUri(firstArticle, secondArticle) {
      return firstArticle.customUri !== secondArticle.customUri
        && firstArticle.id === secondArticle.id;
    }

    function changeLocalUri(currentArticle) {
      setRedirect(`/articles/${currentArticle.customUri}`);
    }

    const source = axios.CancelToken.source();

    async function saveChanges() {
      const url = `/artigos/${article.id}`;

      setIsSaving(true);
      try {
        await axios.put(url, articleChanged, { cancelToken: source.token }).then(() => {
          setShouldSaveChanges(false);
          if (isDiffCustomUri(article, articleChanged)) {
            changeLocalUri(articleChanged);
          }

          setArticle({ ...article, ...articleChanged });
          setArticleChanged({});
        });
      } catch (err) {
        const msg = defineErrorMsg(err);
        callToast(error(msg));
      } finally {
        setIsSaving(false);
      }
    }

    if (shouldSaveChanges) {
      saveChanges();
    }

    return () => source.cancel();
  }, [shouldSaveChanges, articleChanged, article, callToast]);

  useEffect(() => {
    if (enableChanges) {
      setArticleChanged({ content: debounceArticleContent });
      setShouldSaveChanges(true);
    }
  }, [debounceArticleContent, enableChanges]);

  useEffect(() => {
    let handler;
    const source = axios.CancelToken.source();

    async function getArticle() {
      try {
        const { key } = match.params;
        const url = `/artigos/${key}?type=customUri`;

        setLoading(true);

        await axios(url, { cancelToken: source.token }).then((res) => {
          setReload(false);
          setArticle(res.data);
          setArticleContent(res.data.content);
        });

        setLoading(false);
      } catch (err) {
        setReload(false);

        if (!axios.isCancel(err)) {
          const msg = defineErrorMsg(err);
          callToast(error(msg));
          handler = setTimeout(() => {
            setRedirect('/articles');
          }, 1000);
        }
      }
    }

    if (reload) {
      getArticle();
    }

    return () => {
      clearTimeout(handler);
      source.cancel();
    };
  }, [reload, match, callToast]);

  return (
    <Container id="article-container">
      { redirect && <Redirect to={redirect} />}
      <ArticleSettings
        article={article}
        open={showSettings}
        close={closeSettings}
        reason={settingsReason}
        removeReason={removeReason}
        onSaveChanges={saveChangesFromChild}
        onChangeState={changeState}
      />
      { !loading && (
        <Box>
          <ArticleHeader
            article={article}
            isSaving={isSaving}
            onSaveChanges={saveChangesFromChild}
            onPublish={() => changeState('published')}
            onBoost={() => changeState('boosted')}
            onTooglePreview={tooglePreview}
            onShowSettings={openSettings}
            isPreviewed={showPreview}
          />
          <Box display="flex" height={425}>
            <ArticleEditArea sizewidth={showPreview && !matches ? 'withPreview' : 'withoutPreview'}>
              <CustomPaper>
                <ArticleContent
                  multiline
                  fullWidth
                  rows={21}
                  value={articleContent || ''}
                  onChange={changeContent}
                  onScroll={scrollContent}
                />
              </CustomPaper>
            </ArticleEditArea>
            { showPreview && !matches && (
              <ArticleEditArea>
                <CustomPaper>
                  <Scrollbars ref={previewRef}>
                    <MarkdownView
                      className="cm-preview"
                      markdown={articleContent}
                      options={{ tablesHeaderId: true, tables: true, emoji: true }}
                    />
                  </Scrollbars>
                </CustomPaper>
              </ArticleEditArea>
            )}
          </Box>
        </Box>
      )}
      { loading
        && <LoadingList height={600} />
      }
    </Container>
  );
}

Article.propTypes = {
  match: reactRouterParams.isRequired,
  callToast: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Article);
