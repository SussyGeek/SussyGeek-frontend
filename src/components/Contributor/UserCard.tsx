import { formatNumber, formatTime } from '@/data/helper'
import { Clock, User, Users } from 'lucide-react'
import React from 'react'

const ActivityCounter = ({
    Icon,
    name,
    counter
}:
{
    Icon: any,
    name: string,
    counter: string
}
) => {
    return <div className="flex items-center gap-1 select-none">
        <Icon size={18} className=""/>
        <p className="text-md">{counter}</p>
    </div>
}

const UserCard = (
    {
        username,
        timeSpent, 
        scrappedCount
    }: {
        username: string,
        timeSpent: number, 
        scrappedCount: number
    }
) => {
    return (
        <div id="user-card" className="h-full sm:w-full sm:justify-center flex gap-4 relative sm:gap-0 sm:flex-col">
            <div className="flex sm:flex-col">
                <div className="w-full flex justify-center">
                    <div id="user" className="bg-[#ABCFA3] w-25 h-25 grid place-content-center rounded-full">
                        <User className="text-white size-[60px] sm:size-[100px]"/>
                    </div>
                </div>
                
            </div>
                <div className="flex sm:flex-col sm:justify-center  w-full justify-between">
                    <p className="text-left sm:text-center sm:py-1 text-2xl select-none">{username}</p>
                    <div className="flex relative bottom-4 sm:bottom-0 sm:justify-center gap-4">
                        <ActivityCounter 
                            Icon={Clock} 
                            name="time" 
                            counter={formatTime(timeSpent) ?? "00:00"} 
                        />
                        <ActivityCounter 
                            Icon={Users} 
                            name="scrappedCount" 
                            counter={formatNumber(scrappedCount) ?? "0"} 
                        />
                    </div>
                </div>
        </div>
    )
}

export default UserCard
