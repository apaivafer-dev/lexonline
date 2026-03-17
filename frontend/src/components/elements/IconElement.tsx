import React from 'react';
import { Star, Shield, Heart, Check, ArrowRight, Phone, Mail, MapPin, Clock, Users, type LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  star: Star, shield: Shield, heart: Heart, check: Check, 'arrow-right': ArrowRight,
  phone: Phone, mail: Mail, 'map-pin': MapPin, clock: Clock, users: Users,
};

interface IconElementProps {
  icon?: string;
  size?: number;
  color?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function IconElement({ icon = 'star', size = 48, color = '#2563eb', styles, onSelect }: IconElementProps) {
  const Icon = ICON_MAP[icon] ?? Star;
  return (
    <div style={{ color, ...styles }} className="inline-flex" onClick={onSelect}>
      <Icon size={size} />
    </div>
  );
}
