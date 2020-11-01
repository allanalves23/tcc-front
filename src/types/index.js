import {
  shape,
  string,
  bool,
  oneOf,
  oneOfType,
  number,
  object,
} from 'prop-types';

export const userType = shape({
  id: oneOfType([
    string,
    number,
  ]),
  nome: string,
  email: string,
  genero: string,
  url: string,
  dataCadastro: oneOfType([
    Date,
    string,
  ]),
});

export const themeType = shape({
  id: number,
  nome: string,
  descricao: string,
});

export const categoryType = shape({
  id: number,
  nome: string,
  descricao: string,
  tema: themeType,
});

export const articleType = shape({
  id: number,
});

export const appTheme = oneOf([
  'light',
  'dark',
]);

export const reactRouterParams = shape({
  path: string,
  url: string,
  isExact: bool,
  params: object, // Property types are changed according to the context
});

export const toastConfig = shape({
  type: string,
  msg: string,
  display: bool,
});

export const asyncSelectValueType = shape({
  label: string,
  value: oneOfType([
    string,
    number,
  ]),
});
