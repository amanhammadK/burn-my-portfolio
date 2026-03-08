import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, X, Share2, RotateCcw } from "lucide-react";

// Mock roast data - in production this would come from an AI backend
const MOCK_ROASTS: Record<string, { pe: number; rsi: number; sector: string; roastLine: string }> = {
  AAPL: { pe: 33, rsi: 62, sector: "Technology", roastLine: "Congratulations on buying the world's most expensive vending machine stock." },
  TSLA: { pe: 180, rsi: 78, sector: "Consumer Cyclical", roastLine: "You're not investing, you're donating to Elon's Mars fund with extra steps." },
  NVDA: { pe: 65, rsi: 74, sector: "Technology", roastLine: "You and every other GPU-pilled retail trader. Groundbreaking originality." },
  GME: { pe: -12, rsi: 45, sector: "Consumer Cyclical", roastLine: "Still holding? At this point it's not a position, it's a personality disorder." },
  AMC: { pe: -8, rsi: 38, sector: "Communication Services", roastLine: "The only thing getting a sequel here is your losses." },
  MSFT: { pe: 36, rsi: 58, sector: "Technology", roastLine: "The 'I read one Motley Fool article' starter pack." },
  AMZN: { pe: 60, rsi: 66, sector: "Consumer Cyclical", roastLine: "You're paying 60x earnings for the privilege of subsidizing same-day delivery." },
  META: { pe: 28, rsi: 55, sector: "Technology", roastLine: "Betting on the Metaverse. Bold strategy, Cotton." },
  GOOGL: { pe: 24, rsi: 52, sector: "Technology", roastLine: "The safest pick here. Which means you'll panic sell it first." },
  PLTR: { pe: 200, rsi: 72, sector: "Technology", roastLine: "A P/E of 200 says you believe in magic more than math." },
  COIN: { pe: 45, rsi: 68, sector: "Financial Services", roastLine: "You bought a toll booth on a highway that might not exist next year." },
  RIVN: { pe: -15, rsi: 35, sector: "Consumer Cyclical", roastLine: "Negative earnings and maximum hope. The retail investor special." },
  SOFI: { pe: 95, rsi: 60, sector: "Financial Services", roastLine: "A fintech company that hasn't figured out how to make money. Ironic." },
  SPY: { pe: 22, rsi: 55, sector: "Index", roastLine: "An index fund? In THIS economy? How boringly rational of you." },
  BBBY: { pe: -50, rsi: 20, sector: "Consumer Cyclical", roastLine: "This ticker is literally dead. You're roasting yourself at this point." },
};

const GENERIC_ROAST = { pe: 40, rsi: 55, sector: "Unknown", roastLine: "I don't even know this stock, and somehow that's still a red flag." };

function getTickerData(ticker: string) {
  return MOCK_ROASTS[ticker.toUpperCase()] || GENERIC_ROAST;
}

function generateRoast(tickers: string[]) {
  const data = tickers.map(t => ({ ticker: t.toUpperCase(), ...getTickerData(t) }));

  // Calculate burn score
  const sectors = data.map(d => d.sector);
  const uniqueSectors = new Set(sectors);
  const concentrationPenalty = uniqueSectors.size <= 2 ? 25 : uniqueSectors.size <= 3 ? 10 : 0;

  const avgPE = data.reduce((s, d) => s + Math.max(d.pe, 0), 0) / data.length;
  const pePenalty = Math.min(avgPE / 2, 30);

  const avgRSI = data.reduce((s, d) => s + d.rsi, 0) / data.length;
  const rsiPenalty = avgRSI > 65 ? 20 : avgRSI > 55 ? 10 : 0;

  const burnScore = Math.min(Math.round(pePenalty + rsiPenalty + concentrationPenalty + Math.random() * 15), 100);

  // Generate full roast
  const roastLines = data.map(d => `**${d.ticker}**: ${d.roastLine}`);

  const closers = [
    "Your portfolio isn't diversified—it's just different flavors of copium.",
    "I've seen better risk management at a casino's penny slot section.",
    "This isn't a portfolio. It's a cry for help with a brokerage account.",
    "You didn't build a portfolio. You built a monument to FOMO.",
    "The only hedge in this portfolio is the one you should hide behind.",
  ];

  const summary = closers[Math.floor(Math.random() * closers.length)];

  return { burnScore, roastLines, summary, data };
}

function getBurnLabel(score: number) {
  if (score >= 80) return "FINANCIAL ARSON";
  if (score >= 60) return "CRITICALLY SCORCHED";
  if (score >= 40) return "LIGHTLY CHARRED";
  if (score >= 20) return "MILD SINGE";
  return "SURPRISINGLY FIREPROOF";
}

function getBurnColor(score: number) {
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-neon-purple";
  return "text-secondary";
}

