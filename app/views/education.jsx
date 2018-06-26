import React from 'react';
import PageHeadline from '../components/organisms/page-headline.jsx';

export default class Education extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const listItems = [
      {'title': 'Danger Scale', 'url': '/education/danger-scale', 'text': 'Some short text, only optionally, this is max. length'},
      {'title': 'Matrix', 'url': '/education/matrix', 'text': 'Some short text, only optionally, this is max. length'},
      {'title': 'Avalanche Problems', 'url': '/education/avalancheProblems', 'text': 'Some short text, only optionally, this is max. length'},
      {'title': 'Risk Patterns', 'url': '/education/risk-patterns', 'text': 'Some short text, only optionally, this is max. length'},
      {'title': 'Avalanche Sizes', 'url': '/education/avanlanche-sizes', 'text': 'Some short text, only optionally, this is max. length'},
      {'title': 'Terrain Inclinations', 'url': '/education/terrain-inclinations', 'text': 'Some short text, only optionally, this is max. length'},
      {'title': 'Glossary', 'url': '/education/glossary', 'text': 'Some short text, only optionally, this is max. length'},
    ];
    return (
      <div>
        <PageHeadline
          title="In this section"
          subtitle="Education &amp; Prevention"
          marginal="Some short text, only optionally, this is max. length" />
        <section className="section section-features">
          <ul className="list-plain features">
            {
              listItems.map((item, i) =>
                <li key={i} className="feature-item">
                  <a className="linkbox linkbox-feature" href={item.url} title={item.title}>
                    <div className="content-text">
                      <p className="h1 subheader">{item.title}</p>
                      <p>{item.text}</p>
                    </div>
                  </a>
                </li>
              )
            }
          </ul>
        </section>
      </div>
    );
  }
}
