import theme from '@youhood/theme';

interface Style {
  color: string;
  weight: number;
}

const baseStyle = {
  weight: 2,
  opacity: 1,
};

const hoodStyle = () => ({
  color: theme.palette.hood.primary,
  fillOpacity: 0.4,
  ...baseStyle,
});

const hoodStyleSelected = () => ({
  color: theme.palette.hood.selected,
  fillOpacity: 0.5,
  ...baseStyle,
});

const hoodStyleHover = () => ({
  color: theme.palette.hood.hover,
  fillOpacity: 0.5,
  ...baseStyle,
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
