const circleCanvas = document.querySelector("#circleCanvas");
const graphCanvas = document.querySelector("#graphCanvas");
const transformCanvas = document.querySelector("#transformCanvas");
const tanCotCanvas = document.querySelector("#tanCotCanvas");
const circleCtx = circleCanvas.getContext("2d");
const graphCtx = graphCanvas.getContext("2d");
const transformCtx = transformCanvas.getContext("2d");
const tanCotCtx = tanCotCanvas.getContext("2d");

const elements = {
  angleValue: document.querySelector("#angleValue"),
  angleSecondary: document.querySelector("#angleSecondary"),
  sineValue: document.querySelector("#sineValue"),
  sineDecimal: document.querySelector("#sineDecimal"),
  cosineValue: document.querySelector("#cosineValue"),
  cosineDecimal: document.querySelector("#cosineDecimal"),
  tangentValue: document.querySelector("#tangentValue"),
  tangentDecimal: document.querySelector("#tangentDecimal"),
  circleCoordinate: document.querySelector("#circleCoordinate"),
  quadrantBadge: document.querySelector("#quadrantBadge"),
  angleSlider: document.querySelector("#angleSlider"),
  sliderValue: document.querySelector("#sliderValue"),
  playButton: document.querySelector("#playButton"),
  playIcon: document.querySelector("#playIcon"),
  playLabel: document.querySelector("#playLabel"),
  degreeButton: document.querySelector("#degreeButton"),
  radianButton: document.querySelector("#radianButton"),
  resetButton: document.querySelector("#resetButton"),
  snapAngles: document.querySelector("#snapAngles"),
  showSine: document.querySelector("#showSine"),
  showCosine: document.querySelector("#showCosine"),
  showTangent: document.querySelector("#showTangent"),
  insightText: document.querySelector("#insightText"),
  modeButtons: document.querySelectorAll("[data-mode-button]"),
  appViews: document.querySelectorAll("[data-view]"),
  transformEquation: document.querySelector("#transformEquation"),
  transformFamilyButtons: document.querySelectorAll("[data-transform-family]"),
  tanCotFamilyButtons: document.querySelectorAll("[data-tan-cot-family]"),
  paramA: document.querySelector("#paramA"),
  paramB: document.querySelector("#paramB"),
  paramC: document.querySelector("#paramC"),
  paramD: document.querySelector("#paramD"),
  paramANumber: document.querySelector("#paramANumber"),
  paramBNumber: document.querySelector("#paramBNumber"),
  paramCNumber: document.querySelector("#paramCNumber"),
  paramDNumber: document.querySelector("#paramDNumber"),
  tanParamA: document.querySelector("#tanParamA"),
  tanParamB: document.querySelector("#tanParamB"),
  tanParamC: document.querySelector("#tanParamC"),
  tanParamD: document.querySelector("#tanParamD"),
  tanParamANumber: document.querySelector("#tanParamANumber"),
  tanParamBNumber: document.querySelector("#tanParamBNumber"),
  tanParamCNumber: document.querySelector("#tanParamCNumber"),
  tanParamDNumber: document.querySelector("#tanParamDNumber"),
  analysisAmplitude: document.querySelector("#analysisAmplitude"),
  analysisPeriod: document.querySelector("#analysisPeriod"),
  analysisIncrement: document.querySelector("#analysisIncrement"),
  analysisHorizontalShift: document.querySelector("#analysisHorizontalShift"),
  analysisVerticalShift: document.querySelector("#analysisVerticalShift"),
  analysisMidline: document.querySelector("#analysisMidline"),
  analysisDomain: document.querySelector("#analysisDomain"),
  analysisRange: document.querySelector("#analysisRange"),
  transformTopLabel: document.querySelector("#transformTopLabel"),
  transformMidLabel: document.querySelector("#transformMidLabel"),
  transformBottomLabel: document.querySelector("#transformBottomLabel"),
  transformXLeftLabel: document.querySelector("#transformXLeftLabel"),
  transformXCenterLabel: document.querySelector("#transformXCenterLabel"),
  transformXRightLabel: document.querySelector("#transformXRightLabel"),
  transformAxisLabels: document.querySelector("#transformAxisLabels"),
  tanCotEquation: document.querySelector("#tanCotEquation"),
  tanAnalysisStretch: document.querySelector("#tanAnalysisStretch"),
  tanAnalysisPeriod: document.querySelector("#tanAnalysisPeriod"),
  tanAnalysisIncrement: document.querySelector("#tanAnalysisIncrement"),
  tanAnalysisHorizontalShift: document.querySelector("#tanAnalysisHorizontalShift"),
  tanAnalysisVerticalShift: document.querySelector("#tanAnalysisVerticalShift"),
  tanAnalysisCenterline: document.querySelector("#tanAnalysisCenterline"),
  tanAnalysisAsymptotes: document.querySelector("#tanAnalysisAsymptotes"),
  tanAnalysisRange: document.querySelector("#tanAnalysisRange"),
  tanCotTopLabel: document.querySelector("#tanCotTopLabel"),
  tanCotMidLabel: document.querySelector("#tanCotMidLabel"),
  tanCotBottomLabel: document.querySelector("#tanCotBottomLabel"),
  tanCotXLeftLabel: document.querySelector("#tanCotXLeftLabel"),
  tanCotXCenterLabel: document.querySelector("#tanCotXCenterLabel"),
  tanCotXRightLabel: document.querySelector("#tanCotXRightLabel"),
  tanCotAxisLabels: document.querySelector("#tanCotAxisLabels"),
  piStepButtons: document.querySelectorAll("[data-pi-target]"),
};

const colors = {
  ink: "#18342e",
  inkSoft: "#71847e",
  paper: "#fffdf8",
  grid: "#e8e2d7",
  sine: "#ee6b4d",
  cosine: "#277a70",
  tangent: "#8b65a6",
  cotangent: "#b8672a",
  gold: "#e3ad3e",
  period: "#2f6fed",
};

let angle = Math.PI / 4;
let unitMode = "degrees";
let playing = false;
let dragging = false;
let lastFrame = 0;
let activeView = "explore";
let transformFamily = "sin";
let tanCotFamily = "tan";
let transformXCenter = 0;
let tanCotXCenter = 0;
let transformDragging = false;
let transformDragStartX = 0;
let transformDragStartCenter = 0;
let tanCotDragging = false;
let tanCotDragStartX = 0;
let tanCotDragStartCenter = 0;
const transformEpsilon = 0.01;

const specialAngles = [
  0,
  Math.PI / 6,
  Math.PI / 4,
  Math.PI / 3,
  Math.PI / 2,
  (2 * Math.PI) / 3,
  (3 * Math.PI) / 4,
  (5 * Math.PI) / 6,
  Math.PI,
  (7 * Math.PI) / 6,
  (5 * Math.PI) / 4,
  (4 * Math.PI) / 3,
  (3 * Math.PI) / 2,
  (5 * Math.PI) / 3,
  (7 * Math.PI) / 4,
  (11 * Math.PI) / 6,
  2 * Math.PI,
];

