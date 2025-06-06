import React from 'react';
import { Box, Typography, LinearProgress, useTheme } from '@mui/material';

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  height?: number;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = true,
  height = 10,
  color = 'primary'
}) => {
  const theme = useTheme();
  
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {showPercentage && (
            <Typography variant="body2" color="text.secondary">
              {normalizedValue.toFixed(0)}%
            </Typography>
          )}
        </Box>
      )}
      
      <LinearProgress
        variant="determinate"
        value={normalizedValue}
        sx={{
          height,
          borderRadius: height / 2,
          backgroundColor: theme.palette.grey[200],
          '& .MuiLinearProgress-bar': {
            borderRadius: height / 2,
          }
        }}
        color={color}
      />
    </Box>
  );
};

export default ProgressBar;

