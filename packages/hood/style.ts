interface Style {
  color: string;
  weight: number;
}

const baseStyle = {
  weight: 2,
  opacity: 1,
};

const hoodStyle = () => ({
  color: 'rgb(154,194,244)',
  fillOpacity: 0.4,
  ...baseStyle,
});

const hoodStyleSelected = () => ({
  color: 'rgb(204,154,244)',
  fillOpacity: 0.5,
  ...baseStyle,
});

const hoodStyleHover = () => ({
  color: 'rgb(194,244,154)',
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
