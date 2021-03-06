import {Sequence, Parallel} from './primitives'

export {FunctionTreeExecutionError, FunctionTreeError} from './errors'

export function sequence (...args) {
  return new Sequence(...args)
}

export function parallel (...args) {
  return new Parallel(...args)
}

export {FunctionTree} from './FunctionTree'
export {FunctionTree as default} from './FunctionTree'
