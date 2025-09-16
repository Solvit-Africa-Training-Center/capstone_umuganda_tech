import React from "react"
import { Card, CardContent } from "../UI/Card";
import { VscGithubProject } from "react-icons/vsc";
import { FiClock } from "react-icons/fi";
import { FaUserGroup } from "react-icons/fa6";
const KPICards = () => {
  const kpis = [
    { title: "Total Projects", value: "185",icon:<VscGithubProject  className="h-[36px] w-[36px] text-primaryColor-900" /> },
    { title: "Total Participants", value: "4,567",icon:<FaUserGroup  className="h-[36px] w-[36px] text-primaryColor-900"/>  },
    { title: "Total Hours", value: "12,345",icon:<FiClock  className="h-[36px] w-[36px] text-primaryColor-900" />  },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index}>  
          <CardContent className="p-6 text-center flex items-center gap-2">
            {kpi.icon}
            <div className="flex flex-col gap-0 text-start" >
                <p className="font-semibold text-[15px]">{kpi.title}</p>
                <p className="text-[32px] font-bold">{kpi.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default KPICards
