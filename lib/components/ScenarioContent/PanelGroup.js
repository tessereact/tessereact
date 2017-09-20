'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = void 0;
try {
  PropTypes = require('prop-types');
} catch (e) {
  // Ignore optional peer dependency
}

var PanelGroup = function (_React$Component) {
  _inherits(PanelGroup, _React$Component);

  function PanelGroup(props, context) {
    _classCallCheck(this, PanelGroup);

    var _this = _possibleConstructorReturn(this, (PanelGroup.__proto__ || Object.getPrototypeOf(PanelGroup)).call(this, props, context));

    _this.state = _this.loadPanels(props);
    return _this;
  }

  // reload panel configuration if props update


  _createClass(PanelGroup, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var currentPanels = this.props.panelWidths;
      var nextPanels = nextProps.panelWidths;

      // Only update from props if we're supplying the props in the first place
      if (nextPanels.length) {
        // if the panel array is a different size we know to update
        if (currentPanels.length !== nextPanels.length) {
          this.setState(this.loadPanels(nextProps));
        } else {
          // otherwise we need to iterate to spot any difference
          for (var i = 0; i < nextPanels.length; i++) {
            if (currentPanels[i].size !== nextPanels[i].size || currentPanels[i].minSize !== nextPanels[i].minSize || currentPanels[i].resize !== nextPanels[i].resize) {
              this.setState(this.loadPanels(nextProps));
              break;
            }
          }
        }
      }
    }

    // load provided props into state

  }, {
    key: 'loadPanels',
    value: function loadPanels(props) {
      var panels = [];

      if (props.children) {
        // Default values if none were provided
        var defaultSize = 256;
        var defaultMinSize = 48;
        var defaultResize = 'stretch';

        var stretchIncluded = false;
        var children = _react2.default.Children.toArray(props.children);

        for (var i = 0; i < children.length; i++) {
          if (i < props.panelWidths.length && props.panelWidths[i]) {
            var widthObj = {
              size: props.panelWidths[i].size != null ? props.panelWidths[i].size : defaultSize,
              minSize: props.panelWidths[i].minSize != null ? props.panelWidths[i].minSize : defaultMinSize,
              resize: props.panelWidths[i].resize ? props.panelWidths[i].resize : props.panelWidths[i].size ? 'dynamic' : defaultResize,
              snap: props.panelWidths[i].snap != null ? props.panelWidths[i].snap : []
            };
            panels.push(widthObj);
          } else {
            // default values if no props are given
            panels.push({
              size: defaultSize,
              resize: defaultResize,
              minSize: defaultMinSize,
              snap: []
            });
          }

          // if none of the panels included was stretchy, make the last one stretchy
          if (panels[i].resize === 'stretch') {
            stretchIncluded = true;
          }

          if (!stretchIncluded && i === children.length - 1) {
            panels[i].resize = 'stretch';
          }
        }
      }

      return { panels: panels };
    }

    // Pass internal state out if there's a callback for it
    // Useful for saving panel configuration

  }, {
    key: 'onUpdate',
    value: function onUpdate(panels) {
      if (this.props.onUpdate) {
        this.props.onUpdate(panels.slice());
      }
    }
  }, {
    key: 'onStartResizing',
    value: function onStartResizing(panels) {
      if (this.props.onStartResizing) {
        this.props.onStartResizing();
      }
    }
  }, {
    key: 'onStopResizing',
    value: function onStopResizing(panels) {
      if (this.props.onStopResizing) {
        this.props.onStopResizing();
      }
    }

    // For styling, track which direction to apply sizing to

  }, {
    key: 'getSizeDirection',
    value: function getSizeDirection(caps) {
      if (caps) return this.props.direction === 'column' ? 'Height' : 'Width';else return this.props.direction === 'column' ? 'height' : 'width';
    }

    // Render component

  }, {
    key: 'render',
    value: function render() {
      var _container,
          _this2 = this;

      var style = {
        container: (_container = {
          width: '100%',
          height: '100%'
        }, _defineProperty(_container, 'min' + this.getSizeDirection(true), this.getPanelGroupMinSize(this.props.spacing)), _defineProperty(_container, 'display', 'flex'), _defineProperty(_container, 'flexDirection', this.props.direction), _defineProperty(_container, 'flexGrow', 1), _container),
        panel: {
          flexGrow: 0,
          display: 'flex'
        }
      };

      // lets build up a new children array with added resize borders
      var initialChildren = _react2.default.Children.toArray(this.props.children);
      var newChildren = [];
      var stretchIncluded = false;

      for (var i = 0; i < initialChildren.length; i++) {
        var _panelStyle;

        // setting up the style for this panel.  Should probably be handled
        // in the child component, but this was easier for now
        var panelStyle = (_panelStyle = {}, _defineProperty(_panelStyle, this.getSizeDirection(), this.state.panels[i].size), _defineProperty(_panelStyle, this.props.direction === 'row' ? 'height' : 'width', '100%'), _defineProperty(_panelStyle, 'min' + this.getSizeDirection(true), this.state.panels[i].resize === 'stretch' ? 0 : this.state.panels[i].size), _defineProperty(_panelStyle, 'flexGrow', this.state.panels[i].resize === 'stretch' ? 1 : 0), _defineProperty(_panelStyle, 'flexShrink', this.state.panels[i].resize === 'stretch' ? 1 : 0), _defineProperty(_panelStyle, 'display', 'flex'), _defineProperty(_panelStyle, 'overflow', 'hidden'), _defineProperty(_panelStyle, 'position', 'relative'), _panelStyle);

        // patch in the background color if it was supplied as a prop
        Object.assign(panelStyle, { backgroundColor: this.props.panelColor });

        // give position info to children
        var metadata = {
          isFirst: i === 0,
          isLast: i === initialChildren.length - 1,
          resize: this.state.panels[i].resize,

          // window resize handler if this panel is stretchy
          onWindowResize: this.state.panels[i].resize === 'stretch' ? function (panelIndex, sizeObj, callback) {
            return _this2.setPanelSize(panelIndex, sizeObj, callback);
          } : null
        };

        // if none of the panels included was stretchy, make the last one stretchy
        if (this.state.panels[i].resize === 'stretch') stretchIncluded = true;
        if (!stretchIncluded && metadata.isLast) metadata.resize = 'stretch';

        // push children with added metadata
        newChildren.push(_react2.default.createElement(
          Panel,
          _extends({ style: panelStyle, key: 'panel' + i, panelID: i }, metadata),
          initialChildren[i]
        ));

        // add a handle between panels
        if (i < initialChildren.length - 1) {
          newChildren.push(_react2.default.createElement(Divider, {
            borderColor: this.props.borderColor,
            key: 'divider' + i,
            panelID: i,
            handleResize: function handleResize(i, delta) {
              return _this2.handleResize(i, delta);
            },
            dividerWidth: this.props.spacing,
            direction: this.props.direction,
            showHandles: this.props.showHandles,
            onStartResizing: function onStartResizing() {
              return _this2.onStartResizing();
            },
            onStopResizing: function onStopResizing() {
              return _this2.onStopResizing();
            }
          }));
        }
      }

      return _react2.default.createElement(
        'div',
        { className: 'panelGroup', style: style.container },
        newChildren
      );
    }

    // Entry point for resizing panels.
    // We clone the panel array and perform operations on it so we can
    // setState after the recursive operations are finished

  }, {
    key: 'handleResize',
    value: function handleResize(i, delta) {
      var tempPanels = this.state.panels.slice();
      var returnDelta = this.resizePanel(i, this.props.direction === 'row' ? delta.x : delta.y, tempPanels);
      this.setState({ panels: tempPanels });
      this.onUpdate(tempPanels);
      return returnDelta;
    }

    // Recursive panel resizing so we can push other panels out of the way
    // if we've exceeded the target panel's extents

  }, {
    key: 'resizePanel',
    value: function resizePanel(panelIndex, delta, panels) {
      var minsize = void 0;
      var maxsize = void 0;

      // track the progressive delta so we can report back how much this panel
      // actually moved after all the adjustments have been made
      var resultDelta = delta;

      // make the changes and deal with the consequences later
      panels[panelIndex].size += delta;
      panels[panelIndex + 1].size -= delta;

      // Min and max for LEFT panel
      minsize = this.getPanelMinSize(panelIndex, panels);
      maxsize = this.getPanelMaxSize(panelIndex, panels);

      // if we made the left panel too small
      if (panels[panelIndex].size < minsize) {
        var _delta = minsize - panels[panelIndex].size;

        if (panelIndex === 0) {
          resultDelta = this.resizePanel(panelIndex, _delta, panels);
        } else {
          resultDelta = this.resizePanel(panelIndex - 1, -_delta, panels);
        }
      }

      // if we made the left panel too big
      if (maxsize !== 0 && panels[panelIndex].size > maxsize) {
        var _delta2 = panels[panelIndex].size - maxsize;

        if (panelIndex === 0) {
          resultDelta = this.resizePanel(panelIndex, -_delta2, panels);
        } else {
          resultDelta = this.resizePanel(panelIndex - 1, _delta2, panels);
        }
      }

      // Min and max for RIGHT panel
      minsize = this.getPanelMinSize(panelIndex + 1, panels);
      maxsize = this.getPanelMaxSize(panelIndex + 1, panels);

      // if we made the right panel too small
      if (panels[panelIndex + 1].size < minsize) {
        var _delta3 = minsize - panels[panelIndex + 1].size;

        if (panelIndex + 1 === panels.length - 1) {
          resultDelta = this.resizePanel(panelIndex, -_delta3, panels);
        } else {
          resultDelta = this.resizePanel(panelIndex + 1, _delta3, panels);
        }
      }

      // if we made the right panel too big
      if (maxsize !== 0 && panels[panelIndex + 1].size > maxsize) {
        var _delta4 = panels[panelIndex + 1].size - maxsize;

        if (panelIndex + 1 === panels.length - 1) {
          resultDelta = this.resizePanel(panelIndex, _delta4, panels);
        } else {
          resultDelta = this.resizePanel(panelIndex + 1, -_delta4, panels);
        }
      }

      // Iterate through left panel's snap positions
      for (var i = 0; i < panels[panelIndex].snap.length; i++) {
        if (Math.abs(panels[panelIndex].snap[i] - panels[panelIndex].size) < 20) {
          var _delta5 = panels[panelIndex].snap[i] - panels[panelIndex].size;

          if (_delta5 !== 0 && panels[panelIndex].size + _delta5 >= this.getPanelMinSize(panelIndex, panels) && panels[panelIndex + 1].size - _delta5 >= this.getPanelMinSize(panelIndex + 1, panels)) {
            resultDelta = this.resizePanel(panelIndex, _delta5, panels);
          }
        }
      }

      // Iterate through right panel's snap positions
      for (var _i = 0; _i < panels[panelIndex + 1].snap.length; _i++) {
        if (Math.abs(panels[panelIndex + 1].snap[_i] - panels[panelIndex + 1].size) < 20) {
          var _delta6 = panels[panelIndex + 1].snap[_i] - panels[panelIndex + 1].size;

          if (_delta6 !== 0 && panels[panelIndex].size + _delta6 >= this.getPanelMinSize(panelIndex, panels) && panels[panelIndex + 1].size - _delta6 >= this.getPanelMinSize(panelIndex + 1, panels)) {
            resultDelta = this.resizePanel(panelIndex, -_delta6, panels);
          }
        }
      }

      // return how much this panel actually resized
      return resultDelta;
    }

    // Utility function for getting min pixel size of panel

  }, {
    key: 'getPanelMinSize',
    value: function getPanelMinSize(panelIndex, panels) {
      if (panels[panelIndex].resize === 'fixed') {
        if (!panels[panelIndex].fixedSize) {
          panels[panelIndex].fixedSize = panels[panelIndex].size;
        }
        return panels[panelIndex].fixedSize;
      }
      return panels[panelIndex].minSize;
    }

    // Utility function for getting max pixel size of panel

  }, {
    key: 'getPanelMaxSize',
    value: function getPanelMaxSize(panelIndex, panels) {
      if (panels[panelIndex].resize === 'fixed') {
        if (!panels[panelIndex].fixedSize) {
          panels[panelIndex].fixedSize = panels[panelIndex].size;
        }
        return panels[panelIndex].fixedSize;
      }
      return 0;
    }

    // Utility function for getting min pixel size of the entire panel group

  }, {
    key: 'getPanelGroupMinSize',
    value: function getPanelGroupMinSize(spacing) {
      var size = 0;
      for (var i = 0; i < this.state.panels.length; i++) {
        size += this.getPanelMinSize(i, this.state.panels);
      }
      return size + (this.state.panels.length - 1) * spacing;
    }

    // Hard-set a panel's size
    // Used to recalculate a stretchy panel when the window is resized

  }, {
    key: 'setPanelSize',
    value: function setPanelSize(panelIndex, sizeObj, callback) {
      var size = this.props.direction === 'column' ? sizeObj.y : sizeObj.x;

      if (size !== this.state.panels[panelIndex].size) {
        var tempPanels = this.state.panels;
        tempPanels[panelIndex].size = size;
        this.setState({
          panels: tempPanels
        });

        if (panelIndex > 0) {
          this.handleResize(panelIndex - 1, { x: 0, y: 0 });
        } else if (this.state.panels.length > 2) {
          this.handleResize(panelIndex + 1, { x: 0, y: 0 });
        }

        if (callback) {
          callback();
        }
      }
    }
  }]);

  return PanelGroup;
}(_react2.default.Component);

