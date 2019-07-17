import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { domain } from '@youhood/fetch';
import { HoodProps, HoodId } from '@youhood/hood/types';
import { actions, ReportHoodPayload } from '@youhood/report';
const { reportHood } = actions;

import { TextSmall, LinkDanger } from './ui';

const ButtonView = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
`;

interface Props {
  hood: HoodProps;
}

interface State {
  open: boolean;
  reported: string;
}

export default class HoodReport extends React.Component<Props, State> {
  state = {
    open: false,
    reported: '',
  };

  toggle = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.setState({
      open: !this.state.open,
    });
  };

  reported = (reason: string) => {
    this.setState({
      reported: reason,
      open: false,
    });
  };

  render() {
    const { hood } = this.props;
    const { open, reported } = this.state;
    if (open) {
      return <ReportMenuConn onClick={this.reported} hoodId={hood.id} />;
    }

    if (reported) {
      return <TextSmall>Thanks! Reported for ${reported}</TextSmall>;
    }

    return (
      <TextSmall>
        <LinkDanger onClick={this.toggle} href={`${domain}/report/${hood.id}`}>
          Report
        </LinkDanger>
      </TextSmall>
    );
  }
}

interface MapState {
  report: (p: ReportHoodPayload) => void;
}

interface MenuProps extends MapState {
  onClick: (r: string) => void;
  hoodId: HoodId;
}

class ReportMenu extends React.Component<MenuProps> {
  report = (e: React.MouseEvent<HTMLElement>, reason: string) => {
    const { report, hoodId, onClick } = this.props;
    e.preventDefault();
    report({
      hoodId,
      reason,
    });
    onClick(reason);
  };

  render() {
    return (
      <TextSmall>
        <div>Reason</div>
        <ButtonView>
          <LinkDanger onClick={(e) => this.report(e, 'Profanity')} href="#">
            Profanity
          </LinkDanger>
          <LinkDanger
            onClick={(e) => this.report(e, 'Hood too large')}
            href="#"
          >
            Hood too large
          </LinkDanger>
          <LinkDanger
            onClick={(e) => this.report(e, 'Hood too small')}
            href="#"
          >
            Hood too small
          </LinkDanger>
        </ButtonView>
      </TextSmall>
    );
  }
}

const mapDispatch = (dispatch: Dispatch) => {
  return {
    report: (props: ReportHoodPayload) => dispatch(reportHood(props)),
  };
};
const ReportMenuConn = connect<null, MapState>(
  null,
  mapDispatch,
)(ReportMenu);
