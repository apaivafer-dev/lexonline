import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

const SOCIAL_ICONS = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin, twitter: Twitter, youtube: Youtube };

interface SocialIconsElementProps {
  networks?: Array<{ platform: keyof typeof SOCIAL_ICONS; url: string; }>;
  size?: number;
  color?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function SocialIconsElement({ networks = [{ platform: 'facebook', url: '#' }, { platform: 'instagram', url: '#' }, { platform: 'linkedin', url: '#' }], size = 24, color = '#2563eb', styles, onSelect }: SocialIconsElementProps) {
  return (
    <div style={{ display: 'flex', gap: 12, ...styles }} onClick={onSelect}>
      {networks.map(({ platform }) => {
        const Icon = SOCIAL_ICONS[platform];
        return (
          <a key={platform} href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition" style={{ backgroundColor: `${color}15`, color }}>
            <Icon size={size - 4} />
          </a>
        );
      })}
    </div>
  );
}
