import React from 'react';
import { 
  FilePlus, 
  Clock, 
  UserCheck, 
  PlayCircle, 
  CheckCircle2, 
  Archive 
} from 'lucide-react';

const STATUS_CONFIG = {
  'Créée': {
    className: 'badge-creee',
    icon: FilePlus,
    label: 'Créée'
  },
  'En attente': {
    className: 'badge-en-attente',
    icon: Clock,
    label: 'En attente'
  },
  'Assignée': {
    className: 'badge-assignee',
    icon: UserCheck,
    label: 'Assignée'
  },
  'En cours': {
    className: 'badge-en-cours',
    icon: PlayCircle,
    label: 'En cours'
  },
  'Terminée': {
    className: 'badge-terminee',
    icon: CheckCircle2,
    label: 'Terminée'
  },
  'Archivée': {
    className: 'badge-archivee',
    icon: Archive,
    label: 'Archivée'
  }
};

export const StatusBadge = ({ status, showIcon = true, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || {
    className: 'badge-creee',
    icon: Clock,
    label: status
  };

  const IconComponent = config.icon;
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span className={`badge ${config.className} ${size === 'sm' ? 'btn-sm' : ''}`}>
      {showIcon && <IconComponent size={iconSize} />}
      <span>{config.label}</span>
    </span>
  );
};
