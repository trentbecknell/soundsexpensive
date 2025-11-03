import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getTesterIdentity,
  isFirstTimeVisitor,
  getDaysSinceFirstVisit,
  clearTesterIdentity,
  getTesterAnalytics,
} from './testerIdentity';

describe('Tester Identity Management', () => {
  beforeEach(() => {
    // Clear any existing tester data before each test
    clearTesterIdentity();
  });

  afterEach(() => {
    // Clean up after each test
    clearTesterIdentity();
  });

  it('creates new tester identity for first-time visitor', () => {
    expect(isFirstTimeVisitor()).toBe(true);

    const identity = getTesterIdentity();

    expect(identity.id).toMatch(/^tester-/);
    expect(identity.sessionCount).toBe(1);
    expect(identity.version).toBe('1.4.0');
    expect(identity.firstVisit).toBeDefined();
    expect(identity.lastVisit).toBeDefined();
  });

  it('increments session count for returning visitor', () => {
    // First visit
    const firstIdentity = getTesterIdentity();
    expect(firstIdentity.sessionCount).toBe(1);

    // Second visit (simulated by calling again)
    const secondIdentity = getTesterIdentity();
    expect(secondIdentity.id).toBe(firstIdentity.id);
    expect(secondIdentity.sessionCount).toBe(2);

    // Third visit
    const thirdIdentity = getTesterIdentity();
    expect(thirdIdentity.sessionCount).toBe(3);
  });

  it('persists tester identity across function calls', () => {
    const identity1 = getTesterIdentity();
    const identity2 = getTesterIdentity();

    expect(identity1.id).toBe(identity2.id);
    expect(identity1.firstVisit).toBe(identity2.firstVisit);
  });

  it('correctly identifies first-time vs returning visitor', () => {
    expect(isFirstTimeVisitor()).toBe(true);

    getTesterIdentity();

    expect(isFirstTimeVisitor()).toBe(false);
  });

  it('calculates days since first visit', () => {
    getTesterIdentity();

    const days = getDaysSinceFirstVisit();
    
    // Should be 0 or 1 days for same-day test
    expect(days).toBeGreaterThanOrEqual(0);
    expect(days).toBeLessThanOrEqual(1);
  });

  it('clears tester identity completely', () => {
    getTesterIdentity();
    expect(isFirstTimeVisitor()).toBe(false);

    clearTesterIdentity();
    
    expect(isFirstTimeVisitor()).toBe(true);
  });

  it('provides analytics data', () => {
    getTesterIdentity();
    
    const analytics = getTesterAnalytics();

    expect(analytics.testerId).toMatch(/^tester-/);
    expect(analytics.sessionCount).toBe(2); // getTesterAnalytics calls getTesterIdentity which increments
    expect(analytics.isReturningUser).toBe(true);
    expect(analytics.appVersion).toBe('1.4.0');
    expect(analytics.daysSinceFirstVisit).toBeGreaterThanOrEqual(0);
  });

  it('handles new user analytics correctly', () => {
    const analytics = getTesterAnalytics();

    expect(analytics.sessionCount).toBe(1);
    expect(analytics.isReturningUser).toBe(false);
  });
});
