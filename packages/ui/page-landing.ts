import * as h from 'react-hyperscript';
import styled from 'styled-components';

import NavbarStatic from './navbar-static';
import theme from '@youhood/theme';

export const Header = styled.h1`
  font-size: ${theme.font.size.header.xxlarge};
  font-weight: 300;

  ${theme.responsive.mobile`
    font-size: 2rem;
  `}
`;

const View = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  color: #fff;
`;

const Intro = styled.div`
  width: 100%;
  height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;

  ${theme.responsive.mobile`
    height: 450px;
  `}
`;

const IntroView = styled.div`
  max-width: 1040px;
  width: 100%;
  height: 338px;

  ${theme.responsive.mobile`
    margin: 0 20px;
  `}
`;

const Pg = styled.p`
  max-width: 500px;
  width: 50%;
  margin-top: 20px;
  line-height: 26px;
  font-weight: 300;

  ${theme.responsive.mobile`
    font-size: 1rem;
    width: 100%;
  `}
`;

const Stripes = styled.div`
  width: 100%;
  height: 760px;
  overflow: hidden;
  transform: skewY(-12deg);
  transform-origin: 0;
  background: linear-gradient(150deg, #53f 15%, #05d5ff 70%, #a6ffcb 94%);
  position: absolute;
  top: 0;

  ${theme.responsive.mobile`
    height: 500px;
  `}
`;

const Link = styled.a`
  width: 165px;
  white-space: nowrap;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 14px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  text-decoration: none;
  transition: all 0.15s ease;
  margin-right: 23px;
  color: #fff;
  background: #3ecf8e;
  text-align: center;

  :hover {
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
`;

const LinkExplore = styled(Link)`
  color: #6772e5;
  background-color: #fff;

  ${theme.responsive.mobile`
    margin-top: 10px;
  `}
`;

const LinkView = styled.div`
  margin-top: 65px;

  ${theme.responsive.mobile`
    margin-top: 40px;
  `}
`;

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

const ViewContainer = styled.div`
  position: relative;
`;

export default () => {
  return h(ViewContainer, [
    h(NavbarStatic, { style: { zIndex: 1 } }),
    h(View, [
      h(Intro, [
        h(IntroView, [
          h(Header, 'The neighborhood voting platform'),
          h(
            Pg,
            'Youhood is a crowd-sourced platform for determining neighborhoods within cities.  We also provide an API that allows services to obtain geographical data on neighborhoods.',
          ),
          h(LinkView, [
            h(Link, { href: '/signin' }, 'Create Account'),
            h(LinkExplore, { href: '/explore' }, 'Explore'),
          ]),
        ]),
      ]),
    ]),
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
            h(FooterLink, { href: '/faq' }, 'FAQ'),
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
      ]),
    ]),
    h(Stripes),
  ]);
};
