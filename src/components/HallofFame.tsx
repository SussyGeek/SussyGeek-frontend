import { CardContent, CardFooter, Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Users, Crown, Clock, UsersRound } from 'lucide-react'
import { formatNumber, formatTime } from '@/data/helper'
import { renderRankBadge } from '@/data/helper'
import { ContributionRow } from '@/types/appwrite'
const HallofFame = ({
  topContributors
}: {
  topContributors: ContributionRow[]
}) => {
  return (
    <Card className="border-2 border-primary/20 overflow-hidden shadow-sm">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          <CardTitle className="text-xl">Hall of Fame</CardTitle>
        </div>
        <CardDescription>Top contributors for this institute</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border min-h-[364px]">
          {
            topContributors.length > 0 ?
              topContributors.map((contributor, idx) => (
                <div key={`contributor-r-${idx + 1}`} className="p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    {renderRankBadge(idx + 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate leading-none mb-1.5">
                      {contributor.user.username ?? "lol"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {formatNumber(contributor?.students ?? 0)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatTime(contributor?.seconds ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )) :
              <div className="w-full min-h-[364px] grid place-content-center gap-3">
                <div className="w-full flex justify-center">
                  <UsersRound
                    size={64}
                    className="bg-green-600 opacity-20 text-white p-1 rounded-full" />
                </div>
                <p className="text-center text-muted">No contributions found.</p>
              </div>
          }
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 p-3 border-t">
        <p className="text-xs text-center w-full text-muted-foreground">
          {
            topContributors.length > 0 ?
              "Scrape more to climb the leaderboard" :
              "Scrape to show up as the first."
          }
        </p>
      </CardFooter>
    </Card>
  )
}

export default HallofFame
