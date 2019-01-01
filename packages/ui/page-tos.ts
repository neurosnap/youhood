import * as h from 'react-hyperscript';
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

const date = '12/31/2018';

const Intro = () =>
  h(Content, [
    h(Pg, `Last Updated: ${date}`),
    h(
      Pg,
      'These terms of service ("Terms") apply to your access and use of YouHood (the "Service"). Please read them carefully.',
    ),
  ]);

const Accepting = () =>
  h(Content, [
    h(
      Pg,
      "If you access or use the Service, it means you agree to be bound by all of the terms below. So, before you use the Service, please read all of the terms. If you don't agree to all of the terms below, please do not use the Service. Also, if a term does not make sense to you, please let us know by e-mailing support@youhood.io.",
    ),
  ]);

const Changes = () =>
  h(Content, [
    h(
      Pg,
      'We reserve the right to modify these Terms at any time. For instance, we may need to change these Terms if we come out with a new feature or for some other reason.',
    ),
    h(
      Pg,
      `Whenever we make changes to these Terms, the changes are effective immediately after we post such revised Terms (indicated by revising the date at the top of these Terms) or upon your acceptance if we provide a mechanism for your immediate acceptance of the revised Terms (such as a click-through confirmation or acceptance button). It is your responsibility to check YouHood for changes to these Terms.`,
    ),
    h(
      Pg,
      'If you continue to use the Service after the revised Terms go into effect, then you have accepted the changes to these Terms.',
    ),
  ]);

const Privacy = () =>
  h(Content, [
    h(
      Pg,
      'For information about how we collect and use information about users of the Service, please check out our privacy policy available at https://youhood.io/privacy.',
    ),
  ]);

const Services = () =>
  h(Content, [
    h(
      Pg,
      "From time to time, we may provide you with links to third party websites or services that we do not own or control. Your use of the Service may also include the use of applications that are developed or owned by a third party. Your use of such third party applications, websites, and services is governed by that party's own terms of service or privacy policies. We encourage you to read the terms and conditions and privacy policy of any third party application, website or service that you visit or use.",
    ),
  ]);

const Creating = () =>
  h(Content, [
    h(
      Pg,
      'When you create an account or use another service to log in to the Service, you agree to maintain the security of your password and accept all risks of unauthorized access to any data or other information you provide to the Service.',
    ),
    h(
      Pg,
      'If you discover or suspect any Service security breaches, please let us know as soon as possible.',
    ),
  ]);

const Contents = () =>
  h(Content, [
    h(
      Pg,
      'Our Service allows you and other users to post, link and otherwise make available content. You are responsible for the content that you make available to the Service, including its legality, reliability, and appropriateness.',
    ),
    h(
      Pg,
      'When you post, link or otherwise make available content to the Service, you grant us the right and license to use, reproduce, modify, publicly perform, publicly display and distribute your content on or through the Service. We may format your content for display throughout the Service, but we will not edit or revise the substance of your content itself.',
    ),
    h(
      Pg,
      'Aside from our limited right to your content, you retain all of your rights to the content you post, link and otherwise make available on or through the Service.',
    ),
    h(
      Pg,
      'You may not post, link and otherwise make available on or through the Service any of the following:',
    ),
    h(Ul, [
      h(
        'li',
        'Content that is libelous, defamatory, bigoted, fraudulent or deceptive;',
      ),
      h(
        'li',
        'Content that is illegal or unlawful, that would otherwise create liability;',
      ),
      h(
        'li',
        'Content that may infringe or violate any patent, trademark, trade secret, copyright, right of privacy, right of publicity or other intellectual or other right of any party;',
      ),
      h(
        'li',
        'Mass or repeated promotions, political campaigning or commercial messages directed at users who do not follow you (SPAM);',
      ),
      h(
        'li',
        'Private information of any third party (e.g., addresses, phone numbers, email addresses, Social Security numbers and credit card numbers); and',
      ),
      h(
        'li',
        'Viruses, corrupted data or other harmful, disruptive or destructive files or code.',
      ),
    ]),
    h(
      Pg,
      'Also, you agree that you will not do any of the following in connection with the Service or other users:',
    ),
    h(Ul, [
      h(
        'li',
        'Use the Service in any manner that could interfere with, disrupt, negatively affect or inhibit other users from fully enjoying the Service or that could damage, disable, overburden or impair the functioning of the Service;',
      ),
      h(
        'li',
        'Impersonate or post on behalf of any person or entity or otherwise misrepresent your affiliation with a person or entity;',
      ),
      h(
        'li',
        'Collect any personal information about other users, or intimidate, threaten, stalk or otherwise harass other users of the Service.',
      ),
      h(
        'li',
        'Create an account or post any content if you are not over 13 years of age years of age; and',
      ),
      h(
        'li',
        'Circumvent or attempt to circumvent any filtering, security measures, rate limits or other features designed to protect the Service, users of the Service, or third parties.',
      ),
    ]),
  ]);