export default function PortfolioBurn() {
  const [tickers, setTickers] = useState<string[]>(["", "", "", "", ""]);
  const [result, setResult] = useState<ReturnType<typeof generateRoast> | null>(null);
  const [isRoasting, setIsRoasting] = useState(false);

  const filledTickers = tickers.filter(t => t.trim().length > 0);

  const handleRoast = () => {
    if (filledTickers.length < 1) return;
    setIsRoasting(true);
    setTimeout(() => {
      setResult(generateRoast(filledTickers));
      setIsRoasting(false);
    }, 2000);
  };

  const handleReset = () => {
    setResult(null);
    setTickers(["", "", "", "", ""]);
  };

  const handleShare = () => {
    const text = `I just got roasted by Portfolio Burn 🔥 My Burn Score: ${result?.burnScore}/100 — "${result?.summary}" Check your score:`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanline pointer-events-none z-50" />

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[300px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-4 py-8 md:py-16 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-primary animate-flicker" />
            <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-foreground text-glow-pink">
              PORTFOLIO BURN
            </h1>
            <Flame className="w-8 h-8 text-primary animate-flicker" />
          </div>
          <p className="text-muted-foreground font-mono text-sm md:text-base max-w-lg mx-auto">
            Enter your top holdings. Get roasted by our cynical hedge fund AI.
            <br />
            <span className="text-primary/80">No mercy. No refunds.</span>
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            /* Input Phase */
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md space-y-4"
            >
              <div className="space-y-3">
                {tickers.map((ticker, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <input
                      type="text"
                      value={ticker}
                      onChange={(e) => {
                        const next = [...tickers];
                        next[i] = e.target.value.toUpperCase().slice(0, 5);
                        setTickers(next);
                      }}
                      placeholder={["AAPL", "TSLA", "NVDA", "GME", "SPY"][i]}
                      className="w-full bg-input border border-border rounded-lg px-4 py-3 font-mono text-lg text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:neon-border-cyan transition-all duration-300 group-hover:border-secondary/40"
                    />
                    {ticker && (
                      <button
                        onClick={() => {
                          const next = [...tickers];
                          next[i] = "";
                          setTickers(next);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={handleRoast}
                disabled={filledTickers.length < 1 || isRoasting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg tracking-wide disabled:opacity-30 disabled:cursor-not-allowed animate-pulse-glow transition-all"
              >
                {isRoasting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Flame className="w-5 h-5 animate-spin" />
                    ANALYZING YOUR LIFE CHOICES...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Flame className="w-5 h-5" />
                    ROAST MY PORTFOLIO
                  </span>
                )}
              </motion.button>

              <p className="text-center text-muted-foreground/50 font-mono text-xs">
                Enter at least 1 ticker. We support most US equities.
              </p>
            </motion.div>
          ) : (
            /* Result Phase */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl space-y-6"
            >
              {/* Burn Score Card */}
              <div className="bg-card border border-border rounded-xl p-6 neon-border-pink relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px]" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-muted-foreground tracking-widest">BURN SCORE</span>
                    <span className={`font-mono text-xs tracking-widest ${getBurnColor(result.burnScore)}`}>
                      {getBurnLabel(result.burnScore)}
                    </span>
                  </div>
                  <div className="flex items-end gap-3 mb-4">
                    <span className={`text-7xl font-bold font-display ${getBurnColor(result.burnScore)} text-glow-pink`}>
                      {result.burnScore}
                    </span>
                    <span className="text-2xl text-muted-foreground font-mono mb-2">/100</span>
                  </div>
                  {/* Score bar */}
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.burnScore}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-secondary via-neon-purple to-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Roast Lines */}
              <div className="space-y-3">
                {result.roastLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="bg-card border border-border rounded-lg p-4 hover:neon-border-cyan transition-all duration-300"
                  >
                    <p className="font-mono text-sm text-foreground leading-relaxed" dangerouslySetInnerHTML={{
                      __html: line.replace(/\*\*(.*?)\*\*/g, '<span class="text-secondary font-bold">$1</span>')
                    }} />
                    <div className="flex gap-4 mt-2 font-mono text-xs text-muted-foreground">
                      <span>P/E: <span className={result.data[i].pe > 50 ? "text-primary" : "text-secondary"}>{result.data[i].pe}</span></span>
                      <span>RSI: <span className={result.data[i].rsi > 70 ? "text-primary" : "text-secondary"}>{result.data[i].rsi}</span></span>
                      <span className="text-muted-foreground/50">{result.data[i].sector}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-card border border-primary/30 rounded-lg p-5 text-center"
              >
                <p className="font-display text-lg text-foreground italic">"{result.summary}"</p>
                <p className="font-mono text-xs text-muted-foreground mt-2">— The Cynical Hedge Fund Manager</p>
              </motion.div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold flex items-center justify-center gap-2 animate-pulse-glow"
                >
                  <Share2 className="w-4 h-4" />
                  SHARE TO X
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-lg border border-secondary/50 text-secondary font-display font-bold flex items-center justify-center gap-2 hover:glow-cyan transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  ROAST AGAIN
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-auto pt-12 text-center">
          <p className="font-mono text-xs text-muted-foreground/40">
            NOT FINANCIAL ADVICE • FOR ENTERTAINMENT ONLY • YOUR PORTFOLIO IS YOUR PROBLEM
          </p>
        </div>
      </div>
    </div>
  );
}
