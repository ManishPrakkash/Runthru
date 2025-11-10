import React from 'react';

export const LogoIcon = ({ className }) => (
  <span className={className} style={{ fontWeight: 'bold', fontSize: '1.5em', transform: 'translateY(-10px)', display: 'inline-block' }}>
    ᝰ 
  </span>
);

export const LogoutIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const SyncIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M21 21v-5h-5" />
  </svg>
);

export const ExplainIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
    <line x1="12" y1="5" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="19" />
    <line x1="5" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="19" y2="12" />
  </svg>
);

export const RefactorIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20v-6m0 0V8m0 6h6m-6 0H6" />
    <path d="M12 8a2 2 0 100-4 2 2 0 000 4zM18 8a2 2 0 100-4 2 2 0 000 4zM6 8a2 2 0 100-4 2 2 0 000 4z" />
    <path d="M18 20a2 2 0 100-4 2 2 0 000 4zM6 20a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

export const DebugIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 9V7a2 2 0 0 0-2-2h-4.38a2 2 0 0 0-1.23.4l-2.4 2.4a1 1 0 0 1-1.42 0L6.15 7.4A2 2 0 0 0 4.93 7H4a2 2 0 0 0-2 2v2" />
    <path d="M12 12h-2.5a2.5 2.5 0 0 0-2.5 2.5V17a2.5 2.5 0 0 0 2.5 2.5h10A2.5 2.5 0 0 0 22 17v-2.5a2.5 2.5 0 0 0-2.5-2.5H16" />
    <path d="M8 12v-2" />
    <path d="M16 12v-2" />
    <path d="m12 16.5-.5-.5" />
    <path d="m12.5 16 .5.5" />
  </svg>
);

export const UploadIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const CodeBracketsIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