const Materials = () =>
  h(Content, [
    h(
      Pg,
      'We put a lot of effort into creating the Service including, the logo and all designs, text, graphics, pictures, information and other content (excluding your content). This property is owned by us or our licensors and it is protected by U.S. and international copyright laws. We grant you the right to use it.',
    ),
    h(
      Pg,
      'However, unless we expressly state otherwise, your rights do not include: (i) publicly performing or publicly displaying the Service; (ii) modifying or otherwise making any derivative uses of the Service or any portion thereof; (iii) using any data mining, robots or similar data gathering or extraction methods; (iv) downloading (other than page caching) of any portion of the Service or any information contained therein; (v) reverse engineering or accessing the Service in order to build a competitive product or service; or (vi) using the Service other than for its intended purposes. If you do any of this stuff, we may terminate your use of the Service.',
    ),
  ]);

const Hyperlinks = () =>
  h(Content, [
    h(
      Pg,
      'You may create a hyperlink to the Service. But, you may not use, frame or utilize framing techniques to enclose any of our trademarks, logos or other proprietary information without our express written consent.',
    ),
    h(
      Pg,
      'YouHood makes no claim or representation regarding, and accepts no responsibility for third party websites accessible by hyperlink from the Service or websites linking to the Service. When you leave the Service, you should be aware that these Terms and our policies no longer govern.',
    ),
    h(
      Pg,
      "If there is any content on the Service from you and others, we don't review, verify or authenticate it, and it may include inaccuracies or false information. We make no representations, warranties, or guarantees relating to the quality, suitability, truth, accuracy or completeness of any content contained in the Service. You acknowledge sole responsibility for and assume all risk arising from your use of or reliance on any content.",
    ),
  ]);

const Legal = () =>
  h(Content, [
    h(
      Pg,
      'THE SERVICE AND ANY OTHER SERVICE AND CONTENT INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THE SERVICE ARE PROVIDED TO YOU ON AN AS IS OR AS AVAILABLE BASIS WITHOUT ANY REPRESENTATIONS OR WARRANTIES OF ANY KIND. WE DISCLAIM ANY AND ALL WARRANTIES AND REPRESENTATIONS (EXPRESS OR IMPLIED, ORAL OR WRITTEN) WITH RESPECT TO THE SERVICE AND CONTENT INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THE SERVICE WHETHER ALLEGED TO ARISE BY OPERATION OF LAW, BY REASON OF CUSTOM OR USAGE IN THE TRADE, BY COURSE OF DEALING OR OTHERWISE.',
    ),
    h(
      Pg,
      'IN NO EVENT WILL [DEVELOPER NAME] BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY SPECIAL, INDIRECT, INCIDENTAL, EXEMPLARY OR CONSEQUENTIAL DAMAGES OF ANY KIND ARISING OUT OF OR IN CONNECTION WITH THE SERVICE OR ANY OTHER SERVICE AND/OR CONTENT INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THE SERVICE, REGARDLESS OF THE FORM OF ACTION, WHETHER IN CONTRACT, TORT, STRICT LIABILITY OR OTHERWISE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES OR ARE AWARE OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY FOR ALL CAUSES OF ACTION AND UNDER ALL THEORIES OF LIABILITY WILL BE LIMITED TO THE AMOUNT YOU PAID TO [DEVELOPER NAME]. THIS SECTION WILL BE GIVEN FULL EFFECT EVEN IF ANY REMEDY SPECIFIED IN THIS AGREEMENT IS DEEMED TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.',
    ),
    h(
      Pg,
      "You agree to defend, indemnify and hold us harmless from and against any and all costs, damages, liabilities, and expenses (including attorneys' fees, costs, penalties, interest and disbursements) we incur in relation to, arising from, or for the purpose of avoiding, any claim or demand from a third party relating to your use of the Service or the use of the Service by any person using your account, including any claim that your use of the Service violates any applicable law or regulation, or the rights of any third party, and/or your violation of these Terms.",
    ),
  ]);

