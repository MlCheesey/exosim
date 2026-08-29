export default function HowToUse() {
  const guide = [
    ["Pick a system", "Use the sliders or load a preset."],
    ["Change the geometry", "Radius and inclination change the dip."],
    ["Watch the curve", "The graph shows the brightness over one orbit."],
  ];

  return (
    <section aria-label="Quick guide">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-sm text-stone-500">Quick guide</p>
          <h2 className="mt-1 font-display text-lg font-semibold text-stone-100">
            Reading the sim
          </h2>
        </div>

        <ol className="grid gap-3 sm:grid-cols-3 md:col-span-3">
          {guide.map(([title, body], index) => (
            <li key={title} className="rounded-md border border-stone-800 bg-stone-950/30 p-4">
              <p className="font-mono text-xs text-amber-300">0{index + 1}</p>
              <h3 className="mt-2 font-medium text-stone-200">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-stone-500">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
