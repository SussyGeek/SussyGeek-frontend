export const Live = ({ isLive }: { isLive: boolean }) => {

  return (
    <div
      className={[
        "flex items-center gap-2 px-3 py-1 rounded-full border",
        isLive
          ? "bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800"
          : "bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800",
      ].join(" ")}
    >
      <span className="relative flex h-3 w-3">
        <span
          className={[
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            isLive ? "bg-green-400" : "bg-yellow-400",
          ].join(" ")}
        />
        <span
          className={[
            "relative inline-flex h-3 w-3 rounded-full",
            isLive ? "bg-green-500" : "bg-yellow-500",
          ].join(" ")}
        />
      </span>

      <span
        className={[
          "text-sm font-medium",
          isLive ? "text-green-700 dark:text-green-400" : "text-yellow-700 dark:text-yellow-400",
        ].join(" ")}
      >
        {isLive ? "LIVE" : "IDLE"}
      </span>
    </div>
  );
};

export default Live;
