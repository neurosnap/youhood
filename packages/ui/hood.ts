import { Component } from 'react';
import { connect } from 'react-redux';
import * as h from 'react-hyperscript';

import { HoodProps, HoodId, SetHoodNamePayload, EditHoodPayload } from '@youhood/hood/types';
import { User, UserId } from '@youhood/user/types';
import {
  actionCreators,
  selectors,
} from '@youhood/hood';
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

import { State } from '@youhood/web-app/types';
import {
  HoodContainer,
  Votes,
  VoteUp,
  Voted,
  Actions,
  OverlayHeader,
  OverlayContainer,
} from './ui';

const noop = () => {};

interface Props {
  hood: HoodProps;
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
  hood: HoodProps;
  user: User;
  canEdit: boolean;
  userVoted: boolean;
  canUserVote: boolean;
  votes: number;
  edit: Function;
  save: Function;
}

function getHoodId(hood: HoodProps): HoodId {
  if (!hood) return '';
  return hood.id;
}

function getHoodName(hood: HoodProps): string {
  if (!hood) return '';
  return hood.name;
}

export class HoodView extends Component {
  props: Props;

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
    userVoted: false,
    canUserVote: false,
    votes: 0,
    edit: noop,
    save: noop,
  };

  state = {
    name: '',
    editing: false,
  };

  componentWillMount() {
    const name = getHoodName(this.props.hood);
    this.setState({ name });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (getHoodId(nextProps.hood) !== getHoodId(this.props.hood)) {
      this.setState({ name: getHoodName(nextProps.hood) });
    }
  }

  handleSave = () => {
    const { hood, updateHoodName, edit, save } = this.props;
    const { name } = this.state;
    const hoodId = hood.id;
    updateHoodName({ hoodId, name });
    this.setState({ editing: false });
    edit({ hoodId, edit: false });
    save(hoodId);
  }

  handleCancel = () => {
    const { edit, hood } = this.props;
    const { name, id } = hood;
    this.setState({
      editing: false,
      name,
    });
    edit({ hoodId: id, edit: false });
  }

  handleInput = (event: Event) => {
    const name = (<HTMLInputElement>event.target).value;
    this.setState({ name });
  }

  handleEdit = () => {
    const { edit, hood } = this.props;
    this.setState({ editing: true });
    edit({ hoodId: hood.id, edit: true });
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
        h('button', { className: 'save', onClick: this.handleSave }, 'Save'),
        h('button', { className: 'cancel', onClick: this.handleCancel }, 'Cancel'),
      ];
    } else if (canEdit) {
      actions = [
        h('button', { className: 'edit', onClick: this.handleEdit }, 'Edit'),
      ];
    }

    let hoodInfo = null;
    if (editing) {
      hoodInfo = h('div', [
        h('label', { htmlFor: 'hood-name' }, 'Hood'),
        h('input', {
          className: 'name-input',
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
    if (!hood) {
      return <DefaultProps>{ hood: null };
    }
    const userId = hood.userId;
    const user = getUserById(state, { id: hood.userId });
    const currentUserId = getCurrentUserId(state);
    const didUserCreateHood = user && user.id === currentUserId;
    const hoodId = hood.id;
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
    handleDeselectHood: () => dispatch(deselectHood()),
    hideHoodOverlay: () => dispatch(hideMenu('overlay')),
    edit: (opts: EditHoodPayload) => dispatch(editHood(opts)),
    save: (hoodId: HoodId) => dispatch(saveHood(hoodId)),
    handleVote: (hoodId: HoodId, userId: UserId) => dispatch(vote({ hoodId, userId })),
    handleUnvote: (hoodId: HoodId, userId: UserId) => dispatch(unvote({ hoodId, userId })),
  }),
)(HoodView as any);
