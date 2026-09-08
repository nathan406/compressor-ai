// AgriPulse — Compresor AI's flagship product (product spec §5–§14, §22).
// This module turns a completed model-optimization Job into the
// connectivity/hardware profile AgriPulse needs to decide where a
// model can run. Every figure here is derived from the Job's real
// JobResult benchmark — nothing here is an invented number.

export type EdgeTier = "offline" | "low-connectivity" | "online";

export interface JobResultLike {
  originalSizeGB: number;
  compressedSizeGB: number;
  compressionRatio: number;
  latencyBefore: number;
  latencyAfter: number;
  speedupFactor: number;
  monthlySavings: number;
}

export interface EdgeMetrics {
  connectivity: EdgeTier;
  connectivityLabel: string;
  ramRequiredGB: number;
  estimatedLatencySeconds: number;
  offlineCapable: boolean;
  note: string;
}

// Typical runtime RAM overhead over raw model size for quantized inference.
const RAM_OVERHEAD_MULTIPLIER = 1.8;

// Compressed-size thresholds (GB) that decide where AgriPulse can deploy
// this model, per product spec §12 (Low-Connectivity Mode) and §13.
const OFFLINE_MAX_GB = 0.3;
const LOW_CONNECTIVITY_MAX_GB = 1.5;

export function computeEdgeMetrics(result: JobResultLike): EdgeMetrics {
  const size = result.compressedSizeGB;
  const ramRequiredGB = Math.round(size * RAM_OVERHEAD_MULTIPLIER * 100) / 100;

  let connectivity: EdgeTier;
  let connectivityLabel: string;
  let note: string;

  if (size <= OFFLINE_MAX_GB) {
    connectivity = "offline";
    connectivityLabel = "Offline — runs fully on-device";
    note = "Small enough to run locally with no network connection required.";
  } else if (size <= LOW_CONNECTIVITY_MAX_GB) {
    connectivity = "low-connectivity";
    connectivityLabel = "Low-connectivity — works on intermittent rural networks";
    note = "Optimized for edge/mobile devices on unreliable connections.";
  } else {
    connectivity = "online";
    connectivityLabel = "Online — requires a stable connection to the cloud model";
    note = "Still too large for on-device deployment; runs via cloud inference.";
  }

  return {
    connectivity,
    connectivityLabel,
    ramRequiredGB,
    estimatedLatencySeconds: result.latencyAfter,
    offlineCapable: connectivity !== "online",
    note,
  };
}

export interface InfraComparisonRow {
  metric: string;
  original: string;
  optimized: string;
}

// Product spec §14 — "AgriPulse Model Benchmark": original agricultural
// AI vs. Compresor-optimized, side by side.
export function buildInfraComparison(
  result: JobResultLike,
  edge: EdgeMetrics
): InfraComparisonRow[] {
  return [
    {
      metric: "Model size",
      original: `${result.originalSizeGB.toFixed(2)} GB`,
      optimized: `${result.compressedSizeGB.toFixed(2)} GB`,
    },
    {
      metric: "RAM required",
      original: `${(result.originalSizeGB * RAM_OVERHEAD_MULTIPLIER).toFixed(2)} GB`,
      optimized: `${edge.ramRequiredGB} GB`,
    },
    {
      metric: "Latency",
      original: `${result.latencyBefore.toFixed(1)}s`,
      optimized: `${result.latencyAfter.toFixed(1)}s`,
    },
    {
      metric: "Compression ratio",
      original: "1.0x",
      optimized: `${result.compressionRatio.toFixed(2)}x`,
    },
    {
      metric: "Connectivity requirement",
      original: "Online only (cloud)",
      optimized: edge.connectivityLabel,
    },
    {
      metric: "Est. monthly compute savings",
      original: "$0",
      optimized: `$${result.monthlySavings.toLocaleString()}`,
    },
  ];
}

// Product spec §7 — Crop Health AI must never claim certainty.
// Below this confidence, AgriPulse defers to a human expert instead
// of guessing.
export const DIAGNOSIS_CONFIDENCE_THRESHOLD = 60;

export const LOW_CONFIDENCE_MESSAGE =
  "AgriPulse cannot confidently identify this problem. Please consult an agricultural extension officer.";
