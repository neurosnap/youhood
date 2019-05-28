import * as h from 'react-hyperscript';
import { connect } from 'react-redux';
import * as React from 'react';
import styled from 'styled-components';

import { selectors } from '@youhood/token';
const { getToken } = selectors;
import { WebState } from '@youhood/types';
import theme from '@youhood/theme';

import { exampleHoodResp } from './mock';
import NavbarLogo from '../navbar-logo';

const dev = process.env.NODE_ENV === 'development';
const domain = dev ? 'http://localhost:8080' : 'https://api.youhood.io';

interface IProps {
  token: string;
}

const Pre = styled.pre`
  font-family: monospace;
  font-size: 13px;
  padding: 20px 40px;
  background-color: #272b2d;
`;

const Paragraph = styled.p`
  margin-bottom: 0;
  margin-top: 20px;
`;

const IntroText = () => {
  const intro = `
The YouHood API is organized around REST.
Our API has predictable, resource-oriented URLs, and uses HTTP response codes to indicate API errors.
We use built-in HTTP features, like HTTP authentication and HTTP verbs, which are understood by off-the-shelf HTTP clients.
JSON is returned by all API responses, including errors.
`;

  return h('div', [h(Paragraph, intro)]);
};

const IntroCode = () => {
  return h('div', [
    h(Example, [h(ExampleParagraph, 'Base URL'), h(Pre, domain)]),
  ]);
};

const AuthText = () => {
  const beg = `
  Authenticate your account by including your secret key in API requests.
  You can manage your API keys in the Dashboard.
  `;
  const fin = `
  All API requests must be made over HTTPS.
  Calls made over plain HTTP will fail.
  API requests without authentication will also fail.
  `;

  return h('div', [h(Paragraph, beg), h(Paragraph, fin)]);
};

const AuthCode: React.SFC<IProps> = ({ token }) => {
  const displayToken = token || 'INSERT-TOKEN-HERE';
  const isLoggedIn = !!token;

  return h('div', [
    isLoggedIn ? h(ExampleParagraph, 'Your current API token') : null,
    isLoggedIn ? h(Pre, displayToken) : null,
    h(ExampleParagraph, 'In order to authenticate use'),
    h(Pre, `-H "Authorization: Bearer ${displayToken}"`),
  ]);
};

const ErrorText = () => {
  const error = `
YouHood uses conventional HTTP response codes to indicate the success or failure of an API request.
In general: Codes in the 2xx range indicate success.
Codes in the 4xx range indicate an error that failed given the information provided (e.g., a required parameter was omitted, etc.).
Codes in the 5xx range indicate an error with YouHood's servers (these are rare).
`;
  return h('div', [h(Paragraph, error)]);
};

const buildUrl = (token: string, endpoint: string) => {
  const displayToken = token || 'INSERT-TOKEN-HERE';
  return `curl ${domain}${endpoint} \\
  -H "Authorization: Bearer ${displayToken}"`;
};

const HoodText = () => {
  return h('div', [
    h(Paragraph, 'Retrives neighborhoods within the state and city'),
  ]);
};

const Example = styled.div`
  padding: 30px 0;
`;

const ExampleParagraph = styled.p`
  margin: 10px 0;
`;

const ExReq = () => {
  return h(ExampleParagraph, 'Example Request');
};

const ExResp = () => {
  return h(ExampleParagraph, 'Example Response');
};

const HoodCode: React.SFC<IProps> = ({ token }) => {
  return h('div', [
    h(Pre, 'GET /hood/{state}/{city}'),
    h(Example, [h(ExReq), h(Pre, buildUrl(token, '/hood/mi/ann%20arbor'))]),
    h(Example, [h(ExResp), h(Pre, JSON.stringify(exampleHoodResp, null, 2))]),
  ]);
};

const SectionView = styled.div`
  display: flex;

  ${theme.responsive.mobile`
    flex-direction: column;
  `};
`;

const SectionLeft = styled.div`
  padding: 40px 20px 20px 40px;
  flex: 1;
  border-bottom: 1px solid #f0f4f7;
`;

const SectionRight = styled.div`
  width: 55%;
  background-color: rgb(45, 49, 51);
  color: rgb(199, 199, 199);
  padding: 60px 20px 20px 20px;
  border-bottom: 1px solid rgb(51, 56, 59);
  display: flex;
  flex-direction: column;

  ${theme.responsive.mobile`
    margin-top: 50px;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 20px 10px 40px 10px;
  `};
`;

const Section: React.SFC<{
  children?: any;
  title: string;
  id: string;
}> = ({ children, title, id }) => {
  return h(
    SectionView,
    React.Children.map(children, (child, index) => {
      const Title = () => h('h1', { id }, title);

      if (index === 0) {
        return h(SectionLeft, [h(Title), child]);
      }

      return h(SectionRight, [child]);
    }),
  );
};

const DocView = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DocViewInner = styled.div`
  width: 80%;

  ${theme.responsive.mobile`
    width: 100%;
  `};
`;

const Docs: React.SFC<IProps> = ({ token }) =>
  h('div', [
    h(NavbarLogo),
    h(DocView, [
      h(DocViewInner, [
        h(Section, { title: 'API Reference', id: 'api-reference' }, [
          h(IntroText),
          h(IntroCode),
        ]),
        h(Section, { id: 'auth', title: 'Authentication' }, [
          h(AuthText),
          h(AuthCode, { token }),
        ]),
        h(Section, { id: 'error', title: 'Errors' }, [
          h(ErrorText),
          h('div', ''),
        ]),
        h(Section, { title: 'Retrive neighborhoods for a city', id: 'hood' }, [
          h(HoodText),
          h(HoodCode, { token }),
        ]),
      ]),
    ]),
  ]);

const mapState = (state: WebState) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapState)(Docs);
