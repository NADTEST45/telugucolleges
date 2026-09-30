/** Cancel pending UI work when a filter is cleared or its page unmounts. */
export function createDebouncer(delayMs: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };
  return {
    cancel,
    schedule(callback: () => void) {
      cancel();
      timer = setTimeout(() => {
        timer = null;
        callback();
      }, delayMs);
    },
  };
}

/** Distinguish our delayed URL acknowledgements from external navigation. */
export function createQueryTracker(initial: string) {
  let current = initial;
  const submitted = new Set<string>();
  return {
    get current() { return current; },
    edit(value: string) { current = value; },
    submit(value: string) { current = value; submitted.add(value); },
    reset() { submitted.clear(); },
    acknowledge(value: string) {
      if (submitted.has(value)) {
        submitted.delete(value);
        return value === current;
      }
      current = value;
      submitted.clear();
      return true;
    },
  };
}
