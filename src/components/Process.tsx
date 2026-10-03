import { steps } from "@/data/site";
import { FadeUp, SectionLabel, Shine, Split } from "./Reveal";

export function Process() {
  return (
    <section id="process" className="relative px-6 py-28 md:px-10 md:py-44">
      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <SectionLabel index="03">Process</SectionLabel>
          <h2 className="display mt-8 text-[clamp(3.5rem,8vw,8rem)] uppercase">
            <Split as="span">How</Split>
            <br />
            <Split as="span" delay={0.12}>
              we
            </Split>
            <br />
            <span className="text-outline relative inline-block">
              <Split as="span" delay={0.24}>
                Work
              </Split>
              <Shine delay={0.7}>Work</Shine>
            </span>
          </h2>
        </div>

        {/* A grid of cards, not a running list — this section's own shape,
            not another "headline over list" repeat of Work/Services/Contact.
            Hover lift uses the same accent-tinted shadow language as the
            site's CTAs. */}
        <ol className="grid gap-4 sm:grid-cols-2 md:col-span-7 md:gap-5">
          {steps.map((step, i) => (
            <li key={step.title}>
              <FadeUp delay={i * 0.1} y={24} className="h-full">
                <div className="group relative flex h-full flex-col rounded-2xl border border-line bg-surface/40 p-7 transition-[border-color,box-shadow] duration-500 hover:border-accent-bright/40 hover:shadow-[0_24px_70px_-32px_rgba(108,207,212,0.5)] md:p-8">
                  <span className="display text-[clamp(2.25rem,3.4vw,3.25rem)] text-accent-bright">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
                </div>
              </FadeUp>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
