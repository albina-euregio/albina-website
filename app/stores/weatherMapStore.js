import { observable, action } from 'mobx'
import Base from '../base'

export default class WeatherMapStore {
  @observable _itemId
  @observable _domainId
  config

  constructor (initialDomainId) {
    this.config = false
    this._domainId = observable.box(false)
    this._itemId = observable.box(false)

    Base.doRequest(config.get('links.meteoViewerConfig')).then(response => {
      this.config = JSON.parse(response)
      this.changeDomain(initialDomainId)
    })
  }

  /*
    returns the active domain id
  */
  get domainId () {
    return this._domainId.get()
  }

  /*
    returns the active item id
  */
  get itemId () {
    return this._itemId.get()
  }

  /*
    returns domain data based on the active domain id
  */
  get domain () {
    return this.config && this.domainId ? this.config[this.domainId] : false
  }

  /*
    returns item data based on the active item id
  */
  get item () {
    return this.config && this.domainId && this.itemId && this.domain
      ? this.domain.items.find(i => i.id === this.itemId)
      : false
  }

  /*
    returns all items for the active domain in a form of array
  */
  get items () {
    return this.domainId ? this.domain.items : false
  }

  /*
    index of active item in the list of items for the active domain
  */
  get itemIndex () {
    return this.itemId && this.domainId
      ? this.items.map(i => i.id).indexOf(this.itemId)
      : false
  }

  /*
   returns index of active item decremented by 1
  */
  get previousIndex () {
    return this.itemIndex !== false ? parseInt(this.itemIndex, 10) - 1 : false
  }
  /*
    returns index of active item incremented by 1
  */
  get nextIndex () {
    return this.itemIndex !== false ? parseInt(this.itemIndex, 10) + 1 : false
  }

  /*
    returns item that is before the active item in a list of domain items
  */
  get previousItem () {
    const iIndex = this.itemIndex
    const previousIndex = this.previousIndex

    if (iIndex !== false && previousIndex !== false && this.items[previousIndex]) {
      return this.items[previousIndex]
    } else {
      return false
    }
  }

  /*
    returns item that is next to the active item in a list of domain items
  */
  get nextItem () {
    const iIndex = this.itemIndex
    const nextIndex = this.nextIndex

    if (iIndex !== false && nextIndex !== false && this.items[nextIndex]) {
      return this.items[nextIndex]
    } else {
      return false
    }
  }

  /*
    setting a new active domain
  */
  @action changeDomain (domainId) {
    // console.log('changing domain', domainId)
    if (this.checkDomainId(domainId)) {
      this._domainId.set(domainId)
      this.changeItem(this.domain.domainIdStart)
    }
  }

  /*
    setting a new active item
  */
  @action changeItem (itemId) {
    // console.log('changing item', itemId)
    if (this.checkItemId(this.domainId, itemId)) {
      this._itemId.set(itemId)
    }
  }

  /*
    control method to check if the domain does exist in the config
  */
  checkDomainId (domainId) {
    return (
      domainId &&
      this.config &&
      this.config[domainId] &&
      this.config[domainId].items &&
      this.config[domainId].items.length &&
      this.config[domainId].domainIdStart
    )
  }
  /*
  control method to check if the item does exist in the config
*/
  checkItemId (domainId, itemId) {
    return (
      this.checkDomainId(domainId) &&
      this.config[domainId].items.some(i => i.id === itemId)
    )
  }
}
