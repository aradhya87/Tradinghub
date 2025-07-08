<script>
// Currency pairs list
const currencyPairs = [
  "XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "USDCHF", "NZDUSD",
  "EURGBP", "EURJPY", "GBPJPY", "AUDJPY", "CADJPY", "CHFJPY", "NZDJPY",
  "EURCHF", "EURCAD", "EURAUD", "GBPCHF", "GBPCAD", "AUDCAD", "AUDCHF", "CADCHF", "NZDCAD", "NZDCHF"
];

// Create buttons for each currency
function createCurrencyButtons() {
  const sidebar = document.querySelector('nav.sidebar');
  sidebar.innerHTML = '';

  currencyPairs.forEach(pair => {
    const btn = document.createElement('button');
    btn.className = 'pair-btn';
    btn.setAttribute('data-pair', pair);
    btn.textContent = pair;

    const priceBadge = document.createElement('span');
    priceBadge.className = 'price-badge';
    priceBadge.textContent = '...';
    btn.appendChild(priceBadge);

    sidebar.appendChild(btn);
  });
}

// Generate random prices (for demo)
function randomPriceForPair(pair) {
  const basePrices = {
    XAUUSD: 1950, EURUSD: 1.10, GBPUSD: 1.25, USDJPY: 140, AUDUSD: 0.67,
    USDCAD: 1.37, USDCHF: 0.93, NZDUSD: 0.59, EURGBP: 0.88, EURJPY: 154,
    GBPJPY: 176, AUDJPY: 95, CADJPY: 101, CHFJPY: 130, NZDJPY: 83,
    EURCHF: 1.02, EURCAD: 1.48, EURAUD: 1.63, GBPCHF: 1.16, GBPCAD: 1.71,
    AUDCAD: 0.92, AUDCHF: 0.62, CADCHF: 0.67, NZDCAD: 0.81, NZDCHF: 0.55
  };
  let base = basePrices[pair] || 1;
  let fluctuation = (Math.random() - 0.5) * base * 0.01;
  return (base + fluctuation).toFixed(5);
}

// Price data store
let priceData = {};

// Update prices every 5 seconds
function updatePrices() {
  currencyPairs.forEach(pair => {
    priceData[pair] = randomPriceForPair(pair);
  });

  document.querySelectorAll('.pair-btn').forEach(btn => {
    const pair = btn.getAttribute('data-pair');
    const priceBadge = btn.querySelector('.price-badge');
    if (priceBadge) priceBadge.textContent = priceData[pair];
  });
}

// Chart loading
let currentPair = "XAUUSD";
let widget = null;

function loadChart(pair) {
  document.getElementById('tradingview_container').innerHTML = '';
  currentPair = pair;
  widget = new TradingView.widget({
    container_id: "tradingview_container",
    width: "100%",
    height: 360,
    symbol: pair,
    interval: "D",
    timezone: "Etc/UTC",
    theme: "light",
    style: "1",
    locale: "en",
    toolbar_bg: "#f1f3f6",
    enable_publishing: false,
    allow_symbol_change: false,
    hide_side_toolbar: false,
    details: true,
    studies: ["MACD@tv-basicstudies"],
    withdateranges: true,
    hideideas: true,
  });

  updateTradeInfo(); // Refresh estimated lot values
}

// Click event for pair buttons
document.querySelector('nav.sidebar').addEventListener('click', (e) => {
  const btn = e.target.closest('button.pair-btn');
  if (!btn) return;

  document.querySelectorAll('.pair-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const pair = btn.getAttribute('data-pair');
  loadChart(pair);
});

// Lot calculator
const lotsInput = document.getElementById('lotsInput');
const tradeInfo = document.getElementById('tradeInfo');

function updateTradeInfo() {
  let lots = parseFloat(lotsInput.value) || 0;
  if (lots < 0) lots = 0;

  const handlingFeePerLot = 0.000330;
  const marginPerLot = 0.330162;

  tradeInfo.innerHTML = `
    Each Lot: 1 Lot = 1 ${currentPair} <br />
    Estimated Handling Fee: ${(handlingFeePerLot * lots).toFixed(6)} <br />
    Estimated Margin: ${(marginPerLot * lots).toFixed(6)}
  `;
}

lotsInput.addEventListener('input', updateTradeInfo);

// INIT
createCurrencyButtons();
currencyPairs.forEach(pair => priceData[pair] = randomPriceForPair(pair));
updatePrices();
loadChart(currentPair);
setInterval(updatePrices, 5000);
</script>
