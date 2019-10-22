import { observable } from "mobx";

export default class NavigationStore {
  @observable activeElement;
  @observable activeTopLevelElement;

  constructor() {
    this.activeElement = {};
    this.activeTopLevelElement = {};
  }
}
