import { Medal, Trophy } from "lucide-react";

export const renderRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500 fill-yellow-500/20" />;
      case 2: return <Medal className="h-5 w-5 text-slate-400 fill-slate-400/20" />;
      case 3: return <Medal className="h-5 w-5 text-amber-700 fill-amber-700/20" />;
      default: return <span className="h-5 w-5 flex items-center justify-center font-bold text-muted-foreground text-sm">{rank}</span>;
    }
  };

export const formatNumber = (num: number) => {
    if (num === null || num === undefined || isNaN(num)) return null;
    const [int, dec] = num.toString().split(".");
    const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return dec ? `${formattedInt}.${dec}` : formattedInt;
};

export const formatTime = (totalSeconds: number) => {
  if (typeof totalSeconds !== "number" || totalSeconds < 0) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  const days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
};