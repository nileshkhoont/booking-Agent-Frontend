export function RecordingPlayer({ url }: { url?: string | null }) {
  if (!url) {
    return <p className="text-sm text-muted-foreground">No recording available for this call.</p>;
  }

  return (
    <audio controls className="w-full">
      <source src={url} />
      Your browser does not support the audio element.
    </audio>
  );
}
