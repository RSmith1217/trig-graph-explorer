const circleCanvas = document.querySelector("#circleCanvas");
const graphCanvas = document.querySelector("#graphCanvas");
const circleCtx = circleCanvas.getContext("2d");
const graphCtx = graphCanvas.getContext("2d");

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
};

const colors = {
  ink: "#18342e",
  inkSoft: "#71847e",
  paper: "#fffdf8",
  grid: "#e8e2d7",
  sine: "#ee6b4d",
  cosine: "#277a70",
  tangent: "#8b65a6",
  gold: "#e3ad3e",
};

let angle = Math.PI / 4;
let unitMode = "degrees";
let playing = false;
let dragging = false;
let lastFrame = 0;

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

function render() {
  drawCircle();
  drawGraph();
  updateReadout();
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

window.addEventListener("resize", render);
renderStaticMath();
render();
