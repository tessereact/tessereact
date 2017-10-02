import styled from 'styled-components'
import defaultMixin from './mixins/default'

const Sidebar = styled.div`
  display: flex;
  flex-basis: 20%;
  color: #e4e4e4;
  text-align: left;
  max-height: 100vh;
  min-width: 200px;
  flex-direction: column;
`

Sidebar.Header = defaultMixin(styled.div`
  height: 70px;
  font-size: 24px;
  padding: 20px;
  color: #e4e4e4;
  font-weight: normal;
  border-bottom: 1px solid #4d5056;
`)

Sidebar.SearchBox = defaultMixin(styled.div`
  padding: 20px;
  border-bottom: 1px solid #4d5056;
`)

Sidebar.List = defaultMixin(styled.div`
  flex: auto;
  padding: 20px;
  overflow-y: auto;
`)

Sidebar.Progress = defaultMixin(styled.div`
  margin-bottom: 20px;
`)

Sidebar.ListItem = defaultMixin(styled.li`
  list-style: none;
  font-size: 14px;
`)

Sidebar.Footer = defaultMixin(styled.div`
  padding: 20px;
  border-top: 1px solid #4d5056;
`)

export default defaultMixin(Sidebar)
