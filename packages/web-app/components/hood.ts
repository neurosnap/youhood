import { Component } from 'react';
import { connect } from 'react-redux';
import * as h from 'react-hyperscript';

import { HoodId, Hood, SetHoodNamePayload, EditHoodPayload } from '@youhood/hood/types';
import { User, UserId } from '@youhood/user/types';
import {
  utils,
  actionCreators,
  selectors,
} from '@youhood/hood';
const {
  getHoodName,
  getHoodId,
} = utils;
const {
  deselectHood,
  setHoodName,
  editHood,
  saveHood,
} = actionCreators;
const { getHoodSelected } = selectors;
import { actionCreators as menuActionCreators } from '@youhood/menu';
const { hideMenu } = menuActionCreators;
import { selectors as userSelectors } from '@youhood/user';
const { getUserById, getCurrentUserId } = userSelectors;
import {
  selectors as voteSelectors,
  actionCreators as voteActionCreators,
} from '@youhood/vote';
const { getVoteCountByHood, didUserVoteOnHood } = voteSelectors;
const { vote, unvote } = voteActionCreators;
import { selectors as authSelectors } from '@youhood/auth';
const { isUserAuthenticated } = authSelectors;

import { State } from '../types';
import { 
  HoodContainer, 
  Votes, 
  VoteUp, 
  Voted, 
  Actions,
  OverlayHeader,
  OverlayContainer,
} from './ui';

interface HoodProps {
  hood: Hood;
  hoodId: HoodId;
  user: User;
  show: boolean;
  canEdit: boolean;
  updateHoodName: Function;
  handleDeselectHood: Function;
  hideHoodOverlay: Function;
  edit: Function;
  save: Function;
  votes: number;
  userVoted: boolean;
  canUserVote: boolean;
  handleVote: Function;
  handleUnvote: Function;
  currentUserId: UserId;
}

interface DefaultProps {
  show: boolean;
  hood: Hood;
  user: User;
  canEdit: boolean;
  edit: boolean;
}

export class HoodView extends Component {
  props: HoodProps;

  static defaultProps: DefaultProps = {
    show: false,
    hood: null,
    user: {
      email: 'Unknown',
      id: '',
      createdAt: '',
      isTmp: true,
    },
    canEdit: false,
    edit: false,
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
    const { hood, updateHoodName, edit, save } = this.props;
    const { name } = this.state;
    updateHoodName({ hoodId: getHoodId(hood), name });
    this.setState({ editing: false });
    const hoodId = getHoodId(hood);
    edit({ hoodId, edit: false });
    save(hoodId);
  }

  handleCancel = () => {
    const { edit, hood } = this.props;
    this.setState({
      editing: false,
      name: getHoodName(this.props.hood),
    });
    edit({ hoodId: getHoodId(hood), edit: false });
  }

  handleInput = (event: Event) => {
    const name = (<HTMLInputElement>event.target).value;
    this.setState({ name });
  }

  handleEdit = () => {
    const { edit, hood } = this.props;
    this.setState({ editing: true });
    edit({ hoodId: getHoodId(hood), edit: true });
  }

  render() {
    const {
      hoodId,
      show,
      user,
      canEdit,
      votes,
      userVoted,
      canUserVote,
      handleVote,
      handleUnvote,
      currentUserId,
    } = this.props;
    if (!show || !hoodId) return null;
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

    const VoteState = userVoted ? Voted : VoteUp;
    const UserVoting = canUserVote ? h(VoteState, {
      className: 'fa fa-angle-up',
      onClick: () => {
        if (userVoted) {
          handleUnvote(hoodId, currentUserId);
          return;
        }

        handleVote(hoodId, currentUserId);
      },
    }) : null;

    return h(OverlayContainer, [
      h(OverlayHeader, 'Hood View'),
      h(HoodContainer, [
        h(Votes, [
          UserVoting,
          h('div', votes),
        ]),
        h('div', [
          hoodInfo,
          h('div', [
            h('span', 'User: '),
            h('span', user.isTmp ? 'Anonymous' : user.email),
          ]),
        ]),
        actions ? h(Actions, actions) : null,
      ]),
    ]);
  }
}

export default connect(
  (state: State) => {
    const hood = getHoodSelected(state);
    if (!hood) return <DefaultProps>{ hood: null };
    const userId = hood.properties.userId;
    const user = getUserById(state, { id: hood.properties.userId });
    const currentUserId = getCurrentUserId(state);
    const didUserCreateHood = user && user.id === currentUserId;
    const hoodId = getHoodId(hood);
    const userIsAuthenticated = isUserAuthenticated(state);
    const canUserVote = userIsAuthenticated;

    return {
      hood,
      hoodId,
      user: user || undefined,
      canEdit: didUserCreateHood,
      votes: getVoteCountByHood(state, { hoodId }),
      userVoted: didUserVoteOnHood(state, { hoodId, userId }),
      canUserVote,
      currentUserId,
    };
  },
  (dispatch: Function) => ({
    updateHoodName: (payload: SetHoodNamePayload) => dispatch(setHoodName(payload)),
    handleDeselectHood: (hood: Hood) => dispatch(deselectHood()),
    hideHoodOverlay: () => dispatch(hideMenu('overlay')),
    edit: (opts: EditHoodPayload) => dispatch(editHood(opts)),
    save: (hoodId: HoodId) => dispatch(saveHood(hoodId)),
    handleVote: (hoodId: HoodId, userId: UserId) => dispatch(vote({ hoodId, userId })),
    handleUnvote: (hoodId: HoodId, userId: UserId) => dispatch(unvote({ hoodId, userId })),
  }),
)(HoodView as any);
