import { Component } from 'react';
import * as h from 'react-hyperscript';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { WebState } from '@youhood/types';
import { selectors, actions } from '@youhood/onboard';
import { Dispatch } from 'redux';
const { shouldShowOnboard } = selectors;
const { completeOnboard } = actions;

import { DropdownMenuButton, successColor } from './ui';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 314159;
`;
const Modal = styled.div`
  max-width: 500px;
  width: 100%;
  height: 450px;
  background-color: rgba(256, 256, 256, 0.9);
  display: flex;
  flex-direction: column;
  padding: 20px 40px;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
`;
const Actions = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const Slide = styled.div`
  flex: 1;
`;
const Header = styled.h2``;
const Section = styled.div`
  margin: 8px 0;
`;
const Button = DropdownMenuButton.extend``;
const PrevButton = Button.extend`
  font-style: italic;
  color: #9a9a9a;
`;
const CompleteButton = Button.extend`
  color: ${successColor};
`;
const Progress = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  margin: 0 5px 0 0;
  background-color: #ccc;
`;
const ProgressActive = Progress.extend`
  background-color: ${successColor};
`;
const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 10px 0;
`;

interface IState {
  show: boolean;
}

interface IDispatch {
  hide: () => void;
}

interface IProps extends IState, IDispatch {}

const intro = () => {
  return h(Slide, [
    h(Header, 'Wecome to YouHood!'),
    h(
      Section,
      `The main goal of this site is to be the definitive source for determining
      neighborhood boundaries.`,
    ),
    h(
      Section,
      `With this site, users are able to create neighborhoods, vote on them,
      and the neighborhoods with the highest votes will be used as the source of our API.`,
    ),
  ]);
};

const problem = () => {
  return h(Slide, [
    h(Header, 'The Problem'),
    h(
      Section,
      `Neighborhood boundaries are difficult to determine because they are created
      largely by the people that live in those cities.`,
    ),
    h(
      Section,
      `Most services that provide neighborhood data are difficult to access, difficult to find,
      and outdated.`,
    ),
    h(
      Section,
      `Neighborhoods change over time, so why not create a service that is flexible
      to that change?`,
    ),
  ]);
};

const solution = () => {
  return h(Slide, [
    h(Header, 'The Solution'),
    h(
      Section,
      `We provide the tools for anyone is allowed to create neighborhoods, vote
      on them, and choose what neighborhoods are in a city.`,
    ),
    h(
      Section,
      `Developers will be able to use our API to better understand the different
      regions of a city.`,
    ),
    h(
      Section,
      `Apartment listing websites user neighborhood boundaries because they are
      important to how users think about a city.`,
    ),
    h(
      Section,
      `Common queries such as "kerrytown ann abor" or "downtown detroit" become
      trivial when leveraging our API.`,
    ),
  ]);
};

const closing = () => {
  return h(Slide, [
    h(Header, 'Want to contribute?'),
    h(
      Section,
      'In order to contribute you need to first register for an account.',
    ),
    h(
      Section,
      'Then you can search for your city, vote on neighborhoods you agree with.',
    ),
    h(Section, 'Or you can contribute by creating new neighborhoods!'),
  ]);
};

const slides = [intro, problem, solution, closing];

const NUM_SLIDES = 4;

const ProgressMeter = ({
  step = 0,
  maxSteps = 4,
}: {
  step: number;
  maxSteps: number;
}) => {
  const steps = [];
  for (let i = 0; i < maxSteps; i += 1) {
    const completed = i <= step;
    if (completed) {
      steps.push(h(ProgressActive));
    } else {
      steps.push(h(Progress));
    }
  }
  return h(ProgressContainer, steps);
};

class Onboard extends Component<IProps> {
  static defaultProps = {
    show: false,
    hide: () => {},
  };

  state = {
    curSlide: 0,
  };

  nextSlide = () => {
    const { curSlide } = this.state;

    if (curSlide === NUM_SLIDES - 1) {
      return;
    }

    this.setState({
      curSlide: curSlide + 1,
    });
  };

  prevSlide = () => {
    const { curSlide } = this.state;

    if (curSlide === 0) {
      return;
    }

    this.setState({
      curSlide: curSlide - 1,
    });
  };

  render() {
    const { show, hide } = this.props;
    const { curSlide } = this.state;
    const onLastSlide = curSlide === NUM_SLIDES - 1;
    const onFirstSlide = curSlide === 0;
    if (!show) {
      return null;
    }

    const Slide = slides[curSlide];

    const Btn = onLastSlide
      ? h(CompleteButton, { onClick: hide }, [h('div', 'Complete')])
      : h(Button, { onClick: this.nextSlide }, [h('div', 'Continue')]);

    const Prev = onFirstSlide
      ? null
      : h(PrevButton, { onClick: this.prevSlide }, [h('div', 'Previous')]);

    return h(Overlay, [
      h(Modal, [
        h(ProgressMeter, { step: curSlide, maxSteps: NUM_SLIDES }),
        h(Slide),
        h(Actions, [Prev, Btn]),
      ]),
    ]);
  }
}

const mapState = (state: WebState) => ({
  show: shouldShowOnboard(state),
});
const mapDispatch = (dispatch: Dispatch) => ({
  hide: () => {
    const timestamp = new Date();
    dispatch(completeOnboard(timestamp.toString()));
  },
});

export default connect<IState, IDispatch>(
  mapState,
  mapDispatch,
)(Onboard);
