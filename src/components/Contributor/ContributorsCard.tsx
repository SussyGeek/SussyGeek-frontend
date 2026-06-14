import { formatNumber, formatTime } from '@/data/helper';
import { Clock, User, X } from 'lucide-react'

export const Contributor = ({
  name,
  scrappedStudents,
  seconds,
}: {
  name: string
  scrappedStudents: number
  seconds: number
}) => {
  return (
    <div className="relative size-10 grid place-content-center rounded-full bg-[#C6C3C3] group">
      <div
        className="
          absolute right-[3em] top-1/2 -translate-y-1/2
          w-max rounded-md bg-[#d4d3cf] p-2
          shadow-lg shadow-black/20
          opacity-0 scale-95
          pointer-events-none
          transition-all duration-150 ease-out
          group-hover:opacity-100
          group-hover:scale-100
          before:absolute before:top-1/2 before:-right-1
          before:-translate-y-1/2
          before:border-8 before:border-transparent
          before:border-l-[#C6C3C3]
        "
      >
        <p className="flex justify-center font-semibold text-muted-foreground/80 text-sm border-b-[3px] px-4 border-[#3e403f4a]">{name}</p>
        <div className="mt-1 flex gap-2 space-y-0.5 text-xs">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <p>{formatTime(seconds)}</p>
          </div>
          <div className="flex items-center gap-1">
            <User size={12} />
            <p>{formatNumber(scrappedStudents)}</p>
          </div>
        </div>
      </div>

      <User size={32} color="white" />
    </div>
  )
}


const ContributorsCard = ({
  activeContributors,
}: {
  activeContributors: any // Fix pls
}
) => {

  return (
    <div className="bg-secondary/10 rounded-lg select-none">
      <div className="p-4">
        <div className="flex gap-1">
          <h3 className="text-xl pl-2 text-muted-foreground/80">Contributors</h3>
        </div>
        <div>
          {activeContributors && activeContributors.length > 0 ?
            <div className="px-4 py-3 grid transition-all min-h-[10em] duration-200 grid-cols-5 gap-y-3">
              {activeContributors.map((contributor: any, i: number) => (
                <Contributor
                  key={i}
                  name={contributor.user.username}
                  scrappedStudents={contributor.students}
                  seconds={contributor.seconds}
                />
              ))}
            </div> :
            <div className="w-full flex flex-col min-h-[10em] justify-center gap-2 select-none">
              <div className="w-full flex justify-center">
                <div className="bg-[#C6C3C3] rounded-full w-10 h-10 grid place-content-center opacity-25">
                  <X size={60} className="text-white" />
                </div>
              </div>
              <div className="m-0 p-0">
                <p className="text-center text-sm opacity-25">No scrappers active.</p>
                <p className="text-center text-xs opacity-25">Click contribute to start</p>
              </div>
            </div>

          }
        </div>

      </div>

    </div>
  )
}

export default ContributorsCard
