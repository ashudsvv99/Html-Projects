import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  IconButton, 
  Typography, 
  Box,
  useTheme
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface ContentCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  elevation?: number;
  headerColor?: string;
  noPadding?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  children,
  action,
  elevation = 1,
  headerColor,
  noPadding = false
}) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: elevation === 0 
          ? 'none' 
          : `0 ${elevation * 2}px ${elevation * 4}px rgba(0,0,0,0.05)`
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        }
        subheader={subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        action={
          action || (
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          )
        }
        sx={{
          backgroundColor: headerColor || 'transparent',
          color: headerColor ? theme.palette.getContrastText(headerColor) : 'inherit',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, p: noPadding ? 0 : 2 }}>
          {children}
        </CardContent>
      </Box>
    </Card>
  );
};

export default ContentCard;

