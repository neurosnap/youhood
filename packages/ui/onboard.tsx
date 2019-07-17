import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { WebState } from '@youhood/types';
import { selectors, actions } from '@youhood/onboard';
const { shouldShowOnboard } = selectors;
const { completeOnboard } = actions;
import theme from '@youhood/theme';

import { DropdownMenuButton } from './ui';

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
const Button = styled(DropdownMenuButton)``;
const PrevButton = styled(Button)`
  font-style: italic;
  color: #9a9a9a;
`;
const CompleteButton = styled(Button)`
  color: ${theme.palette.success};
`;
const Progress = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  margin: 0 5px 0 0;
  background-color: #ccc;
`;
const ProgressActive = styled(Progress)`
  background-color: ${theme.palette.success};
`;
const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 10px 0;
`;

const intro = () => (
  <Slide>
    <Header>Welcome to Youhood!</Header>
    <Section>
      The main goal of this site is to be the definitive source for determining
      neighborhood boundaries.
    </Section>
    <Section>
      With this site, users are able to create neighborhoods, vote on them, and
      the neighborhoods with the highest votes will be used as the source of our
      API.
    </Section>
  </Slide>
);

const problem = () => (
  <Slide>
    <Header>The Problem</Header>
    <Section>
      Neighborhood boundaries are difficult to determine because they are
      created largely by the people that live in those cities.
    </Section>
    <Section>
      Most services that provide neighborhood data are difficult to access,
      difficult to find, and outdated.
    </Section>
    <Section>
      Neighborhoods change over time, so why not create a service that is
      flexible to that change?
    </Section>
  </Slide>
);

const solution = () => (
  <Slide>
    <Header>The Solution</Header>
    <Section>
      We provide the tools for anyone to create neighborhoods, vote on them, and
      choose what neighborhoods are in a city.
    </Section>
    <Section>
      Developers will be able to use our API to better understand the different
      regions of a city.
    </Section>
    <Section>
      Apartment listing websites use neighborhood boundaries because they are
      important to how users think about a city.
    </Section>
    <Section>
      Common queries such as "kerrytown ann abor" or "downtown detroit" become
      trivial when leveraging our API.
    </Section>
  </Slide>
);

const closing = () => (
  <Slide>
    <Header>Want to contribute?</Header>
    <Section>
      In order to contribute you need to first register for an account.
    </Section>
    <Section>
      Then you can search for your city, vote on neighborhoods you agree with.
    </Section>
    <Section>Or you can contribute by creating new neighborhoods!</Section>
  </Slide>
);

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
      steps.push(<ProgressActive key={i} />);
    } else {
      steps.push(<Progress key={i} />);
    }
  }
  return <ProgressContainer>{steps}</ProgressContainer>;
};

interface IState {
  show: boolean;
}

interface IDispatch {
  hide: () => void;
}

interface IProps extends IState, IDispatch {}

class Onboard extends React.Component<IProps> {
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

    const CurrentSlide = slides[curSlide];

    const Btn = onLastSlide ? (
      <CompleteButton onClick={hide}>
        <div>Complete</div>
      </CompleteButton>
    ) : (
      <Button onClick={this.nextSlide}>
        <div>Continue</div>
      </Button>
    );

    const Prev = onFirstSlide ? null : (
      <PrevButton onClick={this.prevSlide}>
        <div>Previous</div>
      </PrevButton>
    );

    return (
      <Overlay>
        <Modal>
          <ProgressMeter step={curSlide} maxSteps={NUM_SLIDES} />
          <CurrentSlide />
          <Actions>
            {Prev}
            {Btn}
          </Actions>
        </Modal>
      </Overlay>
    );
  }
}

const mapState = (state: WebState) => ({
  show: shouldShowOnboard(state),
});
const mapDispatch = (dispatch: Dispatch) => ({
  hide: () => {
    const timestamp = new Date();
    dispatch(completeOnboard(Math.floor(timestamp.getTime() / 1000)));
  },
});

export default connect(
  mapState,
  mapDispatch,
)(Onboard);
