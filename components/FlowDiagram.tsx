interface Props {
  src: string;
  alt: string;
  label: string;
}

export default function FlowDiagram({ src, alt, label }: Props) {
  return (
    <div className="fd-wrap">
      <div className="fd-label">{label}</div>
      <div className="fd-scroll">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
      </div>
      <div className="fd-hint">&#8592; scroll to explore full flow &#8594;</div>
    </div>
  );
}
