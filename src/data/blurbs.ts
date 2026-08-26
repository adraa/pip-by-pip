/**
 * Our own plain-English descriptions of every course and section.
 *
 * The course, grade and lesson *titles* come from the BabyPips School of
 * Pipsology and are kept exactly as they are, in their original order. Every
 * description below is written from scratch for Pip by Pip.
 */

export const courseBlurbs: Record<string, string> = {
  preschool:
    'What forex actually is, in normal words. Money, prices, and the handful of terms you need before anything else makes sense.',
  kindergarten:
    'Who you actually trade through, the three ways people try to read the market, and how to read a price chart.',
  elementary:
    'Reading a chart properly. Where prices tend to stop, what the candles are telling you, and your first four tools.',
  'middle-school':
    'Tools that measure how hard the market is pushing, the shapes prices repeat over and over, and how to map out a day in advance.',
  'summer-school':
    'Four optional side subjects. Interesting, opinionated, and not required to pass the main course.',
  'high-school':
    'Reading price on its own, without indicators. What happens when a level breaks, and how to check a trade on more than one chart.',
  'undergraduate-freshman':
    'Why currencies move at all. Interest rates, jobs numbers, politics, and the mood of the crowd.',
  'undergraduate-sophomore':
    'How currencies pull on each other, and on gold, oil, bonds and shares. Nothing moves in isolation.',
  'undergraduate-junior':
    'Turning what you know into a written plan you can actually follow on a bad day.',
  'undergraduate-senior':
    'The part that decides whether you last. How much to risk, where to get out, and how to survive being wrong.',
  graduation:
    'The real world beyond the textbook. Funded accounts, scams, the mistakes almost everyone makes, and where to go next.',
};

