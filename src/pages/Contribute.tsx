import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Play, Info, Users, Box, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import HallofFame from "@/components/HallofFame";
import { guideliens } from "@/data/genericData";
import StateCounterCard from "@/components/Contributor/StateCounterCard";
import ContributorsCard from "@/components/Contributor/ContributorsCard";
import UserCard from "@/components/Contributor/UserCard";
import Live from "@/components/ui/live";
import GuidelinesCard from "@/components/Contributor/GuidelinesCard";
import ActiveSession from "@/components/Contributor/ActiveSession";
import Modal from "@/components/Contributor/Modal";
import InstituteNotFound from "@/components/InstituteNotFound";
import ContributionSkeleton from "@/components/Contributor/ContributionSkeleton";
import { useContribute } from "@/hooks/useContribute";
import { useEffect, useRef, useState } from "react";
import { SessionState } from "@/types/state_types";
import { contributeBatch, pingContributionSendPage } from "@/api/services/contributionService";
import { BatchMsg, OptimisticUpdate } from "@/types/worker_types";
import { scrapperWorkerConfig } from "@/workers/scrapper.config";

const Contribute = () => {
  const { id } = useParams();
  const navigation = useNavigate();
  const { state } = useLocation();



  const [sessionState, setSessionState] = useState<SessionState>({
    scrappedStudentCount: 0,
    totalSessionSecondsElapsed: 0,
    config: {
      currentBlockId: -1, // -1 = UNINITIALIZED
      blockStartingPage: -1, // --
      blockEndingPage: -1, // --
      batchSize: scrapperWorkerConfig.BATCH_SIZE,
      blockSize: scrapperWorkerConfig.BLOCK_SIZE
    }
  });

  const [optimisticCounters, setOptimisticCounters] = useState({
    totalSecondsElapsed: 0,
    totalStudentsScrapped: 0
  });
  const [isExtensionInstalled, setIsExtensionInstalled] = useState<boolean>(false);

  const {
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
    handleStopContribution,
    confirmContribution,
    pauseContribution,
    isLoading
  } = useContribute(id, setSessionState);

  const workerRef = useRef<Worker | null>(null);
  const sessionStateRef = useRef(sessionState);
  const isScrapingRef = useRef(isScraping);

  // Keep ref in sync with state so onmessage always reads current values.
  useEffect(() => {
    sessionStateRef.current = sessionState;
  }, [sessionState]);

  useEffect(() => {
    isScrapingRef.current = isScraping;
  }, [isScraping]);

  // Listen for SussyGeek extension. Otherwise, can't contribute. 
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const handler = () => {
      setIsExtensionInstalled(true);
      // Extension found — stop polling
      if (interval) clearInterval(interval);
      window.removeEventListener("sussygeek-pong", handler);
    };

    window.addEventListener("sussygeek-pong", handler);

    interval = setInterval(() => {
      window.dispatchEvent(new CustomEvent("sussygeek-ping"));
    }, 1000);

    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener("sussygeek-pong", handler);
    };
  }, []);

  // Create worker once on mount, terminate on unmount.
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/scrapper.worker.ts", import.meta.url),
      { type: "module" }
    );
    // Send the session token to the worker since it can't access localStorage
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      workerRef.current.postMessage({ type: "init", sessionId });
    }
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  // Attach onmessage handler (stable reference via refs).
  useEffect(() => {
    const worker = workerRef.current;
    if (!worker) return;

    worker.onmessage = async (msg: MessageEvent<OptimisticUpdate | BatchMsg>) => {
      if (msg.data.type === "BATCH") {
        try {
          if (!msg.data.success)
            throw new Error(msg.data.message || "Server error. Try again later.");
          const { studentBatch, secondsElapsed } = msg.data.data;
          const res = await contributeBatch(secondsElapsed, institute.$id, studentBatch);
          if (!res.success)
            throw new Error(res.message || "Server error. Try again later.");
          const currentConfig = sessionStateRef.current.config;

          const pingRes = res.data.isBlockComplete
            ? await pingContributionSendPage(institute.$id)
            : res;


          if (!pingRes.success)
            throw new Error(pingRes.message || "Server error. Try again later.");

          const newConfig = {
            ...currentConfig,
            blockStartingPage: pingRes.data.startingPage,
            blockEndingPage: pingRes.data.endingPage,
            currentBlockId: pingRes.data.assignedBlockId,
          };

          setSessionState((prev: SessionState) => ({
            totalSessionSecondsElapsed: prev.totalSessionSecondsElapsed + secondsElapsed,
            scrappedStudentCount: prev.scrappedStudentCount + studentBatch.length,
            config: newConfig,
          }));

          setOptimisticCounters({
            totalSecondsElapsed: 0,
            totalStudentsScrapped: 0
          });

          if (isScrapingRef.current) {
            worker.postMessage({
              type: "get_batch",
              startingPage: pingRes.data.startingPage,
              endingPage: pingRes.data.endingPage,
              instituteId: institute.$id,
              batchSize: newConfig.batchSize,
            });
          }
        } catch (err: any) {
          pauseContribution(err?.message || "Server error. Try again later.");
        }
      } else if (
        msg.data.type === "UPDATE_OPTIMISTIC_STUDENTS" ||
        msg.data.type === "UPDATE_OPTIMISTIC_SECONDS"
      ) {
        const msgType = msg.data.type;

        setOptimisticCounters(prev => ({
          totalStudentsScrapped:
            msgType === "UPDATE_OPTIMISTIC_STUDENTS" ?
              prev.totalStudentsScrapped + 1 :
              prev.totalStudentsScrapped,
          totalSecondsElapsed:
            msgType === "UPDATE_OPTIMISTIC_SECONDS" ?
              prev.totalSecondsElapsed + 1 :
              prev.totalSecondsElapsed
        }));
      }
    };

    return () => {
      worker.onmessage = null;
    };
  }, [institute?.$id]);

  // Kick off scraping when isScraping becomes true.
  useEffect(() => {
    if (!workerRef.current || !isExtensionInstalled) return;

    if (isScraping) {
      workerRef.current.postMessage({
        type: "get_batch",
        startingPage: sessionState.config.blockStartingPage,
        endingPage: sessionState.config.blockEndingPage,
        instituteId: institute.$id,
        batchSize: sessionState.config.batchSize,
      });
    } else {
      workerRef.current.postMessage({ type: "stop" });
      setOptimisticCounters({ totalSecondsElapsed: 0, totalStudentsScrapped: 0 });
    }
  }, [isScraping]);

  if (isLoading) {
    return <ContributionSkeleton />;
  }

  if (!institute) {
    return <InstituteNotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: Main Action Area (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Contribute Data</h1>
              <p className="text-muted-foreground">
                {isScraping ? "Live connection established. Do not close this window." : "Help us expand our database for this institute."}
              </p>
            </div>

            <Alert className="bg-muted/50 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle>{isExtensionInstalled ? "How this works" : "Extension required."}</AlertTitle>
              <AlertDescription>
                {
                  isExtensionInstalled ?
                    "This is a distributed scraping system. Keep this tab open to contribute." :
                    "The contribution engine requires SussyGeek extension to work. Click here to get it."
                }
              </AlertDescription>
            </Alert>

            <Card className="border-2 shadow-sm">
              <CardHeader className="border-b bg-muted/20">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{institute?.name ?? state?.name ?? '-'}</CardTitle>
                    <CardDescription className="mt-1 font-mono text-primary">Code: {id}</CardDescription>
                  </div>
                  <Live isLive={((activeContributors?.length ?? 0) > 0) || isScraping} />
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UserCard
                      username={currentContributor?.username ?? "You"}
                      timeSpent={sessionState.totalSessionSecondsElapsed + optimisticCounters.totalSecondsElapsed}
                      scrappedCount={sessionState.scrappedStudentCount + optimisticCounters.totalStudentsScrapped}
                    />
                    <ContributorsCard activeContributors={activeContributors} />
                    <StateCounterCard
                      Icon={Users}
                      title="Progress"
                      scrappedCount={(institute?.scrappedStudents ?? 0) + optimisticCounters.totalStudentsScrapped}
                      totalCount={institute?.totalStudents ?? 0}
                    />
                    <StateCounterCard
                      Icon={Box}
                      title="Blocks"
                      blocks={institute?.blocks ?? []}
                      studentCount={institute?.totalStudents ?? 0}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t bg-muted/20 py-4 min-h-[3.2em]">
                {isExtensionInstalled && <div id="contribution-btn" className="w-full flex justify-end">
                  {!isScraping ? (
                    (currentContributor && (currentContributor?.instituteId === institute?.$id)) ?
                      <Button onClick={handleStartContribution} className="w-full sm:w-auto ml-auto bg-blue-600 hover:bg-blue-700">
                        <RotateCcw className="h-4 w-4" />
                        Resume
                      </Button> :
                      <Button onClick={handleStartContribution} className="w-full sm:w-auto ml-auto">
                        <Play className="h-4 w-4" />
                        Contribute
                      </Button>
                  ) : (
                    <Button onClick={handleStopContribution} variant="destructive" className="w-full sm:w-auto ml-auto">Stop Scraping</Button>
                  )}
                </div>}
              </CardFooter>
            </Card>
          </div>

          {/* RIGHT COLUMN: Hall of Fame & Guidelines (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            <HallofFame topContributors={topContributors} />
            <GuidelinesCard guidelines={guideliens} />
            {prevInstitute &&
              <button className="w-full" onClick={() => {
                navigation(`/contribute/${prevInstitute?.id}`)
              }}>
                <ActiveSession
                  instituteName={prevInstitute?.name}
                />
              </button>
            }
          </div>

        </div>
      </div>

      <Modal
        isModalOpen={usernameModalOpen}
        setIsModalOpen={setUsernameModalOpen}
        modalType="usernameSelection"
        confirmContribution={confirmContribution}
        username={username}
        setUsername={setUsername}
      />

      {prevInstitute && <Modal
        isModalOpen={activeSessionModalOpen}
        setIsModalOpen={setActiveSessionModalOpen}
        modalType="activeSession"
        instituteName={prevInstitute?.name ?? ''}
        onResumeSession={() => {
          navigation(`/contribute/${prevInstitute?.id}`)
        }}
        confirmContribution={confirmContribution}
      />}
    </div>
  );
};

export default Contribute;