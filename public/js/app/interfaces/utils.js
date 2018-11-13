'use strict'

import { createInterface } from 'component-registry'

export const IMobxStore = createInterface({
  name: 'IMobxStore'
})

  // This is a named utility used to create object prototypes
export const IObjectPrototypeFactory = createInterface({
  name: 'IObjectPrototypeFactory'
})

// This is a named utility used to deserialize json objects
export const IDeserialize = createInterface({
  name: 'IDeserialize'
})