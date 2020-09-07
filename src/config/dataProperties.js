/**
 *
 * [EN]
 * What's this?
 * This file displays some default values for App data presentations.
 * For example: Table's limits, configuration values for components.
 * Make you sure for change values below.
 * Improper changes can affect App's behavior.
 *
 * [PT-BR]
 * O que é isto?
 * Este arquivo representa alguns valores padrões adotados para
 * representação de dados na aplicação.
 * Como limite de dados em tabelas, valores disponíveis para configuração
 * e também labels padronificadas que poderão aparecer perto de determinados
 * componentes.
 * Tenha certeza do que esteja fazendo.
 * Alterações indevidas poderão afetar o comportamento da aplicação.
 *
 */

export const OPTIONS_LIMIT = [10, 25, 50];
export const DEFAULT_LIMIT = 10;

export const SIMPLE_LOADING_MSG = 'Carregando...';
export const SAUDATION_LOADING_MSG = 'Carregando, por favor aguarde...';

export const SIMPLE_ERROR_MSG = 'Ocorreu um erro desconhecido, se persistir reporte';
export const ERROR_MSG_CUSTOM = 'Ops, parece que ocorreu um erro. Tente recarregar a página, se persistir tente novamente mais tarde';

export const COLOR_APP = '#d92f44';
export const COLOR_APP_HOVER = 'rgba(217, 47, 68, .8)';
export const COLOR_APP_LIGHT = 'rgba(217, 47, 68, .2)';
export const COLOR_APP_ULTRA_LIGHT = 'rgba(217, 47, 68, 0.04)';

export const CAPTCHA_SITE_KEY = process.env.REACT_APP_SITE_KEY_CAPTCHA;
/*
    [EN] - Only Tables from Material UI
    [PT-BR] - Apenas para tabelas do Material UI
*/
export const LIMIT_LABEL = 'Limite: ';
export const DISPLAYED_ROWS = (value) =>
  `${value.from}-${value.to} de ${value.count}`;

export const APP_VERSION = '2.0.2';
export const APP_BUILD = 'Stable';
export const APP_DEPENDENCIES = 'https://github.com/coder-mind-project/panel/blob/master/package.json';
export const APP_REPORT_US = 'https://github.com/coder-mind-project/coder-mind-panel/issues/new';

export const WHITE_LIST_ROUTES = [
  '/auth',
  '/redeem-account',
  '/ticket',
  '/confirm-email',
  '/remove-account',
];

export const CODER_MIND_URL = process.env.REACT_APP_CODER_MIND_URL;
