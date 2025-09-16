import React from 'react'
import ReportNavbar from './ReportNavbar'
import { Card } from '../UI/Card'
import Filters from './Filters'
import KPICards from './KPICards'
import Charts from './Charts'
import ReportTable from './ReportTable'

const Reports = () => {
  return (
    <div className='w-full grid grid-cols-1 gap-5 '>
      <ReportNavbar/>
    <div className='p-5 flex flex-col gap-5'>
      <Card><Filters /></Card>
      <KPICards />
      <Charts />
      <ReportTable />
    </div>
    </div>
  )
}

export default Reports
