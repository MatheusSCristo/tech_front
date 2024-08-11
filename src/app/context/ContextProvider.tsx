"use client"

import React from 'react'
import { UserProvider } from './UserContext'

const ContextProvider = ({children}:{children:React.ReactNode}) => {
  return (
    <UserProvider>
        {children}
    </UserProvider>
  )
}

export default ContextProvider