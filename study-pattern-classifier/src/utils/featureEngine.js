/**
 * Calculate standard deviation of an array
 */
function calculateStd(arr) {
  const n = arr.length;
  if (n === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  return Math.sqrt(variance);
}

/**
 * Calculate linear trend (slope) using least squares
 */
function calculateTrend(arr) {
  const n = arr.length;
  const xMean = (n - 1) / 2;
  const yMean = arr.reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (arr[i] - yMean);
    denominator += (i - xMean) * (i - xMean);
  }
  
  return denominator !== 0 ? numerator / denominator : 0;
}

/**
 * Extract features from a student's study pattern
 * Features are designed to capture TEMPORAL DISTRIBUTION, not just totals
 * @param {Array} days - Array of 5 study minutes values
 * @returns {Object} Features: PI, std, cv, trend, ei
 */
export function extractFeatures(days) {
  const total = days.reduce((a, b) => a + b, 0);
  const mean = total / days.length;
  
  // Procrastination Index: proportion of study in last 2 days
  const PI = total > 0 ? (days[3] + days[4]) / total : 0;
  
  // Early Index: proportion of study in first 2 days
  const EI = total > 0 ? (days[0] + days[1]) / total : 0;
  
  // Standard deviation: measures consistency
  const std = calculateStd(days);
  
  // Coefficient of Variation: normalized variability (std/mean)
  const cv = mean > 0 ? std / mean : 0;
  
  // Slope: simple difference between last and first day
  const slope = days[4] - days[0];
  
  // Trend: linear regression slope (more robust than simple difference)
  const trend = calculateTrend(days);
  
  return {
    PI: Math.round(PI * 1000) / 1000,
    EI: Math.round(EI * 1000) / 1000,
    std: Math.round(std * 100) / 100,
    cv: Math.round(cv * 1000) / 1000,
    slope: Math.round(slope * 100) / 100,
    trend: Math.round(trend * 100) / 100,
    total: Math.round(total)
  };
}
