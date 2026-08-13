import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { useNavigate } from "react-router-dom";

const InstituteCard = (
  {
    id,
    name,
    score,
    students,
    status
  }:
    {
      id: string,
      name: string,
      score: number,
      students: number,
      status: string
    }
) => {

  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/institution/${id}`)} // To be dealt with. FIX
    >
      <CardHeader>
        <CardTitle className="text-lg">{name.split(',')[0]}</CardTitle>
        <CardDescription>{"LAT" /* add code later. FIX */}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Score</span>
          <span className="font-semibold">{score.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Students</span>
          <span className="font-semibold">{students}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span
            className={`font-semibold ${status === "Complete"
                ? "text-green-600"
                : status === "Incomplete"
                  ? "text-yellow-600"
                  : "text-blue-600"
              }`}
          >
            {status}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default InstituteCard;
