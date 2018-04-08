interface Style {
  color: string;
  weight: number;
}

const hoodStyle = () => ({
  color: 'blue',
  weight: 1,
});

const hoodStyleSelected = () => ({
  color: 'yellow',
  weight: 1,
});

const hoodStyleHover = () => ({
  color: 'green',
  weight: 1,
});

interface StyleProps {
  selected?: boolean;
  hover?: boolean;
}

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
