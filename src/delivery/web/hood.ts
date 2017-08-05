import { Component } from 'react';
import { connect } from 'react-redux';
import h from 'react-hyperscript';

import { Polygon, InputEvent, State } from '../../types';
import {
  utils,
  actionCreators,
  selectors,
} from '../../packages/hood';
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

type HoodProps = {
  hood: Polygon,
  show: boolean,
  updateHoodName: Function,
  handleDeselectHood: Function,
  hideHoodOverlay: Function,
};

export class Hood extends Component {
  props: HoodProps;

  static defaultProps = {
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

  handleInput = (event: InputEvent) => {
    const name = event.target.value;
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
    updateHoodName: (payload: string) => dispatch(setHoodName(payload)),
    handleDeselectHood: (hood: Polygon) => dispatch(deselectHood(hood)),
    hideHoodOverlay: () => dispatch(hideMenu('overlay')),
  }),
)(Hood);
