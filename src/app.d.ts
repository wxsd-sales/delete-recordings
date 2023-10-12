// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  declare module "*.numbers" {
    const data: string;
    export default data;
  }
  declare module "*.xlsx" {
    const data: string;
    export default data;
  }
}

export {};
