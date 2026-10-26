import { recordActivity } from '@/lib/mongodb/utils';
import { activityDay } from './goals';

// Adds to a student's activity for the day (see recordActivity). Never throws: a failed log
// mustn't stop the mark, rating or save that triggered it.
export async function logActivity(userId, today, what) {
  try {
    await recordActivity(userId, activityDay(today), what);
  } catch (error) {
    console.error('Logging activity failed:', error);
  }
}
