import React from 'react'
import mdi from '../svg/MaterialIcons.svg';

const Icon = ({path, width=24, height=24, fill='#555', ...props}) => {
  return (
    <svg style={{ width, height, fill, ...props }}>
      <use xlinkHref={`${mdi}#${path}`}></use>
    </svg>
  )
}

export default Icon;