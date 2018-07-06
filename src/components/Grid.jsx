import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  width: ${({ width }) => width || `100%`};
  height: ${({ height }) => height || `auto`};
  grid-template-rows: ${({ gridTemplateRows }) => gridTemplateRows || 'auto'};
  grid-template-columns: ${({ gridTemplateColumns }) => gridTemplateColumns || 'auto'};
  grid-row-gap: ${({ gridRowGap }) => gridRowGap || 0 };
  grid-column-gap: ${({ gridColumnGap }) => gridColumnGap || 0 };
  justify-items: ${({ justifyItems }) => justifyItems || 'center'}; 
  align-items: ${({ alignItems }) => alignItems || 'center'};
  justify-content: ${({ justifyContent }) => justifyContent || 'start'};
  align-content: ${({ alignContent }) => alignContent || 'start'};
  position: ${({ position }) => position || 'relative'};
  background: ${({ background }) => background || 'auto'};
  color: ${({ color }) => color || 'auto'};
  z-index: ${({ zIndex }) => zIndex || 'auto'};
  box-sizing: border-box
`;

Grid.Item = styled.div`
  width: ${({ width }) => width || `auto`};
  height: ${({ height }) => height || `auto`};
  grid-row: ${({ gridRow }) => gridRow || 'auto / auto'};
  grid-column: ${({ gridColumn }) => gridColumn || 'auto / auto'};
  justify-self: ${({ justifySelf }) => justifySelf || 'center'}; 
  align-self: ${({ alignSelf }) => alignSelf || 'center'};
  z-index: ${({ zIndex }) => zIndex || 'auto'};
  position: ${({ position }) => position || 'relative'};
  box-sizing: border-box
`

export default Grid
