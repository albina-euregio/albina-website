import React from "react";
import BulletinReport from "./bulletin-report";

export default class BulletinList extends React.Component {
    constructor(props) {
        super(props);
    }

    get bulletins() {
        const collection = this.props.bulletinCollection;
        const list = collection.regions.map((rId) => collection.getBulletinForRegion(rId));
        list.sort((b1,b2) => b1.maxWarnlevel.number < b2.maxWarnlevel.number);
        return list;
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
