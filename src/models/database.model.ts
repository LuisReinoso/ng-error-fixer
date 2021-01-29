export interface Solution {
  packageName: string
  repo: string
  schematics: string
  args: { [key: string]: string }
}
