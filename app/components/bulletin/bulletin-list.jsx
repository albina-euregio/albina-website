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
        const activeRegion =this.props.store.activeBulletin ? this.props.store.activeBulletin.id : null;
        return (
            <ul className="bulletin-list">
                {this.bulletins.map((bulletin) =>
                    <li key={bulletin.id} className={(bulletin.id === activeRegion) ? "selected" : ""}>
                        { (bulletin.id === activeRegion) 
                            ? <BulletinReport bulletin={bulletin} date={this.props.store.settings.date} />
                            : <BulletinReport bulletin={bulletin} date={this.props.store.settings.date} />
                        }
                    </li>
                )}
            </ul>
        );
    }
}
