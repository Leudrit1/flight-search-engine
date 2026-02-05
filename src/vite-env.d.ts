/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AMADEUS_CLIENT_ID?: string
  readonly VITE_AMADEUS_CLIENT_CREDENTIAL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css' {
  const content: Record<string, string>
  export default content
}
