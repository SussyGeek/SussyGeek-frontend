import { ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"


export const GuidelinesCard = ({ 
    guidelines 
}: {
    guidelines: string[]
}) => {
  return (
    <Card className="bg-muted/30 border-dashed">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Guidelines</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground pb-4">
          {guidelines.map((instruction, idx) => (
            <p className="flex gap-2" key={'rule'+idx}>
              <span className="font-bold">•</span>
              <span>{instruction}</span>
            </p>
          ))}
      </CardContent>
    </Card>
  )
}

export default GuidelinesCard
