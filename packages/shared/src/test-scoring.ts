import assert from 'assert';
import { convertScoreTo100, getScoreCategory, calculateWeightedAverage } from './scoring';

console.log('Running Phase 4 Scoring Engine Unit Tests...');

try {
  // Test 1: Scoring scale 1-5 conversion
  console.log('- Testing scoring scale 1-5 conversion...');
  assert.strictEqual(convertScoreTo100(5, 5), 100);
  assert.strictEqual(convertScoreTo100(3, 5), 50);
  assert.strictEqual(convertScoreTo100(1, 5), 0);
  assert.strictEqual(convertScoreTo100(4, 5), 75);
  // Clamping check
  assert.strictEqual(convertScoreTo100(6, 5), 100);
  assert.strictEqual(convertScoreTo100(0, 5), 0);

  // Test 2: Scoring scale 1-4 conversion
  console.log('- Testing scoring scale 1-4 conversion...');
  assert.strictEqual(convertScoreTo100(4, 4), 100);
  // Math.round to handle floats
  assert.strictEqual(Math.round(convertScoreTo100(3, 4) * 100) / 100, 66.67);
  assert.strictEqual(Math.round(convertScoreTo100(2, 4) * 100) / 100, 33.33);
  assert.strictEqual(convertScoreTo100(1, 4), 0);

  // Test 3: Score categories
  console.log('- Testing score categories...');
  assert.strictEqual(getScoreCategory(95), 'Sangat Baik');
  assert.strictEqual(getScoreCategory(80), 'Sangat Baik');
  assert.strictEqual(getScoreCategory(75), 'Baik');
  assert.strictEqual(getScoreCategory(60), 'Baik');
  assert.strictEqual(getScoreCategory(55), 'Cukup');
  assert.strictEqual(getScoreCategory(40), 'Cukup');
  assert.strictEqual(getScoreCategory(35), 'Kurang');
  assert.strictEqual(getScoreCategory(0), 'Kurang');

  // Test 4: Weighted average calculations
  console.log('- Testing weighted average...');
  
  // Test with equal weights
  const answersEqualWeights = [
    { ratingValue: 4, weight: 1.0 },
    { ratingValue: 5, weight: 1.0 },
    { ratingValue: 3, weight: 1.0 }
  ];
  const res1 = calculateWeightedAverage(answersEqualWeights);
  assert.strictEqual(res1.scoreRaw, 4.0);
  assert.strictEqual(res1.count, 3);

  // Test with varying weights
  const answersWeighted = [
    { ratingValue: 4, weight: 2.0 }, // 4 * 2 = 8
    { ratingValue: 5, weight: 1.0 }, // 5 * 1 = 5
    { ratingValue: 2, weight: 1.0 }  // 2 * 1 = 2
  ]; // Total weighted sum = 15, Total weight = 4. Weighted Avg = 15 / 4 = 3.75
  const res2 = calculateWeightedAverage(answersWeighted);
  assert.strictEqual(res2.scoreRaw, 3.75);
  assert.strictEqual(res2.count, 3);

  // Test with empty/null/undefined ratings
  const answersWithNull = [
    { ratingValue: 5, weight: 1.0 },
    { ratingValue: null, weight: 2.0 },
    { ratingValue: undefined, weight: 1.0 },
    { ratingValue: 3, weight: 2.0 }
  ]; // Total weighted sum = 5*1 + 3*2 = 11. Total weight = 1 + 2 = 3. Weighted Avg = 11/3 = 3.666...
  const res3 = calculateWeightedAverage(answersWithNull);
  assert.strictEqual(Math.round(res3.scoreRaw * 100) / 100, 3.67);
  assert.strictEqual(res3.count, 2);

  // Test with no valid ratings
  const answersEmpty = [
    { ratingValue: null },
    { ratingValue: undefined }
  ];
  const resEmpty = calculateWeightedAverage(answersEmpty);
  assert.strictEqual(resEmpty.scoreRaw, 0);
  assert.strictEqual(resEmpty.count, 0);

  console.log('✅ All scoring tests passed successfully!');
} catch (error) {
  console.error('❌ Scoring test failed:', error);
  process.exit(1);
}
