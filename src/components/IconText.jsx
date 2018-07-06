import React from 'react'
import Flex from './Flex'
import Icon from './Icon'


const IconText = ({text, style, iconStyle, labelStyle, ...props}) => {
  return (
    <Flex alignItems='center' style={style}>
      <Icon {...props} style={iconStyle} marginRight='5px'/>
      <label style={labelStyle}>{text}</label>
    </Flex>
  )
}

export default IconText;