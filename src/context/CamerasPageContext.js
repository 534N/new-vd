import React from 'react'

export const CamerasPageContext = React.createContext(
  {
    auth: null,
    locations: null,
    width: null,
  }
);