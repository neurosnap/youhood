import styled from 'styled-components';
import theme from '@youhood/theme';
import * as h from 'react-hyperscript';

const FooterView = styled.div`
  padding: 65px 0 55px;
  color: #8898aa;
  line-height: 30px;
  font-size: 15px;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;

  ${theme.responsive.mobile`
    margin: 0 0 20px 20px;
  `}
`;

const FooterInner = styled.div`
  height: 300px;
  max-width: 1040px;
  width: 100%;
  display: flex;

  ${theme.responsive.mobile`
    height: auto;
    flex-direction: column;
  `}
`;

const FooterSection = styled.div`
  margin: 0 50px;

  ${theme.responsive.mobile`
    width: 100%;
    margin: 20px 0;
  `}
`;
const FooterHeader = styled.div`
  font-size: ${theme.font.size.normal};
  font-weight: 400;
  text-transform: uppercase;
`;
const FooterLinks = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;

  ${theme.responsive.mobile`
    margin: 0;
  `}
`;
const FooterLink = styled.a`
  text-decoration: none;
  color: rgb(136, 152, 170);
  margin: 3px 0;

  :hover {
    color: #32325d;
  }
`;

export default () =>
  h(FooterView, [
    h(FooterInner, [
      h(FooterSection, { style: { margin: '0 50px 0 0' } }, [
        h(FooterHeader, 'Company'),
        h(FooterLinks, [h(FooterLink, { href: '/about' }, 'about')]),
      ]),
      h(FooterSection, [
        h(FooterHeader, 'Product'),
        h(FooterLinks, [
          h(FooterLink, { href: '/pricing' }, 'pricing'),
          h(FooterLink, { href: '/privacy' }, 'privacy'),
          h(
            FooterLink,
            { href: 'https://github.com/neurosnap/youhood/issues' },
            'submit feedback',
          ),
          h(
            FooterLink,
            { href: 'https://github.com/neurosnap/youhood' },
            'source code',
          ),
        ]),
      ]),
      h(FooterSection, [
        h(FooterHeader, 'Developers'),
        h(FooterLinks, [h(FooterLink, { href: '/docs' }, 'docs')]),
      ]),
      h(FooterSection, [
        h(FooterHeader, 'Contact'),
        h(FooterLinks, [
          h(
            FooterLink,
            { href: 'mailto:support@youhood.io' },
            'support@youhood.io',
          ),
        ]),
      ]),
    ]),
  ]);
