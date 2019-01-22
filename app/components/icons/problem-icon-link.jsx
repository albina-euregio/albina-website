import React from 'react'
import { Link } from 'react-router-dom'
import { inject } from 'mobx-react'
import { injectIntl } from 'react-intl'
import ProblemIcon from './problem-icon.jsx'

class ProblemIconLink extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const title = this.props.intl.formatMessage({
      id: 'problem:' + this.props.problem
    })

    return (
      <div className="bulletin-report-picto avalanche-situation">
        {title && (
          <Link
            to={'/education/avp#' + this.props.problem}
            className="img tooltip"
            href="#"
            title={title}
          >
            <ProblemIcon
              problem={this.props.problem}
              alt={title}
              active={true}
            />
          </Link>
        )}
      </div>
    )
  }
}

export default inject('locale')(injectIntl(ProblemIconLink))
