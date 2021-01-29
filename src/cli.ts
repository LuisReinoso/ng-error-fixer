export const sections = [
  {
    header: 'ng-error-fixer',
    content: 'CLI helper to fix common errors on Angular framework',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'autoFix',
        alias: 'a',
        typeLabel: '{underline boolean}',
        description: `Enable auto fix when solution for error it's found`,
      },
      {
        name: 'database',
        alias: 'd',
        typeLabel: '{underline path}',
        description: `Error database path where to check errors`,
      },
      {
        name: 'debugMode',
        alias: 'b',
        typeLabel: '{underline boolean}',
        description: `Display schematics execution error`,
      },
      {
        name: 'project',
        alias: 'p',
        typeLabel: '{underline string}',
        description: `Project to get selector prefix`,
      },
      {
        name: 'help',
        alias: 'h',
        description: 'Print this usage guide.',
      },
    ],
  },
]

export const optionDefinitions = [
  { name: 'autoFix', alias: 'a', type: Boolean, defaultOption: false },
  {
    name: 'database',
    alias: 'd',
    type: String,
  },
  {
    name: 'debugMode',
    alias: 'b',
    type: Boolean,
  },
  {
    name: 'project',
    alias: 'p',
    type: String,
  },
  { name: 'help', alias: 'h', type: Boolean },
]
