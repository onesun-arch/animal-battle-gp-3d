export default function Home() {
  return (
    <main className="game-shell">
      <iframe
        className="game-frame"
        src="/game.html"
        title="애니멀 배틀 GP"
        allow="clipboard-write"
      />
    </main>
  );
}