PanelGroup.defaultProps = {
  spacing: 1,
  direction: 'row',
  panelWidths: []
};


if (PropTypes) {
  PanelGroup.propTypes = {
    children: PropTypes.node.isRequired,
    onStartResizing: PropTypes.func,
    onStopResizing: PropTypes.func,
    onUpdate: PropTypes.func,
    panelWidths: PropTypes.array,
    panelColor: PropTypes.string,
    borderColor: PropTypes.string,
    spacing: PropTypes.number,
    showHandles: PropTypes.bool,
    direction: PropTypes.string
  };
}

var Panel = function (_React$Component2) {
  _inherits(Panel, _React$Component2);

  function Panel() {
    _classCallCheck(this, Panel);

    return _possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).apply(this, arguments));
  }

  _createClass(Panel, [{
    key: 'componentDidMount',

    // Find the resizeObject if it has one
    value: function componentDidMount() {
      var _this4 = this;

      if (this.props.resize === 'stretch') {
        this.refs.resizeObject.addEventListener('load', function () {
          return _this4.onResizeObjectLoad();
        });
        this.refs.resizeObject.data = 'about:blank';
        this.calculateStretchWidth();
      }
    }

    // Attach resize event listener to resizeObject

  }, {
    key: 'onResizeObjectLoad',
    value: function onResizeObjectLoad() {
      var _this5 = this;

      this.refs.resizeObject.contentDocument.defaultView.addEventListener('resize', function () {
        return _this5.calculateStretchWidth();
      });
    }

    // Utility function to wait for next render before executing a function

  }, {
    key: 'onNextFrame',
    value: function onNextFrame(callback) {
      setTimeout(function () {
        return window.requestAnimationFrame(callback);
      }, 0);
    }

    // Recalculate the stretchy panel if it's container has been resized

  }, {
    key: 'calculateStretchWidth',
    value: function calculateStretchWidth() {
      var _this6 = this;

      if (this.props.onWindowResize !== null) {
        var rect = _reactDom2.default.findDOMNode(this).getBoundingClientRect();

        this.props.onWindowResize(this.props.panelID, { x: rect.width, y: rect.height },
        // recalcalculate again if the width is below minimum
        // Kinda hacky, but for large resizes like fullscreen/Restore
        // it can't solve it in one pass.
        function () {
          return _this6.onNextFrame(function () {
            return _this6.calculateStretchWidth();
          });
        });
      }
    }

    // Render component

  }, {
    key: 'render',
    value: function render() {
      var style = {
        resizeObject: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          opacity: 0
        }
      };

      // only attach resize object if panel is stretchy.  Others dont need it
      var resizeObject = this.props.resize === 'stretch' ? _react2.default.createElement('object', {
        style: style.resizeObject,
        ref: 'resizeObject',
        type: 'text/html'
      }) : null;

      return _react2.default.createElement(
        'div',
        { className: 'panelWrapper', style: this.props.style },
        resizeObject,
        this.props.children
      );
    }
  }]);

  return Panel;
}(_react2.default.Component);

