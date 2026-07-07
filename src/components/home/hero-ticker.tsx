import type { HomeLandingCopy } from './types';

type HeroTickerProps = {
  ticker: HomeLandingCopy['ticker'];
};

export function HeroTicker({ ticker }: HeroTickerProps) {
  return (
    <div className="absolute bottom-0 z-50 w-full overflow-hidden border-t border-white/10 bg-white/[0.03] py-2">
      <div className="font-mono-tech animate-ticker flex w-[200%] whitespace-nowrap text-[8px] tracking-[0.5em] text-white/30 uppercase">
        <span className="px-12 text-google-blue">{ticker.item1}</span>
        <span className="px-12 text-google-red">{ticker.item2}</span>
        <span className="px-12 text-google-yellow">{ticker.item3}</span>
        <span className="px-12 text-google-green">{ticker.item4}</span>
        <span className="px-12 text-google-blue">{ticker.item1}</span>
        <span className="px-12 text-google-red">{ticker.item2}</span>
        <span className="px-12 text-google-yellow">{ticker.item3}</span>
      </div>
    </div>
  );
}
