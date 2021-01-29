#!/usr/bin/env node

const c = require('ansi-colors')
const { exec } = require('child_process')
const os = require('os')
const path = require('path')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
import { optionDefinitions, sections } from './cli'
import { loadErrorDb, parseLogs, solutionForError } from './ng-error-fixer'
const fs = require('fs')

const usage = commandLineUsage(sections)
const cliInput = commandLineArgs(optionDefinitions)

if (cliInput.help) {
  console.log(usage)
  process.exit(0)
}

let angularJSON = null
let rawdata = null
try {
  rawdata = fs.readFileSync('angular.json')
  angularJSON = JSON.parse(rawdata)
} catch (error) {
  console.log(c.red(`angular.json file wasn't found`))
  console.log(usage)
  process.exit(1)
}

const projectRoot = angularJSON.newProjectRoot
const defaultProject = angularJSON.defaultProject

const hasToFix = cliInput.autoFix
const databasePath =
  cliInput.database || path.join(os.homedir(), '.ng-error-fixer', 'errors-db.json')
const debugMode = cliInput.debugMode
const project = cliInput.project || defaultProject
const prefix = angularJSON[projectRoot][project].prefix

let errorDb: any = null
try {
  errorDb = JSON.parse(loadErrorDb(databasePath))
} catch (error) {
  console.log(c.red(`${databasePath} file wasn't found`))
  console.log(
    c.blue(`Please download database from`),
    c.green(`https://raw.githubusercontent.com/LuisReinoso/ng-error-fixer/master/db/errors-db.json`)
  )
  console.log(c.blue(`WIP: Download database automatically`))
  process.exit(1)
}

let data = ''

process.stdin.on('readable', async function () {
  const chunk: any = process.stdin.read()
  if (chunk !== null) {
    data += chunk
  }

  // TODO: catch last line of other error message
  // it can be found here:
  // https://github.com/angular/angular/blob/a6971ba89adc253bfa4260036ee4a1e0bd76159f/packages/compiler-cli/src/ngtsc/typecheck/diagnostics/src/diagnostic.ts#L104
  if (data.includes('Error occurs in the template of component')) {
    const errorInfo = parseLogs(data)

    if (errorInfo) {
      data = ''

      console.log('')

      console.log(c.red('Error was found'))
      console.log(errorInfo)

      console.log('')

      const { schematics, args, packageName } = solutionForError({ code: errorInfo.code }, errorDb)

      Object.keys(args).forEach((key: string) => {
        if (errorInfo.hasOwnProperty(key)) {
          args[key] = errorInfo[key]
        } else {
          console.log(c.red(`It's not enough args to fix issue`))
          return
        }
      })

      if (errorInfo.selector.includes(prefix)) {
        console.log(c.green('Solution'))
        const solutionArgs = Object.keys(args).map((key) => `--${key} ${args[key]}`)
        const solutionCommand = `ng g ${schematics} ${solutionArgs.join(' ')}`
        console.log(solutionCommand)

        if (hasToFix) {
          exec(solutionCommand, (err: any, cmdStdout: any, cmdStderr: any) => {
            console.log(c.green(cmdStdout))

            if (!debugMode && !!cmdStderr) {
              console.log(c.red('Something happen with schematics please enable debug mode'))
              console.log(c.blue('Please be sure you have installed', packageName, 'package'))
            } else if (debugMode && cmdStderr) {
              console.log('')
              console.log(c.red('Debug mode'))
              console.log(cmdStderr)
            }
          })
        }
      } else {
        console.log(c.blue('WIP: fix external imports.'))
        console.log(
          c.blue('Current is looking for selector with'),
          c.green(prefix),
          c.blue('prefix')
        )
      }
    }
  }
})
