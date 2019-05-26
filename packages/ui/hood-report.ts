import { Component, MouseEvent } from 'react';
import * as h from 'react-hyperscript';
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

export default class HoodReport extends Component<Props, State> {
  state = {
    open: false,
    reported: '',
  };

  toggle = (e: MouseEvent<HTMLElement>) => {
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
      return h(ReportMenuConn, {
        onClick: this.reported,
        hoodId: hood.id,
      });
    }

    return reported
      ? h(TextSmall, `Thanks! Reported for ${reported}`)
      : h(TextSmall, [
          h(
            LinkDanger,
            { onClick: this.toggle, href: `${domain}/report/${hood.id}` },
            'Report',
          ),
        ]);
  }
}

interface MapState {
  report: (p: ReportHoodPayload) => void;
}

interface MenuProps extends MapState {
  onClick: (r: string) => void;
  hoodId: HoodId;
}

class ReportMenu extends Component<MenuProps> {
  report = (e: MouseEvent<HTMLElement>, reason: string) => {
    const { report, hoodId, onClick } = this.props;
    e.preventDefault();
    report({
      hoodId,
      reason,
    });
    onClick(reason);
  };

  render() {
    return h(TextSmall, [
      h('div', 'Reason'),
      h(ButtonView, [
        h(
          LinkDanger,
          { onClick: (e) => this.report(e, 'Profanity'), href: '#' },
          'Profanity',
        ),
        h(
          LinkDanger,
          { onClick: (e) => this.report(e, 'Hood too large'), href: '#' },
          'Hood too large',
        ),
        h(
          LinkDanger,
          { onClick: (e) => this.report(e, 'Hood too small'), href: '#' },
          'Hood too small',
        ),
      ]),
    ]);
  }
}

const mapDispatch = (dispatch: Dispatch) => {
  return {
    report: (props: ReportHoodPayload) => dispatch(reportHood(props)),
  };
};
const ReportMenuConn = connect<MapState>(
  null,
  mapDispatch,
)(ReportMenu);
