export function formatPercentage(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function formatRatio(quantity: number, capacity: number, uom?: string) {
  return `${quantity.toLocaleString('en-US')} / ${capacity.toLocaleString('en-US')}${uom ? ` ${uom}` : ''}`;
}

export function formatTimestamp(value?: string) {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  return `${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

export function formatShift(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

