import * as React from 'react';
import styled from 'styled-components';

import theme from '@youhood/theme';

import NavbarStatic from './navbar-static';
import Footer from './footer';

const Header = styled.h1`
  font-size: ${theme.font.size.header.large};
  font-weight: 300;

  ${theme.responsive.mobile`
    font-size: 2rem;
  `}
`;

const Subheader = styled(Header)`
  font-size: ${theme.font.size.header.small};
  margin-top: 20px;
`;

const View = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  color: #000;
`;

const Content = styled.div`
  margin-top: 20px;
`;

const ContentView = styled.div`
  max-width: 1040px;
  width: 100%;
  min-height: 650px;
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  ${theme.responsive.mobile`
    height: 450px;
  `}
`;

const Pg = styled.p`
  margin: 10px 0;
`;

const Ul = styled.ul`
  margin-left: 40px;
`;

const Intro = () => (
  <Content>
    <Pg>
      Eric Bower built the YouHood app as a Commercial app. This SERVICE is
      provided by Eric Bower and is intended for use as is.
    </Pg>
    <Pg>
      This page is used to inform visitors regarding my policies with the
      collection, use, and disclosure of Personal Information if anyone decided
      to use my Service.
    </Pg>
    <Pg>
      If you choose to use my Service, then you agree to the collection and use
      of information in relation to this policy. The Personal Information that I
      collect is used for providing and improving the Service. I will not use or
      share your information with anyone except as described in this Privacy
      Policy.
    </Pg>
    <Pg>
      The terms used in this Privacy Policy have the same meanings as in our
      Terms and Conditions, which is accessible at YouHood unless otherwise
      defined in this Privacy Policy.
    </Pg>
  </Content>
);

const Collection = () => (
  <Content>
    <Pg>
      For a better experience, while using our Service, I may require you to
      provide us with certain personally identifiable information, including but
      not limited to email address. The information that I request will be
      retained on your device and is not collected by me in any way.
    </Pg>
    <Pg>
      The app does use third party services that may collect information used to
      identify you.
    </Pg>
  </Content>
);

const Log = () => (
  <Content>
    <Pg>
      I want to inform you that whenever you use my Service, in a case of an
      error in the app I collect data and information (through third party
      products) on your phone called Log Data. This Log Data may include
      information such as your device Internet Protocol (“IP”) address, device
      name, operating system version, the configuration of the app when
      utilizing my Service, the time and date of your use of the Service, and
      other statistics.
    </Pg>
  </Content>
);

const Cookies = () => (
  <Content>
    <Pg>
      Cookies are files with a small amount of data that are commonly used as
      anonymous unique identifiers. These are sent to your browser from the
      websites that you visit and are stored on your device's internal memory.
    </Pg>
    <Pg>
      This Service does not use these “cookies” explicitly. However, the app may
      use third party code and libraries that use “cookies” to collect
      information and improve their services. You have the option to either
      accept or refuse these cookies and know when a cookie is being sent to
      your device. If you choose to refuse our cookies, you may not be able to
      use some portions of this Service.
    </Pg>
  </Content>
);

const Services = () => (
  <Content>
    <Pg>
      I may employ third-party companies and individuals due to the following
      reasons:
    </Pg>
    <Ul>
      <li>To facilitate our Service;</li>
      <li>To provide the Service on our behalf;</li>
      <li>To perform Service-related services; or</li>
      <li>To assist us in analyzing how our Service is used.</li>
    </Ul>
    <Pg>
      I want to inform users of this Service that these third parties have
      access to your Personal Information. The reason is to perform the tasks
      assigned to them on our behalf. However, they are obligated not to
      disclose or use the information for any other purpose.
    </Pg>
  </Content>
);

const Security = () => (
  <Content>
    <Pg>
      I value your trust in providing us your Personal Information, thus we are
      striving to use commercially acceptable means of protecting it. But
      remember that no method of transmission over the internet, or method of
      electronic storage is 100% secure and reliable, and I cannot guarantee its
      absolute security.
    </Pg>
  </Content>
);

const Other = () => (
  <Content>
    <Pg>
      This Service may contain links to other sites. If you click on a
      third-party link, you will be directed to that site. Note that these
      external sites are not operated by me. Therefore, I strongly advise you to
      review the Privacy Policy of these websites. I have no control over and
      assume no responsibility for the content, privacy policies, or practices
      of any third-party sites or services.
    </Pg>
  </Content>
);

const Children = () => (
  <Content>
    <Pg>
      These Services do not address anyone under the age of 13. I do not
      knowingly collect personally identifiable information from children under
      13. In the case I discover that a child under 13 has provided me with
      personal information, I immediately delete this from our servers. If you
      are a parent or guardian and you are aware that your child has provided us
      with personal information, please contact me so that I will be able to do
      necessary actions.
    </Pg>
  </Content>
);

const Changes = () => (
  <Content>
    <Pg>
      I may update our Privacy Policy from time to time. Thus, you are advised
      to review this page periodically for any changes. I will notify you of any
      changes by posting the new Privacy Policy on this page. These changes are
      effective immediately after they are posted on this page.
    </Pg>
  </Content>
);

const Contact = () => (
  <Content>
    <Pg>
      If you have any questions or suggestions about my Privacy Policy, do not
      hesitate to contact me.
    </Pg>
    <a href="mailto:support@youhood.io">support@youhood.io</a>
  </Content>
);

export default () => (
  <div>
    <NavbarStatic />
    <View>
      <ContentView>
        <Header>Privacy Policy</Header>
        <Intro />
        <Subheader>Information Collection and Use</Subheader>
        <Collection />
        <Subheader>Log Data</Subheader>
        <Log />
        <Subheader>Cookies</Subheader>
        <Cookies />
        <Subheader>Service Providers</Subheader>
        <Services />
        <Subheader>Security</Subheader>
        <Security />
        <Subheader>Links to Other Sites</Subheader>
        <Other />
        <Subheader>Children’s Privacy</Subheader>
        <Children />
        <Subheader>Changes to This Privacy Policy</Subheader>
        <Changes />
        <Subheader>Contact Us</Subheader>
        <Contact />
      </ContentView>
    </View>
    <Footer />
  </div>
);
