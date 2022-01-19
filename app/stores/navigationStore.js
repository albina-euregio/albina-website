import { makeAutoObservable } from "mobx";

export default class NavigationStore {
  constructor() {
    console.log("NavigationStore");
    this.activeElement = {};
    this.activeTopLevelElement = {};
    makeAutoObservable(this);
  }
}

export const NAVIGATION_STORE = new NavigationStore();
