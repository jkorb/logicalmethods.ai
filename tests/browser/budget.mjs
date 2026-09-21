/* How much slower is this machine than the one the tests were written on?

   Machine speed is not under test. A check that passes on a developer laptop
   and fails on a shared GitHub runner has reported on the runner, not on the
   site. Every budget that exists only to stop a hang from running forever is
   therefore written as `budget(ms)` at laptop speed and scaled here, in one
   place, rather than guessed per test.

   A budget is a ceiling, not a delay: raising it costs nothing on a run that
   passes. Waiting for a *condition* rather than a fixed sleep is what actually
   makes a test speed-independent — see docs/testing/ci-parity.md. */

export const ci = !!process.env.CI;

// A shared GitHub runner measured roughly three times slower than the laptop
// this suite was written on, under two workers and a cold page cache.
export const SLOW = ci ? 3 : 1;

export const budget = ms => ms * SLOW;