const exactValues = {
  0: ["0", "1", "0"],
  30: ["\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}", "\\frac{\\sqrt{3}}{3}"],
  45: ["\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}", "1"],
  60: ["\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}", "\\sqrt{3}"],
  90: ["1", "0", "\\text{undefined}"],
  120: ["\\frac{\\sqrt{3}}{2}", "-\\frac{1}{2}", "-\\sqrt{3}"],
  135: ["\\frac{\\sqrt{2}}{2}", "-\\frac{\\sqrt{2}}{2}", "-1"],
  150: ["\\frac{1}{2}", "-\\frac{\\sqrt{3}}{2}", "-\\frac{\\sqrt{3}}{3}"],
  180: ["0", "-1", "0"],
  210: ["-\\frac{1}{2}", "-\\frac{\\sqrt{3}}{2}", "\\frac{\\sqrt{3}}{3}"],
  225: ["-\\frac{\\sqrt{2}}{2}", "-\\frac{\\sqrt{2}}{2}", "1"],
  240: ["-\\frac{\\sqrt{3}}{2}", "-\\frac{1}{2}", "\\sqrt{3}"],
  270: ["-1", "0", "\\text{undefined}"],
  300: ["-\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}", "-\\sqrt{3}"],
  315: ["-\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}", "-1"],
  330: ["-\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}", "-\\frac{\\sqrt{3}}{3}"],
  360: ["0", "1", "0"],
};

function renderMath(element, latex) {
  if (element.dataset.latex === latex) return;
  element.dataset.latex = latex;
  if (window.katex) {
    window.katex.render(latex, element, {
      throwOnError: false,
      strict: false,
    });
  } else {
    element.textContent = latex
      .replaceAll("\\frac", "")
      .replaceAll("\\sqrt", "√")
      .replaceAll("\\pi", "π")
      .replaceAll("\\circ", "°")
      .replaceAll("\\mathrm", "")
      .replaceAll("\\text", "")
      .replace(/[{}]/g, "");
  }
}

function renderStaticMath() {
  document.querySelectorAll("[data-math]").forEach((element) => {
    renderMath(element, element.dataset.math);
  });
}

function setupCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width: rect.width, height: rect.height };
}

