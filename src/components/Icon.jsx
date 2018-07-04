import React from 'react'
import mdi from '../svg/MaterialIcons.svg';

const Icon = ({path, width=24, height=24, fill='#555'}) => {
  return (
    <svg style={{ width: `24px`, height: `24px`, fill: `#555` }}>
      <use xlinkHref={`${mdi}#${path}`}></use>
    </svg>
  )
}

export default Icon;