import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";
import { getInstitute } from "@/api/services/instituteService";
import {
  getAllContributors,
  pingContributionSendPage,
  stopContribution,
} from "@/api/services/contributionService";
import { prepInstituteBlocks } from "@/utils/prepareData";
import { useLocation } from "react-router-dom";
import { ContributionRow, Institution } from "@/types/appwrite";
import { SessionState } from "@/types/state_types";
import { useModal } from "./useModal";

export const useContribute = (
  id: string | undefined,
  sessionStateSetter: Dispatch<SetStateAction<SessionState>>
) => {
  const { toast } = useToast();
  const auth = useAuth();
  const { state } = useLocation();
  const { openModal, closeModal } = useModal();

  // Institute
  const [institute, setInstitute] = useState<any>(null);
  const [prevInstitute, setPrevInstitute] = useState<any>(null); // Institute rows of previous session.
  const [isLoading, setIsLoading] = useState(true);

  // Contributions
  const [topContributors, setTopContributors] = useState<ContributionRow[]>([]);
  const [activeContributors, setActiveContributors] = useState<any[]>([]);
  const [currentContributor, setCurrentContributor] = useState<any>(null);

  // Active contribution rows of other institute. [i.e curr_institute_id != institute_id]
  const [prevSessions, setPrevSessions] = useState<any>(null);

  const [isScraping, setIsScraping] = useState(false);

  // Get contribution categories and previous sessions
  // on page load.
  useEffect(() => {
    if (!auth?.isReady || !id) return;

    const getContributionData = async () => {
      setIsLoading(true);
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

      setIsLoading(false);
    };

    getContributionData();
  }, [id, auth?.isReady, auth?.username]);

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
          openModal("active_session", "Hall of Fame");
          return;
        }
        await pingContributionEndpoint();
        setIsScraping(true);
        toast({
          title: "Contribution Started",
          description: `Joined contribution network for ${institute?.name ?? state?.name ?? '-'}.`
        });
        auth.markContributingActive();
        return;
      }
      openModal("username", "Hall of Fame");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to start contribution.",
        description: `${err?.message || ' Server error. Try again later.'}`
      });
    }
  };

  // Confirms the active-session modal: pings the endpoint, starts scraping, and closes the modal.
  const confirmActiveSession = async () => {
    try {
      await pingContributionEndpoint();
      setIsScraping(true);
      auth.markContributingActive();
      closeModal("active_session");
      toast({
        title: "Contribution Started",
        description: `Joined contribution network for ${institute?.name ?? state?.name ?? '-'}.`
      });
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
    // TODO: May be unnecessary refresh as we're already having an optimistic update on that.
    // Decide.
    await auth.refreshAuth();
    auth.markContributingInactive();
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
    isScraping,
    handleStartContribution,
    confirmActiveSession,
    handleStopContribution,
    pauseContribution,
    state,
    isLoading
  };
};
