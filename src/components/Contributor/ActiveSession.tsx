import { CircleAlert, Play } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"


export const ActiveSession = ({
  instituteName
}: {
  instituteName: string
}) => {
  return (
    <Card className="relative bg-muted/30 hover:bg-muted/40 select-none group border-dashed">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center gap-2">
          <CircleAlert className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
            GO TO ACTIVE SESSION
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-xs text-xs lg:w-[20vw] text-left text-muted-foreground pb-4">
        <div className="flex">
          <div className="flex relative">
            <div className="bg-green-700 size-3 absolute rounded-full" />
            <p className="font-bold pl-6">
              {instituteName.split("(")[0]}
            </p>
          </div>
        </div>
      </CardContent>

      <div className=" absolute right-0 top-0 bottom-0 rounded-r-xl bg-primary/90 group-hover:bg-primary text-white px-3 flex items-center justify-center cursor-pointer">
        <Play size={24} />
      </div>
    </Card>
  )
}

export default ActiveSession;
