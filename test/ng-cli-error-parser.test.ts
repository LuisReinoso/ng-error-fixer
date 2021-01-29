import { loadFileRelativePath, parseLogs, solutionForError } from '../src/ng-error-fixer'

describe('ng-error-fixer', () => {
  it('should read file', () => {
    const file = loadFileRelativePath('/../test/errors-db.json')
    expect(JSON.parse(file)).toEqual({
      NG8001: {
        code: 'NG8001',
        solution: {
          packageName: 'unknown-html-schematics',
          repo: 'https://github.com/LuisReinoso/unknown-html-schematics',
          schematics: 'unknown-html-schematics:fix',
          args: {
            path: '',
            selector: '',
          },
        },
      },
    })
  })

  it('should read log', () => {
    const file = loadFileRelativePath('/../test/new-error.log')
    expect(file).toBeTruthy()
  })

  it('should return solution given dbError and currentError', () => {
    const dbError = JSON.parse(loadFileRelativePath('/../test/errors-db.json'))
    const rawError = loadFileRelativePath('/../test/new-error.log')
    const currentError = parseLogs(rawError)

    if (!currentError) {
      return
    }

    const solution = solutionForError(currentError, dbError)
    expect(solution.schematics).toEqual('unknown-html-schematics:fix')
  })
})
