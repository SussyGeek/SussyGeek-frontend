import { formatNumber, formatTime, renderRankBadge } from "@/data/helper";
import { ContributionRow } from "@/types/appwrite";
import { Clock, Users, UsersRound } from "lucide-react";

const HallofFame = ({ topContributors }: { topContributors: ContributionRow[] }) => {
    return (
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
    )
};

export default HallofFame;