import styled from 'styled-components'

const Flex = styled.div`
  position: relative;
  display: flex;
  width: ${({ width }) => width || `100%`};
  height: ${({ height }) => height || `auto`};
  justify-content: ${({ justifyContent }) => justifyContent || 'flex-start'};
  align-items: ${({ alignItems }) => alignItems || 'flex-start'};
  flex-direction: ${({ flexDirection }) => flexDirection || 'row'};
  z-index: ${({ zIndex }) => zIndex || 'auto'};
`

Flex.Item = styled.div`
  align-self: ${({ alignSelf }) => alignSelf || 'flex-start'};
`

export default Flex