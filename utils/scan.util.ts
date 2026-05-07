import { Landmark } from 'react-native-mediapipe';

function clamp(x: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, x));
}

function dist(a: Landmark, b: Landmark) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function score(dev: number, tol: number) {
  return clamp(100 * Math.exp(-dev / tol));
}

// ---------- NORMALIZATION ----------
function normalizeLandmarks(l: Landmark[]): Landmark[] {
  const leftEye = l[33];
  const rightEye = l[263];

  const dx = rightEye.x - leftEye.x;
  const dy = rightEye.y - leftEye.y;

  const angle = Math.atan2(dy, dx);

  const cos = Math.cos(-angle);
  const sin = Math.sin(-angle);

  return l.map((p) => ({
    x: p.x * cos - p.y * sin,
    y: p.x * sin + p.y * cos,
    z: p.z,
  }));
}

// ---------- BASE ----------
function getMidlineX(l: Landmark[]) {
  return (l[6].x + l[168].x + l[1].x) / 3;
}

function getFaceWidth(l: Landmark[]) {
  return dist(l[234], l[454]);
}

function getFaceHeight(l: Landmark[]) {
  const forehead = l[10];
  const chin = l[152];
  const hairline = forehead.y - (chin.y - forehead.y) * 0.15;
  return Math.abs(chin.y - hairline);
}

function normalizeFeature(x: number, max = 85) {
  return Math.min(x, max);
}

// ---------- FEATURES ----------

// Symmetry
export function calculateOverallSymmetry(l: Landmark[]) {
  const mid = getMidlineX(l);
  const w = getFaceWidth(l);
  const h = getFaceHeight(l);

  const pairs = [
    [33, 263],
    [133, 362],
    [61, 291],
    [234, 454],
  ];

  let d = 0;

  for (const [r, left] of pairs) {
    const rd = Math.abs(l[r].x - mid);
    const ld = Math.abs(l[left].x - mid);

    d += Math.abs(rd - ld) / w;
    d += Math.abs(l[r].y - l[left].y) / h;
  }

  return score(d / pairs.length, 0.05);
}

// Eyes (slightly stricter)
export function calculateEyeAlignment(l: Landmark[]) {
  const mid = getMidlineX(l);
  const w = getFaceWidth(l);
  const h = getFaceHeight(l);

  const r = {
    x: (l[33].x + l[133].x) / 2,
    y: (l[33].y + l[133].y) / 2,
  };

  const left = {
    x: (l[263].x + l[362].x) / 2,
    y: (l[263].y + l[362].y) / 2,
  };

  const vertical = Math.abs(r.y - left.y) / h;
  const horizontal = Math.abs(Math.abs(r.x - mid) - Math.abs(left.x - mid)) / w;

  return score(vertical * 0.6 + horizontal * 0.4, 0.026);
}

// Nose (strict)
export function calculateNoseCentering(l: Landmark[]) {
  const mid = getMidlineX(l);
  const w = getFaceWidth(l);

  const tip = Math.abs(l[1].x - mid) / w;
  const bridge = Math.abs(l[168].x - mid) / w;

  return score(tip * 0.75 + bridge * 0.25, 0.013);
}

// Jaw
export function calculateJawlineSymmetry(l: Landmark[]) {
  const mid = getMidlineX(l);
  const w = getFaceWidth(l);
  const h = getFaceHeight(l);

  const r = l[234];
  const left = l[454];

  const hDiff = Math.abs(Math.abs(r.x - mid) - Math.abs(left.x - mid)) / w;

  const vDiff = Math.abs(r.y - left.y) / h;

  return score(hDiff * 0.7 + vDiff * 0.3, 0.035);
}

// Chin (boosted)
export function calculateChinAlignment(l: Landmark[]) {
  const mid = getMidlineX(l);
  const w = getFaceWidth(l);

  const chin = l[152].x;
  const nose = l[1].x;

  return score((Math.abs(chin - mid) + Math.abs(chin - nose)) / w, 0.035);
}

// Lower face (fixed inflation)
export function calculateLowerFaceProportion(l: Landmark[]) {
  const chin = l[152].y;
  const nose = l[2].y;
  const brow = (l[107].y + l[336].y) / 2;

  const ratio = (nose - brow) / (chin - nose);

  return score(Math.abs(ratio - 1), 0.18);
}

// Eye spacing (stable)
export function calculateEyeSpacingRatio(l: Landmark[]) {
  const w = getFaceWidth(l);
  const spacing = dist(l[133], l[362]) / w;

  const raw = 100 * Math.exp(-Math.abs(spacing - 0.25) / 0.06);

  return clamp(raw * 0.85);
}

// Thirds (stronger impact)
export function calculateFacialThirds(l: Landmark[]) {
  const forehead = l[10];
  const chin = l[152];
  const nose = l[2];

  const hairline = forehead.y - (chin.y - forehead.y) * 0.15;
  const brow = (l[107].y + l[336].y) / 2;

  const t1 = brow - hairline;
  const t2 = nose.y - brow;
  const t3 = chin.y - nose.y;

  const total = t1 + t2 + t3;

  const dev =
    Math.abs(t1 / total - 1 / 3) +
    Math.abs(t2 / total - 1 / 3) +
    Math.abs(t3 / total - 1 / 3);

  return score(dev, 0.09);
}

// ---------- FINAL ----------
export function calculateFinalScore(landmarks: Landmark[]) {
  let l = normalizeLandmarks(landmarks);

  const symmetry = normalizeFeature(calculateOverallSymmetry(l));
  const eyes = normalizeFeature(calculateEyeAlignment(l), 85);
  const nose = normalizeFeature(calculateNoseCentering(l), 85);
  const jaw = normalizeFeature(calculateJawlineSymmetry(l), 85);
  const chin = normalizeFeature(calculateChinAlignment(l), 80);
  const lower = normalizeFeature(calculateLowerFaceProportion(l), 85);
  const spacing = normalizeFeature(calculateEyeSpacingRatio(l), 80);
  const thirds = normalizeFeature(calculateFacialThirds(l), 80);

  const raw =
    symmetry * 0.25 +
    jaw * 0.25 +
    eyes * 0.14 +
    nose * 0.14 +
    chin * 0.15 +
    lower * 0.03 +
    spacing * 0.03 +
    thirds * 0.04;

  //  FINAL STRICT CURVE (CRITICAL)
  const strict = Math.pow(raw / 100, 1.25) * 100;

  return clamp(Math.round(strict));
}
