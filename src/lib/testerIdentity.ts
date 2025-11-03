/**
 * Anonymous Tester Identity Management
 * 
 * Generates and persists a unique tester ID for multi-day testing sessions.
 * No personal data collected - purely for session continuity.
 */

const TESTER_ID_KEY = 'tester-id';
const TESTER_METADATA_KEY = 'tester-metadata';

export interface TesterMetadata {
  id: string;
  firstVisit: string; // ISO timestamp
  lastVisit: string; // ISO timestamp
  sessionCount: number;
  version: string; // App version at first visit
}

/**
 * Generate a unique anonymous tester ID
 */
function generateTesterId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `tester-${timestamp}-${random}`;
}

/**
 * Get or create tester identity
 */
export function getTesterIdentity(): TesterMetadata {
  try {
    // Check if tester already exists
    const existingId = localStorage.getItem(TESTER_ID_KEY);
    const existingMetadata = localStorage.getItem(TESTER_METADATA_KEY);
    
    const now = new Date().toISOString();
    const currentVersion = '1.4.0'; // Updated from package.json
    
    if (existingId && existingMetadata) {
      // Existing tester - update last visit and session count
      const metadata: TesterMetadata = JSON.parse(existingMetadata);
      metadata.lastVisit = now;
      metadata.sessionCount += 1;
      
      localStorage.setItem(TESTER_METADATA_KEY, JSON.stringify(metadata));
      
      return metadata;
    } else {
      // New tester - create identity
      const newId = generateTesterId();
      const metadata: TesterMetadata = {
        id: newId,
        firstVisit: now,
        lastVisit: now,
        sessionCount: 1,
        version: currentVersion,
      };
      
      localStorage.setItem(TESTER_ID_KEY, newId);
      localStorage.setItem(TESTER_METADATA_KEY, JSON.stringify(metadata));
      
      return metadata;
    }
  } catch (error) {
    console.error('Failed to manage tester identity:', error);
    // Fallback to in-memory ID
    return {
      id: generateTesterId(),
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      sessionCount: 1,
      version: '1.4.0',
    };
  }
}

/**
 * Check if this is a first-time visitor
 */
export function isFirstTimeVisitor(): boolean {
  try {
    return !localStorage.getItem(TESTER_ID_KEY);
  } catch {
    return true;
  }
}

/**
 * Get days since first visit
 */
export function getDaysSinceFirstVisit(): number {
  try {
    const metadata = localStorage.getItem(TESTER_METADATA_KEY);
    if (!metadata) return 0;
    
    const { firstVisit } = JSON.parse(metadata) as TesterMetadata;
    const first = new Date(firstVisit);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - first.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch {
    return 0;
  }
}

/**
 * Clear tester identity (for testing/debugging)
 */
export function clearTesterIdentity(): void {
  try {
    localStorage.removeItem(TESTER_ID_KEY);
    localStorage.removeItem(TESTER_METADATA_KEY);
  } catch (error) {
    console.error('Failed to clear tester identity:', error);
  }
}

/**
 * Export tester metadata for analytics (no personal data)
 */
export function getTesterAnalytics() {
  const metadata = getTesterIdentity();
  const daysSinceFirst = getDaysSinceFirstVisit();
  
  return {
    testerId: metadata.id,
    firstVisit: metadata.firstVisit,
    lastVisit: metadata.lastVisit,
    sessionCount: metadata.sessionCount,
    appVersion: metadata.version,
    daysSinceFirstVisit: daysSinceFirst,
    isReturningUser: metadata.sessionCount > 1,
  };
}
