import {convertObjectWithTemplates, processResponse} from '../utils'

function uploadFileFactory (urlValue, filesValue, optionsValue) {
  function uploadFile ({http, resolve, path}) {
    const url = resolve.value(urlValue)
    const files = resolve.value(filesValue)
    const options = convertObjectWithTemplates(optionsValue)

    return processResponse(http.uploadFile(url, files, options), path)
  }
  return uploadFile
}

export default uploadFileFactory
