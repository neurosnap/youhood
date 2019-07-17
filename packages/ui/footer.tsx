import * as React from 'react';
import styled from 'styled-components';
import theme from '@youhood/theme';

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

export default () => (
  <FooterView>
    <FooterInner>
      <FooterSection style={{ margin: '0 50px 0 0' }}>
        <FooterHeader>Company</FooterHeader>
        <FooterLinks>
          <FooterLink href="/about">about</FooterLink>
        </FooterLinks>
      </FooterSection>
      <FooterSection>
        <FooterHeader>Product</FooterHeader>
        <FooterLinks>
          <FooterLink href="/pricing">pricing</FooterLink>
          <FooterLink href="/privacy">privacy</FooterLink>
          <FooterLink href="https://github.com/neurosnap/youhood/issues">
            submit feedback
          </FooterLink>
          <FooterLink href="https://github.com/neurosnap/youhood">
            source code
          </FooterLink>
        </FooterLinks>
      </FooterSection>
      <FooterSection>
        <FooterHeader>Developers</FooterHeader>
        <FooterLinks>
          <FooterLink href="/docs">docs</FooterLink>
        </FooterLinks>
      </FooterSection>
      <FooterSection>
        <FooterHeader>Contact</FooterHeader>
        <FooterLinks>
          <FooterLink href="mailto:support@youhood.io">
            support@youhood.io
          </FooterLink>
        </FooterLinks>
      </FooterSection>
    </FooterInner>
  </FooterView>
);