if (PropTypes) {
  Panel.propTypes = {
    children: PropTypes.node.isRequired,
    isFirst: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired,
    resize: PropTypes.string.isRequired,
    onWindowResize: PropTypes.func,
    style: PropTypes.object.isRequired,
    panelID: PropTypes.number.isRequired
  };
}

var Divider = function (_React$Component3) {
  _inherits(Divider, _React$Component3);

  function Divider(props, context) {
    _classCallCheck(this, Divider);

    var _this7 = _possibleConstructorReturn(this, (Divider.__proto__ || Object.getPrototypeOf(Divider)).call(this, props, context));

    _this7.state = {
      dragging: false,
      initPos: { x: null, y: null }
    };
    return _this7;
  }

  // Add/remove event listeners based on drag state


  _createClass(Divider, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(props, state) {
      var _this8 = this;

      if (this.state.dragging && !state.dragging) {
        this.onMouseMoveCallback = function (e) {
          return _this8.onMouseMove(e);
        };
        this.onMouseUpCallback = function (e) {
          return _this8.onMouseUp(e);
        };
        document.addEventListener('mousemove', this.onMouseMoveCallback);
        document.addEventListener('mouseup', this.onMouseUpCallback);
        this.props.onStartResizing();
      } else if (!this.state.dragging && state.dragging) {
        document.removeEventListener('mousemove', this.onMouseMoveCallback);
        document.removeEventListener('mouseup', this.onMouseUpCallback);
        this.props.onStopResizing();
      }
    }

    // Start drag state and set initial position

  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      // only left mouse button
      if (e.button !== 0) return;

      this.setState({
        dragging: true,
        initPos: {
          x: e.pageX,
          y: e.pageY
        }
      });

      e.stopPropagation();
      e.preventDefault();
    }

    // End drag state

  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.setState({ dragging: false });
      e.stopPropagation();
      e.preventDefault();
    }

    // Call resize handler if we're dragging

  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      if (!this.state.dragging) return;

      var initDelta = {
        x: e.pageX - this.state.initPos.x,
        y: e.pageY - this.state.initPos.y
      };

      var flowMask = {
        x: this.props.direction === 'row' ? 1 : 0,
        y: this.props.direction === 'column' ? 1 : 0
      };

      var flowDelta = initDelta.x * flowMask.x + initDelta.y * flowMask.y;

      // Resize the panels
      var resultDelta = this.handleResize(this.props.panelID, initDelta);

      // if the divider moved, reset the initPos
      if (resultDelta + flowDelta !== 0) {
        // Did we move the expected amount? (snapping will result in a larger delta)
        var expectedDelta = resultDelta === flowDelta;

        this.setState({
          initPos: {
            // if we moved more than expected, add the difference to the Position
            x: e.pageX + (expectedDelta ? 0 : resultDelta * flowMask.x),
            y: e.pageY + (expectedDelta ? 0 : resultDelta * flowMask.y)
          }
        });
      }

      e.stopPropagation();
      e.preventDefault();
    }

    // Handle resizing

  }, {
    key: 'handleResize',
    value: function handleResize(i, delta) {
      return this.props.handleResize(i, delta);
    }

    // Utility functions for handle size provided how much bleed
    // we want outside of the actual divider div

  }, {
    key: 'getHandleWidth',
    value: function getHandleWidth() {
      return this.props.dividerWidth + this.props.handleBleed * 2;
    }
  }, {
    key: 'getHandleOffset',
    value: function getHandleOffset() {
      return this.props.dividerWidth / 2 - this.getHandleWidth() / 2;
    }

    // Render component

  }, {
    key: 'render',
    value: function render() {
      var _this9 = this;

      var style = {
        divider: {
          width: this.props.direction === 'row' ? this.props.dividerWidth : 'auto',
          minWidth: this.props.direction === 'row' ? this.props.dividerWidth : 'auto',
          maxWidth: this.props.direction === 'row' ? this.props.dividerWidth : 'auto',
          height: this.props.direction === 'column' ? this.props.dividerWidth : 'auto',
          minHeight: this.props.direction === 'column' ? this.props.dividerWidth : 'auto',
          maxHeight: this.props.direction === 'column' ? this.props.dividerWidth : 'auto',
          flexGrow: 0,
          position: 'relative'
        },
        handle: {
          position: 'absolute',
          width: this.props.direction === 'row' ? this.getHandleWidth() : '100%',
          height: this.props.direction === 'column' ? this.getHandleWidth() : '100%',
          left: this.props.direction === 'row' ? this.getHandleOffset() : 0,
          top: this.props.direction === 'column' ? this.getHandleOffset() : 0,
          backgroundColor: this.props.showHandles ? 'rgba(0,128,255,0.25)' : 'auto',
          cursor: this.props.direction === 'row' ? 'col-resize' : 'row-resize',
          zIndex: 100
        }
      };
      Object.assign(style.divider, { backgroundColor: this.props.borderColor });

      return _react2.default.createElement(
        'div',
        {
          className: 'divider',
          style: style.divider,
          onMouseDown: function onMouseDown(e) {
            return _this9.onMouseDown(e);
          }
        },
        _react2.default.createElement('div', { style: style.handle })
      );
    }
  }]);

  return Divider;
}(_react2.default.Component);

Divider.defaultProps = {
  dividerWidth: 1,
  handleBleed: 4
};


if (PropTypes) {
  Divider.propTypes = {
    borderColor: PropTypes.string,
    panelID: PropTypes.number.isRequired,
    handleResize: PropTypes.func.isRequired,
    dividerWidth: PropTypes.number.isRequired,
    direction: PropTypes.string.isRequired,
    showHandles: PropTypes.bool,
    onStartResizing: PropTypes.func.isRequired,
    onStopResizing: PropTypes.func.isRequired,
    handleBleed: PropTypes.number
  };
}

exports.default = PanelGroup;