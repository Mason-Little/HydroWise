type Props = {
  bytesDownloaded: number;
  bytesTotal: number;
};

const formatBytes = (n: number): string => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} GB`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)} MB`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)} KB`;
  return `${n} B`;
};

export const ModelDownloadBar = ({ bytesDownloaded, bytesTotal }: Props) => {
  const progress = bytesTotal > 0 ? (bytesDownloaded / bytesTotal) * 100 : 0;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex justify-between text-[10.5px] font-medium text-[var(--text-tertiary)]">
        <span>Downloading…</span>
        <span>
          {formatBytes(bytesDownloaded)} / {formatBytes(bytesTotal)}
        </span>
      </div>
      <div className="h-[5px] overflow-hidden rounded-[3px] bg-[var(--progress-track)]">
        <div
          className="h-full rounded-[3px] bg-[image:var(--progress-fill)] transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
