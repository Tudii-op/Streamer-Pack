type LogListener = (logs: string[]) => void;

let logs: string[] = [];
let listeners: LogListener[] = [];

export function addLog(msg: string) {
  const timestamp = new Date().toLocaleTimeString();
  logs.push(`[${timestamp}] ${msg}`);
  listeners.forEach((fn) => fn(logs));
}

export function getLogs(): string[] {
  return [...logs];
}

export function clearLogs() {
  logs = [];
  listeners.forEach((fn) => fn(logs));
}

export function subscribeLogs(fn: LogListener) {
  listeners.push(fn);
  fn(logs);
  return () => {
    listeners = listeners.filter((f) => f !== fn);
  };
}