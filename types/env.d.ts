// Minimal env typings to use process.env without installing @types/node
declare namespace NodeJS {
  interface ProcessEnv {
    API_URL?: string
  }
}

declare const process: {
  env: NodeJS.ProcessEnv
  dev?: boolean
}
