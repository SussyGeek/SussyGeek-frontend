import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import type { LucideProps } from "lucide-react"

const StatsCard = ({
    title,
    counter,
    description,
    icon
}:
{
    title: string 
    counter: number,
    description: string,
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}) => {

  const Icon = icon
  
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{counter}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
  )
}

export default StatsCard;
