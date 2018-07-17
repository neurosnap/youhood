import * as h from 'react-hyperscript';
import { Component } from 'react';
import { connect } from 'react-redux';

import {
  HoodProps,
  HoodId,
  SetHoodNamePayload,
  EditHoodPayload,
} from '@youhood/hood/types';
import { selectors, actions, utils } from '@youhood/hood';
const { getHoodSelected } = selectors;
const { setHoodName, editHood, saveHood } = actions;
const { createHood } = utils;

import {
  Header,
  HoodEditorContainer,
  EditorActions,
  OverlayHeader,
  OverlayContainer,
  LinkDanger,
  LinkSuccess,
  InputOverlay,
} from './ui';

function getHoodName(hood: HoodProps): string {
  if (!hood) return '';
  return hood.name;
}

function getHoodId(hood: HoodProps): HoodId {
  if (!hood) return '';
  return hood.id;
}

interface IProps {
  hood?: HoodProps;
  updateHoodName?: Function;
  edit?: Function;
  save?: Function;
}

interface IState {
  name: string;
}

const noop = () => {};

export class HoodEditor extends Component<IProps, IState> {
  static defaultProps = {
    hood: createHood({ id: '123' }),
    updateHoodName: noop,
    edit: noop,
    save: noop,
  };

  state = {
    name: '',
  };

  componentWillMount() {
    const name = getHoodName(this.props.hood);
    this.setState({ name });
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (getHoodId(nextProps.hood) !== getHoodId(this.props.hood)) {
      this.setState({ name: getHoodName(nextProps.hood) });
    }
  }

  handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    this.setState({ name });
  };

  handleSave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const { hood, updateHoodName, edit, save } = this.props;
    const { name } = this.state;
    const hoodId = hood.id;
    updateHoodName({ hoodId, name });
    edit({ hoodId, edit: false });
    save(hoodId);
  };

  handleCancel = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const { edit, hood } = this.props;
    const { name, id } = hood;
    this.setState({ name });
    edit({ hoodId: id, edit: false });
  };

  render() {
    const { name } = this.state;
    const actions = [
      h(LinkDanger, { href: '/cancel', onClick: this.handleCancel }, 'Cancel'),
      h(LinkSuccess, { href: '/save', onClick: this.handleSave }, 'Save'),
    ];

    return h(OverlayContainer, [
      h(OverlayHeader, [h(Header, 'Hood Editor')]),
      h(HoodEditorContainer, [
        h('label', { htmlFor: 'hood-name' }, 'Hood Name'),
        h(InputOverlay, {
          type: 'input',
          value: name,
          onChange: this.handleInput,
        }),
        h(EditorActions, actions),
      ]),
    ]);
  }
}

export default connect(
  (state) => ({
    hood: getHoodSelected(state),
  }),
  (dispatch) => ({
    updateHoodName: (payload: SetHoodNamePayload) =>
      dispatch(setHoodName(payload)),
    save: (hoodId: HoodId) => dispatch(saveHood(hoodId)),
    edit: (opts: EditHoodPayload) => dispatch(editHood(opts)),
  }),
)(HoodEditor as any);
