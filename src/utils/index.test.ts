import { ProblemLevel } from '../interfaces/Problem';
import { getLevelList, range, mapToObject, getHeader } from './index';

describe('getLevelList()', () => {
  test('problem level list should be [0] + [1, 1.5, 2, ..., 6.0]', () => {
    expect(getLevelList()).toEqual([
      0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6,
    ] as ProblemLevel[]);
  });
});

describe('range()', () => {
  test('range 3..7 should be [3,4,5,6,7]', () => {
    expect(range(3, 7)).toEqual([3, 4, 5, 6, 7]);
  });
});

describe('mapToObject()', () => {
  test('map {1=>2,3=>4} should be converted to object {1:2,3:4}', () => {
    const m = new Map<number, number>();
    m.set(1, 2).set(3, 4);
    expect(mapToObject(m)).toEqual({ 1: 2, 3: 4 });
  });
});

describe('getHeader()', () => {
  test('1st header should be A', () => {
    expect(getHeader(0)).toBe('A');
  });
  test('2nd header should be B', () => {
    expect(getHeader(1)).toBe('B');
  });
  test('25th header should be Y', () => {
    expect(getHeader(24)).toBe('Y');
  });
  test('26th header should be Z', () => {
    expect(getHeader(25)).toBe('Z');
  });
  test('27th header should be AA', () => {
    expect(getHeader(26)).toBe('AA');
  });
  test('28th header should be AB', () => {
    expect(getHeader(27)).toBe('AB');
  });
  test('52nd header should be AZ', () => {
    expect(getHeader(51)).toBe('AZ');
  });
  test('53rd header should be BA', () => {
    expect(getHeader(52)).toBe('BA');
  });
});
