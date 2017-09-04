import { Component } from 'react';
import { connect } from 'react-redux';
import * as h from 'react-hyperscript';

import { Hood, State, User } from '../../types';
import {
  utils,
  actionCreators,
  selectors,
} from '../../packages/hood';
const {
  getHoodName,
  getHoodId,
} = utils;
const {
  deselectHood,
  setHoodName,
} = actionCreators;
const { getHoodSelected } = selectors;
import { SetHoodNamePayload } from '../../packages/hood/action-creators';
import { actionCreators as menuActionCreators } from '../../packages/menu';
const { hideMenu } = menuActionCreators;
import { selectors as userSelectors } from '../../packages/user';
const { getUserById, getCurrentUserId } = userSelectors;

interface HoodProps {
  hood: Hood;
  user: User;
  show: boolean;
  updateHoodName: Function;
  handleDeselectHood: Function;
  hideHoodOverlay: Function;
  canEdit: boolean;
}

interface DefaultProps {
  show: boolean;
  hood: Hood;
  user: User;
  canEdit: boolean;
}

export class HoodCreate extends Component {
  props: HoodProps;

  static defaultProps: DefaultProps = {
    show: false,
    hood: null,
    user: {
      name: 'Unknown',
      id: '',
    },
    canEdit: false,
  };

  state = {
    name: '',
    editing: false,
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
    this.setState({ editing: false });
  }

  handleCancel = () => {
    this.setState({
      editing: false,
      name: getHoodName(this.props.hood),
    });
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

  handleEdit = () => {
    this.setState({ editing: true });
  }

  render() {
    const { show, user, canEdit } = this.props;
    if (!show) return null;
    const { name, editing } = this.state;

    let actions = null;
    if (editing) {
      actions = [
        h('button', { onClick: this.handleSave }, 'Save'),
        h('button', { onClick: this.handleCancel }, 'Cancel'),
      ];
    } else if (canEdit) {
      actions = [
        h('button', { onClick: this.handleEdit }, 'Edit'),
        h('button', { onClick: this.handleClose }, 'Close'),
      ];
    }

    let hoodInfo = null;
    if (editing) {
      hoodInfo = h('div', [
        h('label', { htmlFor: 'hood-name' }, 'Hood'),
        h('input', {
          type: 'input',
          value: name,
          onChange: this.handleInput,
        }),
      ]);
    } else {
      hoodInfo = h('div', name);
    }

    return h('div.overlay.hood', [
      h('div', [
        hoodInfo,
        h('div', [
          h('span', 'User: '),
          h('span', user.name),
        ]),
      ]),
      actions ? h('div.actions', actions) : null,
    ]);
  }
}

export default connect(
  (state: State) => {
    const hood = getHoodSelected(state);
    if (!hood) return <DefaultProps>{ hood: null };
    const user = getUserById(state, { id: hood.properties.userId });
    const currentUserId = getCurrentUserId(state);
    const didUserCreateHood = user.id === currentUserId;

    return {
      hood,
      user: user || undefined,
      canEdit: didUserCreateHood,
    };
  },
  (dispatch: Function) => ({
    updateHoodName: (payload: SetHoodNamePayload) => dispatch(setHoodName(payload)),
    handleDeselectHood: (hood: Hood) => dispatch(deselectHood()),
    hideHoodOverlay: () => dispatch(hideMenu('overlay')),
  }),
)(HoodCreate as any);
