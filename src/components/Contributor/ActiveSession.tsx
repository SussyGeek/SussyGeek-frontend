import { CircleAlert, Play, StopCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"


export const ActiveSession = ({ 
    instituteName, 
    instituteId
}: {
    instituteName: string, 
    instituteId: string
}) => {
  return (
    <Card className="bg-muted/30 hover:bg-muted/40 select-none group border-dashed group">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center gap-2">
          <CircleAlert className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium uppercase text-muted-foreground">GO TO ACTIVE SESSION</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground pb-4 relative flex">
        <div>
          <div className="flex relative">
            <div className="bg-green-700 size-3 absolute rounded-full"/>
            <p className="font-bold pl-6">
            {instituteName.split("(")[0]}
            </p>
          </div>
        </div>
        <div className="absolute right-0 rounded-r-xl bottom-0 group bg-primary/90 group-hover:bg-primary group:hover-cursor-pointer text-white px-2 h-[6.4em] flex items-center"><Play size={24}/></div>
      </CardContent>
    </Card>
  )
}

export default ActiveSession;
