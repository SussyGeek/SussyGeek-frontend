import { formatNumber } from '@/data/helper';
import { BATCH_SIZE, BLOCK_SIZE } from '@/params';
import { BUCKETS } from '@/data/genericData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { InstituteBlock } from '@/types/appwrite';
import { StateCounterCardProps, BlockProps } from '@/types/generic';

function getContributionColor(percent: number | null) {
  if (percent === null || percent === undefined) return "bg-[#F3E2E2]/20";
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const index = Math.min(
    BUCKETS.length - 1,
    Math.floor((clampedPercent / 100) * BUCKETS.length)
  );
  return BUCKETS[index];
}

export const Block = ({ active, startPage, endPage, percentage }: BlockProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`h-3 rounded-sm ${getContributionColor(percentage)} hover:ring-2 hover:ring-black/30 transition-all cursor-pointer`} />
      </TooltipTrigger>
      <TooltipContent className="bg-gray-900 text-gray-50 border-none px-2.5 py-1.5 shadow-md z-[100]">
        {percentage !== null ? (
          <div className="text-center">
            <p className="font-medium text-white">Pages {startPage} - {endPage}</p>
            <p className="text-gray-300 text-xs">{percentage.toFixed(1)}%</p>
          </div>
        ) : (
          <p className="text-white">Unassigned</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}



export const StateCounterCard = (props: StateCounterCardProps) => {

  const Blocks = () => {
    return <div>
      <div className="max-h-10 overflow-y-auto overflow-x-hidden p-1 -mx-1">
        <TooltipProvider delayDuration={100}>
          <div id="blocks" className="bg-muted-foreground/5 grid grid-cols-10 gap-1 rounded-sm p-1.5">
            {blocks.length === 0 ?
              Array.from({ length: 60 }).map((_, idx) => (<Block
                key={idx}
                percentage={null}
                startPage={null}
                endPage={null}
                active={null}
              />)) :
              blocks?.map((block, idx) => (<Block
                key={idx}
                startPage={block.startPage - 1}
                endPage={block.endPage}
                active={block.percentage}
                percentage={block.percentage}
              />))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  }

  const { Icon } = props;
  let blocks: InstituteBlock[] = [];
  let totalBlocks: number = 0;

  if (props.title === "Blocks") {
    blocks = props.blocks;
    totalBlocks = (blocks.length === 0 && props.studentCount > 0 ?
      ((props.studentCount / BATCH_SIZE) / BLOCK_SIZE) :
      blocks.length);
  }

  return (
    <div
      className={`space-y-1 p-4 bg-secondary/10 text-muted-foreground/80 rounded-lg border border-black/5 select-none
    ${props.title === "Progress" ? "flex justify-between items-center" : ""}`}
    >
      <div className="flex items-center gap-2 text-md">
        <Icon className="h-5 w-5" />
        <div className="flex justify-between w-full">
          <span>{props.title}</span>
          {props.title === "Blocks" && <p className="pr-1 font-semibold">{`${blocks.filter(b => b.percentage && b.percentage >= 100).length}/${Math.ceil(totalBlocks)}`}</p>}
        </div>
      </div>
      {props.title === "Progress" ?
        <div className="text-lg text-muted-foreground/80 font-semibold pt-1">
          {formatNumber(props.scrappedCount) ?? 0} <span className="text-md">/ {formatNumber(props.totalCount) ?? '1,000'}</span>
        </div> :
        <Blocks />
      }
    </div>
  )
}

export default StateCounterCard
