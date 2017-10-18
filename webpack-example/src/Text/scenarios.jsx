import React from 'react'
import {context, scenario} from 'tessereact'
import Text from '.'

context('Text', () => {
  scenario('Default', () => (
    <Text>Text</Text>
  ), {css: true, screenshot: true})

  scenario('Purple', () => (
    <Text color='purple'>Purple text</Text>
  ), {css: true, screenshot: true})
})