function normalizeAngle(value) {
  return ((value % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

function degrees(value = angle) {
  return (normalizeAngle(value) * 180) / Math.PI;
}

function snappedAngle(value) {
  if (!elements.snapAngles.checked) return value;
  const normalized = normalizeAngle(value);
  let nearest = specialAngles[0];
  let distance = Infinity;
  for (const candidate of specialAngles) {
    const delta = Math.abs(candidate - normalized);
    if (delta < distance) {
      distance = delta;
      nearest = candidate;
    }
  }
  return distance < (4 * Math.PI) / 180 ? nearest : value;
}

function piFraction(value) {
  const normalized = normalizeAngle(value);
  const twelfths = Math.round((normalized / Math.PI) * 12);
  if (twelfths === 0) return "0";
  if (twelfths === 24) return "2\\pi";
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const divisor = gcd(twelfths, 12);
  const numerator = twelfths / divisor;
  const denominator = 12 / divisor;
  if (denominator === 1) return numerator === 1 ? "\\pi" : `${numerator}\\pi`;
  return numerator === 1
    ? `\\frac{\\pi}{${denominator}}`
    : `\\frac{${numerator}\\pi}{${denominator}}`;
}

function exactForAngle() {
  const rounded = Math.round(degrees());
  const normalized = rounded === 0 && angle > Math.PI ? 360 : rounded;
  if (Math.abs(degrees() - rounded) < 0.08) return exactValues[normalized] || null;
  return null;
}

function formatDecimal(value) {
  return Math.abs(value) < 0.0005 ? "0.000" : value.toFixed(3);
}

function formatCompactNumber(value) {
  if (!Number.isFinite(value)) return "\\text{undefined}";
  if (Math.abs(value) < 0.0005) return "0";
  if (Math.abs(value - Math.round(value)) < 0.0005) return `${Math.round(value)}`;
  return `${Number(value.toFixed(3))}`;
}

function formatPiMultiple(value) {
  if (Math.abs(value) < transformEpsilon) return "0";
  const twelfths = Math.round((value / Math.PI) * 12);
  if (Math.abs(value - (twelfths * Math.PI) / 12) > 0.012) return formatCompactNumber(value);

  const sign = twelfths < 0 ? "-" : "";
  const count = Math.abs(twelfths);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const divisor = gcd(count, 12);
  const numerator = count / divisor;
  const denominator = 12 / divisor;

  if (denominator === 1) return `${sign}${numerator === 1 ? "\\pi" : `${numerator}\\pi`}`;
  return numerator === 1
    ? `${sign}\\frac{\\pi}{${denominator}}`
    : `${sign}\\frac{${numerator}\\pi}{${denominator}}`;
}

function signedLatex(value, formatter = formatCompactNumber) {
  const absolute = Math.abs(value);
  return value < -0.0005 ? `-${formatter(absolute)}` : formatter(absolute);
}

function plusMinusLatex(value, formatter = formatCompactNumber) {
  if (Math.abs(value) < 0.0005) return "";
  return value > 0 ? `+${formatter(value)}` : `-${formatter(Math.abs(value))}`;
}

function solvedAsymptoteLatex({ B, C }, family) {
  if (Math.abs(B) < transformEpsilon) return "\\text{none}";

  const base = family === "tan" ? Math.PI / 2 : 0;
  const firstAsymptote = C + base / B;
  const step = Math.PI / Math.abs(B);
  const constantTerm = formatPiMultiple(firstAsymptote);
  const stepTerm = formatPiMultiple(step);
  const kStepTerm = stepTerm === "1" ? "k" : `k${stepTerm}`;

  if (Math.abs(firstAsymptote) < transformEpsilon) return `x=${kStepTerm}`;
  return `x=${constantTerm}+${kStepTerm}`;
}

function transformParameters() {
  const numericValue = (element, fallback = 0) => {
    const value = Number(element.value);
    return Number.isFinite(value) ? value : fallback;
  };

  return {
    A: numericValue(elements.paramANumber, 1),
    B: numericValue(elements.paramBNumber, 1),
    C: numericValue(elements.paramCNumber, 0),
    D: numericValue(elements.paramDNumber, 0),
  };
}

function isSinCosFamily(family = transformFamily) {
  return family === "sin" || family === "cos";
}

function isTanCotFamily(family = transformFamily) {
  return family === "tan" || family === "cot";
}

function transformFunctionLatex(family = transformFamily) {
  return {
    sin: "\\sin",
    cos: "\\cos",
    tan: "\\tan",
    cot: "\\cot",
  }[family];
}

function transformColor(family = transformFamily) {
  return {
    sin: colors.sine,
    cos: colors.cosine,
    tan: colors.tangent,
    cot: colors.cotangent,
  }[family];
}

function transformedTrigValue(family, x, { A, B, C, D }) {
  const input = B * (x - C);
  if (family === "sin") return A * Math.sin(input) + D;
  if (family === "cos") return A * Math.cos(input) + D;
  if (family === "tan") return A * Math.tan(input) + D;

  const tangent = Math.tan(input);
  return A * (Math.abs(tangent) < 0.000001 ? Infinity : 1 / tangent) + D;
}

function transformValue(x, params) {
  return transformedTrigValue(transformFamily, x, params);
}

function niceGridStep(target) {
  const safeTarget = Math.max(Math.abs(target), 0.0001);
  const exponent = Math.floor(Math.log10(safeTarget));
  const base = safeTarget / 10 ** exponent;
  const niceBase = base <= 1 ? 1 : base <= 2 ? 2 : base <= 2.5 ? 2.5 : base <= 5 ? 5 : 10;
  return niceBase * 10 ** exponent;
}

function renderAxisIncrementLabels(labels, container = elements.transformAxisLabels) {
  container.replaceChildren();
  labels.forEach(({ latex, left, top }) => {
    const label = document.createElement("div");
    label.className = "axis-increment-label";
    label.style.left = `${left}px`;
    label.style.top = `${top}px`;
    container.append(label);
    renderMath(label, latex);
  });
}

function tangentAsymptotes({ B, C }, xMin, xMax, family = transformFamily) {
  if (Math.abs(B) < transformEpsilon || !isTanCotFamily(family)) return [];

  const asymptotes = [];
  const base = family === "tan" ? Math.PI / 2 : 0;
  const inputA = B * (xMin - C);
  const inputB = B * (xMax - C);
  const inputMin = Math.min(inputA, inputB);
  const inputMax = Math.max(inputA, inputB);
  const lowK = Math.ceil((inputMin - base) / Math.PI) - 1;
  const highK = Math.floor((inputMax - base) / Math.PI) + 1;

  for (let k = lowK; k <= highK; k++) {
    const x = C + (base + k * Math.PI) / B;
    if (x >= xMin - transformEpsilon && x <= xMax + transformEpsilon) asymptotes.push(x);
  }

  return [...new Set(asymptotes.map((x) => Number(x.toFixed(10))))].sort((a, b) => a - b);
}

function isNearTangentAsymptote(x, params, family = transformFamily) {
  if (!isTanCotFamily(family)) return false;
  const input = params.B * (x - params.C);
  const normalized = family === "tan" ? input - Math.PI / 2 : input;
  return Math.abs(Math.sin(normalized)) < 0.015;
}

function drawCircle() {
  const { width, height } = setupCanvas(circleCanvas, circleCtx);
  const ctx = circleCtx;
  const theta = normalizeAngle(angle);
  const cx = width / 2;
  const cy = height / 2 + 6;
  const radius = Math.min(width * 0.31, height * 0.34);
  const x = cx + Math.cos(theta) * radius;
  const y = cy - Math.sin(theta) * radius;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 6]);
  for (let i = -2; i <= 2; i++) {
    const offset = (i * radius) / 2;
    ctx.beginPath();
    ctx.moveTo(cx - radius - 30, cy + offset);
    ctx.lineTo(cx + radius + 30, cy + offset);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + offset, cy - radius - 30);
    ctx.lineTo(cx + offset, cy + radius + 30);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(cx - radius - 35, cy);
  ctx.lineTo(cx + radius + 48, cy);
  ctx.moveTo(cx, cy + radius + 35);
  ctx.lineTo(cx, cy - radius - 40);
  ctx.stroke();

  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = colors.gold;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 1, -theta, 0);
  ctx.stroke();

  const arcRadius = radius * 0.25;
  ctx.strokeStyle = colors.gold;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, arcRadius, -theta, 0);
  ctx.stroke();

  const labelAngle = theta / 2;
  ctx.fillStyle = "#8a611c";
  ctx.font = '600 13px "Manrope", sans-serif';
  ctx.fillText("θ", cx + Math.cos(labelAngle) * (arcRadius + 13), cy - Math.sin(labelAngle) * (arcRadius + 13));

  ctx.fillStyle = "rgba(238, 107, 77, 0.09)";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, cy);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();

  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = colors.sine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, cy);
  ctx.lineTo(x, y);
  ctx.stroke();

  ctx.strokeStyle = colors.cosine;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, cy);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, y);
  ctx.stroke();

  if (elements.showTangent.checked) {
    const tanX = cx + radius;
    const tanY = cy - Math.tan(theta) * radius;
    ctx.strokeStyle = colors.tangent;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 5]);
    ctx.beginPath();
    ctx.moveTo(tanX, cy - radius - 32);
    ctx.lineTo(tanX, cy + radius + 32);
    ctx.stroke();
    ctx.setLineDash([]);

    if (Math.abs(Math.cos(theta)) > 0.12 && Math.abs(tanY - cy) < radius * 1.8) {
      ctx.strokeStyle = colors.tangent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tanX, cy);
      ctx.lineTo(tanX, tanY);
      ctx.stroke();
      ctx.fillStyle = colors.tangent;
      ctx.beginPath();
      ctx.arc(tanX, tanY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = colors.paper;
  ctx.strokeStyle = colors.sine;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const coordinateX = x > cx ? Math.min(x + 14, width - 118) : Math.max(x - 118, 8);
  const coordinateY = y < cy ? Math.max(y - 25, 8) : Math.min(y + 14, height - 28);
  elements.circleCoordinate.style.left = `${coordinateX}px`;
  elements.circleCoordinate.style.top = `${coordinateY}px`;

  circleCanvas._geometry = { cx, cy, radius };
}

function graphPoint(xValue, yValue, plot) {
  return {
    x: plot.left + (xValue / (Math.PI * 2)) * plot.width,
    y: plot.top + plot.height / 2 - yValue * (plot.height / 2.8),
  };
}

