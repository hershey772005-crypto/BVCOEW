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
 * Works with any number of days (dynamic)
 * @param {Array} days - Array of study minutes values (any length)
 * @returns {Object} Features: PI, std, cv, trend, ei
 */
export function extractFeatures(days) {
  const n = days.length;
  if (n === 0) return { PI: 0, EI: 0, std: 0, cv: 0, slope: 0, trend: 0, total: 0 };
  
  const total = days.reduce((a, b) => a + b, 0);
  const mean = total / n;
  
  // Calculate how many days to use for "last" and "first" portions
  // Use ~40% of days for each end (min 1 day)
  const endDays = Math.max(1, Math.floor(n * 0.4));
  
  // Procrastination Index: proportion of study in last portion of days
  const lastPortion = days.slice(-endDays).reduce((a, b) => a + b, 0);
  const PI = total > 0 ? lastPortion / total : 0;
  
  // Early Index: proportion of study in first portion of days
  const firstPortion = days.slice(0, endDays).reduce((a, b) => a + b, 0);
  const EI = total > 0 ? firstPortion / total : 0;
  
  // Standard deviation: measures consistency
  const std = calculateStd(days);
  
  // Coefficient of Variation: normalized variability (std/mean)
  const cv = mean > 0 ? std / mean : 0;
  
  // Slope: simple difference between last and first day
  const slope = days[n - 1] - days[0];
  
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
