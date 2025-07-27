import { BoltIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

const FEATURES = [
  {
    id: 1,
    title: 'Proof of transfer',
    desc: 'The consensus mechanism that connects stacks and bitcoin.',
    icon: <BoltIcon className="w-4 h-4" />,
  },
  {
    id: 2,
    title: 'Bitcoin to NFTs',
    desc: 'NFTs in securing bitcoin by encoding on the network.',
    icon: <BoltIcon className="w-4 h-4" />,
    highlighted: true,
  },
  {
    id: 3,
    title: 'Bitcoin to DeFi',
    desc: 'Stacks brings DeFi to bitcoin, unlocking over $1 trillion in capital.',
    icon: <BoltIcon className="w-4 h-4" />,
  },
];

export default function FeatureCarousel() {
  return (
    <section
      id="features"
      className="py-24 flex flex-col items-center gap-16"
    >
      <h2 className="text-4xl lg:text-5xl font-bold text-gray900 text-center">
        Stacks unleashed <br className="hidden sm:block" /> Bitcoin
      </h2>

      {/* card rail */}
      <div
        className="relative w-full max-w-7xl overflow-x-auto
                   flex justify-center gap-8 px-8 snap-x snap-mandatory"
      >
        {FEATURES.map((f) => (
          <article
            key={f.id}
            className={clsx(
              'snap-start shrink-0 rounded-2xl shadow-sm',
              'w-[280px] md:w-[320px] lg:w-[360px] h-[480px]',
              f.highlighted
                ? 'bg-accent text-white'
                : 'bg-surface-light text-gray900'
            )}
          >
            {/* icon badge */}
            <div
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center mt-8 ml-8',
                f.highlighted ? 'bg-white text-accent' : 'bg-accent text-white'
              )}
            >
              {f.icon}
            </div>

            {/* copy block */}
            <div className="flex flex-col gap-4 px-8 pt-24">
              <h3 className={clsx('font-semibold text-2xl leading-snug',
                                   f.highlighted ? 'text-white' : 'text-gray900')}>
                {f.title}
              </h3>
              <p className={clsx('text-sm leading-relaxed',
                                f.highlighted ? 'text-white/80' : 'text-gray500')}>
                {f.desc}
              </p>
              <a
                href="#"
                className={clsx('mt-4 text-sm underline underline-offset-4',
                                f.highlighted ? 'text-white' : 'text-gray900')}
              >
                Learn more
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* see‑all link */}
      <a href="#all-features" className="text-sm underline underline-offset-4">
        See all features
      </a>
    </section>
  );
} 