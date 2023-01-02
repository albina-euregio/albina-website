// https://github.com/runette/ngx-leaflet-sidebar/blob/master/src/lib/ngx-sidebar-control.component.ts
/// <reference types='leaflet-sidebar-v2' />
import {
  Component,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import { Map, Control, LeafletEvent, SidebarEventHandlerFnMap } from "leaflet";
import "leaflet-sidebar-v2";

declare module "leaflet" {
  interface LeafletEvent {
    id: string;
  }
}

export type SidebarEvent = LeafletEvent;

@Component({
  selector: "leaflet-sidebar-control",
  template: "",
})
export class NgxSidebarControlComponent implements OnDestroy {
  private _map: Map;
  private sidebar: Control.Sidebar;
  @Output() change$: EventEmitter<SidebarEvent> = new EventEmitter();
  private eventMap: SidebarEventHandlerFnMap = {
    opening: (e) => {
      this.change$.emit(e);
    },
    closing: (e) => {
      this.change$.emit(e);
    },
    content: (e) => {
      this.change$.emit(e);
    },
  };

  constructor() {}

  ngOnDestroy() {
    this._map.removeControl(this.sidebar);
  }

  @Input() options: Control.SidebarOptions = {};

  @Input() set map(map: Map) {
    if (map) {
      this._map = map;
      this.sidebar = new Control.Sidebar(this.options).addTo(map);
      this.sidebar.on(this.eventMap);
    }
  }

  get map(): Map {
    return this._map;
  }
}
