import { Activity, Database, Orbit, Sigma } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070707] px-6 py-5 text-stone-100">
      <header className="mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-[#2A2620] bg-[#11100E]/90 px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/10 text-amber-300">
            <Orbit size={22} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-stone-50">ExoSim</h1>
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
              Exoplanet Transit Lab
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-stone-400 md:flex">
          <a href="#lab" className="transition hover:text-amber-300">
            Lab
          </a>
          <a href="#library" className="transition hover:text-amber-300">
            NASA Library
          </a>
          <a href="#science" className="transition hover:text-amber-300">
            Science Math
          </a>
        </nav>

        <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
          <Activity size={14} />
          TELEMETRY ACTIVE
        </div>
      </header>

      <section
        id="lab"
        className="mx-auto mt-6 grid max-w-7xl gap-5 lg:grid-cols-[1fr_340px]"
      >
        <div className="rounded-lg border border-[#2A2620] bg-[#11100E]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-50">
                Orbital View
              </h2>
              <p className="text-sm text-stone-500">
                3D star and planet simulation will render here.
              </p>
            </div>
            <Orbit className="text-amber-300" size={22} />
          </div>

          <div className="flex aspect-video items-center justify-center rounded-lg border border-[#2A2620] bg-[#050505]">
            <div className="text-center">
              <div className="mx-auto mb-4 size-24 rounded-full bg-[#D6A33A] shadow-[0_0_70px_rgba(214,163,58,0.45)]" />
              <p className="font-mono text-sm text-stone-500">
                WebGL canvas coming soon
              </p>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-[#2A2620] bg-[#11100E]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-50">
                Mission Controls
              </h2>
              <p className="text-sm text-stone-500">Simulation parameters</p>
            </div>
            <Sigma className="text-rose-300" size={22} />
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-[#2A2620] bg-[#090807] p-4">
              <p className="text-sm text-stone-500">Planet Radius</p>
              <p className="mt-1 font-mono text-2xl text-amber-200">
                1.00 R_earth
              </p>
            </div>

            <div className="rounded-lg border border-[#2A2620] bg-[#090807] p-4">
              <p className="text-sm text-stone-500">Star Radius</p>
              <p className="mt-1 font-mono text-2xl text-stone-200">
                1.00 R_sun
              </p>
            </div>

            <div className="rounded-lg border border-[#2A2620] bg-[#090807] p-4">
              <p className="text-sm text-stone-500">Transit Depth</p>
              <p className="mt-1 font-mono text-2xl text-rose-300">0.01%</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-5 max-w-7xl rounded-lg border border-[#2A2620] bg-[#11100E]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
        <div className="mb-4 flex items-center gap-3">
          <Database className="text-rose-300" size={20} />
          <h2 className="text-lg font-semibold text-stone-50">
            Live Light-Curve
          </h2>
        </div>

        <div className="flex h-44 items-center justify-center rounded-lg border border-[#2A2620] bg-[#090807]">
          <p className="font-mono text-sm text-stone-500">
            Streaming brightness will appear here.
          </p>
        </div>
      </section>
    </main>
  );
}