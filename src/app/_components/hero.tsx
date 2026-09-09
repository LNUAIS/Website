import Link from "next/link";
import { getEvents, type LnuEvent } from "@/lib/events";
import { InfinityMark } from "./infinity-mark";

export function Hero() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const all = getEvents(); // newest first
  const next = all.filter((ev) => ev.date >= today).at(-1);
  const past = all.filter((ev) => ev.date < today).slice(0, 3);

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-chalk/10 px-5 py-16 sm:px-10 lg:h-[680px] lg:py-0"
    >
      <InfinityMark className="pointer-events-none absolute top-1/2 left-1/2 hidden w-[1320px] -translate-x-1/2 -translate-y-1/2 opacity-40 lg:block" />

      <div className="relative mx-auto flex h-full max-w-[1180px] flex-col items-center gap-20 lg:justify-center lg:gap-0">
        <div className="flex max-w-[600px] flex-col items-center text-center">
          <div className="font-mono text-[10.5px] tracking-[0.22em] text-gold">
            LNU AI SOCIETY · LINNAEUS UNIVERSITY
          </div>
          <h1 className="mt-7 font-serif text-[34px] leading-none font-bold tracking-[-0.045em] text-balance sm:text-[48px] lg:text-[60px]">
            A place to actually use the things everyone is talking about.
          </h1>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="#events"
              className="rounded-[2px] bg-gold px-7 py-3.5 text-[15px] font-bold text-ink transition-colors hover:bg-gold-hi"
            >
              Upcoming events
            </Link>
            <Link
              href="#contact"
              className="rounded-[2px] border border-chalk/28 px-7 py-3.5 text-[15px] font-bold transition-colors hover:border-gold hover:text-gold"
            >
              Get in touch
            </Link>
          </div>
        </div>

        <Pile tilt="left" className="lg:absolute lg:-top-6.5 lg:-left-13">
          <div className="bg-gold px-6.5 pt-6 pb-7 text-ink shadow-[0_26px_60px_rgba(0,0,0,0.6)]">
            {next ? <NextUp event={next} /> : <BetweenEvents />}
          </div>
        </Pile>

        {past.length > 0 && (
          <Pile
            tilt="right"
            className="lg:absolute lg:-right-11.5 lg:-bottom-9"
          >
            <div className="border border-chalk/22 bg-panel px-6.5 py-6 shadow-[0_26px_60px_rgba(0,0,0,0.6)]">
              <div className="font-mono text-[10px] tracking-[0.14em] text-chalk/62">
                RECENTLY RUN
              </div>
              <ol className="mt-4 flex flex-col gap-2.75 font-mono text-[12.5px]">
                {past.map((ev, i) => (
                  <li key={ev.slug} className="flex gap-3">
                    <span className="text-chalk/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{ev.title}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Pile>
        )}
      </div>
    </section>
  );
}

function NextUp({ event }: { event: LnuEvent }) {
  return (
    <>
      <div className="font-mono text-[10px] tracking-[0.14em] text-ink/70">
        NEXT UP · {event.day} {event.month}
      </div>
      <div className="mt-2.5 font-serif text-[32px] leading-[1.02] font-semibold tracking-[-0.035em]">
        {event.title}
      </div>
      <div className="mt-3 font-mono text-[11.5px] leading-[1.7] text-ink/78 uppercase">
        {event.time && (
          <>
            {event.time}
            <br />
          </>
        )}
        {event.place}
      </div>
    </>
  );
}

/** The calendar is empty between terms — keep the card, give it a job. */
function BetweenEvents() {
  return (
    <>
      <div className="font-mono text-[10px] tracking-[0.14em] text-ink/70">
        BETWEEN EVENTS
      </div>
      <div className="mt-2.5 font-serif text-[32px] leading-[1.02] font-semibold tracking-[-0.035em]">
        The next one is being planned.
      </div>
      <Link
        href="#contact"
        className="mt-3 inline-block font-mono text-[11.5px] leading-[1.7] text-ink/78 underline underline-offset-3 transition-colors hover:text-ink"
      >
        TELL US WHAT TO RUN →
      </Link>
    </>
  );
}

/** Two blank cards fanned out behind the real one, so it reads as a stack. */
const BACKERS = {
  left: [
    "translate-x-6 translate-y-7 -rotate-7",
    "translate-x-3 translate-y-3.5 -rotate-[3.5deg]",
  ],
  right: [
    "-translate-x-5.5 -translate-y-7.5 rotate-6",
    "-translate-x-2.5 -translate-y-3.5 rotate-3",
  ],
};

function Pile({
  tilt,
  className,
  children,
}: {
  tilt: keyof typeof BACKERS;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative w-full max-w-[352px] ${className ?? ""}`}>
      {BACKERS[tilt].map((transform, i) => (
        <div
          key={transform}
          aria-hidden
          className={`absolute inset-0 border ${i === 0 ? "border-chalk/12 bg-[#191918]" : "border-chalk/14 bg-[#1f1f1d]"} ${transform}`}
        />
      ))}
      <div className="relative">{children}</div>
    </div>
  );
}
