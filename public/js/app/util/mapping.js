const ko = require('knockout')
require('knockout.viewmodel')
const log = require('./logging')
const i18n = require('kth-node-i18n')

/**
 * Binding handler that allows a initial value to be set.
 * See views/partials/answer/browerInfo.handlebars for usage example.
 */
ko.bindingHandlers.initValue = {
  init: function (element, valueAccessor) {
    var value = valueAccessor()
    if (!ko.isWriteableObservable(value)) {
      throw new Error('Knockout "initValue" binding expects an observable.')
    }
    value(element.value)
  }
}

// List item mappings
var itemMappings = function (listItem) {
  listItem.hasError = ko.observable(false)
  listItem.error = ko.observable('')
  log.debug('Mapping item: ' + listItem)

  listItem.toggleError = function () {
    if (!listItem.hasError()) {
      log.debug('Mapping item: set error')
      listItem.error('Error')
      listItem.hasError(true)
    } else {
      log.debug('Mapping item: unset error')
      listItem.error('')
      listItem.hasError(false)
    }
  }
}

function createTranslatedField (targetObject, targetField) {
  return ko.computed(function () {
    var result = ''
    if (targetObject[ targetField ]) {
      var lang = 'sv'
      if (!i18n.isSwedish()) {
        lang = 'en'
      }
      result = targetObject[ targetField ][ lang ]
    }

    return result
  }, targetObject)
}
// List equipment mappings
var equipmentMappings = function (equipment) {
  log.debug('Mapping equipment: ' + JSON.stringify(equipment))
  if (equipment) {
    equipment.equipmentDescription = createTranslatedField(equipment, 'description')
    equipment.equipmentName = createTranslatedField(equipment, 'name')
  }
}

// Json object mappings
var objectMappings = function (objectToMap) {
  log.debug('Mapping objectToMap: ' + JSON.stringify(objectToMap))
  objectToMap.isHidden = ko.observable(false)

  objectToMap.toggleHide = function () {
    objectToMap.isHidden(!objectToMap.isHidden())
  }
}

// expose i18n as function in knockout model
//    function languageMappings(languageModel) {
//      languageModel.message = function(key) {
//        return i18n.message(key)
//      }
//    }

// expose serverConfig as knockout model
function serverConfigMappings (serverConfigModel) {}

// Our extended mapping options
var mappingOptions = {
  extend: {
    '{root}': objectMappings,
    '{root}.equipment[i]': equipmentMappings
  }
}

// Our extended mapping options
var listMappingOptions = {
  extend: {
    '{root}[i]': itemMappings
  }
}

var languageMappingOptions = {
  extend: {
    // '{root}': languageMappings
  }
}

var serverConfigMappingOptions = {
  extend: {
    '{root}': serverConfigMappings
  }
}

module.exports = {
  // Creates a knockout.viewmodel model from json
  fromModel: function (model) {
    return ko.viewmodel.fromModel(model, mappingOptions)
  },

  fromListModel: function (model) {
    return ko.viewmodel.fromModel(model, listMappingOptions)
  },

  fromLanguageModel: function (model) {
    return ko.viewmodel.fromModel(model, languageMappingOptions)
  },

  fromServerConfigModel: function (model) {
    return ko.viewmodel.fromModel(model, serverConfigMappingOptions)
  },

  // Creates json from a knockout.viewmodel model
  toModel: function (model) {
    var jsonModel = ko.viewmodel.toModel(model)

    return jsonModel
  }
}
