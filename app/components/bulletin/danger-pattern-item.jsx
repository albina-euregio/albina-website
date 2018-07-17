import React from 'react';

export default class DangerPatternItem extends React.Component {
  patternTexts;

  constructor(props) {
    super(props);
    this.patternTexts = {
      'dp1': {en: 'Bodennahe Schwachschicht vom Frühwinter'},
      'dp2': {en: 'Gleitschnee'},
      'dp3': {en: 'Regen'},
      'dp4': {en: 'Kalt auf warm / warm auf kalt'},
      'dp5': {en: 'Schnee nach langer Kälteperiode'},
      'dp6': {en: 'Lockerer Schnee und Wind'},
      'dp7': {en: 'Schneearm neben schneereich'},
      'dp8': {en: 'Eingeschneiter Oberflächenreif'},
      'dp9': {en: 'Eingeschneiter Graupel'},
      'dp10': {en: 'Frühjahrssituation'}
    }
  }

  render() {
    const text = this.patternTexts[this.props.dangerPattern] ? this.patternTexts[this.props.dangerPattern].en : 'n/a';
    return (
      <a href="#" className="label">{text}</a>
    )
  }
}
