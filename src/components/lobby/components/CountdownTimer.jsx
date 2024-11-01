// components/lobby/components/CountdownTimer.jsx
import React from 'react';
import { useInterval } from 'react-use';
import { Clock } from 'lucide-react';

export function CountdownTimer({ 
  interval,
  onTick = () => {},
  className = ''
}) {
  const [timeLeft, setTimeLeft] = React.useState(interval / 1000);

  useInterval(() => {
    if (timeLeft <= 0) {
      setTimeLeft(interval / 1000);
      onTick();
    } else {
      setTimeLeft(t => t - 1);
    }
  }, 1000);

  return (
    <div className={`flex items-center gap-1 text-xs text-green-700 ${className}`}>
      <Clock className="w-3 h-3" />
      <span>Refresh in {timeLeft}s</span>
    </div>
  );
}