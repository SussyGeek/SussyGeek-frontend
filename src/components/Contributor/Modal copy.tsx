import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import {useState} from 'react'
import { DialogFooter, DialogHeader } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

type ModalPropType = { 
    isModalOpen: boolean, 
    setIsModalOpen: any, 
    modalType: string,
    confirmContribution: any
}

const ModalBackup = ( { 
    isModalOpen,  
    setIsModalOpen, 
    modalType,
    confirmContribution
}:ModalPropType   ) => {
    
    const [username, setUsername] = useState("");

    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
                { modalType === "usernameSelection" ?  
                "Join the Hall of Fame" : 
                "Active Session" }
            </DialogTitle>
            <DialogDescription>
                { modalType === "usernameSelection" ?
                  "Enter your username to appear on the leaderboard." :
                  "A previous session is active. You can only contribute to one instance at a time."
                }
            </DialogDescription>
            { modalType !== "usernameSelection" && <DialogDescription>
                
            </DialogDescription>}
            
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-right">Username</Label>
              <Input id="username" placeholder="e.g. Pumpkin Lava" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmContribution}>Start Scraping</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}

export default ModalBackup


