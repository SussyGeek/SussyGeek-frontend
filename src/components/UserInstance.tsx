import { User2 } from 'lucide-react';
import { Button } from './ui/button';

const UserInstance = (
    
    { 
      username, 
      handleLogout 
    }: 
    { 
      username: string,
      handleLogout: () => Promise<void>
    }
) => {
  return (
    <div className="flex gap-3">
        <User2 className="bg-green-600 text-white rounded-full " size={36}/>
        <div className="flex flex-col relative bottom-[3px]">
            <p className="font-bold text-lg">{username || 'WatchDojo'}</p>
            <button 
            className="text-[12px] text-left text-muted-foreground hover:cursor-pointer relative bottom-1 hover:text-green-800"
            onClick={handleLogout}
            >Sign Out</button>
        </div>
    </div>
  )
}

export default UserInstance
