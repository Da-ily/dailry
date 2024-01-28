import { styled, css } from 'styled-components';
import { Link } from 'react-router-dom';
import { MENU } from '../../../styles/color';

export const NavigationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  width: 100%;
`;

export const NameWrapper = styled(Link)`
  display: flex;
  flex-direction: column;

  padding: 0 20px;
  width: 100%;

  &:hover {
    background-color: ${MENU.boxMouseOver};
  }
`;

export const Line = styled.hr`
  display: inline;
  margin: 10px;
  width: calc(100% - 20px);
  height: 1px;
  border: 1px solid ${MENU.line};
`;

export const ItemName = css`
  padding: 0 0 8px 15px;

  color: ${MENU.title};
  font-size: 16px;
  font-weight: 700;
`;