export const sectionBlurbs: Record<string, string> = {
  // Preschool
  'preschool/what-is-forex': 'The market itself: what gets traded, by whom, and why it is so enormous.',
  'preschool/how-do-you-trade-forex':
    'The mechanics. Buying, selling, pips, lots, spreads and the different kinds of orders you can place.',
  'preschool/when-can-you-trade-forex':
    'The market runs around the clock, but it is only genuinely busy at certain hours. Here is when.',
  'preschool/who-trades-forex':
    'Banks, funds, companies and people like us. Knowing who is on the other side changes how you see the price.',
  'preschool/why-trade-forex': 'What forex offers that shares and futures do not, and where it falls short.',
  'preschool/margin-trading-101-understand-how-your-margin-account-works':
    'The most important section in Preschool. How borrowed money works, and exactly how accounts get wiped out.',

  // Kindergarten
  'kindergarten/forex-brokers-101':
    'Choosing who holds your money. Regulation, costs, order execution, and the questions to ask before you sign up.',
  'kindergarten/three-types-of-analysis':
    'Charts, news, and crowd mood. Three ways to form an opinion, and why you need all three.',
  'kindergarten/types-of-charts': 'Line, bar and candlestick charts, and why almost everyone settles on candles.',

  // Elementary
  'elementary/support-and-resistance-levels':
    'Prices stall in the same places again and again. Finding those places is the foundation of everything else.',
  'elementary/japanese-candlesticks':
    'Each candle is a small story about who won the last hour. Learning to read them fluently.',
  'elementary/fibonacci': 'A set of levels traders use to guess how far a pullback will run before the trend resumes.',
  'elementary/moving-averages': 'Smoothing out the noise to see the direction underneath.',
  'elementary/popular-chart-indicators':
    'Bollinger Bands, MACD, stochastic and RSI. What each one measures and when it lies to you.',

  // Middle School
  'middle-school/oscillators-and-momentum-indicators':
    'Tools that try to tell you when a move has run out of steam, and why they contradict each other.',
  'middle-school/important-chart-patterns':
    'The shapes that show up on every chart, on every timeframe, forever. What each one usually means.',
  'middle-school/pivot-points': 'Levels worked out from yesterday, used to plan today before the market opens.',

  // Summer School
  'summer-school/heikin-ashi': 'A different way of drawing candles that makes trends much easier to see.',
  'summer-school/elliott-wave-theory': 'The idea that markets move in repeating five-step and three-step patterns.',
  'summer-school/harmonic-price-patterns': 'Precise geometric shapes, measured with Fibonacci ratios.',
  'summer-school/trading-divergences':
    'When price goes one way and the indicator goes the other, something is about to give.',

  // High School
  'high-school/price-action-trading': 'Reading a bare chart. Structure, zones, and entries, without a single indicator.',
  'high-school/trading-breakouts-and-fakeouts':
    'What happens when a level finally gives way, and how to tell a real break from a trap.',
  'high-school/market-environment':
    'Trending, ranging, quiet, wild. Knowing which one you are in decides which tools work.',
  'high-school/multiple-time-frame-analysis':
    'Checking the same trade on a big chart and a small one, so you stop fighting the bigger trend.',

  // Undergraduate - Freshman
  'undergraduate-freshman/fundamental-analysis-a-macro-fundamentals-approach':
    'What actually drives a currency over months: interest rates, growth, inflation and central banks.',
  'undergraduate-freshman/economic-data-and-market-reactions':
    'The reports that move prices, and why the reaction often makes no sense.',
  'undergraduate-freshman/country-risk-geopolitics-and-market-interventions':
    'Elections, conflicts, and governments stepping in to push their own currency around.',
  'undergraduate-freshman/applying-macro-fundamentals': 'Putting the whole macro picture together into one view.',
  'undergraduate-freshman/currency-crosses': 'Pairs without the US dollar in them, and why they behave differently.',
  'undergraduate-freshman/carry-trade': 'Earning the interest rate difference between two currencies, and the risk of it.',
  'undergraduate-freshman/understanding-and-trading-the-news':
    'Trading around scheduled announcements, which is far harder than it looks.',
  'undergraduate-freshman/sentiment-analysis': 'Working out what everyone else is already positioned for.',

  // Undergraduate - Sophomore
  'undergraduate-sophomore/the-u-s-dollar-index': 'One number for the dollar against the world, and how to read it.',
  'undergraduate-sophomore/intermarket-analysis': 'How bonds, gold, oil and shares tug on currencies.',
  'undergraduate-sophomore/using-equities-to-trade-fx': 'Using the stock market as a clue about currencies.',
  'undergraduate-sophomore/country-profiles':
    'The eight major currencies, one by one. What each economy runs on and what moves it.',
  'undergraduate-sophomore/beginner-s-guide-to-global-liquidity':
    'The tide of money washing around the world, and why it lifts and drops everything at once.',
  'undergraduate-sophomore/narrative-analysis': 'The story the market has decided to believe this month.',

  // Undergraduate - Junior
  'undergraduate-junior/developing-your-own-trading-plan': 'Writing down your rules before money is on the line.',
  'undergraduate-junior/which-type-of-trader-are-you': 'Matching your trading to your temperament and your free time.',
  'undergraduate-junior/build-your-own-trading-system': 'Assembling your own method, step by step, and testing it.',
  'undergraduate-junior/keeping-a-trading-journal': 'The single habit that separates people who improve from people who do not.',
  'undergraduate-junior/personality-quizzes': 'Short quizzes to work out what sort of trader you naturally are.',

  // Undergraduate - Senior
  'undergraduate-senior/risk-management': 'Deciding in advance how much you are willing to lose. Everything else follows from this.',
  'undergraduate-senior/trading-with-leverage-without-blowing-up':
    'Leverage is what kills most accounts. Here is how to use it without joining them.',
  'undergraduate-senior/position-sizing-for-account-survival': 'Working out exactly how big a trade should be.',
  'undergraduate-senior/managing-risk-with-proper-stop-loss-placement': 'Choosing where to admit you were wrong, before you enter.',
  'undergraduate-senior/scaling-in-and-out-of-trades': 'Adding to a position or taking profit in pieces rather than all at once.',
  'undergraduate-senior/currency-correlations':
    'Some pairs move together. Trading three of them can mean holding the same risk three times over.',

  // Graduation
  'graduation/prop-trading-firms-101': 'Firms that fund you to trade their money, and what the rules really mean.',
  'graduation/forex-trading-scams': 'How to spot the signal sellers, fake gurus and account managers.',
  'graduation/the-most-common-trading-mistakes-new-traders-make': 'The errors almost everyone makes, collected in one place.',
  'graduation/graduation-speech': 'A last word before you go and do this for real.',
};
