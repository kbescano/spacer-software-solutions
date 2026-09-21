import { steps } from "@/data/site";
import { FadeUp, Line, SectionLabel, Split } from "./Reveal";

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
            <span className="text-outline">
              <Split as="span" delay={0.24}>
                Work
              </Split>
            </span>
          </h2>
        </div>

        <ol className="md:col-span-7">
          {steps.map((step, i) => (
            <li key={step.title}>
              <Line delay={i * 0.08} />
              <FadeUp delay={i * 0.08} y={20}>
                <div className="group relative grid grid-cols-1 gap-3 py-8 sm:grid-cols-[6rem_1fr] sm:gap-8 md:py-10">
                  <span
                    aria-hidden
                    className="ease-expo absolute inset-y-0 -inset-x-4 origin-left scale-x-0 rounded-xl bg-surface transition-transform duration-500 group-hover:scale-x-100"
                  />
                  <span className="display relative text-[clamp(2.5rem,4vw,4rem)] text-accent-bright transition-colors">
                    0{i + 1}
                  </span>
                  <div className="relative">
                    <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md leading-relaxed text-muted">
                      {step.text}
                    </p>
                  </div>
                </div>
              </FadeUp>
            </li>
          ))}
          <li aria-hidden>
            <Line />
          </li>
        </ol>
      </div>
    </section>
  );
}
