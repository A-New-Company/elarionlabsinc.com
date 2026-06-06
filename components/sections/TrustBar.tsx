const ITEMS = [
  "12,000+ on the waitlist",
  "Backed by sports scientists",
  "HIPAA-grade privacy",
  "Featured in HealthTech Weekly",
  "94% 12-week adherence",
  "Built with elite coaches",
];

export default function TrustBar() {
  // duplicate the row for a seamless loop
  const row = [...ITEMS, ...ITEMS];
  return (
    <section className="trust">
      <p className="trust__label">Trusted by early movers in performance & health</p>
      <div className="marquee">
        <div className="marquee__row">
          {row.map((item, i) => (
            <span className="marquee__item" key={i}>
              {item}
            </span>
          ))}
        </div>
        <div className="marquee__row" aria-hidden="true">
          {row.map((item, i) => (
            <span className="marquee__item" key={i}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
