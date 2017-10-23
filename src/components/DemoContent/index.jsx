import React from 'react'
import Header from '../../styled/Header'
import StyledContent from '../../styled/Content'
import ComponentPreview from '../../styled/ComponentPreview'

import { redirectToHome } from '../_lib/routes'

/**
 * UI element which shows demo page to the user.
 * @extends React.Component
 */
class DemoContent extends React.Component {
  componentWillMount () {
    if (!window.__tessereactDemoMode) {
      redirectToHome()
    }
  }

  render () {
    return <StyledContent.Wrapper>
      <Header>
        <div>
          <span>{window.__tessereactDemoMode.title}</span>
        </div>
      </Header>

      <ComponentPreview>
        {window.__tessereactDemoMode.description}
      </ComponentPreview>
    </StyledContent.Wrapper>
  }
}

export default DemoContent
