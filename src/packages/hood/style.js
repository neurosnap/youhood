/* @flow */
type Style = {
  color: string,
};

const hoodStyle = () => ({
  color: 'blue',
});

const hoodStyleSelected = () => ({
  color: 'yellow',
});

const hoodStyleHover = () => ({
  color: 'green',
});

type StyleProps = {
  selected?: boolean,
  hover?: boolean,
};

const defaultProps = {
  selected: false,
  hover: false,
};

export default ({
  selected = defaultProps.selected,
  hover = defaultProps.hover,
}: StyleProps = defaultProps): Style => {
  if (hover) {
    return hoodStyleHover();
  }

  if (selected === true) {
    return hoodStyleSelected();
  }

  return hoodStyle();
};
