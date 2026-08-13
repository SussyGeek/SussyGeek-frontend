
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

type ModalType = "usernameSelection" | "activeSession";

type ModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  modalType: ModalType;
  onConfirm: () => void;

  // only needed for activeSession
  instituteName?: string;
  onResumeSession?: () => void;

  requestType: "Hall of Fame" | "Live Chat"

  // only needed for usernameSelection
  username?: string;
  setUsername?: (username: string) => void;
};

const Modal = ({
  isModalOpen,
  setIsModalOpen,
  modalType,
  onConfirm,
  requestType,
  instituteName = "K.K Wagh Institute of Engineering and Research",
  onResumeSession,
  username,
  setUsername
}: ModalProps) => {

  const isUsername = modalType === "usernameSelection";
  const isActiveSession = modalType === "activeSession";

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isUsername ? `Join the ${requestType}` : "Active Session"}
          </DialogTitle>

          <DialogDescription>
            {isUsername
              ? `Enter your username to ${requestType === "Hall of Fame" ?
                "appear on the leaderboard" :
                "talk with others and also join the contribution network."
              }.`
              : "A previous session is active. You can only contribute to one institute at a time."}
          </DialogDescription>
        </DialogHeader>

        {isUsername && (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="e.g. Pumpkin Lava"
                value={username}
                onChange={(e) => setUsername?.(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}

        {isActiveSession && (
          <div
            onClick={onResumeSession}
            className="mt-1 mb-2 rounded-xl border-2 border-dotted px-4 py-3 select-none hover:bg-primary/10 hover:cursor-pointer"
          >
            <p className="text-xs text-muted-foreground">Resume contribution for</p>
            <p className="text-sm font-medium leading-snug">{instituteName}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Join {requestType === "Hall of Fame" && "Network"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
