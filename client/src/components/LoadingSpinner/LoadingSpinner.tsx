import React from 'react';
import './loading-spinner.css'; 

interface LoadingSpinnerProps {
  animating: boolean; 
  size?: number; 
  color?: string; 
}

export const LoadingSpinner = ({ animating, size = 30, color = '#7983ff' }: LoadingSpinnerProps) => {
  if (!animating) {
    return null;
  }

  const style = {
    '--spinner-size': `${size}px`,
    '--spinner-color': color,
  } as React.CSSProperties; 

  return (
    <div className="spinner" style={style}></div>
  );
};