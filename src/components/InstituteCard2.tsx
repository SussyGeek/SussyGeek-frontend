import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/prepareData";
import { useNavigate } from "react-router-dom";

const InstituteCard2 = (
    {
        id,
        name,
        students,
        score,
        status,
        problemsSolved,
        creationDate
    }:
    {
        id: string,
        name: string,
        students: number,
        score: number,
        status: string,
        problemsSolved: number,
        creationDate: string
    }
) => {
  const navigate = useNavigate()
  return (
    <Card
        key={id}
        className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
        onClick={() => navigate(`/institution/${id}`)}
    > 
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-lg line-clamp-2">{name.split(',')[0]}</CardTitle>
            <Badge
              variant={
                status === "Complete"
                  ? "default"
                  : status === "Incomplete"
                  ? "secondary"
                  : "outline"
              }
              className="ml-2 shrink-0"
            >
              {status}
            </Badge>
          </div>
          <CardDescription>{id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Score</span>
            <span className="font-semibold text-foreground">
              {score.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Students</span>
            <span className="font-semibold text-foreground">{students}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Problems Solved</span>
            <span className="font-semibold text-foreground">
              {problemsSolved.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-border">
            <span className="text-muted-foreground">Added</span>
            <span className="text-foreground">{formatDate(creationDate)}</span>
          </div>
        </CardContent>
    </Card>
  )
}

export default InstituteCard2
