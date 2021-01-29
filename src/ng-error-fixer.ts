import { Solution } from './models/database.model'

let fs = require('fs')

export function loadErrorDb(path: String) {
  let archivo = fs.readFileSync(path, 'utf-8')
  return archivo
}

export function loadFileRelativePath(relativePath: String) {
  let archivo = fs.readFileSync(__dirname + relativePath, 'utf-8')
  return archivo
}

export function readLogFile(path: String) {
  let archivo = fs.readFileSync(__dirname + '/../test' + path, 'utf-8')
  parseLogs(archivo)
}

export function parseLogs(archivo: any): { code: string; [key: string]: string } | null {
  const errorCodeRegex = /NG[0-9][0-7][0-9]{2}/
  const codeFound = archivo.match(errorCodeRegex)
  const regexMatchIndex = 0

  if (!codeFound) {
    console.log(`Provide output doesn't have code error`)
    return null
  }

  switch (codeFound[regexMatchIndex]) {
    case 'NG8001':
      return parseUnknownHTML(archivo, codeFound)
    default:
      console.log(`Error: ${codeFound} parser wasn't found`)
      return null
  }
}

function parseUnknownHTML(archivo: any, codeFound: any) {
  const pathRegex = /src.*html/
  const pathFound = archivo.match(pathRegex)

  const selectorRegex = /'.*'/
  const selectorFound = archivo.match(selectorRegex)

  return {
    code: codeFound[0],
    path: pathFound[0],
    selector: selectorFound[0].replace(/'/g, ''),
  }
}

export function solutionForError(
  currentError: { code: string },
  dbError: {
    [key: string]: { code: string; solution: Solution }
  }
): Solution {
  return dbError[currentError.code].solution
}
