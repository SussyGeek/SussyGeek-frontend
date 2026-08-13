import { CardContent, CardFooter, Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Crown, MessageSquareTextIcon } from 'lucide-react'
import { ContributionRow } from '@/types/appwrite'
import ChatBox from "./Contributor/ChatBox";
import HallofFame from './Contributor/HallofFame';

const ActivityBox = ({
  topContributors,
  boxType,
}: {
  topContributors: ContributionRow[],
  boxType: string
}
) => {
  return (
    <Card className="border-2 border-primary/20 overflow-hidden shadow-sm">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
        <div className="flex items-center gap-2">
          {
            boxType === "ChatBox" ?
              <MessageSquareTextIcon className="size-5 text-yellow-600" /> :
              <Crown className="h-5 w-5 text-yellow-600" />
          }
          <CardTitle className="text-xl">
            {boxType === "HallofFame" ?
              "Hall of Fame" : "Chat with others"}
          </CardTitle>
        </div>
        <CardDescription>
          {boxType === "HallofFame" ?
            "Top contributors of this institute" : "Live chat with other contributors."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border min-h-[364px]">
          {
            boxType === "HallofFame" ?
              <HallofFame topContributors={topContributors} /> :
              <ChatBox />
          }
        </div>
      </CardContent>
      <CardFooter className="w-full bg-muted/10 w-full p-2 border-t">
        <p className="text-xs text-center w-full text-muted-foreground">
          {boxType === "ChatBox" ?
            "Keep the chat decorum respectful." : topContributors.length > 0 ?
              "Scrape more to climb the leaderboard" :
              "Scrape to show up as the first."
          }
        </p>
      </CardFooter>
    </Card>
  )
}

export default ActivityBox;
