import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from 'react-use';

const getRandomTypingSpeed = (minSpeed = 20, maxSpeed = 50) => {
  return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
};

const Cursor = ({ style = 'block', visible = true }) => {
  const [isVisible, setIsVisible] = useState(visible);
  
  useInterval(() => {
    setIsVisible(prev => !prev);
  }, 530);
  
  return (
    <span className="inline-block w-2.5">
      {isVisible && (
        <span className={
          style === 'block' 
            ? "inline-block w-2.5 h-4 bg-green-500 -mb-0.5"
            : "inline-block w-2.5 h-0.5 bg-green-500 -mb-0.5"
        } />
      )}
    </span>
  );
};

const TypingEffect = ({ 
  children, 
  className = '', 
  minSpeed = 20,
  maxSpeed = 50,
  cursorStyle = 'block',
  onComplete,
  playSound = true,
  showCursor = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const text = React.Children.toArray(children).join('');
  
  const typeSound = useCallback(() => {
    if (!playSound) return;
    const audio = new Audio('/api/placeholder/audio');
    audio.volume = 0.1;
    audio.playbackRate = 2;
    audio.play().catch(() => {});
  }, [playSound]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        typeSound();
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, getRandomTypingSpeed(minSpeed, maxSpeed));
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, minSpeed, maxSpeed, onComplete, typeSound]);

  return (
    <div className={`font-mono ${className}`}>
      <span className="whitespace-pre-wrap">{displayText}</span>
      {showCursor && !isComplete && (
        <span className="fixed-width-cursor">
          <Cursor style={cursorStyle} />
        </span>
      )}
    </div>
  );
};

const BootSequence = ({ onComplete, messages = [], minDisplayTime = 800 }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [startTimes, setStartTimes] = useState([Date.now()]);
    const [isComplete, setIsComplete] = useState(false);
    const [progress, setProgress] = useState(0);
  
    useEffect(() => {
      // When all messages are complete, trigger the completion callback
      if (isComplete) {
        setTimeout(() => {
          console.log('Boot sequence complete, triggering callback');
          onComplete?.();
        }, 1000);
      }
    }, [isComplete, onComplete]);
  
    const handleMessageComplete = useCallback(() => {
      const currentTime = Date.now();
      const messageStartTime = startTimes[currentMessageIndex];
      const elapsedTime = currentTime - messageStartTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
  
      setTimeout(() => {
        if (currentMessageIndex < messages.length - 1) {
          setCurrentMessageIndex(prev => prev + 1);
          setStartTimes(prev => [...prev, Date.now()]);
          setProgress(((currentMessageIndex + 2) / messages.length) * 100);
        } else {
          setProgress(100);
          setIsComplete(true);
        }
      }, remainingTime + 200);
    }, [currentMessageIndex, messages.length, minDisplayTime, startTimes]);
  
    return (
      <div className="font-mono space-y-2">
        {messages.slice(0, currentMessageIndex + 1).map((message, index) => (
          <div key={index} className="min-h-[1.5rem]">
            {index === currentMessageIndex && !isComplete ? (
              <TypingEffect 
                minSpeed={message.minSpeed || 20}
                maxSpeed={message.maxSpeed || 40}
                onComplete={handleMessageComplete}
                showCursor={!isComplete}
                playSound={true}
              >
                {message.text}
                {message.append || ''}
              </TypingEffect>
            ) : (
              <span className="whitespace-pre-wrap">
                {message.text}
                {message.append || ''}
              </span>
            )}
          </div>
        ))}
        <div className="mt-4 h-1 bg-green-900">
          <div 
            className="h-full bg-green-500 transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    );
  };

const Scanlines = ({ intensity = 'medium' }) => {
  const intensityMap = {
    light: 'opacity-[0.03]',
    medium: 'opacity-[0.06]',
    heavy: 'opacity-[0.09]'
  };

  return (
    <div className={`pointer-events-none fixed inset-0 z-50 ${intensityMap[intensity]}`}>
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,_rgba(32,_128,_32,_0.2)_50%,_transparent_51%)] bg-[length:100%_4px] animate-scan" />
    </div>
  );
};

const PhosphorGlow = () => (
  <div className="pointer-events-none fixed inset-0 z-40">
    <div className="absolute inset-0 bg-green-500/5 mix-blend-screen animate-subtle-flicker" />
    <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(51,255,51,0.15)]" />
  </div>
);

const CommandInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  onKeyDown,
  prompt = ">", 
  className = '' 
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <span className="text-green-500 min-w-[1ch]">{prompt}</span>
    <div className="flex-1 relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmit) {
            onSubmit(value);
          }
          onKeyDown?.(e);
        }}
        className="w-full bg-transparent border-none outline-none text-green-500 font-mono"
        spellCheck="false"
        autoComplete="off"
        autoCapitalize="off"
      />
      {!value && <Cursor style="underscore" />}
    </div>
  </div>
);

const StatusBar = ({ 
  left, 
  center, 
  right,
  className = '' 
}) => (
  <div className={`h-6 border-t border-green-500 bg-black ${className}`}>
    <div className="flex justify-between items-center px-4 h-full text-sm">
      <div className="w-1/3 text-left truncate">{left}</div>
      <div className="w-1/3 text-center truncate">{center}</div>
      <div className="w-1/3 text-right truncate">{right}</div>
    </div>
  </div>
);

export default {
  Cursor,
  TypingEffect,
  BootSequence,
  Scanlines,
  PhosphorGlow,
  CommandInput,
  StatusBar
};