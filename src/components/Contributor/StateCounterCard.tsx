import { formatNumber } from '@/data/helper';
import { BATCH_SIZE, BLOCK_SIZE } from '@/params';
import { BUCKETS } from '@/data/genericData';

interface BlockType {
      status: number,
      startPage: number,
      endPage: number,
      percentage: number
}

type StateCounterCardPropsType = {
    Icon: any
    title: "Progress";
    scrappedCount: number;
    totalCount: number;
} | {
    Icon: any;
    title: "Blocks";
    blocks: BlockType[],
    studentCount: number
}

interface BlockPropsType {
  active: number | null,
  startPage: number | null,
  endPage: number | null,
  percentage: number | null
}

function getContributionColor(percent: number | null) {
  if(!percent) return "bg-[#F3E2E2]/20";
  const index = Math.min(
    BUCKETS.length - 1,
    Math.floor((percent / 100) * BUCKETS.length)
  );
  return BUCKETS[index];
}

export const Block = ({
  percentage
} : BlockPropsType ) => {

    const BlockHover = () => {
      return <div className="opacity-0 oveflow-visible absolute left-20 bg-gray-600 group-hover:opacity-100">
        <p>Good boy</p>
        <p>Bad boy</p>
        <p>Kill yourself</p>
      </div>
    }

    return <div className={`h-2 overflow-visible ${getContributionColor(percentage)} relative group hover:border-black hover:border-1 border-2`}>
      <BlockHover />
    </div> 
}



export const StateCounterCard = (
    props: StateCounterCardPropsType
) => {

    const Blocks = () => {
      return <div>
        <div></div>
        <div className="max-h-10 overflow-y-scroll">
          {
            <div id="blocks" className="bg-muted-foreground/5 grid grid-cols-10 rounded-xs">
                { blocks.length === 0 ? 
                  Array.from({length: 60}).map((_,idx) => (<Block 
                    key={idx} 
                    percentage={null} 
                    startPage={0} 
                    endPage={0} 
                    active={0} 
                  />)):
                  blocks?.map((block, idx) => (<Block 
                    key={idx} 
                    startPage={block.startPage} 
                    endPage={block.endPage} 
                    active={block.percentage} 
                    percentage={block.percentage}
                  />)) }
            </div>
          }
        </div>
      </div>
    }

    const { Icon } = props;
    let blocks: BlockType[] = [];
    let totalBlocks: number = 0;

    if(props.title === "Blocks"){
      blocks = props.blocks;
      totalBlocks = (blocks.length === 0 && props.studentCount > 0 ? 
      ((props.studentCount/BATCH_SIZE)/BLOCK_SIZE) : 
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
            {props.title === "Blocks" && <p className="pr-1 font-semibold">{`0/${Math.ceil(totalBlocks)}`}</p>}
          </div>
        </div>
        { props.title === "Progress" ?
          <div className="text-lg text-muted-foreground/80 font-semibold pt-1">
              {formatNumber(props.scrappedCount) ?? 0} <span className="text-md">/ {formatNumber(props.totalCount) ?? '1,000'}</span>
          </div> :
          <Blocks />
        }
      </div>
    )
}

export default StateCounterCard
