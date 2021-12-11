'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var PropTypes = require('prop-types');
var Player = require('@vimeo/player');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);
var Player__default = /*#__PURE__*/_interopDefaultLegacy(Player);

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var eventNames = {
  play: 'onPlay',
  pause: 'onPause',
  ended: 'onEnd',
  timeupdate: 'onTimeUpdate',
  progress: 'onProgress',
  seeked: 'onSeeked',
  texttrackchange: 'onTextTrackChange',
  cuechange: 'onCueChange',
  cuepoint: 'onCuePoint',
  volumechange: 'onVolumeChange',
  playbackratechange: 'onPlaybackRateChange',
  error: 'onError',
  loaded: 'onLoaded'
};

var Vimeo = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Vimeo, _React$Component);

  function Vimeo(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.refContainer = _this.refContainer.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Vimeo.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.createPlayer();
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this2 = this;

    // eslint-disable-next-line react/destructuring-assignment
    var changes = Object.keys(this.props).filter(function (name) {
      return _this2.props[name] !== prevProps[name];
    });
    this.updateProps(changes);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.player.destroy();
  }
  /**
   * @private
   */
  ;

  _proto.getInitialOptions = function getInitialOptions() {
    /* eslint-disable react/destructuring-assignment */
    return {
      id: this.props.video,
      width: this.props.width,
      height: this.props.height,
      autopause: this.props.autopause,
      autoplay: this.props.autoplay,
      byline: this.props.showByline,
      color: this.props.color,
      controls: this.props.controls,
      loop: this.props.loop,
      portrait: this.props.showPortrait,
      title: this.props.showTitle,
      muted: this.props.muted,
      background: this.props.background,
      responsive: this.props.responsive,
      dnt: this.props.dnt,
      speed: this.props.speed,
      playbackrate: this.props.playbackrate
    };
    /* eslint-enable react/destructuring-assignment */
  }
  /**
   * @private
   */
  ;

  _proto.updateProps = function updateProps(propNames) {
    var _this3 = this;

    var player = this.player;
    propNames.forEach(function (name) {
      // eslint-disable-next-line react/destructuring-assignment
      var value = _this3.props[name];

      switch (name) {
        case 'autopause':
          player.setAutopause(value);
          break;

        case 'color':
          player.setColor(value);
          break;

        case 'loop':
          player.setLoop(value);
          break;

        case 'volume':
          player.setVolume(value);
          break;

        case 'playbackrate':
          player.setPlaybackRate(value).then(function () {
            console.log('Setting playback rate success');
          })["catch"](function (err) {
            console.log('Setting playback rate failed');
          });
          break;

        case 'paused':
          player.getPaused().then(function (paused) {
            if (value && !paused) {
              return player.pause();
            }

            if (!value && paused) {
              return player.play();
            }

            return null;
          });
          break;

        case 'width':
        case 'height':
          player.element[name] = value;
          break;

        case 'video':
          if (value) {
            var start = _this3.props.start;
            var loaded = player.loadVideo(value); // Set the start time only when loading a new video.
            // It seems like this has to be done after the video has loaded, else it just starts at
            // the beginning!

            if (typeof start === 'number') {
              loaded.then(function () {
                player.setCurrentTime(start);
              });
            }
          } else {
            player.unload();
          }

          break;

      }
    });
  }
  /**
   * @private
   */
  ;

  _proto.createPlayer = function createPlayer() {
    var _this4 = this;

    var _this$props = this.props,
        start = _this$props.start,
        volume = _this$props.volume;
    this.player = new Player__default["default"](this.container, this.getInitialOptions());
    Object.keys(eventNames).forEach(function (dmName) {
      var reactName = eventNames[dmName];

      _this4.player.on(dmName, function (event) {
        // eslint-disable-next-line react/destructuring-assignment
        var handler = _this4.props[reactName];

        if (handler) {
          handler(event);
        }
      });
    });
    var _this$props2 = this.props,
        onError = _this$props2.onError,
        onReady = _this$props2.onReady;
    this.player.ready().then(function () {
      if (onReady) {
        onReady(_this4.player);
      }
    }, function (err) {
      if (onError) {
        onError(err);
      } else {
        throw err;
      }
    });

    if (typeof start === 'number') {
      this.player.setCurrentTime(start);
    }

    if (typeof volume === 'number') {
      this.updateProps(['volume']);
    }
  }
  /**
   * @private
   */
  ;

  _proto.refContainer = function refContainer(container) {
    this.container = container;
  };

  _proto.render = function render() {
    var _this$props3 = this.props,
        id = _this$props3.id,
        className = _this$props3.className,
        style = _this$props3.style;
    return /*#__PURE__*/React__default["default"].createElement("div", {
      id: id,
      className: className,
      style: style,
      ref: this.refContainer
    });
  };

  return Vimeo;
}(React__default["default"].Component);

