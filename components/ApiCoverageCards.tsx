type CoverageItem = {
  code: string;
  title: string;
  copy: string;
};

function CardContent({ item, index }: { item: CoverageItem; index: number }) {
  return (
    <>
      <div><span>{String(index + 1).padStart(2, "0")}</span><code>{item.code}</code></div>
      <h3>{item.title}</h3>
      <p>{item.copy}{item.code === "SHADOW" && " Surface operations that remain reachable outside the approved specification or normal development lifecycle."}</p>
      <i aria-hidden="true" />
    </>
  );
}

export default function ApiCoverageCards({ items }: { items: CoverageItem[] }) {
  return (
    <div className="apiscan-coverage-grid">
      <div className="apiscan-coverage-card-scroll">
        {items.map((item, index) => <article key={item.title}><CardContent item={item} index={index} /></article>)}
      </div>
    </div>
  );
}
