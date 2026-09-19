import React, { useState } from 'react';
import {
  IconDeviceDesktop,
  IconLayoutGrid,
  IconPalette,
  IconBrush,
  IconComponents,
  IconCircleCheckFilled,
  IconPresentation,
  IconBriefcase,
  IconUsersGroup,
  IconCopy,
  IconCheck,
  IconSun,
  IconMoon,
  IconSparkles,
  IconInfoCircle,
} from '@tabler/icons-react';
import { Tooltip, Badge } from '@mantine/core';
import { toast } from '../../context/ToastContext';

// The 9 core competencies from the reference infographic
export const UI_UX_COMPETENCIES = [
  {
    id: 1,
    title: 'Focus on Interface & Experience',
    shortDesc: 'Crafting responsive layouts, intuitive visual hierarchies, and frictionless navigation paths.',
    category: 'Core Focus',
    iconType: 'desktop',
    accentColor: '#3B82F6',
  },
  {
    id: 2,
    title: 'Wireframes & Prototypes',
    shortDesc: 'Translating concepts into low-to-high fidelity interactive prototypes to validate workflows.',
    category: 'Deliverables',
    iconType: 'wireframe',
    accentColor: '#F59E0B',
  },
  {
    id: 3,
    title: 'User Flow & Interaction Design',
    shortDesc: 'Mapping journeys, micro-interactions, responsive states, and delightful motion feedback.',
    category: 'Architecture',
    iconType: 'palette',
    accentColor: '#EC4899',
  },
  {
    id: 4,
    title: 'Visual Design & Aesthetics',
    shortDesc: 'Mastering color theory, typography, spacing rhythm, iconography, and brand coherence.',
    category: 'Visuals',
    iconType: 'brush',
    accentColor: '#8B5CF6',
  },
  {
    id: 5,
    title: 'UI Component Creation',
    shortDesc: 'Architecting reusable component tokens, variants, atomic patterns, and design system kits.',
    category: 'Design Systems',
    iconType: 'components',
    accentColor: '#10B981',
  },
  {
    id: 6,
    title: 'Focus on End-User',
    shortDesc: 'Advocating for user empathy, universal accessibility (WCAG), and usability best practices.',
    category: 'Empathy',
    iconType: 'check',
    accentColor: '#2563EB',
  },
  {
    id: 7,
    title: 'Tool-Oriented',
    shortDesc: 'Power-user proficiency in industry tools: Figma, FigJam, Sketch, Framer, and Adobe XD.',
    category: 'Tooling',
    iconType: 'presentation',
    accentColor: '#0EA5E9',
  },
  {
    id: 8,
    title: 'Less Involved in Business Strategy',
    shortDesc: 'Dedicated craft execution on UI/UX assets rather than quarterly enterprise P&L roadmaps.',
    category: 'Scope',
    iconType: 'briefcase',
    accentColor: '#6366F1',
  },
  {
    id: 9,
    title: 'Collaboration with Developers & UX Researchers',
    shortDesc: 'Seamless design-to-code handoffs, design QA, token alignment, and usability testing reviews.',
    category: 'Collaboration',
    iconType: 'collaboration',
    accentColor: '#F97316',
  },
];

