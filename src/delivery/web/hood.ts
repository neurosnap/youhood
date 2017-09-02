import { Component } from 'react';
import { connect } from 'react-redux';
import * as h from 'react-hyperscript';

import { Hood, State } from '../../types';
import {
  utils,
  actionCreators,
  selectors,
} from '../../packages/hood';
import { SetHoodNamePayload } from '../../packages/hood/action-creators';
import { actionCreators as menuActionCreators } from '../../packages/menu';

const { getHoodSelected } = selectors;
const {
  getHoodName,
  getHoodId,
  getHoodUser,
} = utils;
const {
  deselectHood,
  setHoodName,
} = actionCreators;
const { hideMenu } = menuActionCreators;

interface HoodProps {
  hood: Hood;
  show: boolean;
  updateHoodName: Function;
  handleDeselectHood: Function;
  hideHoodOverlay: Function;
}

interface DefaultProps {
  show: boolean;
  hood: Hood;
}

export class HoodView extends Component {
  props: HoodProps;

  static defaultProps: DefaultProps = {
    show: false,
    hood: null,
  };

  state = {
    name: '',
  };

  componentWillMount() {
    this.setState({ name: getHoodName(this.props.hood) });
  }

  componentWillReceiveProps(nextProps: HoodProps) {
    if (getHoodId(nextProps.hood) !== getHoodId(this.props.hood)) {
      this.setState({ name: getHoodName(nextProps.hood) });
    }
  }

  handleSave = () => {
    const { hood, updateHoodName } = this.props;
    const { name } = this.state;
    updateHoodName({ hoodId: getHoodId(hood), name });
  }

  handleClose = () => {
    const { handleDeselectHood, hideHoodOverlay, hood } = this.props;
    handleDeselectHood(hood);
    hideHoodOverlay();
  }

  handleInput = (event: Event) => {
    const name = (<HTMLInputElement>event.target).value;
    this.setState({ name });
  }

  render() {
    const { hood, show } = this.props;
    if (!show) return null;
    const { name } = this.state;
    const user = getHoodUser(hood);

    return h('div.overlay.hood', [
      h('div', [
        h('div', [
          h('span', 'User: '),
          h('span', user.name),
        ]),
        h('label', { htmlFor: 'hood-name' }, 'Hood'),
        h('input', {
          type: 'input',
          value: name,
          onChange: this.handleInput,
        }),
      ]),
      h('div.actions', [
        h('button', { onClick: this.handleSave }, 'Save'),
        h('button', { onClick: this.handleClose }, 'Close'),
      ]),
    ]);
  }
}

export default connect(
  (state: State) => ({
    hood: getHoodSelected(state),
  }),
  (dispatch: Function) => ({
    updateHoodName: (payload: SetHoodNamePayload) => dispatch(setHoodName(payload)),
    handleDeselectHood: (hood: Hood) => dispatch(deselectHood()),
    hideHoodOverlay: () => dispatch(hideMenu('overlay')),
  }),
)(HoodView as any);
