/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AMADEUS_API_KEY?: string
  readonly VITE_AMADEUS_API_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css' {
  const content: Record<string, string>
  export default content
}
