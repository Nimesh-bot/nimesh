import React, { useContext } from 'react'
import { Container } from '../assets/Global'
import Disks from '../components/ExplorerComponents/Disks'
import Header from '../components/Header'
import QuickAccess from '../components/ExplorerComponents/QuickAccess'
import { ThemeContext } from '../context/theme-context'

import { FileExplorer } from '../components'

const Explorer = () => {
  const { theme } = useContext(ThemeContext)

  return (
    <Container bg={`${theme.body}`} className='w-full h-full px-16 py-4 flex flex-col gap-y-10'>
        <Header icon={FileExplorer} title="File Explorer"/>
        <Container bg={`${theme.background}`} className='w-full min-h-[calc(0.8*100vh)] max-h-auto rounded-md px-6 py-4 flex flex-col gap-y-12'>
          <QuickAccess />
          <Disks />
        </Container>
    </Container>
  )
}

export default Explorer