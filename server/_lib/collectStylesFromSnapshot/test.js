import test from 'ava'
import collectStylesFromSnapshot from '.'

const rules = [
  {selectorText: '*', cssText: '* {padding: 0; margin: 0;}'},
  {selectorText: 'html', cssText: 'html {background-color: #fff;}'},
  {selectorText: 'body', cssText: 'body {text-align: center;}'},
  {
    atRuleType: 'media',
    selectorText: '@media (min-width: 765px)',
    cssRules: [
      {selectorText: 'div', cssText: 'div {font-size: 18px;}'},
      {selectorText: '.unused-style', cssText: '.unused-style {font-size: 22px;}'}
    ]
  },
  {
    atRuleType: 'keyframes',
    selectorText: '@keyframes some-keyframes',
    cssRules: [
      {selectorText: '0%', cssText: '0% {width: 50%;}'},
      {selectorText: '50%', cssText: '50% {width: 75%;}'},
      {selectorText: '100%', cssText: '100% {width: 100%;}'}
    ]
  },
  {selectorText: 'div .hello-world', cssText: 'div .hello-world {cursor: pointer;}'},
  {selectorText: 'div .hello-world:hover', cssText: 'div .hello-world:hover {background-color: #000;}'},
  {selectorText: '.unused-style', cssText: '.unused-style {background-color: #000;}'}
]

const snapshot = '<div><p class="hello-world">Hello World!</p></div>'

const expectedCSS = `* {
  padding: 0;
  margin: 0;
}

html {
  background-color: #fff;
}

body {
  text-align: center;
}

@media (min-width: 765px) {
  div {
    font-size: 18px;
  }
}

@keyframes some-keyframes {
  0% {
    width: 50%;
  }

  50% {
    width: 75%;
  }

  100% {
    width: 100%;
  }
}

div .hello-world {
  cursor: pointer;
}

div .hello-world:hover {
  background-color: #000;
}
`

test('collectStylesFromSnapshot', t => {
  t.is(collectStylesFromSnapshot(rules, snapshot), expectedCSS)
})
