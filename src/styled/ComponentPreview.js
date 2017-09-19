import styled from 'styled-components'

const ComponentPreview = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;

`

ComponentPreview.LeftPane = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`

ComponentPreview.RightPane = styled(ComponentPreview.LeftPane)`
  border-left: 2px solid #d8d8d8;`

export default ComponentPreview
