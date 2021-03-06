import {ensurePath, cleanPath, throwError} from '../utils'

function StateProviderFactory () {
  const methods = [
    'get',
    'set',
    'push',
    'merge',
    'pop',
    'shift',
    'unshift',
    'splice',
    'unset',
    'concat'
  ]
  let provider = null

  function createProvider (context) {
    const model = context.controller.model
    let asyncTimeout = null

    return methods.reduce((currentStateContext, methodKey) => {
      currentStateContext[methodKey] = (...args) => {
        const path = ensurePath(cleanPath(args.shift()))

        if (methodKey !== 'get') {
          clearTimeout(asyncTimeout)
          asyncTimeout = setTimeout(() => context.controller.flush())
        }

        return model[methodKey].apply(model, [path].concat(args))
      }

      return currentStateContext
    }, {})
  }

  function StateProvider (context) {
    context.state = provider = provider || createProvider(context)

    if (context.debugger) {
      context.state = methods.reduce((currentState, methodKey) => {
        if (methodKey === 'get' || methodKey === 'compute') {
          currentState[methodKey] = provider[methodKey]
        } else {
          const originFunc = provider[methodKey]

          currentState[methodKey] = (...args) => {
            const argsCopy = args.slice()
            const path = ensurePath(argsCopy.shift())

            context.debugger.send({
              datetime: Date.now(),
              type: 'mutation',
              color: '#333',
              method: methodKey,
              args: [path, ...argsCopy]
            })

            try {
              originFunc.apply(context.controller.model, args)
            } catch (e) {
              const path = args[0]
              const type = typeof args[1]
              const signalName = context.execution.name
              throwError(`The Signal '${signalName}' passed an invalid value of type '${type}' to the state tree at path: '${path}'`)
            }
          }
        }

        return currentState
      }, {})
    }

    return context
  }

  return StateProvider
}

export default StateProviderFactory
