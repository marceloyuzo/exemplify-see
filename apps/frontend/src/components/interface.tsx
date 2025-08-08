'use client'

import { useState } from 'react'
import Header from './header'
import Sidebar from './sidebar'

export default function Interface() {
  const [expanded, setExpanded] = useState<boolean>(false)

  return (
    <>
      <Header expanded={expanded} setExpanded={setExpanded} />
      <Sidebar expanded={expanded} />
    </>
  )
}
