import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { useAuth } from "@/context/userContext";
import { useToast } from "@/hooks/use-toast";
import { getInstitute } from "@/api/services/instituteService";
import { getAllContributors, pingContributionSendPage, stopContribution } from "@/api/services/contributionService";
import { login as loginService } from "@/api/services/userService";
import { prepInstituteBlocks } from "@/utils/prepareData";
import { useLocation } from "react-router-dom";
import { Institution } from "@/types/appwrite";
import { SessionState } from "@/types/state_types";

export const useContribute = (
  id: string | undefined,
  sessionStateSetter: Dispatch<SetStateAction<SessionState>>
) => {
  const { toast } = useToast();
  const auth = useAuth();
  const { state } = useLocation();

  // Institute
  const [institute, setInstitute] = useState<any>(null);
  const [prevInstitute, setPrevInstitute] = useState<any>(null); // Institute rows of previous session.

  // Contributions
  const [topContributors, setTopContributors] = useState<any[]>([]);
  const [activeContributors, setActiveContributors] = useState<any[]>([]);
  const [currentContributor, setCurrentContributor] = useState<any>(null);

  // Active contribution rows of other institute. [i.e curr_institute_id != institute_id]
  const [prevSessions, setPrevSessions] = useState<any>(null);


  // Modal states
  const [activeSessionModalOpen, setActiveSessionModalOpen] = useState(false);
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);

  const [isScraping, setIsScraping] = useState(false);
  const [username, setUsername] = useState("");

  // Get contribution categories and previous sessions
  // on page load.
  useEffect(() => {
    if (!auth?.isReady || !id) return;

    const getContributionData = async () => {
      // reset UI for new institute
      setInstitute(null);
      setPrevSessions(null);
      setPrevInstitute(null);

      // 1) fetch institute
      const instituteRes = await getInstitute(id, "", 1, 1);
      if (instituteRes.success) {

        const instituteRow = instituteRes.data as Institution;
        // Update fetched institute.
        const institute = {
          ...instituteRow,
          blocks: prepInstituteBlocks(instituteRow.blocks),
        };
        setInstitute(institute);

        // 2) Fetch all contributors and categorize them.
        // i.e Top contributors, currently active contributors and previous user contributions.
        const conResult = await getAllContributors(auth?.username || null, institute.$id);

        if (conResult.success && conResult.data) {
          // Set all contribution categories, i.e active, top, and current (user level)
          setTopContributors(conResult.data.topContributors);
          setActiveContributors(conResult.data.activeContributors);
          setCurrentContributor(conResult.data.currentContributor);

          if (conResult.data.currentContributor) {
            const { seconds, students } = conResult.data.currentContributor;
            sessionStateSetter((prev: SessionState) => ({
              ...prev,
              scrappedStudentCount: students,
              totalSessionSecondsElapsed: seconds,
              config: { ...prev.config }
            }));
          }

          setPrevSessions(conResult.data.prevSessions); // Previously active session.
        }
      }
    };

    getContributionData();
  }, [id, auth?.isReady, auth?.username, auth?.isContributing]);

  // Fetch previous active session of current user
  useEffect(() => {
    if (!prevSessions || prevSessions.length === 0) return;

    const fetchPrevInstitute = async () => {
      const instResult = await getInstitute(prevSessions[0].instituteId, '', 1, 1);

      if (instResult.success && instResult.data) {
        const instituteRow = instResult.data as Institution
        setPrevInstitute({
          name: instituteRow.name,
          id: instituteRow.$id
        });
      }
    };

    fetchPrevInstitute();
  }, [prevSessions]);

  // Handling username login 
  useEffect(() => {
    if (!auth?.username && isScraping) {
      setIsScraping(false);
    }
  }, [auth?.username, isScraping]);

  const pingContributionEndpoint = async () => {
    const res = await pingContributionSendPage(institute.$id);
    if (!res.success)
      throw new Error(res.message);

    const { blockSize, batchSize } = res.data;
    sessionStateSetter((prev: SessionState) => ({
      ...prev,
      config: {
        blockSize,
        batchSize,
        currentBlockId: res.data.assignedBlockId,
        blockStartingPage: res.data.startingPage,
        blockEndingPage: res.data.endingPage
      }
    }));
  }

  const pauseContribution = (description: string) => {
    setIsScraping(false);
    toast({ title: "Contribution paused", description });
  }

  // ============= Input handlers =============

  // Flow Start Contribution --> Confirmation modal opens (if no login)
  // Upon confirmation, contribution starts.

  const handleStartContribution = async () => {
    try {
      if (auth?.username) {
        if (prevInstitute) {
          setActiveSessionModalOpen(true);
          return;
        }
        await pingContributionEndpoint();
        setIsScraping(true);
        toast({
          title: "Contribution Started",
          description: `Joined contribution network for ${institute?.name ?? state?.name ?? '-'}.`
        });
        return;
      }
      setUsernameModalOpen(true);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to start contribution.",
        description: `${err?.message || ' Server error. Try again later.'}`
      });
    }
  };


  // TODO: Rename to confirmModal
  const confirmContribution = async (modalType: string) => {
    try {
      if (modalType === "usernameSelection") {
        if (!username.trim() || username.length > 24) {
          toast({
            variant: "destructive",
            title: "Username required",
            description: "Provided name unacceptable."
          });
          return;
        }

        const response = await loginService(username);
        if (response.success) {
          await auth?.refreshAuth();
        }
        setUsernameModalOpen(false);
      } else {
        await pingContributionEndpoint();
        setIsScraping(true);
        setActiveSessionModalOpen(false);
        toast({
          title: "Contribution Started",
          description: `Joined contribution network for ${institute?.name ?? state?.name ?? '-'}.`
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to start contribution.",
        description: `${err?.message || ' Server error. Try again later.'}`
      });
    }
  };

  const handleStopContribution = async () => {
    if (!auth?.username || !auth?.isContributing) return;
    const result = await stopContribution(institute.$id);
    if (!result.success) {
      toast({ title: "Stop failed.", description: "Failed to stop contribution. Session still active." });
      return;
    }
    await auth.refreshAuth();
    setIsScraping(false);
    toast({ title: "Scraping Paused", description: "Progress saved." });
  };

  // =============xxxxxxxxxxxxx=============


  return {
    institute,
    topContributors,
    activeContributors,
    currentContributor,
    prevInstitute,
    activeSessionModalOpen,
    setActiveSessionModalOpen,
    usernameModalOpen,
    setUsernameModalOpen,
    isScraping,
    username,
    setUsername,
    handleStartContribution,
    confirmContribution,
    handleStopContribution,
    pauseContribution,
    state
  };
};
