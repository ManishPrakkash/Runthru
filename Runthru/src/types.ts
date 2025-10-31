// Replaced TypeScript `enum` with a plain JS-safe object so the Vite/esbuild
// pipeline won't throw a parse error when treating files as JS.
export const ActionType = {
  Explain: 'Explain',
  Refactor: 'Refactor',
  Debug: 'Debug',
};

export default ActionType;
