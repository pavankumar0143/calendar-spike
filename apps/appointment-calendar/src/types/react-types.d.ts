import * as React from 'react';

// This declaration merges with the React namespace to fix type conflicts
declare module 'react' {
  // Ensure ReactNode types are compatible
  export type ReactNode = 
    | React.ReactElement
    | string
    | number
    | boolean
    | null
    | undefined
    | React.ReactNodeArray
    | React.ReactPortal
    | bigint;
} 