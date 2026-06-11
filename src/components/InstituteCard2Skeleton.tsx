import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const InstituteCard2Skeleton = () => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-20 ml-2 shrink-0 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/2 mt-1.5" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm items-center">
          <span className="text-muted-foreground">Score</span>
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-muted-foreground">Students</span>
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-muted-foreground">Problems Solved</span>
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-border mt-3 items-center">
          <span className="text-muted-foreground">Added</span>
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export default InstituteCard2Skeleton;
