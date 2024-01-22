import { styled } from 'styled-components';
import { MENU } from '../../../styles/color';

export const ToolWrapper = styled.button`
  width: 100%;
  aspect-ratio: 1;
  padding: 10px;

  border-radius: 4px;

  background-color: ${({ selected }) =>
    selected ? MENU.tool : MENU.boxCurrent};
`;

export const IconProps = (selected) => {
  return {
    fill: selected ? MENU.boxCurrent : MENU.tool,
    style: {
      width: '100%',
      height: '100%',
    },
  };
};
export const fillColor = (selected) => (selected ? MENU.boxCurrent : MENU.tool);
