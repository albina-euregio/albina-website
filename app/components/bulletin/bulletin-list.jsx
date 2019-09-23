import React from "react";
import BulletinReport from "./bulletin-report";

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
                    <li key={bulletin.id}>
                        <BulletinReport bulletin={bulletin} store={this.props.store} />
                    </li>
                )}
            </ul>
        );
    }
}
