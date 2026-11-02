// Shown instantly while a public page's content is on its way, instead of a frozen screen.
export default function Loading() {
  return (
    <div className="rm-landing" role="status" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <p className="rm-lead">Loading…</p>
    </div>
  );
}
