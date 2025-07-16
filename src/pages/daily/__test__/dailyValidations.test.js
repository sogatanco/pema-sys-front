// taskValidations.test.js
import { validateNoFullProgress, validateAllFullProgress } from '../validations/dailyValidations';

describe('validateNoFullProgress', () => {
  it('should return true if all tasks have progress < 100', () => {
    const tasks = [{ progress: 50 }, { progress: 80 }];
    expect(validateNoFullProgress(tasks)).toBe(true);
  });

  it('should return false if any task has progress >= 100', () => {
    const tasks = [{ progress: 50 }, { progress: 100 }];
    expect(validateNoFullProgress(tasks)).toBe(false);
  });
});

describe('validateAllFullProgress', () => {
  it('should return true if all tasks have progress >= 100', () => {
    const tasks = [{ progress: 100 }, { progress: 100 }];
    expect(validateAllFullProgress(tasks)).toBe(true);
  });

  it('should return false if any task has progress < 100', () => {
    const tasks = [{ progress: 100 }, { progress: 99 }];
    expect(validateAllFullProgress(tasks)).toBe(false);
  });

  it('should return true for empty array (edge case)', () => {
    expect(validateAllFullProgress([])).toBe(true);
  });

  it('should return true for exactly 100% progress', () => {
    expect(validateAllFullProgress([{ progress: 100 }])).toBe(true);
  });
});