// Custom 3D styled icon renderer for high fidelity
function CompetencyIcon({ type }) {
  switch (type) {
    case 'desktop':
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 shadow-md shadow-blue-900/40 flex items-center justify-center text-white border border-sky-300/30">
          <IconDeviceDesktop size={22} stroke={2.2} />
        </div>
      );
    case 'wireframe':
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 shadow-md shadow-orange-950/20 flex items-center justify-center text-amber-900 border border-amber-300/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-red-500/80"></div>
          <IconLayoutGrid size={20} stroke={2.2} className="text-amber-800 mt-1" />
        </div>
      );
    case 'palette':
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 shadow-md shadow-stone-900/20 flex items-center justify-center text-rose-500 border border-amber-200/60 relative">
          <IconPalette size={22} stroke={2.2} className="text-amber-700" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span className="absolute bottom-2.5 right-3 w-1.5 h-1.5 rounded-full bg-red-500"></span>
          <span className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>
      );
    case 'brush':
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-rose-500 shadow-md shadow-indigo-950/30 flex items-center justify-center text-white border border-indigo-300/30">
          <IconBrush size={21} stroke={2.2} />
        </div>
      );
    case 'components':
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-slate-900 shadow-md shadow-blue-950/40 flex items-center justify-center text-amber-300 border border-blue-400/40 relative">
          <IconComponents size={21} stroke={2.2} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white"></span>
        </div>
      );
    case 'check':
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-950/40 flex items-center justify-center text-white border border-blue-300/40">
          <IconCircleCheckFilled size={23} className="text-white drop-shadow-xs" />
        </div>
      );
    case 'presentation':
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-800 shadow-md shadow-cyan-950/30 flex items-center justify-center text-white border border-cyan-300/30">
          <IconPresentation size={21} stroke={2.2} />
        </div>
      );
    case 'briefcase':
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-md shadow-slate-950/40 flex items-center justify-center text-amber-300 border border-slate-600/50">
          <IconBriefcase size={21} stroke={2.2} />
        </div>
      );
    case 'collaboration':
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-600 shadow-md shadow-indigo-950/40 flex items-center justify-center text-white border border-blue-300/30">
          <IconUsersGroup size={22} stroke={2.2} />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white">
          <IconSparkles size={20} />
        </div>
      );
  }
}

// Vector illustration of the bearded designer in burgundy blazer (matching reference image)
function DesignerAvatarIllustration({ className = 'w-28 h-28' }) {
  return (
    <div className={`relative ${className} mx-auto flex items-center justify-center select-none`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl overflow-visible"
      >
        {/* Soft Background Aura */}
        <circle cx="100" cy="100" r="90" fill="url(#avatarGlow)" opacity="0.4" />

        <defs>
          <radialGradient id="avatarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="suitGrad" x1="50" y1="120" x2="150" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8E2B3D" />
            <stop offset="100%" stopColor="#5E1B27" />
          </linearGradient>
          <linearGradient id="lapelGrad" x1="70" y1="120" x2="130" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6E1E2C" />
            <stop offset="100%" stopColor="#4A131E" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="100" y1="40" x2="100" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBD7B5" />
            <stop offset="100%" stopColor="#E9B990" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="100" y1="15" x2="100" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A1B18" />
            <stop offset="100%" stopColor="#140C0A" />
          </linearGradient>
        </defs>

        {/* Shoulders & Burgundy Suit Jacket */}
        <path
          d="M32 195 C35 150 60 135 75 130 L100 155 L125 130 C140 135 165 150 168 195 Z"
          fill="url(#suitGrad)"
        />

        {/* Crisp White Shirt Collar */}
        <path d="M82 125 L100 162 L118 125 L108 118 L92 118 Z" fill="#FFFFFF" />
        <path d="M96 135 L100 160 L104 135 Z" fill="#F0EDE8" />

        {/* Suit Lapels */}
        <path d="M72 130 L94 165 L84 168 L60 148 Z" fill="url(#lapelGrad)" />
        <path d="M128 130 L106 165 L116 168 L140 148 Z" fill="url(#lapelGrad)" />

        {/* Neck */}
        <path d="M85 105 H115 V130 C115 138 108 144 100 144 C92 144 85 138 85 130 Z" fill="#E4AE84" />

        {/* Face */}
        <path
          d="M68 75 C68 45 78 40 100 40 C122 40 132 45 132 75 C132 108 120 128 100 128 C80 128 68 108 68 75 Z"
          fill="url(#skinGrad)"
        />

        {/* Ears */}
        <circle cx="68" cy="82" r="9" fill="#E9B990" />
        <circle cx="132" cy="82" r="9" fill="#E9B990" />

        {/* Styled Black Hair with Pompadour Volume */}
        <path
          d="M64 68 C62 48 70 24 100 20 C130 20 138 48 136 68 C132 50 120 42 100 42 C80 42 68 50 64 68 Z"
          fill="url(#hairGrad)"
        />
        <path
          d="M74 38 C82 22 105 18 126 24 C134 26 122 20 104 20 C84 20 74 30 74 38 Z"
          fill="#3D2925"
        />

        {/* Expressive Eyebrows */}
        <path
          d="M78 64 C83 60 91 60 94 63"
          stroke="#1F1614"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M122 64 C117 60 109 60 106 63"
          stroke="#1F1614"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Happy Expressive Eyes */}
        <circle cx="86" cy="74" r="5" fill="#1A120E" />
        <circle cx="87.5" cy="72.5" r="1.8" fill="#FFFFFF" />

        <circle cx="114" cy="74" r="5" fill="#1A120E" />
        <circle cx="115.5" cy="72.5" r="1.8" fill="#FFFFFF" />

        {/* Cute Nose */}
        <path
          d="M97 78 C98 83 102 83 103 78"
          stroke="#C88E65"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Neatly Groomed Beard & Mustache */}
        <path
          d="M74 86 C74 116 82 128 100 128 C118 128 126 116 126 86 C124 95 116 100 100 100 C84 100 76 95 74 86 Z"
          fill="url(#hairGrad)"
        />

        {/* Friendly Open Smile with Teeth */}
        <path
          d="M87 91 C87 91 93 99 100 99 C107 99 113 91 113 91 Z"
          fill="#52141F"
        />
        <path
          d="M89 91 C92 94 100 95 108 94 C111 94 111 91 111 91 H89 Z"
          fill="#FFFFFF"
        />

        {/* Mustache Arch */}
        <path
          d="M86 89 C91 87 98 89 100 91 C102 89 109 87 114 89 C108 94 92 94 86 89 Z"
          fill="#1C1310"
        />
      </svg>
    </div>
  );
}