const Governing = () =>
  h(Content, [
    h(
      Pg,
      'The validity of these Terms and the rights, obligations, and relations of the parties under these Terms will be construed and determined under and in accordance with the laws of the Michigan, without regard to conflicts of law principles.',
    ),
  ]);

const Jurisdiction = () =>
  h(Content, [
    h(
      Pg,
      'You expressly agree that exclusive jurisdiction for any dispute with the Service or relating to your use of it, resides in the courts of the Michigan and you further agree and expressly consent to the exercise of personal jurisdiction in the courts of the Michigan located in Ann Arbor in connection with any such dispute including any claim involving Service. You further agree that you and Service will not commence against the other a class action, class arbitration or other representative action or proceeding.',
    ),
  ]);

const Termination = () =>
  h(Content, [
    h(
      Pg,
      'If you breach any of these Terms, we have the right to suspend or disable your access to or use of the Service.',
    ),
  ]);

const Agreement = () =>
  h(Content, [
    h(
      Pg,
      'These Terms constitute the entire agreement between you and YouHood regarding the use of the Service, superseding any prior agreements between you and YouHood relating to your use of the Service.',
    ),
  ]);

const Feedback = () =>
  h(Content, [
    h(
      Pg,
      'Please let us know what you think of the Service, these Terms and, in general, YouHood. When you provide us with any feedback, comments or suggestions about the Service, these Terms and, in general, YouHood, you irrevocably assign to us all of your right, title and interest in and to your feedback, comments and suggestions.',
    ),
  ]);

const Contact = () =>
  h(Content, [
    h(
      Pg,
      'Questions or comments about the Service may be directed to us at the email address support@youhood.io.',
    ),
  ]);

export default () => {
  return h('div', [
    h(NavbarStatic),
    h(View, [
      h(ContentView, [
        h(Header, 'YouHood Terms of Service'),
        h(Intro),
        h(Subheader, 'Accepting these Terms'),
        h(Accepting),
        h(Subheader, 'Changes to these Terms'),
        h(Changes),
        h(Subheader, 'Privacy Policy'),
        h(Privacy),
        h(Subheader, 'Third-Party Services'),
        h(Services),
        h(Subheader, 'Creating Accounts'),
        h(Creating),
        h(Subheader, 'Your Content & Conduct'),
        h(Contents),
        h(Subheader, 'YouHood Materials'),
        h(Materials),
        h(Subheader, 'Hyperlinks and Third Party Content'),
        h(Hyperlinks),
        h(Subheader, 'Unavoidable Legal Stuff'),
        h(Legal),
        h(Subheader, 'Governing Law'),
        h(Governing),
        h(Subheader, 'Jurisdiction'),
        h(Jurisdiction),
        h(Subheader, 'Termination'),
        h(Termination),
        h(Subheader, 'Entire Agreement'),
        h(Agreement),
        h(Subheader, 'Feedback'),
        h(Feedback),
        h(Subheader, 'Questions & Contact Information'),
        h(Contact),
      ]),
    ]),
    h(Footer),
  ]);
};
