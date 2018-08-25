import { observable, action } from 'mobx'
import Base from '../base'

export default class WeatherMapStore {
  @observable _itemId
  @observable _domainId
  config

  constructor (initialDomainId) {
    console.log(initialDomainId)
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
    setting a new active domain
  */
  @action changeDomain (domainId) {
    console.log('changing domain', domainId)
    if (this.checkDomainId(domainId)) {
      this._domainId.set(domainId)
      this.changeItem(this.domain.domainIdStart)
    }
  }

  /*
    setting a new active item
  */
  @action changeItem (itemId) {
    console.log('changing item', itemId)
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
