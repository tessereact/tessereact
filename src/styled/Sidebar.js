import styled from 'styled-components'
import defaultMixin from './mixins/default'

const Sidebar = styled.div`
  ${defaultMixin}
  display: flex;
  flex-basis: 20%;
  color: #e4e4e4;
  text-align: left;
  max-height: 100vh;
  min-width: 200px;
  flex-direction: column;
`

Sidebar.Header = styled.div`
  ${defaultMixin}
  height: 70px;
  font-size: 24px;
  padding: 20px;
  color: #e4e4e4;
  font-weight: normal;
  border-bottom: 1px solid #4d5056;
`

Sidebar.SearchBox = styled.div`
  ${defaultMixin}
  padding: 20px;
  border-bottom: 1px solid #4d5056;
`

Sidebar.List = styled.div`
  ${defaultMixin}
  flex: auto;
  padding: 20px;
  overflow-y: auto;
`

Sidebar.Progress = styled.div`
  ${defaultMixin}
  margin-bottom: 20px;
`

Sidebar.ListItem = styled.li`
  ${defaultMixin}
  list-style: none;
  font-size: 14px;
`

Sidebar.Footer = styled.div`
  ${defaultMixin}
  padding: 20px;
  border-top: 1px solid #4d5056;
`

export default Sidebar
