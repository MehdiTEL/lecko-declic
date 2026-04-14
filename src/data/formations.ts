import type { Formation } from '../types/formation';
import { FORMATIONS_PART1 } from './formations-part1';
import { FORMATIONS_PART2 } from './formations-part2';

export const FORMATIONS: Formation[] = [...FORMATIONS_PART1, ...FORMATIONS_PART2];
