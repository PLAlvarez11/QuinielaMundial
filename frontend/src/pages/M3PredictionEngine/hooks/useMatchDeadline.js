import { useState, useEffect } from 'react';

const DEADLINE_MINUTES = 15;

function computeState(matchDate) {
  if (!matchDate) return { isClosed: false, minutesLeft: null, kickoff: null };

  const now = new Date();
  const kickoff = new Date(matchDate);
  const deadline = new Date(kickoff.getTime() - DEADLINE_MINUTES * 60 * 1000);
  const msLeft = deadline - now;
  const minutesLeft = Math.ceil(msLeft / 60_000);
  const isClosed = msLeft <= 0;

  return { isClosed, minutesLeft, kickoff, deadline };
}

/**
 * Tracks whether a match has passed its prediction deadline (15 min before kick-off).
 * Updates every 30 seconds so the UI reacts in near real-time.
 *
 * @param {string|null} matchDate - ISO datetime string from the backend
 * @returns {{ isClosed: boolean, minutesLeft: number|null, kickoff: Date|null }}
 */
export const useMatchDeadline = (matchDate) => {
  const [state, setState] = useState(() => computeState(matchDate));

  useEffect(() => {
    if (!matchDate) return;

    // Sync immediately when matchDate changes
    setState(computeState(matchDate));

    const interval = setInterval(() => {
      setState(computeState(matchDate));
    }, 30_000);

    return () => clearInterval(interval);
  }, [matchDate]);

  return state;
};
