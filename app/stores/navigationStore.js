import { observable, makeObservable } from "mobx";

export default class NavigationStore {
  constructor() {
    this.activeElement = {};
    this.activeTopLevelElement = {};
    makeObservable(this, {
      activeElement: observable,
      activeTopLevelElement: observable
    });
  }
}
