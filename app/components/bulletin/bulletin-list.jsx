import React from "react";
import { observer } from "mobx-react";
import BulletinReport from "./bulletin-report";

@observer
export default class BulletinList extends React.Component {
    constructor(props) {
        super(props);
    }

    get bulletins() {
        const collection = this.props.bulletinCollection;
        return collection.regions.map((rId) => collection.getBulletinForRegion(rId));
    }

    render() {
        return (
            <ul className="bulletin-list">
                {this.bulletins.map((bulletin) =>
                    <li id={bulletin.id} 
                        key={bulletin.id} 
                        className={"bulletin-list-item" + ((bulletin.id === this.props.store.settings.region) ? " selected" : "")}>
                        { <BulletinReport bulletin={bulletin} date={this.props.store.settings.date} /> }
                    </li>
                )}
            </ul>
        );
    }
}
