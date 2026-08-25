import React from 'react';
import { AlertCircle, Flame, ArrowDown, ArrowUp } from 'lucide-react';

const PRIORITY_CONFIG = {
  'Basse': {
    className: 'priority-basse',
    icon: ArrowDown,
    label: 'Basse'
  },
  'Moyenne': {
    className: 'priority-moyenne',
    icon: AlertCircle,
    label: 'Moyenne'
  },
  'Haute': {
    className: 'priority-haute',
    icon: ArrowUp,
    label: 'Haute'
  },
  'Urgente': {
    className: 'priority-urgente',
    icon: Flame,
    label: 'Urgente'
  }
};

export const PriorityBadge = ({ priority, size = 'md' }) => {
  const config = PRIORITY_CONFIG[priority] || {
    className: 'priority-moyenne',
    icon: AlertCircle,
    label: priority
  };

  const IconComponent = config.icon;
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span className={`badge ${config.className}`}>
      <IconComponent size={iconSize} />
      <span>{config.label}</span>
    </span>
  );
};