if (process.env.NODE_ENV !== 'production') {
  Vimeo.propTypes = {
    /**
     * A Vimeo video ID or URL.
     */
    video: PropTypes__default["default"].oneOfType([PropTypes__default["default"].number, PropTypes__default["default"].string]),

    /**
     * DOM ID for the player element.
     */
    id: PropTypes__default["default"].string,

    /**
     * CSS className for the player element.
     */
    className: PropTypes__default["default"].string,

    /**
     * Inline style for container element.
     */
    style: PropTypes__default["default"].object,
    // eslint-disable-line react/forbid-prop-types

    /**
     * Width of the player element.
     */
    width: PropTypes__default["default"].oneOfType([PropTypes__default["default"].number, PropTypes__default["default"].string]),

    /**
     * Height of the player element.
     */
    height: PropTypes__default["default"].oneOfType([PropTypes__default["default"].number, PropTypes__default["default"].string]),

    /**
     * Pause the video.
     */
    paused: PropTypes__default["default"].bool,
    // eslint-disable-line react/no-unused-prop-types

    /**
     * The playback volume as a number between 0 and 1.
     */
    volume: PropTypes__default["default"].number,

    /**
     * The playbackrate volume as a number between 0.5 and 2.
     */
    playbackrate: PropTypes__default["default"].number,

    /**
     * The time in seconds at which to start playing the video.
     */
    start: PropTypes__default["default"].number,
    // Player parameters

    /**
     * Pause this video automatically when another one plays.
     */
    autopause: PropTypes__default["default"].bool,

    /**
     * Automatically start playback of the video. Note that this won’t work on
     * some devices.
     */
    autoplay: PropTypes__default["default"].bool,

    /**
     * Show the byline on the video.
     */
    showByline: PropTypes__default["default"].bool,

    /**
     * Specify the color of the video controls. Colors may be overridden by the
     * embed settings of the video. _(Ex: "ef2f9f")_
     */
    color: PropTypes__default["default"].string,

    /**
     * Blocks the player from tracking any session data, including all cookies and analytics.
     */
    dnt: PropTypes__default["default"].bool,
    // Player controls

    /**
     * Hide all elements in the player (play bar, sharing buttons, etc).
     */
    controls: PropTypes__default["default"].bool,

    /**
     * Play the video again when it reaches the end.
     */
    loop: PropTypes__default["default"].bool,

    /**
     * Show the portrait on the video.
     */
    showPortrait: PropTypes__default["default"].bool,

    /**
     * Show the title on the video.
     */
    showTitle: PropTypes__default["default"].bool,

    /**
     * Starts in a muted state to help with autoplay
     */
    muted: PropTypes__default["default"].bool,

    /**
     * Starts in a background state with no controls to help with autoplay
     */
    background: PropTypes__default["default"].bool,

    /**
     * Enable responsive mode and resize according to parent element (experimental)
     */
    responsive: PropTypes__default["default"].bool,

    /**
     * Enable playback rate controls (requires Vimeo PRO / Business account)
     */
    speed: PropTypes__default["default"].bool,
    // Events

    /* eslint-disable react/no-unused-prop-types */

    /**
     * Sent when the Vimeo player API has loaded.
     * Receives the Vimeo player object in the first parameter.
     */
    onReady: PropTypes__default["default"].func,

    /**
     * Sent when the player triggers an error.
     */
    onError: PropTypes__default["default"].func,

    /**
     * Triggered when the video plays.
     */
    onPlay: PropTypes__default["default"].func,

    /**
     * Triggered when the video pauses.
     */
    onPause: PropTypes__default["default"].func,

    /**
     * Triggered any time the video playback reaches the end.
     * Note: when `loop` is turned on, the ended event will not fire.
     */
    onEnd: PropTypes__default["default"].func,

    /**
     * Triggered as the `currentTime` of the video updates. It generally fires
     * every 250ms, but it may vary depending on the browser.
     */
    onTimeUpdate: PropTypes__default["default"].func,

    /**
     * Triggered as the video is loaded. Reports back the amount of the video
     * that has been buffered.
     */
    onProgress: PropTypes__default["default"].func,

    /**
     * Triggered when the player seeks to a specific time. An `onTimeUpdate`
     * event will also be fired at the same time.
     */
    onSeeked: PropTypes__default["default"].func,

    /**
     * Triggered when the active text track (captions/subtitles) changes. The
     * values will be `null` if text tracks are turned off.
     */
    onTextTrackChange: PropTypes__default["default"].func,

    /**
     * Triggered when the active cue for the current text track changes. It also
     * fires when the active text track changes. There may be multiple cues
     * active.
     */
    onCueChange: PropTypes__default["default"].func,

    /**
     * Triggered when the current time hits a registered cue point.
     */
    onCuePoint: PropTypes__default["default"].func,

    /**
     * Triggered when the volume in the player changes. Some devices do not
     * support setting the volume of the video independently from the system
     * volume, so this event will never fire on those devices.
     */
    onVolumeChange: PropTypes__default["default"].func,

    /**
     * Triggered when the playback rate changes.
     */
    onPlaybackRateChange: PropTypes__default["default"].func,

    /**
     * Triggered when a new video is loaded in the player.
     */
    onLoaded: PropTypes__default["default"].func
    /* eslint-enable react/no-unused-prop-types */

  };
}

Vimeo.defaultProps = {
  autopause: true,
  autoplay: false,
  showByline: true,
  controls: true,
  loop: false,
  showPortrait: true,
  showTitle: true,
  muted: false,
  background: false,
  responsive: false,
  dnt: false,
  speed: false
};

exports["default"] = Vimeo;