export default function UiUxDesignerCard({
  variant = 'terracotta', // 'terracotta' (reference photo) | 'adaptive' (respects light/dark mode)
  showActions = true,
  interactive = true,
  className = '',
}) {
  const [themeMode, setThemeMode] = useState(variant);
  const [activeItem, setActiveItem] = useState(null);
  const [copied, setCopied] = useState(false);
  const [usePhotoAvatar, setUsePhotoAvatar] = useState(false);

  const isTerracotta = themeMode === 'terracotta';

  const handleCopyText = (e) => {
    e?.stopPropagation();
    const textToCopy = `🎨 UI/UX DESIGNER - CORE COMPETENCIES:\n\n` +
      UI_UX_COMPETENCIES.map((item) => `${item.id}. ${item.title}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('UI/UX Designer competencies copied to clipboard!');
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      className={`relative max-w-sm sm:max-w-md mx-auto rounded-3xl sm:rounded-[36px] overflow-hidden transition-all duration-300 shadow-2xl ${
        isTerracotta
          ? 'bg-gradient-to-b from-[#DE6437] via-[#D15B32] to-[#B84E29] text-[#FFF7F2] ring-1 ring-orange-400/40 shadow-orange-950/40'
          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 shadow-xl'
      } ${className}`}
    >
      {/* Top Background Subtle Lighting Effect */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

      {/* Floating Action Controls */}
      {showActions && (
        <div className="relative z-20 px-5 pt-4 flex items-center justify-between">
          <Badge
            size="sm"
            variant="light"
            className={`font-black uppercase tracking-wider text-[10px] ${
              isTerracotta
                ? 'bg-black/20 text-white/90 border border-white/20'
                : 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
            }`}
          >
            Role Infographic
          </Badge>

          <div className="flex items-center gap-1.5">
            {/* Toggle Theme: Terracotta vs Adaptive */}
            <Tooltip label={isTerracotta ? 'Switch to Dark/Light Mode' : 'Switch to Terracotta Studio'} withArrow>
              <button
                type="button"
                onClick={() => setThemeMode(isTerracotta ? 'adaptive' : 'terracotta')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  isTerracotta
                    ? 'bg-black/25 hover:bg-black/40 text-white/90'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
                title="Toggle Theme"
              >
                {isTerracotta ? <IconMoon size={15} /> : <IconSun size={15} />}
              </button>
            </Tooltip>

            {/* Switch Avatar Style */}
            <Tooltip label={usePhotoAvatar ? 'Use Vector Avatar' : 'Use Reference Photo'} withArrow>
              <button
                type="button"
                onClick={() => setUsePhotoAvatar(!usePhotoAvatar)}
                className={`p-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isTerracotta
                    ? 'bg-black/25 hover:bg-black/40 text-white/90'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
                title="Toggle Avatar Source"
              >
                <IconSparkles size={15} />
              </button>
            </Tooltip>

            {/* Copy Action */}
            <Tooltip label={copied ? 'Copied!' : 'Copy Summary'} withArrow>
              <button
                type="button"
                onClick={handleCopyText}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : isTerracotta
                    ? 'bg-black/25 hover:bg-black/40 text-white/90'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
                title="Copy list"
              >
                {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
              </button>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Header Section: Avatar + Bold Typography */}
      <div className="relative z-10 pt-2 pb-5 px-6 text-center">
        {/* Designer Character Avatar */}
        <div className="mb-2">
          {usePhotoAvatar ? (
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-white/30 shadow-xl bg-orange-900/40">
              <img
                src="/images/ui-ux-designer-ref.png"
                alt="UI/UX Designer Avatar"
                className="w-full h-full object-cover object-top scale-125 translate-y-1"
              />
            </div>
          ) : (
            <DesignerAvatarIllustration className="w-28 h-28" />
          )}
        </div>

        {/* Card Title (UI/UX DESIGNER) */}
        <h1
          className={`font-black tracking-tight leading-none uppercase select-none ${
            isTerracotta
              ? 'text-[#FFF8F0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          <span className="block text-3xl sm:text-4xl tracking-tight">UI/UX</span>
          <span className="block text-2xl sm:text-3xl tracking-wide mt-0.5">DESIGNER</span>
        </h1>

        <p
          className={`mt-2 text-xs font-semibold max-w-[260px] mx-auto tracking-wide ${
            isTerracotta ? 'text-orange-100/80' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Core Competencies & Responsibilities
        </p>
      </div>

      {/* 9 Core Competency Breakdown List */}
      <div className="relative z-10 px-5 pb-7 space-y-2.5">
        {UI_UX_COMPETENCIES.map((comp) => {
          const isSelected = activeItem === comp.id;

          return (
            <div
              key={comp.id}
              onClick={() => interactive && setActiveItem(isSelected ? null : comp.id)}
              className={`group flex items-center gap-3.5 p-2 sm:p-2.5 rounded-2xl transition-all duration-200 select-none ${
                interactive ? 'cursor-pointer hover:scale-[1.015]' : ''
              } ${
                isTerracotta
                  ? isSelected
                    ? 'bg-black/30 ring-1 ring-white/30 backdrop-blur-xs'
                    : 'hover:bg-black/15 active:bg-black/25'
                  : isSelected
                  ? 'bg-brand-50/80 dark:bg-slate-800/90 ring-1 ring-brand-300 dark:ring-slate-700'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {/* Left 3D Styled Icon Tile */}
              <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
                <CompetencyIcon type={comp.iconType} />
              </div>

              {/* Text & Short Description */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1.5">
                  <h3
                    className={`text-sm sm:text-[15px] font-bold tracking-tight leading-snug truncate ${
                      isTerracotta
                        ? 'text-[#FFF8F2] group-hover:text-white'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {comp.title}
                  </h3>

                  {interactive && (
                    <span
                      className={`text-[10px] opacity-0 group-hover:opacity-60 transition-opacity ${
                        isTerracotta ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      <IconInfoCircle size={14} />
                    </span>
                  )}
                </div>

                {/* Subtitle / Expansion Info */}
                {isSelected ? (
                  <p
                    className={`text-xs mt-1 leading-relaxed animate-fadeIn ${
                      isTerracotta ? 'text-orange-100/95 font-medium' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {comp.shortDesc}
                  </p>
                ) : (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[11px] font-medium tracking-wide ${
                        isTerracotta ? 'text-orange-200/70' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {comp.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Footer */}
      <div
        className={`px-6 py-3 text-center border-t text-[11px] font-semibold flex items-center justify-between ${
          isTerracotta
            ? 'border-white/15 bg-black/15 text-orange-200/80'
            : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400'
        }`}
      >
        <span>Pinboard Design Guide</span>
        <span>9 Key Skills</span>
      </div>
    </div>
  );
}