function drawGraph() {
  const { width, height } = setupCanvas(graphCanvas, graphCtx);
  const ctx = graphCtx;
  const plot = { left: 50, top: 24, width: width - 72, height: height - 62 };
  const midY = plot.top + plot.height / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;

  for (let i = -2; i <= 2; i++) {
    const y = midY - i * (plot.height / 2.8);
    ctx.beginPath();
    ctx.moveTo(plot.left, y);
    ctx.lineTo(plot.left + plot.width, y);
    ctx.stroke();
  }

  for (let i = 0; i <= 4; i++) {
    const x = plot.left + (i / 4) * plot.width;
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.top + plot.height);
    ctx.stroke();
  }

  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(plot.left, midY);
  ctx.lineTo(plot.left + plot.width + 8, midY);
  ctx.moveTo(plot.left, plot.top - 6);
  ctx.lineTo(plot.left, plot.top + plot.height);
  ctx.stroke();

  if (elements.showTangent.checked) {
    ctx.strokeStyle = "rgba(139, 101, 166, 0.4)";
    ctx.setLineDash([4, 5]);
    [Math.PI / 2, (3 * Math.PI) / 2].forEach((value) => {
      const point = graphPoint(value, 0, plot);
      ctx.beginPath();
      ctx.moveTo(point.x, plot.top);
      ctx.lineTo(point.x, plot.top + plot.height);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  function drawFunction(fn, color, lineWidth = 3) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    let drawing = false;
    for (let px = 0; px <= plot.width; px += 1.5) {
      const xv = (px / plot.width) * Math.PI * 2;
      const yv = fn(xv);
      const p = graphPoint(xv, yv, plot);
      const valid = Number.isFinite(yv) && Math.abs(yv) < 2.4;
      if (!valid) {
        drawing = false;
        continue;
      }
      if (!drawing) {
        ctx.moveTo(p.x, p.y);
        drawing = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }
    ctx.stroke();
  }

  if (elements.showSine.checked) drawFunction(Math.sin, colors.sine, 3.2);
  if (elements.showCosine.checked) drawFunction(Math.cos, colors.cosine, 3.2);
  if (elements.showTangent.checked) drawFunction(Math.tan, colors.tangent, 2.5);

  const current = normalizeAngle(angle);
  const currentX = graphPoint(current, 0, plot).x;
  ctx.strokeStyle = "rgba(24, 52, 46, 0.55)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(currentX, plot.top);
  ctx.lineTo(currentX, plot.top + plot.height);
  ctx.stroke();
  ctx.setLineDash([]);

  const markers = [];
  if (elements.showSine.checked) markers.push([Math.sin(current), colors.sine]);
  if (elements.showCosine.checked) markers.push([Math.cos(current), colors.cosine]);
  if (elements.showTangent.checked && Math.abs(Math.cos(current)) > 0.08) {
    markers.push([Math.tan(current), colors.tangent]);
  }

  for (const [value, color] of markers) {
    if (Math.abs(value) > 2.35) continue;
    const point = graphPoint(current, value, plot);
    ctx.fillStyle = colors.paper;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  graphCanvas._geometry = plot;
}

function drawTransformGraph() {
  if (activeView !== "transform") return;

  const { width, height } = setupCanvas(transformCanvas, transformCtx);
  if (!width || !height) return;

  const ctx = transformCtx;
  const params = transformParameters();
  const { A, B, C, D } = params;
  const xSpan = 4 * Math.PI;
  const xMin = transformXCenter - xSpan / 2;
  const xMax = transformXCenter + xSpan / 2;
  const amplitude = Math.abs(A);
  const sampleCount = 420;
  const values = [];

  for (let i = 0; i <= sampleCount; i++) {
    const x = xMin + (i / sampleCount) * (xMax - xMin);
    const y = transformValue(x, params);
    values.push(Number.isFinite(y) ? y : null);
  }

  const tangentRadius = Math.max(4, amplitude * 4, 1);
  const finiteValues = values.filter((value) => value !== null);
  const naturalMin = isTanCotFamily()
    ? D - tangentRadius
    : Math.abs(B) < transformEpsilon
      ? Math.min(...finiteValues, D, 0)
      : D - amplitude;
  const naturalMax = isTanCotFamily()
    ? D + tangentRadius
    : Math.abs(B) < transformEpsilon
      ? Math.max(...finiteValues, D, 0)
      : D + amplitude;
  const span = Math.max(naturalMax - naturalMin, Math.abs(D) * 0.4, 1);
  const yMin = Math.min(naturalMin, 0) - span * 0.25;
  const yMax = Math.max(naturalMax, 0) + span * 0.25;
  const plot = { left: 56, top: 25, width: width - 82, height: height - 62 };

  const pointFor = (x, y) => ({
    x: plot.left + ((x - xMin) / (xMax - xMin)) * plot.width,
    y: plot.top + ((yMax - y) / (yMax - yMin)) * plot.height,
  });

  const drawCurveSegment = (startX, endX, color, lineWidth) => {
    const lower = Math.max(xMin, Math.min(startX, endX));
    const upper = Math.min(xMax, Math.max(startX, endX));
    if (upper <= lower) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    const segmentSteps = Math.max(48, Math.round(((upper - lower) / (xMax - xMin)) * sampleCount));
    let drawing = false;
    let previousPoint = null;
    for (let i = 0; i <= segmentSteps; i++) {
      const x = lower + (i / segmentSteps) * (upper - lower);
      const y = transformValue(x, params);
      const p = Number.isFinite(y) ? pointFor(x, y) : null;
      const offCanvas = !p || p.y < plot.top - plot.height * 1.4 || p.y > plot.top + plot.height * 2.4;
      const jumpsAcrossAsymptote =
        isTanCotFamily() &&
        (isNearTangentAsymptote(x, params) ||
          (previousPoint && Math.abs(p?.y - previousPoint.y) > plot.height * 0.65));

      if (offCanvas || jumpsAcrossAsymptote) {
        drawing = false;
        previousPoint = null;
        continue;
      }

      if (!drawing) {
        ctx.moveTo(p.x, p.y);
        drawing = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
      previousPoint = p;
    }
    ctx.stroke();
  };

  const drawSinCosAnchorPoints = () => {
    if (Math.abs(B) < transformEpsilon) return;

    const parentInputs = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI];

    parentInputs.forEach((input) => {
      const x = C + input / Math.abs(B);
      const y = transformValue(x, params);
      if (x < xMin - transformEpsilon || x > xMax + transformEpsilon || !Number.isFinite(y)) return;

      const p = pointFor(x, y);
      if (p.y < plot.top || p.y > plot.top + plot.height) return;

      ctx.save();
      ctx.shadowColor = "rgba(24, 52, 46, 0.18)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = colors.paper;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = transformColor(transformFamily);
      ctx.strokeStyle = colors.period;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  };

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  const xGridStep = Math.PI / 2;
  const firstXGrid = Math.ceil(xMin / xGridStep) * xGridStep;
  for (let xValue = firstXGrid; xValue <= xMax + transformEpsilon; xValue += xGridStep) {
    const x = pointFor(xValue, 0).x;
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.top + plot.height);
    ctx.stroke();
  }

  const targetYStep = (yMax - yMin) / 8;
  const yGridStep = amplitude >= 1 ? Math.max(1, niceGridStep(targetYStep)) : niceGridStep(targetYStep);
  const firstYGrid = Math.ceil(yMin / yGridStep) * yGridStep;
  for (let yValue = firstYGrid; yValue <= yMax + transformEpsilon; yValue += yGridStep) {
    const y = pointFor(0, yValue).y;
    ctx.beginPath();
    ctx.moveTo(plot.left, y);
    ctx.lineTo(plot.left + plot.width, y);
    ctx.stroke();
  }

  const xAxis = pointFor(0, 0).y;
  if (xAxis >= plot.top && xAxis <= plot.top + plot.height) {
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(plot.left, xAxis);
    ctx.lineTo(plot.left + plot.width, xAxis);
    ctx.stroke();
  }

  const yAxis = pointFor(0, 0).x;
  if (yAxis >= plot.left && yAxis <= plot.left + plot.width) {
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(yAxis, plot.top);
    ctx.lineTo(yAxis, plot.top + plot.height);
    ctx.stroke();
  }

  const midline = pointFor(0, D).y;
  ctx.strokeStyle = "rgba(227, 173, 62, 0.8)";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 6]);
  ctx.beginPath();
  ctx.moveTo(plot.left, midline);
  ctx.lineTo(plot.left + plot.width, midline);
  ctx.stroke();

  if (C >= xMin && C <= xMax) {
    const shiftX = pointFor(C, 0).x;
    ctx.strokeStyle = "rgba(24, 52, 46, 0.35)";
    ctx.beginPath();
    ctx.moveTo(shiftX, plot.top);
    ctx.lineTo(shiftX, plot.top + plot.height);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  if (isTanCotFamily()) {
    const asymptotes = tangentAsymptotes(params, xMin, xMax);
    ctx.strokeStyle = transformFamily === "tan" ? "rgba(139, 101, 166, 0.42)" : "rgba(184, 103, 42, 0.42)";
    ctx.lineWidth = 1.7;
    ctx.setLineDash([8, 7]);
    asymptotes.forEach((asymptote) => {
      const x = pointFor(asymptote, 0).x;
      ctx.beginPath();
      ctx.moveTo(x, plot.top);
      ctx.lineTo(x, plot.top + plot.height);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  drawCurveSegment(xMin, xMax, transformColor(), 3.4);

  if (Math.abs(B) >= transformEpsilon) {
    const period = (isTanCotFamily() ? Math.PI : 2 * Math.PI) / Math.abs(B);
    const increment = isTanCotFamily() ? period / 2 : period / 4;
    drawCurveSegment(C, C + period, colors.period, 6.4);

    const xAxisLabelTop = Math.max(
      plot.top + 8,
      Math.min(plot.top + plot.height - 26, (xAxis >= plot.top && xAxis <= plot.top + plot.height ? xAxis : plot.top + plot.height) + 8),
    );
    const labels = [];
    const labelSpacing = (increment / (xMax - xMin)) * plot.width;
    const labelCount = labelSpacing < 54 ? 1 : isTanCotFamily() ? 3 : 5;
    for (let i = 0; i < labelCount; i++) {
      const xValue = C + i * increment;
      if (xValue < xMin - transformEpsilon || xValue > xMax + transformEpsilon) continue;
      const left = pointFor(xValue, 0).x;
      labels.push({ latex: formatPiMultiple(xValue), left, top: xAxisLabelTop });
    }
    renderAxisIncrementLabels(labels);
  } else {
    renderAxisIncrementLabels([]);
  }

  drawSinCosAnchorPoints();

  renderMath(elements.transformTopLabel, formatCompactNumber(naturalMax));
  renderMath(elements.transformMidLabel, formatCompactNumber(D));
  renderMath(elements.transformBottomLabel, formatCompactNumber(naturalMin));
  renderMath(elements.transformXLeftLabel, formatPiMultiple(xMin));
  renderMath(elements.transformXCenterLabel, formatPiMultiple(transformXCenter));
  renderMath(elements.transformXRightLabel, formatPiMultiple(xMax));

  transformCanvas._geometry = { plot, xMin, xMax, yMin, yMax, yGridStep };
}

function drawTanCotGraph() {
  if (activeView !== "transform") return;

  const { width, height } = setupCanvas(tanCotCanvas, tanCotCtx);
  if (!width || !height) return;

  const ctx = tanCotCtx;
  const params = transformParameters();
  const { A, B, C, D } = params;
  const xSpan = 4 * Math.PI;
  const xMin = tanCotXCenter - xSpan / 2;
  const xMax = tanCotXCenter + xSpan / 2;
  const stretch = Math.abs(A);
  const sampleCount = 420;
  const tangentRadius = Math.max(4, stretch * 4, 1);
  const naturalMin = D - tangentRadius;
  const naturalMax = D + tangentRadius;
  const span = Math.max(naturalMax - naturalMin, Math.abs(D) * 0.4, 1);
  const yMin = Math.min(naturalMin, 0) - span * 0.25;
  const yMax = Math.max(naturalMax, 0) + span * 0.25;
  const plot = { left: 56, top: 25, width: width - 82, height: height - 62 };

  const pointFor = (x, y) => ({
    x: plot.left + ((x - xMin) / (xMax - xMin)) * plot.width,
    y: plot.top + ((yMax - y) / (yMax - yMin)) * plot.height,
  });

  const drawCurveSegment = (startX, endX, color, lineWidth) => {
    const lower = Math.max(xMin, Math.min(startX, endX));
    const upper = Math.min(xMax, Math.max(startX, endX));
    if (upper <= lower) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    const segmentSteps = Math.max(48, Math.round(((upper - lower) / (xMax - xMin)) * sampleCount));
    let drawing = false;
    let previousPoint = null;
    for (let i = 0; i <= segmentSteps; i++) {
      const x = lower + (i / segmentSteps) * (upper - lower);
      const y = transformedTrigValue(tanCotFamily, x, params);
      const p = Number.isFinite(y) ? pointFor(x, y) : null;
      const offCanvas = !p || p.y < plot.top - plot.height * 1.4 || p.y > plot.top + plot.height * 2.4;
      const jumpsAcrossAsymptote =
        isNearTangentAsymptote(x, params, tanCotFamily) ||
        (previousPoint && Math.abs(p?.y - previousPoint.y) > plot.height * 0.65);

      if (offCanvas || jumpsAcrossAsymptote) {
        drawing = false;
        previousPoint = null;
        continue;
      }

      if (!drawing) {
        ctx.moveTo(p.x, p.y);
        drawing = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
      previousPoint = p;
    }
    ctx.stroke();
  };

  const drawAnchorPoints = () => {
    if (Math.abs(B) < transformEpsilon) return;

    const parentInputs =
      tanCotFamily === "tan"
        ? [-Math.PI / 4, 0, Math.PI / 4]
        : [Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];

    parentInputs.forEach((input) => {
      const x = C + input / B;
      const parentY = tanCotFamily === "tan" ? Math.tan(input) : 1 / Math.tan(input);
      const y = A * parentY + D;
      if (x < xMin - transformEpsilon || x > xMax + transformEpsilon || !Number.isFinite(y)) return;

      const p = pointFor(x, y);
      if (p.y < plot.top || p.y > plot.top + plot.height) return;

      ctx.save();
      ctx.shadowColor = "rgba(24, 52, 46, 0.18)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = colors.paper;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = transformColor(tanCotFamily);
      ctx.strokeStyle = colors.period;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  };

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  const xGridStep = Math.PI / 2;
  const firstXGrid = Math.ceil(xMin / xGridStep) * xGridStep;
  for (let xValue = firstXGrid; xValue <= xMax + transformEpsilon; xValue += xGridStep) {
    const x = pointFor(xValue, 0).x;
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.top + plot.height);
    ctx.stroke();
  }

  const targetYStep = (yMax - yMin) / 8;
  const yGridStep = stretch >= 1 ? Math.max(1, niceGridStep(targetYStep)) : niceGridStep(targetYStep);
  const firstYGrid = Math.ceil(yMin / yGridStep) * yGridStep;
  for (let yValue = firstYGrid; yValue <= yMax + transformEpsilon; yValue += yGridStep) {
    const y = pointFor(0, yValue).y;
    ctx.beginPath();
    ctx.moveTo(plot.left, y);
    ctx.lineTo(plot.left + plot.width, y);
    ctx.stroke();
  }

  const xAxis = pointFor(0, 0).y;
  if (xAxis >= plot.top && xAxis <= plot.top + plot.height) {
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(plot.left, xAxis);
    ctx.lineTo(plot.left + plot.width, xAxis);
    ctx.stroke();
  }

  const yAxis = pointFor(0, 0).x;
  if (yAxis >= plot.left && yAxis <= plot.left + plot.width) {
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(yAxis, plot.top);
    ctx.lineTo(yAxis, plot.top + plot.height);
    ctx.stroke();
  }

  const centerline = pointFor(0, D).y;
  ctx.strokeStyle = "rgba(227, 173, 62, 0.8)";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 6]);
  ctx.beginPath();
  ctx.moveTo(plot.left, centerline);
  ctx.lineTo(plot.left + plot.width, centerline);
  ctx.stroke();

  const asymptotes = tangentAsymptotes(params, xMin, xMax, tanCotFamily);
  ctx.strokeStyle = tanCotFamily === "tan" ? "rgba(139, 101, 166, 0.42)" : "rgba(184, 103, 42, 0.42)";
  ctx.lineWidth = 1.7;
  ctx.setLineDash([8, 7]);
  asymptotes.forEach((asymptote) => {
    const x = pointFor(asymptote, 0).x;
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.top + plot.height);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  drawCurveSegment(xMin, xMax, transformColor(tanCotFamily), 3.4);

  if (Math.abs(B) >= transformEpsilon) {
    const period = Math.PI / Math.abs(B);
    const increment = period / 2;
    drawCurveSegment(C, C + period, colors.period, 6.4);

    const xAxisLabelTop = Math.max(
      plot.top + 8,
      Math.min(plot.top + plot.height - 26, (xAxis >= plot.top && xAxis <= plot.top + plot.height ? xAxis : plot.top + plot.height) + 8),
    );
    const labels = [];
    const labelSpacing = (increment / (xMax - xMin)) * plot.width;
    const labelCount = labelSpacing < 54 ? 1 : 3;
    for (let i = 0; i < labelCount; i++) {
      const xValue = C + i * increment;
      if (xValue < xMin - transformEpsilon || xValue > xMax + transformEpsilon) continue;
      labels.push({ latex: formatPiMultiple(xValue), left: pointFor(xValue, 0).x, top: xAxisLabelTop });
    }
    renderAxisIncrementLabels(labels, elements.tanCotAxisLabels);
  } else {
    renderAxisIncrementLabels([], elements.tanCotAxisLabels);
  }

  drawAnchorPoints();

  renderMath(elements.tanCotTopLabel, formatCompactNumber(naturalMax));
  renderMath(elements.tanCotMidLabel, formatCompactNumber(D));
  renderMath(elements.tanCotBottomLabel, formatCompactNumber(naturalMin));
  renderMath(elements.tanCotXLeftLabel, formatPiMultiple(xMin));
  renderMath(elements.tanCotXCenterLabel, formatPiMultiple(tanCotXCenter));
  renderMath(elements.tanCotXRightLabel, formatPiMultiple(xMax));

  tanCotCanvas._geometry = { plot, xMin, xMax, yMin, yMax, yGridStep };
}

function updateReadout() {
  const deg = degrees();
  const exact = exactForAngle();
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  const tangent = Math.tan(angle);
  const isTanUndefined = Math.abs(cosine) < 0.0005;

  if (unitMode === "degrees") {
    renderMath(elements.angleValue, `${Math.round(deg * 10) / 10}^{\\circ}`);
    renderMath(elements.angleSecondary, `${piFraction(angle)}\\,\\mathrm{rad}`);
    renderMath(elements.sliderValue, `${Math.round(deg)}^{\\circ}`);
  } else {
    renderMath(elements.angleValue, `${piFraction(angle)}\\,\\mathrm{rad}`);
    renderMath(elements.angleSecondary, `${Math.round(deg * 10) / 10}^{\\circ}`);
    renderMath(elements.sliderValue, piFraction(angle));
  }

  renderMath(elements.sineValue, exact?.[0] ?? formatDecimal(sine));
  renderMath(elements.cosineValue, exact?.[1] ?? formatDecimal(cosine));
  renderMath(
    elements.tangentValue,
    exact?.[2] ?? (isTanUndefined ? "\\text{undefined}" : formatDecimal(tangent)),
  );
  renderMath(elements.sineDecimal, `\\approx ${formatDecimal(sine)}`);
  renderMath(elements.cosineDecimal, `\\approx ${formatDecimal(cosine)}`);
  renderMath(
    elements.tangentDecimal,
    isTanUndefined ? "\\cos\\theta=0" : `\\approx ${formatDecimal(tangent)}`,
  );
  renderMath(
    elements.circleCoordinate,
    `\\left(${formatDecimal(cosine)},\\ ${formatDecimal(sine)}\\right)`,
  );

  let quadrant = "On an axis";
  if (deg > 0 && deg < 90) quadrant = "Quadrant I";
  if (deg > 90 && deg < 180) quadrant = "Quadrant II";
  if (deg > 180 && deg < 270) quadrant = "Quadrant III";
  if (deg > 270 && deg < 360) quadrant = "Quadrant IV";
  elements.quadrantBadge.textContent = quadrant;

  elements.angleSlider.value = Math.round((normalizeAngle(angle) / (Math.PI * 2)) * 720);
  const progress = (elements.angleSlider.value / 720) * 100;
  elements.angleSlider.style.background = `linear-gradient(to right, ${colors.sine} 0 ${progress}%, ${colors.grid} ${progress}% 100%)`;

  if (isTanUndefined) {
    elements.insightText.innerHTML =
      "Tangent is <strong>undefined</strong> here because cos θ = 0. On the graph, the curve approaches a vertical asymptote.";
  } else if (deg > 90 && deg < 180) {
    elements.insightText.innerHTML =
      "In Quadrant II, <strong>sine stays positive</strong> while cosine becomes negative. The graph markers reveal both signs at once.";
  } else if (deg > 180 && deg < 270) {
    elements.insightText.innerHTML =
      "In Quadrant III, sine and cosine are both negative, so their ratio—<strong>tangent—is positive</strong>.";
  } else {
    elements.insightText.innerHTML =
      "The point’s vertical height is <strong>sin θ</strong>. As the point moves around the circle, that height becomes the sine wave.";
  }
}

function updateTransformReadout() {
  const { A, B, C, D } = transformParameters();
  const family = transformFunctionLatex();
  const bTerm = formatPiMultiple(B);
  const dTerm = plusMinusLatex(D);
  const amplitude = Math.abs(A);
  const constantValue = transformFamily === "sin" ? D : A + D;
  const period = Math.abs(B) < transformEpsilon ? null : (2 * Math.PI) / Math.abs(B);
  const increment = period === null ? null : period / 4;
  const rangeLow = Math.abs(B) < transformEpsilon ? constantValue : D - amplitude;
  const rangeHigh = Math.abs(B) < transformEpsilon ? constantValue : D + amplitude;
  const shiftTerm =
    C < -transformEpsilon
      ? `+${formatPiMultiple(Math.abs(C))}`
      : C > transformEpsilon
        ? `-${formatPiMultiple(C)}`
        : "";

  renderMath(
    elements.transformEquation,
    `y=${formatCompactNumber(A)}${family}\\left[${bTerm}\\left(x${shiftTerm}\\right)\\right]${dTerm}`,
  );

  renderMath(elements.analysisAmplitude, formatCompactNumber(amplitude));
  renderMath(elements.analysisPeriod, period === null ? "\\text{undefined}" : formatPiMultiple(period));
  renderMath(elements.analysisIncrement, increment === null ? "\\text{undefined}" : formatPiMultiple(increment));
  renderMath(
    elements.analysisHorizontalShift,
    C > transformEpsilon
      ? `${formatPiMultiple(C)}\\text{ right}`
      : C < -transformEpsilon
        ? `${formatPiMultiple(Math.abs(C))}\\text{ left}`
        : "0",
  );
  renderMath(
    elements.analysisVerticalShift,
    D > 0.0005
      ? `${formatCompactNumber(D)}\\text{ up}`
      : D < -0.0005
        ? `${formatCompactNumber(Math.abs(D))}\\text{ down}`
        : "0",
  );
  renderMath(elements.analysisMidline, `y=${formatCompactNumber(D)}`);
  renderMath(elements.analysisDomain, "(-\\infty,\\infty)");
  renderMath(
    elements.analysisRange,
    `\\left[${formatCompactNumber(rangeLow)},${formatCompactNumber(rangeHigh)}\\right]`,
  );
}

function updateTanCotReadout() {
  const { A, B, C, D } = transformParameters();
  const family = transformFunctionLatex(tanCotFamily);
  const bTerm = formatPiMultiple(B);
  const dTerm = plusMinusLatex(D);
  const period = Math.abs(B) < transformEpsilon ? null : Math.PI / Math.abs(B);
  const increment = period === null ? null : period / 2;
  const shiftTerm =
    C < -transformEpsilon
      ? `+${formatPiMultiple(Math.abs(C))}`
      : C > transformEpsilon
        ? `-${formatPiMultiple(C)}`
        : "";

  renderMath(
    elements.tanCotEquation,
    `y=${formatCompactNumber(A)}${family}\\left[${bTerm}\\left(x${shiftTerm}\\right)\\right]${dTerm}`,
  );
  renderMath(elements.tanAnalysisStretch, formatCompactNumber(A));
  renderMath(elements.tanAnalysisPeriod, period === null ? "\\text{undefined}" : formatPiMultiple(period));
  renderMath(elements.tanAnalysisIncrement, increment === null ? "\\text{undefined}" : formatPiMultiple(increment));
  renderMath(
    elements.tanAnalysisHorizontalShift,
    C > transformEpsilon
      ? `${formatPiMultiple(C)}\\text{ right}`
      : C < -transformEpsilon
        ? `${formatPiMultiple(Math.abs(C))}\\text{ left}`
        : "0",
  );
  renderMath(
    elements.tanAnalysisVerticalShift,
    D > 0.0005
      ? `${formatCompactNumber(D)}\\text{ up}`
      : D < -0.0005
        ? `${formatCompactNumber(Math.abs(D))}\\text{ down}`
        : "0",
  );
  renderMath(elements.tanAnalysisCenterline, `y=${formatCompactNumber(D)}`);
  renderMath(
    elements.tanAnalysisAsymptotes,
    solvedAsymptoteLatex({ B, C }, tanCotFamily),
  );
  renderMath(elements.tanAnalysisRange, Math.abs(A) < transformEpsilon ? `\\{${formatCompactNumber(D)}\\}` : "(-\\infty,\\infty)");
}

function render() {
  drawCircle();
  drawGraph();
  updateReadout();
}

function renderTransform() {
  updateTransformReadout();
  drawTransformGraph();
  updateTanCotReadout();
  drawTanCotGraph();
}

function setActiveView(view) {
  activeView = view;
  elements.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.modeButton === view);
  });
  elements.appViews.forEach((section) => {
    section.classList.toggle("hidden", section.dataset.view !== view);
  });
  if (view === "transform") renderTransform();
  else render();
}

function setAngle(value, shouldSnap = true) {
  angle = shouldSnap ? snappedAngle(value) : value;
  render();
}

function pointerAngle(event) {
  const rect = circleCanvas.getBoundingClientRect();
  const { cx, cy } = circleCanvas._geometry;
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return Math.atan2(cy - y, x - cx);
}

circleCanvas.addEventListener("pointerdown", (event) => {
  dragging = true;
  playing = false;
  updatePlayButton();
  circleCanvas.setPointerCapture(event.pointerId);
  setAngle(pointerAngle(event));
});

circleCanvas.addEventListener("pointermove", (event) => {
  if (dragging) setAngle(pointerAngle(event));
});

circleCanvas.addEventListener("pointerup", () => {
  dragging = false;
});

circleCanvas.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  if (event.key === "Home") setAngle(0, false);
  if (event.key === "End") setAngle(Math.PI * 2, false);
  if (event.key === "ArrowLeft") setAngle(angle - Math.PI / 180, false);
  if (event.key === "ArrowRight") setAngle(angle + Math.PI / 180, false);
});

graphCanvas.addEventListener("pointerdown", (event) => {
  const rect = graphCanvas.getBoundingClientRect();
  const plot = graphCanvas._geometry;
  const x = event.clientX - rect.left;
  const bounded = Math.max(plot.left, Math.min(plot.left + plot.width, x));
  playing = false;
  updatePlayButton();
  setAngle(((bounded - plot.left) / plot.width) * Math.PI * 2);
});

function setTransformXCenter(value) {
  transformXCenter = value;
  renderTransform();
}

function setTanCotXCenter(value) {
  tanCotXCenter = value;
  renderTransform();
}

transformCanvas.addEventListener("pointerdown", (event) => {
  transformDragging = true;
  transformDragStartX = event.clientX;
  transformDragStartCenter = transformXCenter;
  transformCanvas.setPointerCapture(event.pointerId);
});

transformCanvas.addEventListener("pointermove", (event) => {
  if (!transformDragging || !transformCanvas._geometry) return;
  const { plot, xMin, xMax } = transformCanvas._geometry;
  const xUnitsPerPixel = (xMax - xMin) / plot.width;
  setTransformXCenter(transformDragStartCenter - (event.clientX - transformDragStartX) * xUnitsPerPixel);
});

transformCanvas.addEventListener("pointerup", () => {
  transformDragging = false;
});

transformCanvas.addEventListener("pointercancel", () => {
  transformDragging = false;
});

transformCanvas.addEventListener(
  "wheel",
  (event) => {
    if (!transformCanvas._geometry) return;
    event.preventDefault();
    const { plot, xMin, xMax } = transformCanvas._geometry;
    const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const xUnitsPerPixel = (xMax - xMin) / plot.width;
    setTransformXCenter(transformXCenter + horizontalDelta * xUnitsPerPixel);
  },
  { passive: false },
);

tanCotCanvas.addEventListener("pointerdown", (event) => {
  tanCotDragging = true;
  tanCotDragStartX = event.clientX;
  tanCotDragStartCenter = tanCotXCenter;
  tanCotCanvas.setPointerCapture(event.pointerId);
});

tanCotCanvas.addEventListener("pointermove", (event) => {
  if (!tanCotDragging || !tanCotCanvas._geometry) return;
  const { plot, xMin, xMax } = tanCotCanvas._geometry;
  const xUnitsPerPixel = (xMax - xMin) / plot.width;
  setTanCotXCenter(tanCotDragStartCenter - (event.clientX - tanCotDragStartX) * xUnitsPerPixel);
});

tanCotCanvas.addEventListener("pointerup", () => {
  tanCotDragging = false;
});

tanCotCanvas.addEventListener("pointercancel", () => {
  tanCotDragging = false;
});

tanCotCanvas.addEventListener(
  "wheel",
  (event) => {
    if (!tanCotCanvas._geometry) return;
    event.preventDefault();
    const { plot, xMin, xMax } = tanCotCanvas._geometry;
    const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const xUnitsPerPixel = (xMax - xMin) / plot.width;
    setTanCotXCenter(tanCotXCenter + horizontalDelta * xUnitsPerPixel);
  },
  { passive: false },
);

elements.angleSlider.addEventListener("input", (event) => {
  playing = false;
  updatePlayButton();
  setAngle((Number(event.target.value) / 720) * Math.PI * 2);
});

function updatePlayButton() {
  elements.playIcon.textContent = playing ? "Ⅱ" : "▶";
  elements.playLabel.textContent = playing ? "Pause" : "Play";
  elements.playButton.setAttribute("aria-label", playing ? "Pause animation" : "Play animation");
}

elements.playButton.addEventListener("click", () => {
  playing = !playing;
  lastFrame = performance.now();
  updatePlayButton();
  if (playing) requestAnimationFrame(animate);
});

function animate(timestamp) {
  if (!playing) return;
  const elapsed = Math.min(timestamp - lastFrame, 50);
  lastFrame = timestamp;
  angle += elapsed * 0.00045;
  render();
  requestAnimationFrame(animate);
}

elements.degreeButton.addEventListener("click", () => {
  unitMode = "degrees";
  elements.degreeButton.classList.add("active");
  elements.radianButton.classList.remove("active");
  render();
});

elements.radianButton.addEventListener("click", () => {
  unitMode = "radians";
  elements.radianButton.classList.add("active");
  elements.degreeButton.classList.remove("active");
  render();
});

elements.resetButton.addEventListener("click", () => {
  playing = false;
  updatePlayButton();
  unitMode = "degrees";
  elements.degreeButton.classList.add("active");
  elements.radianButton.classList.remove("active");
  elements.showSine.checked = true;
  elements.showCosine.checked = true;
  elements.showTangent.checked = false;
  elements.snapAngles.checked = true;
  setAngle(Math.PI / 4, false);
});

[elements.showSine, elements.showCosine, elements.showTangent].forEach((input) => {
  input.addEventListener("change", render);
});

elements.modeButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.modeButton));
});

