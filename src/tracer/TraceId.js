'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../option');

var Some = _require.Some;
var None = _require.None;
var verifyIsOptional = _require.verifyIsOptional;

// truncates a 128 bit hex-encoded trace ID to its lower 64 bits

function coerceTo64Bit(str) {
  if (str.length <= 16) {
    return str;
  } else {
    return str.substr(str.length - 16);
  }
}

var TraceId = function () {
  function TraceId(params) {
    _classCallCheck(this, TraceId);

    var _params$traceId = params.traceId;
    var traceId = _params$traceId === undefined ? None : _params$traceId;
    var _params$parentId = params.parentId;
    var parentId = _params$parentId === undefined ? None : _params$parentId;
    var spanId = params.spanId;
    var _params$sampled = params.sampled;
    var sampled = _params$sampled === undefined ? None : _params$sampled;
    var _params$flags = params.flags;
    var flags = _params$flags === undefined ? 0 : _params$flags;

    verifyIsOptional(traceId);
    verifyIsOptional(parentId);
    verifyIsOptional(sampled);
    this._traceId = traceId.map(coerceTo64Bit);
    this._parentId = parentId;
    this._spanId = spanId;
    this._sampled = sampled;
    this._flags = flags;
  }

  _createClass(TraceId, [{
    key: 'isDebug',
    value: function isDebug() {
      // The jshint tool always complains about using bitwise operators,
      // but in this case it's actually intentional, so we disable the warning:
      // jshint bitwise: false
      return (this._flags & 1) === 1;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'TraceId(spanId=' + this.spanId.toString() + (', parentId=' + this.parentId.toString()) + (', traceId=' + this.traceId.toString() + ')');
    }
  }, {
    key: 'spanId',
    get: function get() {
      return this._spanId;
    }
  }, {
    key: 'parentId',
    get: function get() {
      return this._parentId.getOrElse(this.spanId);
    }
  }, {
    key: 'traceId',
    get: function get() {
      return this._traceId.getOrElse(this.parentId);
    }
  }, {
    key: 'sampled',
    get: function get() {
      return this.isDebug() ? new Some(true) : this._sampled;
    }
  }, {
    key: 'flags',
    get: function get() {
      return this._flags;
    }
  }]);

  return TraceId;
}();

module.exports = TraceId;