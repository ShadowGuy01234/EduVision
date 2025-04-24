import React, { useEffect, useState } from 'react';

const EngagementChart = ({ data = [] }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for dark mode on component mount and when theme changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    // Initial check
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  // Default data if none provided
  const chartData = data.length > 0 ? data : [
    { time: '10:00', value: 75 },
    { time: '10:15', value: 82 },
    { time: '10:30', value: 68 },
    { time: '10:45', value: 90 },
    { time: '11:00', value: 85 }
  ];
  
  const maxValue = 100; // Maximum possible value
  const chartHeight = 200; // Height in pixels
  const chartWidth = 100; // Width percentage

  // Get value position on y-axis
  const getYPosition = (value) => {
    return chartHeight - (value / maxValue) * chartHeight;
  };
  
  // Get point color based on value
  const getPointColor = (value) => {
    if (value >= 80) return isDarkMode ? '#4ade80' : '#22c55e'; // green
    if (value >= 60) return isDarkMode ? '#facc15' : '#eab308'; // yellow
    return isDarkMode ? '#f87171' : '#ef4444'; // red
  };

  // Create SVG path for the line
  const createLinePath = () => {
    if (chartData.length === 0) return '';
    
    const totalPoints = chartData.length;
    const segmentWidth = chartWidth / (totalPoints - 1);
    
    let path = `M 0,${getYPosition(chartData[0].value)}`;
    
    for (let i = 1; i < totalPoints; i++) {
      path += ` L ${i * segmentWidth},${getYPosition(chartData[i].value)}`;
    }
    
    return path;
  };

  // Get the line color based on the current theme
  const getLineColor = () => {
    return isDarkMode ? "#60a5fa" : "#3b82f6";
  };

  return (
    <div className="w-full h-64">
      <div className="relative h-[200px] mb-4">
        {/* Line graph */}
        <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((tick) => (
            <line 
              key={tick} 
              x1="0" 
              y1={chartHeight - (tick / 100) * chartHeight} 
              x2={chartWidth} 
              y2={chartHeight - (tick / 100) * chartHeight} 
              stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
              strokeWidth="1" 
              strokeDasharray={tick % 50 === 0 ? "none" : "4"} 
            />
          ))}
          
          {/* Line path */}
          <path 
            d={createLinePath()} 
            fill="none" 
            stroke={getLineColor()} 
            strokeWidth="2"
            className="transition-all duration-500"
          />
          
          {/* Data points */}
          {chartData.map((item, index) => {
            const x = index * (chartWidth / (chartData.length - 1));
            const y = getYPosition(item.value);
            return (
              <circle 
                key={index}
                cx={x}
                cy={y}
                r="2.5"
                fill={isDarkMode ? "#1e293b" : "white"}
                stroke={getLineColor()}
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pointer-events-none px-2">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-1 px-1">
        {chartData.map((item, index) => (
          <div key={index} className="text-xs text-gray-500 dark:text-gray-400">
            {item.time}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngagementChart; 