elements.transformFamilyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    transformFamily = button.dataset.transformFamily;
    elements.transformFamilyButtons.forEach((familyButton) => {
      familyButton.classList.toggle("active", familyButton === button);
    });
    renderTransform();
  });
});

elements.tanCotFamilyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tanCotFamily = button.dataset.tanCotFamily;
    elements.tanCotFamilyButtons.forEach((familyButton) => {
      familyButton.classList.toggle("active", familyButton === button);
    });
    renderTransform();
  });
});

const parameterGroups = {
  A: [
    [elements.paramA, elements.paramANumber],
    [elements.tanParamA, elements.tanParamANumber],
  ],
  B: [
    [elements.paramB, elements.paramBNumber],
    [elements.tanParamB, elements.tanParamBNumber],
  ],
  C: [
    [elements.paramC, elements.paramCNumber],
    [elements.tanParamC, elements.tanParamCNumber],
  ],
  D: [
    [elements.paramD, elements.paramDNumber],
    [elements.tanParamD, elements.tanParamDNumber],
  ],
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function cleanParameterValue(value) {
  if (Math.abs(value) < 0.000001) return "0";
  return `${Number(value.toFixed(6))}`;
}

function snapParameterValue(value, targetValue) {
  const tolerance = 0.03;
  return Math.abs(value - targetValue) <= tolerance ? targetValue : value;
}

function snappedValueForParameter(parameter, value) {
  if (parameter === "A" || parameter === "B") return snapParameterValue(value, 1);
  if (parameter === "C" || parameter === "D") return snapParameterValue(value, 0);
  return value;
}

function setParameterValue(parameter, value, shouldCenterOnC = false) {
  const controls = parameterGroups[parameter];
  const [, primaryNumber] = controls[0];
  const min = Number(primaryNumber.min);
  const max = Number(primaryNumber.max);
  const nextValue = clamp(snappedValueForParameter(parameter, value), min, max);
  controls.forEach(([slider, number]) => {
    number.value = cleanParameterValue(nextValue);
    slider.value = `${clamp(nextValue, Number(slider.min), Number(slider.max))}`;
  });
  if (shouldCenterOnC || parameter === "C") {
    transformXCenter = nextValue;
    tanCotXCenter = nextValue;
  }
  renderTransform();
}

function syncParameter(parameter, source) {
  if (source.value === "") {
    parameterGroups[parameter].forEach(([slider, number]) => {
      if (source !== slider) slider.value = "";
      if (source !== number) number.value = "";
    });
    renderTransform();
    return;
  }
  const sourceValue = Number(source.value);
  const nextValue = Number.isFinite(sourceValue) ? snappedValueForParameter(parameter, sourceValue) : source.value;
  parameterGroups[parameter].forEach(([slider, number]) => {
    slider.value = cleanParameterValue(nextValue);
    number.value = cleanParameterValue(nextValue);
  });
  if (parameter === "C") {
    const nextCenter = Number(nextValue);
    if (Number.isFinite(nextCenter)) {
      transformXCenter = nextCenter;
      tanCotXCenter = nextCenter;
    }
  }
  renderTransform();
}

Object.entries(parameterGroups).forEach(([parameter, controls]) => {
  controls.forEach(([slider, number]) => {
    slider.addEventListener("input", () => syncParameter(parameter, slider));
    number.addEventListener("input", () => syncParameter(parameter, number));
  });
});

elements.piStepButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.piTarget;
    const direction = Number(button.dataset.piDirection);
    const step = Math.PI / 12;
    const [, number] = parameterGroups[target][0];
    const currentValue = Number(number.value) || 0;
    const rawStep = currentValue / step;
    const nearestStep = Math.round(rawStep);
    const currentStep = Math.abs(rawStep - nearestStep) < 0.01 ? nearestStep : rawStep;
    const nextStep =
      direction > 0
        ? Math.floor(currentStep + 0.000001) + 1
        : Math.ceil(currentStep - 0.000001) - 1;
    setParameterValue(target, nextStep * step, target === "C");
  });
});

window.addEventListener("resize", () => {
  render();
  renderTransform();
});
renderStaticMath();
render();
renderTransform();
