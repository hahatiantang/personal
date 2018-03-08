// Ion.RangeSlider
// version 2.1.4 Build: 355
// © Denis Ineshin, 2016
// https://github.com/IonDen
//
// Project page:    http://ionden.com/a/plugins/ion.rangeSlider/en.html
// GitHub page:     https://github.com/IonDen/ion.rangeSlider
//
// Released under MIT licence:
// http://ionden.com/a/plugins/licence-en.html
// =====================================================================================================================

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], function ($) {
      factory($, document, window, navigator);
    });
  } else {
    factory(jQuery, document, window, navigator);
  }
} (function ($, document, window, navigator, undefined) {
  "use strict";

  var plugin_count = 0;

  // IE8 fix
  var is_old_ie = (function () {
    var n = navigator.userAgent,
      r = /msie\s\d+/i,
      v;
    if (n.search(r) > 0) {
      v = r.exec(n).toString();
      v = v.split(" ")[1];
      if (v < 9) {
        $("html").addClass("lt-ie9");
        return true;
      }
    }
    return false;
  } ());
  if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) {

      var target = this;
      var slice = [].slice;

      if (typeof target != "function") {
        throw new TypeError();
      }

      var args = slice.call(arguments, 1),
        bound = function () {

          if (this instanceof bound) {

            var F = function(){};
            F.prototype = target.prototype;
            var self = new F();

            var result = target.apply(
              self,
              args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
              return result;
            }
            return self;

          } else {

            return target.apply(
              that,
              args.concat(slice.call(arguments))
            );

          }

        };

      return bound;
    };
  }
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
      var k;
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var O = Object(this);
      var len = O.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = +fromIndex || 0;
      if (Math.abs(n) === Infinity) {
        n = 0;
      }
      if (n >= len) {
        return -1;
      }
      k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      while (k < len) {
        if (k in O && O[k] === searchElement) {
          return k;
        }
        k++;
      }
      return -1;
    };
  }

  // Template
  var base_html =
    '<span class="irs">' +
    '<span class="irs-line" tabindex="-1"><span class="irs-line-left"></span><span class="irs-line-mid"></span><span class="irs-line-right"></span></span>' +
    '<span class="irs-min">0</span><span class="irs-max">1</span>' +
    '<span class="irs-from">0</span><span class="irs-to">0</span><span class="irs-single">0</span>' +
    '</span>' +
    '<span class="irs-grid"></span>' +
    '<span class="irs-bar"></span>';

  var single_html =
    '<span class="irs-bar-edge"></span>' +
    '<span class="irs-shadow shadow-single"></span>' +
    '<span class="irs-slider single"></span>';

  var double_html =
    '<span class="irs-shadow shadow-from"></span>' +
    '<span class="irs-shadow shadow-to"></span>' +
    '<span class="irs-slider from"></span>' +
    '<span class="irs-slider to"></span>';

  var disable_html =
    '<span class="irs-disable-mask"></span>';

  // =================================================================================================================
  // Core

  /**
   * Main plugin constructor
   *
   * @param input {Object} link to base input element
   * @param options {Object} slider config
   * @param plugin_count {Number}
   * @constructor
   */
  var IonRangeSlider = function (input, options, plugin_count) {
    this.VERSION = "2.1.4";
    this.input = input;
    this.plugin_count = plugin_count;
    this.current_plugin = 0;
    this.calc_count = 0;
    this.update_tm = 0;
    this.old_from = 0;
    this.old_to = 0;
    this.old_min_interval = null;
    this.raf_id = null;
    this.dragging = false;
    this.force_redraw = false;
    this.no_diapason = false;
    this.is_key = false;
    this.is_update = false;
    this.is_start = true;
    this.is_finish = false;
    this.is_active = false;
    this.is_resize = false;
    this.is_click = false;

    // cache for links to all DOM elements
    this.$cache = {
      win: $(window),
      body: $(document.body),
      input: $(input),
      cont: null,
      rs: null,
      min: null,
      max: null,
      from: null,
      to: null,
      single: null,
      bar: null,
      line: null,
      s_single: null,
      s_from: null,
      s_to: null,
      shad_single: null,
      shad_from: null,
      shad_to: null,
      edge: null,
      grid: null,
      grid_labels: []
    };

    // storage for measure variables
    this.coords = {
      // left
      x_gap: 0,
      x_pointer: 0,

      // width
      w_rs: 0,
      w_rs_old: 0,
      w_handle: 0,

      // percents
      p_gap: 0,
      p_gap_left: 0,
      p_gap_right: 0,
      p_step: 0,
      p_pointer: 0,
      p_handle: 0,
      p_single_fake: 0,
      p_single_real: 0,
      p_from_fake: 0,
      p_from_real: 0,
      p_to_fake: 0,
      p_to_real: 0,
      p_bar_x: 0,
      p_bar_w: 0,

      // grid
      grid_gap: 0,
      big_num: 0,
      big: [],
      big_w: [],
      big_p: [],
      big_x: []
    };

    // storage for labels measure variables
    this.labels = {
      // width
      w_min: 0,
      w_max: 0,
      w_from: 0,
      w_to: 0,
      w_single: 0,

      // percents
      p_min: 0,
      p_max: 0,
      p_from_fake: 0,
      p_from_left: 0,
      p_to_fake: 0,
      p_to_left: 0,
      p_single_fake: 0,
      p_single_left: 0
    };



    /**
     * get and validate config
     */
    var $inp = this.$cache.input,
      val = $inp.prop("value"),
      config, config_from_data, prop;

    // default config
    config = {
      type: "single",

      min: 10,
      max: 100,
      from: null,
      to: null,
      step: 1,

      min_interval: 0,
      max_interval: 0,
      drag_interval: false,

      values: [],
      p_values: [],

      from_fixed: false,
      from_min: null,
      from_max: null,
      from_shadow: false,

      to_fixed: false,
      to_min: null,
      to_max: null,
      to_shadow: false,

      prettify_enabled: true,
      prettify_separator: " ",
      prettify: null,

      force_edges: false,

      keyboard: false,
      keyboard_step: 5,

      grid: false,
      grid_margin: true,
      grid_num: 4,
      grid_snap: false,

      hide_min_max: false,
      hide_from_to: false,

      prefix: "",
      postfix: "",
      max_postfix: "",
      decorate_both: true,
      values_separator: " — ",

      input_values_separator: ";",

      disable: false,

      onStart: null,
      onChange: null,
      onFinish: null,
      onUpdate: null
    };

    // config from data-attributes extends js config
    config_from_data = {
      type: $inp.data("type"),

      min: $inp.data("min"),
      max: $inp.data("max"),
      from: $inp.data("from"),
      to: $inp.data("to"),
      step: $inp.data("step"),

      min_interval: $inp.data("minInterval"),
      max_interval: $inp.data("maxInterval"),
      drag_interval: $inp.data("dragInterval"),

      values: $inp.data("values"),

      from_fixed: $inp.data("fromFixed"),
      from_min: $inp.data("fromMin"),
      from_max: $inp.data("fromMax"),
      from_shadow: $inp.data("fromShadow"),

      to_fixed: $inp.data("toFixed"),
      to_min: $inp.data("toMin"),
      to_max: $inp.data("toMax"),
      to_shadow: $inp.data("toShadow"),

      prettify_enabled: $inp.data("prettifyEnabled"),
      prettify_separator: $inp.data("prettifySeparator"),

      force_edges: $inp.data("forceEdges"),

      keyboard: $inp.data("keyboard"),
      keyboard_step: $inp.data("keyboardStep"),

      grid: $inp.data("grid"),
      grid_margin: $inp.data("gridMargin"),
      grid_num: $inp.data("gridNum"),
      grid_snap: $inp.data("gridSnap"),

      hide_min_max: $inp.data("hideMinMax"),
      hide_from_to: $inp.data("hideFromTo"),

      prefix: $inp.data("prefix"),
      postfix: $inp.data("postfix"),
      max_postfix: $inp.data("maxPostfix"),
      decorate_both: $inp.data("decorateBoth"),
      values_separator: $inp.data("valuesSeparator"),

      input_values_separator: $inp.data("inputValuesSeparator"),

      disable: $inp.data("disable")
    };
    config_from_data.values = config_from_data.values && config_from_data.values.split(",");

    for (prop in config_from_data) {
      if (config_from_data.hasOwnProperty(prop)) {
        if (!config_from_data[prop] && config_from_data[prop] !== 0) {
          delete config_from_data[prop];
        }
      }
    }



    // input value extends default config
    if (val) {
      val = val.split(config_from_data.input_values_separator || options.input_values_separator || ";");

      if (val[0] && val[0] == +val[0]) {
        val[0] = +val[0];
      }
      if (val[1] && val[1] == +val[1]) {
        val[1] = +val[1];
      }

      if (options && options.values && options.values.length) {
        config.from = val[0] && options.values.indexOf(val[0]);
        config.to = val[1] && options.values.indexOf(val[1]);
      } else {
        config.from = val[0] && +val[0];
        config.to = val[1] && +val[1];
      }
    }

    // js config extends default config
    $.extend(config, options);

    // data config extends config
    $.extend(config, config_from_data);
    this.options = config;

    // validate config, to be sure that all data types are correct
    this.validate();

    // default result object, returned to callbacks
    this.result = {
      input: this.$cache.input,
      slider: null,

      min: this.options.min,
      max: this.options.max,

      from: this.options.from,
      from_percent: 0,
      from_value: null,

      to: this.options.to,
      to_percent: 0,
      to_value: null
    };
    this.init();
  };

  IonRangeSlider.prototype = {

    /**
     * Starts or updates the plugin instance
     *
     * @param is_update {boolean}
     */
    init: function (is_update) {
      this.no_diapason = false;
      this.coords.p_step = this.convertToPercent(this.options.step, true);

      this.target = "base";

      this.toggleInput();
      this.append();
      this.setMinMax();

      if (is_update) {
        this.force_redraw = true;
        this.calc(true);

        // callbacks called
        this.callOnUpdate();
      } else {
        this.force_redraw = true;
        this.calc(true);

        // callbacks called
        this.callOnStart();
      }

      this.updateScene();
    },

    /**
     * Appends slider template to a DOM
     */
    append: function () {
      var container_html = '<span class="irs js-irs-' + this.plugin_count + '"></span>';
      this.$cache.input.before(container_html);
      this.$cache.input.prop("readonly", true);
      this.$cache.cont = this.$cache.input.prev();
      this.result.slider = this.$cache.cont;

      this.$cache.cont.html(base_html);
      this.$cache.rs = this.$cache.cont.find(".irs");
      this.$cache.min = this.$cache.cont.find(".irs-min");
      this.$cache.max = this.$cache.cont.find(".irs-max");
      this.$cache.from = this.$cache.cont.find(".irs-from");
      this.$cache.to = this.$cache.cont.find(".irs-to");
      this.$cache.single = this.$cache.cont.find(".irs-single");
      this.$cache.bar = this.$cache.cont.find(".irs-bar");
      this.$cache.line = this.$cache.cont.find(".irs-line");
      this.$cache.grid = this.$cache.cont.find(".irs-grid");

      if (this.options.type === "single") {
        this.$cache.cont.append(single_html);
        this.$cache.edge = this.$cache.cont.find(".irs-bar-edge");
        this.$cache.s_single = this.$cache.cont.find(".single");
        this.$cache.from[0].style.visibility = "hidden";
        this.$cache.to[0].style.visibility = "hidden";
        this.$cache.shad_single = this.$cache.cont.find(".shadow-single");
      } else {
        this.$cache.cont.append(double_html);
        this.$cache.s_from = this.$cache.cont.find(".from");
        this.$cache.s_to = this.$cache.cont.find(".to");
        this.$cache.shad_from = this.$cache.cont.find(".shadow-from");
        this.$cache.shad_to = this.$cache.cont.find(".shadow-to");

        this.setTopHandler();
      }

      if (this.options.hide_from_to) {
        this.$cache.from[0].style.display = "none";
        this.$cache.to[0].style.display = "none";
        this.$cache.single[0].style.display = "none";
      }

      this.appendGrid();

      if (this.options.disable) {
        this.appendDisableMask();
        this.$cache.input[0].disabled = true;
      } else {
        this.$cache.cont.removeClass("irs-disabled");
        this.$cache.input[0].disabled = false;
        this.bindEvents();
      }

      if (this.options.drag_interval) {
        this.$cache.bar[0].style.cursor = "ew-resize";
      }
    },

    /**
     * Determine which handler has a priority
     * works only for double slider type
     */
    setTopHandler: function () {
      var min = this.options.min,
        max = this.options.max,
        from = this.options.from,
        to = this.options.to;

      if (from > min && to === max) {
        this.$cache.s_from.addClass("type_last");
      } else if (to < max) {
        this.$cache.s_to.addClass("type_last");
      }
    },

    /**
     * Determine which handles was clicked last
     * and which handler should have hover effect
     *
     * @param target {String}
     */
    changeLevel: function (target) {
      switch (target) {
        case "single":
          this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_single_fake);
          break;
        case "from":
          this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_from_fake);
          this.$cache.s_from.addClass("state_hover");
          this.$cache.s_from.addClass("type_last");
          this.$cache.s_to.removeClass("type_last");
          break;
        case "to":
          this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_to_fake);
          this.$cache.s_to.addClass("state_hover");
          this.$cache.s_to.addClass("type_last");
          this.$cache.s_from.removeClass("type_last");
          break;
        case "both":
          this.coords.p_gap_left = this.toFixed(this.coords.p_pointer - this.coords.p_from_fake);
          this.coords.p_gap_right = this.toFixed(this.coords.p_to_fake - this.coords.p_pointer);
          this.$cache.s_to.removeClass("type_last");
          this.$cache.s_from.removeClass("type_last");
          break;
      }
    },

    /**
     * Then slider is disabled
     * appends extra layer with opacity
     */
    appendDisableMask: function () {
      this.$cache.cont.append(disable_html);
      this.$cache.cont.addClass("irs-disabled");
    },

    /**
     * Remove slider instance
     * and ubind all events
     */
    remove: function () {
      this.$cache.cont.remove();
      this.$cache.cont = null;

      this.$cache.line.off("keydown.irs_" + this.plugin_count);

      this.$cache.body.off("touchmove.irs_" + this.plugin_count);
      this.$cache.body.off("mousemove.irs_" + this.plugin_count);

      this.$cache.win.off("touchend.irs_" + this.plugin_count);
      this.$cache.win.off("mouseup.irs_" + this.plugin_count);

      if (is_old_ie) {
        this.$cache.body.off("mouseup.irs_" + this.plugin_count);
        this.$cache.body.off("mouseleave.irs_" + this.plugin_count);
      }

      this.$cache.grid_labels = [];
      this.coords.big = [];
      this.coords.big_w = [];
      this.coords.big_p = [];
      this.coords.big_x = [];

      cancelAnimationFrame(this.raf_id);
    },

    /**
     * bind all slider events
     */
    bindEvents: function () {
      if (this.no_diapason) {
        return;
      }

      this.$cache.body.on("touchmove.irs_" + this.plugin_count, this.pointerMove.bind(this));
      this.$cache.body.on("mousemove.irs_" + this.plugin_count, this.pointerMove.bind(this));

      this.$cache.win.on("touchend.irs_" + this.plugin_count, this.pointerUp.bind(this));
      this.$cache.win.on("mouseup.irs_" + this.plugin_count, this.pointerUp.bind(this));

      this.$cache.line.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
      this.$cache.line.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));

      if (this.options.drag_interval && this.options.type === "double") {
        this.$cache.bar.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "both"));
        this.$cache.bar.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "both"));
      } else {
        this.$cache.bar.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
        this.$cache.bar.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
      }

      if (this.options.type === "single") {
        this.$cache.single.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "single"));
        this.$cache.s_single.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "single"));
        this.$cache.shad_single.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));

        this.$cache.single.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "single"));
        this.$cache.s_single.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "single"));
        this.$cache.edge.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
        this.$cache.shad_single.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
      } else {
        this.$cache.single.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, null));
        this.$cache.single.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, null));

        this.$cache.from.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "from"));
        this.$cache.s_from.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "from"));
        this.$cache.to.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "to"));
        this.$cache.s_to.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "to"));
        this.$cache.shad_from.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
        this.$cache.shad_to.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));

        this.$cache.from.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "from"));
        this.$cache.s_from.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "from"));
        this.$cache.to.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "to"));
        this.$cache.s_to.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "to"));
        this.$cache.shad_from.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
        this.$cache.shad_to.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
      }

      if (this.options.keyboard) {
        this.$cache.line.on("keydown.irs_" + this.plugin_count, this.key.bind(this, "keyboard"));
      }

      if (is_old_ie) {
        this.$cache.body.on("mouseup.irs_" + this.plugin_count, this.pointerUp.bind(this));
        this.$cache.body.on("mouseleave.irs_" + this.plugin_count, this.pointerUp.bind(this));
      }
    },

    /**
     * Mousemove or touchmove
     * only for handlers
     *
     * @param e {Object} event object
     */
    pointerMove: function (e) {
      if (!this.dragging) {
        return;
      }

      var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
      this.coords.x_pointer = x - this.coords.x_gap;

      this.calc();
    },

    /**
     * Mouseup or touchend
     * only for handlers
     *
     * @param e {Object} event object
     */
    pointerUp: function (e) {
      if (this.current_plugin !== this.plugin_count) {
        return;
      }

      if (this.is_active) {
        this.is_active = false;
      } else {
        return;
      }

      this.$cache.cont.find(".state_hover").removeClass("state_hover");

      this.force_redraw = true;

      if (is_old_ie) {
        $("*").prop("unselectable", false);
      }

      this.updateScene();
      this.restoreOriginalMinInterval();

      // callbacks call
      if ($.contains(this.$cache.cont[0], e.target) || this.dragging) {
        this.is_finish = true;
        this.callOnFinish();
      }

      this.dragging = false;
    },

    /**
     * Mousedown or touchstart
     * only for handlers
     *
     * @param target {String|null}
     * @param e {Object} event object
     */
    pointerDown: function (target, e) {
      e.preventDefault();
      var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
      if (e.button === 2) {
        return;
      }

      if (target === "both") {
        this.setTempMinInterval();
      }

      if (!target) {
        target = this.target;
      }

      this.current_plugin = this.plugin_count;
      this.target = target;

      this.is_active = true;
      this.dragging = true;

      this.coords.x_gap = this.$cache.rs.offset().left;
      this.coords.x_pointer = x - this.coords.x_gap;

      this.calcPointerPercent();
      this.changeLevel(target);

      if (is_old_ie) {
        $("*").prop("unselectable", true);
      }

      this.$cache.line.trigger("focus");

      this.updateScene();
    },

    /**
     * Mousedown or touchstart
     * for other slider elements, like diapason line
     *
     * @param target {String}
     * @param e {Object} event object
     */
    pointerClick: function (target, e) {
      e.preventDefault();
      var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
      if (e.button === 2) {
        return;
      }

      this.current_plugin = this.plugin_count;
      this.target = target;

      this.is_click = true;
      this.coords.x_gap = this.$cache.rs.offset().left;
      this.coords.x_pointer = +(x - this.coords.x_gap).toFixed();

      this.force_redraw = true;
      this.calc();

      this.$cache.line.trigger("focus");
    },

    /**
     * Keyborard controls for focused slider
     *
     * @param target {String}
     * @param e {Object} event object
     * @returns {boolean|undefined}
     */
    key: function (target, e) {
      if (this.current_plugin !== this.plugin_count || e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
        return;
      }

      switch (e.which) {
        case 83: // W
        case 65: // A
        case 40: // DOWN
        case 37: // LEFT
          e.preventDefault();
          this.moveByKey(false);
          break;

        case 87: // S
        case 68: // D
        case 38: // UP
        case 39: // RIGHT
          e.preventDefault();
          this.moveByKey(true);
          break;
      }

      return true;
    },

    /**
     * Move by key. Beta
     * @todo refactor than have plenty of time
     *
     * @param right {boolean} direction to move
     */
    moveByKey: function (right) {
      var p = this.coords.p_pointer;

      if (right) {
        p += this.options.keyboard_step;
      } else {
        p -= this.options.keyboard_step;
      }

      this.coords.x_pointer = this.toFixed(this.coords.w_rs / 100 * p);
      this.is_key = true;
      this.calc();
    },

    /**
     * Set visibility and content
     * of Min and Max labels
     */
    setMinMax: function () {
      if (!this.options) {
        return;
      }

      if (this.options.hide_min_max) {
        this.$cache.min[0].style.display = "none";
        this.$cache.max[0].style.display = "none";
        return;
      }

      if (this.options.values.length) {
        this.$cache.min.html(this.decorate(this.options.p_values[this.options.min]));
        this.$cache.max.html(this.decorate(this.options.p_values[this.options.max]));
      } else {
        this.$cache.min.html(this.decorate(this._prettify(this.options.min), this.options.min));
        this.$cache.max.html(this.decorate(this._prettify(this.options.max), this.options.max));
      }

      this.labels.w_min = this.$cache.min.outerWidth(false);
      this.labels.w_max = this.$cache.max.outerWidth(false);
    },

    /**
     * Then dragging interval, prevent interval collapsing
     * using min_interval option
     */
    setTempMinInterval: function () {
      var interval = this.result.to - this.result.from;

      if (this.old_min_interval === null) {
        this.old_min_interval = this.options.min_interval;
      }

      this.options.min_interval = interval;
    },

    /**
     * Restore min_interval option to original
     */
    restoreOriginalMinInterval: function () {
      if (this.old_min_interval !== null) {
        this.options.min_interval = this.old_min_interval;
        this.old_min_interval = null;
      }
    },

    // =============================================================================================================
    // Calculations
    /**
     * All calculations and measures start here
     *
     * @param update {boolean=}
     */
    calc: function (update) {
      if (!this.options) {
        return;
      }

      this.calc_count++;

      if (this.calc_count === 10 || update) {
        this.calc_count = 0;
        this.coords.w_rs = this.$cache.rs.outerWidth(false);

        this.calcHandlePercent();
      }

      if (!this.coords.w_rs) {
        return;
      }

      this.calcPointerPercent();
      var handle_x = this.getHandleX();

      if (this.target === "click") {
        this.coords.p_gap = this.coords.p_handle / 2;
        handle_x = this.getHandleX();

        if (this.options.drag_interval) {
          this.target = "both_one";
        } else {
          this.target = this.chooseHandle(handle_x);
        }
      }

      switch (this.target) {
        case "base":
          var w = (this.options.max - this.options.min) / 100,
            f = (this.result.from - this.options.min) / w,
            t = (this.result.to - this.options.min) / w;

          this.coords.p_single_real = this.toFixed(f);
          this.coords.p_from_real = this.toFixed(f);
          this.coords.p_to_real = this.toFixed(t);

          this.coords.p_single_real = this.checkDiapason(this.coords.p_single_real, this.options.from_min, this.options.from_max);
          this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
          this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);

          this.coords.p_single_fake = this.convertToFakePercent(this.coords.p_single_real);
          this.coords.p_from_fake = this.convertToFakePercent(this.coords.p_from_real);
          this.coords.p_to_fake = this.convertToFakePercent(this.coords.p_to_real);

          this.target = null;

          break;

        case "single":
          if (this.options.from_fixed) {
            break;
          }

          this.coords.p_single_real = this.convertToRealPercent(handle_x);
          this.coords.p_single_real = this.calcWithStep(this.coords.p_single_real);
          this.coords.p_single_real = this.checkDiapason(this.coords.p_single_real, this.options.from_min, this.options.from_max);

          this.coords.p_single_fake = this.convertToFakePercent(this.coords.p_single_real);

          break;

        case "from":
          if (this.options.from_fixed) {
            break;
          }

          this.coords.p_from_real = this.convertToRealPercent(handle_x);
          this.coords.p_from_real = this.calcWithStep(this.coords.p_from_real);
          if (this.coords.p_from_real > this.coords.p_to_real) {
            this.coords.p_from_real = this.coords.p_to_real;
          }
          this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
          this.coords.p_from_real = this.checkMinInterval(this.coords.p_from_real, this.coords.p_to_real, "from");
          this.coords.p_from_real = this.checkMaxInterval(this.coords.p_from_real, this.coords.p_to_real, "from");

          this.coords.p_from_fake = this.convertToFakePercent(this.coords.p_from_real);

          break;

        case "to":
          if (this.options.to_fixed) {
            break;
          }

          this.coords.p_to_real = this.convertToRealPercent(handle_x);
          this.coords.p_to_real = this.calcWithStep(this.coords.p_to_real);
          if (this.coords.p_to_real < this.coords.p_from_real) {
            this.coords.p_to_real = this.coords.p_from_real;
          }
          this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);
          this.coords.p_to_real = this.checkMinInterval(this.coords.p_to_real, this.coords.p_from_real, "to");
          this.coords.p_to_real = this.checkMaxInterval(this.coords.p_to_real, this.coords.p_from_real, "to");

          this.coords.p_to_fake = this.convertToFakePercent(this.coords.p_to_real);

          break;

        case "both":
          if (this.options.from_fixed || this.options.to_fixed) {
            break;
          }

          handle_x = this.toFixed(handle_x + (this.coords.p_handle * 0.1));

          this.coords.p_from_real = this.convertToRealPercent(handle_x) - this.coords.p_gap_left;
          this.coords.p_from_real = this.calcWithStep(this.coords.p_from_real);
          this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
          this.coords.p_from_real = this.checkMinInterval(this.coords.p_from_real, this.coords.p_to_real, "from");
          this.coords.p_from_fake = this.convertToFakePercent(this.coords.p_from_real);

          this.coords.p_to_real = this.convertToRealPercent(handle_x) + this.coords.p_gap_right;
          this.coords.p_to_real = this.calcWithStep(this.coords.p_to_real);
          this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);
          this.coords.p_to_real = this.checkMinInterval(this.coords.p_to_real, this.coords.p_from_real, "to");
          this.coords.p_to_fake = this.convertToFakePercent(this.coords.p_to_real);

          break;

        case "both_one":
          if (this.options.from_fixed || this.options.to_fixed) {
            break;
          }

          var real_x = this.convertToRealPercent(handle_x),
            from = this.result.from_percent,
            to = this.result.to_percent,
            full = to - from,
            half = full / 2,
            new_from = real_x - half,
            new_to = real_x + half;

          if (new_from < 0) {
            new_from = 0;
            new_to = new_from + full;
          }

          if (new_to > 100) {
            new_to = 100;
            new_from = new_to - full;
          }

          this.coords.p_from_real = this.calcWithStep(new_from);
          this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
          this.coords.p_from_fake = this.convertToFakePercent(this.coords.p_from_real);

          this.coords.p_to_real = this.calcWithStep(new_to);
          this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);
          this.coords.p_to_fake = this.convertToFakePercent(this.coords.p_to_real);

          break;
      }

      if (this.options.type === "single") {
        this.coords.p_bar_x = (this.coords.p_handle / 2);
        this.coords.p_bar_w = this.coords.p_single_fake;

        this.result.from_percent = this.coords.p_single_real;
        this.result.from = this.convertToValue(this.coords.p_single_real);

        if (this.options.values.length) {
          this.result.from_value = this.options.values[this.result.from];
        }
      } else {
        this.coords.p_bar_x = this.toFixed(this.coords.p_from_fake + (this.coords.p_handle / 2));
        this.coords.p_bar_w = this.toFixed(this.coords.p_to_fake - this.coords.p_from_fake);

        this.result.from_percent = this.coords.p_from_real;
        this.result.from = this.convertToValue(this.coords.p_from_real);
        this.result.to_percent = this.coords.p_to_real;
        this.result.to = this.convertToValue(this.coords.p_to_real);

        if (this.options.values.length) {
          this.result.from_value = this.options.values[this.result.from];
          this.result.to_value = this.options.values[this.result.to];
        }
      }

      this.calcMinMax();
      this.calcLabels();
    },

    /**
     * calculates pointer X in percent
     */
    calcPointerPercent: function () {
      if (!this.coords.w_rs) {
        this.coords.p_pointer = 0;
        return;
      }

      if (this.coords.x_pointer < 0 || isNaN(this.coords.x_pointer)  ) {
        this.coords.x_pointer = 0;
      } else if (this.coords.x_pointer > this.coords.w_rs) {
        this.coords.x_pointer = this.coords.w_rs;
      }

      this.coords.p_pointer = this.toFixed(this.coords.x_pointer / this.coords.w_rs * 100);
    },

    convertToRealPercent: function (fake) {
      var full = 100 - this.coords.p_handle;
      return fake / full * 100;
    },

    convertToFakePercent: function (real) {
      var full = 100 - this.coords.p_handle;
      return real / 100 * full;
    },

    getHandleX: function () {
      var max = 100 - this.coords.p_handle,
        x = this.toFixed(this.coords.p_pointer - this.coords.p_gap);

      if (x < 0) {
        x = 0;
      } else if (x > max) {
        x = max;
      }

      return x;
    },

    calcHandlePercent: function () {
      if (this.options.type === "single") {
        this.coords.w_handle = this.$cache.s_single.outerWidth(false);
      } else {
        this.coords.w_handle = this.$cache.s_from.outerWidth(false);
      }

      this.coords.p_handle = this.toFixed(this.coords.w_handle / this.coords.w_rs * 100);
    },

    /**
     * Find closest handle to pointer click
     *
     * @param real_x {Number}
     * @returns {String}
     */
    chooseHandle: function (real_x) {
      if (this.options.type === "single") {
        return "single";
      } else {
        var m_point = this.coords.p_from_real + ((this.coords.p_to_real - this.coords.p_from_real) / 2);
        if (real_x >= m_point) {
          return this.options.to_fixed ? "from" : "to";
        } else {
          return this.options.from_fixed ? "to" : "from";
        }
      }
    },

    /**
     * Measure Min and Max labels width in percent
     */
    calcMinMax: function () {
      if (!this.coords.w_rs) {
        return;
      }

      this.labels.p_min = this.labels.w_min / this.coords.w_rs * 100;
      this.labels.p_max = this.labels.w_max / this.coords.w_rs * 100;
    },

    /**
     * Measure labels width and X in percent
     */
    calcLabels: function () {
      if (!this.coords.w_rs || this.options.hide_from_to) {
        return;
      }

      if (this.options.type === "single") {

        this.labels.w_single = this.$cache.single.outerWidth(false);
        this.labels.p_single_fake = this.labels.w_single / this.coords.w_rs * 100;
        this.labels.p_single_left = this.coords.p_single_fake + (this.coords.p_handle / 2) - (this.labels.p_single_fake / 2);
        this.labels.p_single_left = this.checkEdges(this.labels.p_single_left, this.labels.p_single_fake);

      } else {

        this.labels.w_from = this.$cache.from.outerWidth(false);
        this.labels.p_from_fake = this.labels.w_from / this.coords.w_rs * 100;
        this.labels.p_from_left = this.coords.p_from_fake + (this.coords.p_handle / 2) - (this.labels.p_from_fake / 2);
        this.labels.p_from_left = this.toFixed(this.labels.p_from_left);
        this.labels.p_from_left = this.checkEdges(this.labels.p_from_left, this.labels.p_from_fake);

        this.labels.w_to = this.$cache.to.outerWidth(false);
        this.labels.p_to_fake = this.labels.w_to / this.coords.w_rs * 100;
        this.labels.p_to_left = this.coords.p_to_fake + (this.coords.p_handle / 2) - (this.labels.p_to_fake / 2);
        this.labels.p_to_left = this.toFixed(this.labels.p_to_left);
        this.labels.p_to_left = this.checkEdges(this.labels.p_to_left, this.labels.p_to_fake);

        this.labels.w_single = this.$cache.single.outerWidth(false);
        this.labels.p_single_fake = this.labels.w_single / this.coords.w_rs * 100;
        this.labels.p_single_left = ((this.labels.p_from_left + this.labels.p_to_left + this.labels.p_to_fake) / 2) - (this.labels.p_single_fake / 2);
        this.labels.p_single_left = this.toFixed(this.labels.p_single_left);
        this.labels.p_single_left = this.checkEdges(this.labels.p_single_left, this.labels.p_single_fake);

      }
    },



    // =============================================================================================================
    // Drawings

    /**
     * Main function called in request animation frame
     * to update everything
     */
    updateScene: function () {
      if (this.raf_id) {
        cancelAnimationFrame(this.raf_id);
        this.raf_id = null;
      }

      clearTimeout(this.update_tm);
      this.update_tm = null;

      if (!this.options) {
        return;
      }

      this.drawHandles();

      if (this.is_active) {
        this.raf_id = requestAnimationFrame(this.updateScene.bind(this));
      } else {
        this.update_tm = setTimeout(this.updateScene.bind(this), 300);
      }
    },

    /**
     * Draw handles
     */
    drawHandles: function () {
      this.coords.w_rs = this.$cache.rs.outerWidth(false);

      if (!this.coords.w_rs) {
        return;
      }

      if (this.coords.w_rs !== this.coords.w_rs_old) {
        this.target = "base";
        this.is_resize = true;
      }

      if (this.coords.w_rs !== this.coords.w_rs_old || this.force_redraw) {
        this.setMinMax();
        this.calc(true);
        this.drawLabels();
        if (this.options.grid) {
          this.calcGridMargin();
          this.calcGridLabels();
        }
        this.force_redraw = true;
        this.coords.w_rs_old = this.coords.w_rs;
        this.drawShadow();
      }

      if (!this.coords.w_rs) {
        return;
      }

      if (!this.dragging && !this.force_redraw && !this.is_key) {
        return;
      }

      if (this.old_from !== this.result.from || this.old_to !== this.result.to || this.force_redraw || this.is_key) {

        this.drawLabels();

        this.$cache.bar[0].style.left = this.coords.p_bar_x + "%";
        this.$cache.bar[0].style.width = this.coords.p_bar_w + "%";

        if (this.options.type === "single") {
          this.$cache.s_single[0].style.left = this.coords.p_single_fake + "%";

          this.$cache.single[0].style.left = this.labels.p_single_left + "%";

          if (this.options.values.length) {
            this.$cache.input.prop("value", this.result.from_value);
          } else {
            this.$cache.input.prop("value", this.result.from);
          }
          this.$cache.input.data("from", this.result.from);
        } else {
          this.$cache.s_from[0].style.left = this.coords.p_from_fake + "%";
          this.$cache.s_to[0].style.left = this.coords.p_to_fake + "%";

          if (this.old_from !== this.result.from || this.force_redraw) {
            this.$cache.from[0].style.left = this.labels.p_from_left + "%";
          }
          if (this.old_to !== this.result.to || this.force_redraw) {
            this.$cache.to[0].style.left = this.labels.p_to_left + "%";
          }

          this.$cache.single[0].style.left = this.labels.p_single_left + "%";

          if (this.options.values.length) {
            this.$cache.input.prop("value", this.result.from_value + this.options.input_values_separator + this.result.to_value);
          } else {
            this.$cache.input.prop("value", this.result.from + this.options.input_values_separator + this.result.to);
          }
          this.$cache.input.data("from", this.result.from);
          this.$cache.input.data("to", this.result.to);
        }

        if ((this.old_from !== this.result.from || this.old_to !== this.result.to) && !this.is_start) {
          this.$cache.input.trigger("change");
        }

        this.old_from = this.result.from;
        this.old_to = this.result.to;

        // callbacks call
        if (!this.is_resize && !this.is_update && !this.is_start && !this.is_finish) {
          this.callOnChange();
        }
        if (this.is_key || this.is_click) {
          this.is_key = false;
          this.is_click = false;
          this.callOnFinish();
        }

        this.is_update = false;
        this.is_resize = false;
        this.is_finish = false;
      }

      this.is_start = false;
      this.is_key = false;
      this.is_click = false;
      this.force_redraw = false;
    },

    /**
     * Draw labels
     * measure labels collisions
     * collapse close labels
     */
    drawLabels: function () {
      if (!this.options) {
        return;
      }

      var values_num = this.options.values.length,
        p_values = this.options.p_values,
        text_single,
        text_from,
        text_to;

      if (this.options.hide_from_to) {
        return;
      }

      if (this.options.type === "single") {

        if (values_num) {
          text_single = this.decorate(p_values[this.result.from]);
          this.$cache.single.html(text_single);
        } else {
          text_single = this.decorate(this._prettify(this.result.from), this.result.from);
          this.$cache.single.html(text_single);
        }

        this.calcLabels();

        if (this.labels.p_single_left < this.labels.p_min + 1) {
          this.$cache.min[0].style.visibility = "hidden";
        } else {
          this.$cache.min[0].style.visibility = "visible";
        }

        if (this.labels.p_single_left + this.labels.p_single_fake > 100 - this.labels.p_max - 1) {
          this.$cache.max[0].style.visibility = "hidden";
        } else {
          this.$cache.max[0].style.visibility = "visible";
        }

      } else {

        if (values_num) {

          if (this.options.decorate_both) {
            text_single = this.decorate(p_values[this.result.from]);
            text_single += this.options.values_separator;
            text_single += this.decorate(p_values[this.result.to]);
          } else {
            text_single = this.decorate(p_values[this.result.from] + this.options.values_separator + p_values[this.result.to]);
          }
          text_from = this.decorate(p_values[this.result.from]);
          text_to = this.decorate(p_values[this.result.to]);

          this.$cache.single.html(text_single);
          this.$cache.from.html(text_from);
          this.$cache.to.html(text_to);

        } else {

          if (this.options.decorate_both) {
            text_single = this.decorate(this._prettify(this.result.from), this.result.from);
            text_single += this.options.values_separator;
            text_single += this.decorate(this._prettify(this.result.to), this.result.to);
          } else {
            text_single = this.decorate(this._prettify(this.result.from) + this.options.values_separator + this._prettify(this.result.to), this.result.to);
          }
          text_from = this.decorate(this._prettify(this.result.from), this.result.from);
          text_to = this.decorate(this._prettify(this.result.to), this.result.to);

          this.$cache.single.html(text_single);
          this.$cache.from.html(text_from);
          this.$cache.to.html(text_to);

        }

        this.calcLabels();

        var min = Math.min(this.labels.p_single_left, this.labels.p_from_left),
          single_left = this.labels.p_single_left + this.labels.p_single_fake,
          to_left = this.labels.p_to_left + this.labels.p_to_fake,
          max = Math.max(single_left, to_left);

        if (this.labels.p_from_left + this.labels.p_from_fake >= this.labels.p_to_left) {
          this.$cache.from[0].style.visibility = "hidden";
          this.$cache.to[0].style.visibility = "hidden";
          this.$cache.single[0].style.visibility = "visible";

          if (this.result.from === this.result.to) {
            if (this.target === "from") {
              this.$cache.from[0].style.visibility = "visible";
            } else if (this.target === "to") {
              this.$cache.to[0].style.visibility = "visible";
            } else if (!this.target) {
              this.$cache.from[0].style.visibility = "visible";
            }
            this.$cache.single[0].style.visibility = "hidden";
            max = to_left;
          } else {
            this.$cache.from[0].style.visibility = "hidden";
            this.$cache.to[0].style.visibility = "hidden";
            this.$cache.single[0].style.visibility = "visible";
            max = Math.max(single_left, to_left);
          }
        } else {
          this.$cache.from[0].style.visibility = "visible";
          this.$cache.to[0].style.visibility = "visible";
          this.$cache.single[0].style.visibility = "hidden";
        }

        if (min < this.labels.p_min + 1) {
          this.$cache.min[0].style.visibility = "hidden";
        } else {
          this.$cache.min[0].style.visibility = "visible";
        }

        if (max > 100 - this.labels.p_max - 1) {
          this.$cache.max[0].style.visibility = "hidden";
        } else {
          this.$cache.max[0].style.visibility = "visible";
        }

      }
    },

    /**
     * Draw shadow intervals
     */
    drawShadow: function () {
      var o = this.options,
        c = this.$cache,

        is_from_min = typeof o.from_min === "number" && !isNaN(o.from_min),
        is_from_max = typeof o.from_max === "number" && !isNaN(o.from_max),
        is_to_min = typeof o.to_min === "number" && !isNaN(o.to_min),
        is_to_max = typeof o.to_max === "number" && !isNaN(o.to_max),

        from_min,
        from_max,
        to_min,
        to_max;

      if (o.type === "single") {
        if (o.from_shadow && (is_from_min || is_from_max)) {
          from_min = this.convertToPercent(is_from_min ? o.from_min : o.min);
          from_max = this.convertToPercent(is_from_max ? o.from_max : o.max) - from_min;
          from_min = this.toFixed(from_min - (this.coords.p_handle / 100 * from_min));
          from_max = this.toFixed(from_max - (this.coords.p_handle / 100 * from_max));
          from_min = from_min + (this.coords.p_handle / 2);

          c.shad_single[0].style.display = "block";
          c.shad_single[0].style.left = from_min + "%";
          c.shad_single[0].style.width = from_max + "%";
        } else {
          c.shad_single[0].style.display = "none";
        }
      } else {
        if (o.from_shadow && (is_from_min || is_from_max)) {
          from_min = this.convertToPercent(is_from_min ? o.from_min : o.min);
          from_max = this.convertToPercent(is_from_max ? o.from_max : o.max) - from_min;
          from_min = this.toFixed(from_min - (this.coords.p_handle / 100 * from_min));
          from_max = this.toFixed(from_max - (this.coords.p_handle / 100 * from_max));
          from_min = from_min + (this.coords.p_handle / 2);

          c.shad_from[0].style.display = "block";
          c.shad_from[0].style.left = from_min + "%";
          c.shad_from[0].style.width = from_max + "%";
        } else {
          c.shad_from[0].style.display = "none";
        }

        if (o.to_shadow && (is_to_min || is_to_max)) {
          to_min = this.convertToPercent(is_to_min ? o.to_min : o.min);
          to_max = this.convertToPercent(is_to_max ? o.to_max : o.max) - to_min;
          to_min = this.toFixed(to_min - (this.coords.p_handle / 100 * to_min));
          to_max = this.toFixed(to_max - (this.coords.p_handle / 100 * to_max));
          to_min = to_min + (this.coords.p_handle / 2);

          c.shad_to[0].style.display = "block";
          c.shad_to[0].style.left = to_min + "%";
          c.shad_to[0].style.width = to_max + "%";
        } else {
          c.shad_to[0].style.display = "none";
        }
      }
    },



    // =============================================================================================================
    // Callbacks

    callOnStart: function () {
      if (this.options.onStart && typeof this.options.onStart === "function") {
        this.options.onStart(this.result);
      }
    },
    callOnChange: function () {
      if (this.options.onChange && typeof this.options.onChange === "function") {
        this.options.onChange(this.result);
      }
    },
    callOnFinish: function () {
      if (this.options.onFinish && typeof this.options.onFinish === "function") {
        this.options.onFinish(this.result);
      }
    },
    callOnUpdate: function () {
      if (this.options.onUpdate && typeof this.options.onUpdate === "function") {
        this.options.onUpdate(this.result);
      }
    },



    // =============================================================================================================
    // Service methods

    toggleInput: function () {
      this.$cache.input.toggleClass("irs-hidden-input");
    },

    /**
     * Convert real value to percent
     *
     * @param value {Number} X in real
     * @param no_min {boolean=} don't use min value
     * @returns {Number} X in percent
     */
    convertToPercent: function (value, no_min) {
      var diapason = this.options.max - this.options.min,
        one_percent = diapason / 100,
        val, percent;

      if (!diapason) {
        this.no_diapason = true;
        return 0;
      }

      if (no_min) {
        val = value;
      } else {
        val = value - this.options.min;
      }

      percent = val / one_percent;

      return this.toFixed(percent);
    },

    /**
     * Convert percent to real values
     *
     * @param percent {Number} X in percent
     * @returns {Number} X in real
     */
    convertToValue: function (percent) {
      var min = this.options.min,
        max = this.options.max,
        min_decimals = min.toString().split(".")[1],
        max_decimals = max.toString().split(".")[1],
        min_length, max_length,
        avg_decimals = 0,
        abs = 0;

      if (percent === 0) {
        return this.options.min;
      }
      if (percent === 100) {
        return this.options.max;
      }


      if (min_decimals) {
        min_length = min_decimals.length;
        avg_decimals = min_length;
      }
      if (max_decimals) {
        max_length = max_decimals.length;
        avg_decimals = max_length;
      }
      if (min_length && max_length) {
        avg_decimals = (min_length >= max_length) ? min_length : max_length;
      }

      if (min < 0) {
        abs = Math.abs(min);
        min = +(min + abs).toFixed(avg_decimals);
        max = +(max + abs).toFixed(avg_decimals);
      }

      var number = ((max - min) / 100 * percent) + min,
        string = this.options.step.toString().split(".")[1],
        result;

      if (string) {
        number = +number.toFixed(string.length);
      } else {
        number = number / this.options.step;
        number = number * this.options.step;

        number = +number.toFixed(0);
      }

      if (abs) {
        number -= abs;
      }

      if (string) {
        result = +number.toFixed(string.length);
      } else {
        result = this.toFixed(number);
      }

      if (result < this.options.min) {
        result = this.options.min;
      } else if (result > this.options.max) {
        result = this.options.max;
      }

      return result;
    },

    /**
     * Round percent value with step
     *
     * @param percent {Number}
     * @returns percent {Number} rounded
     */
    calcWithStep: function (percent) {
      var rounded = Math.round(percent / this.coords.p_step) * this.coords.p_step;

      if (rounded > 100) {
        rounded = 100;
      }
      if (percent === 100) {
        rounded = 100;
      }

      return this.toFixed(rounded);
    },

    checkMinInterval: function (p_current, p_next, type) {
      var o = this.options,
        current,
        next;

      if (!o.min_interval) {
        return p_current;
      }

      current = this.convertToValue(p_current);
      next = this.convertToValue(p_next);

      if (type === "from") {

        if (next - current < o.min_interval) {
          current = next - o.min_interval;
        }

      } else {

        if (current - next < o.min_interval) {
          current = next + o.min_interval;
        }

      }

      return this.convertToPercent(current);
    },

    checkMaxInterval: function (p_current, p_next, type) {
      var o = this.options,
        current,
        next;

      if (!o.max_interval) {
        return p_current;
      }

      current = this.convertToValue(p_current);
      next = this.convertToValue(p_next);

      if (type === "from") {

        if (next - current > o.max_interval) {
          current = next - o.max_interval;
        }

      } else {

        if (current - next > o.max_interval) {
          current = next + o.max_interval;
        }

      }

      return this.convertToPercent(current);
    },

    checkDiapason: function (p_num, min, max) {
      var num = this.convertToValue(p_num),
        o = this.options;

      if (typeof min !== "number") {
        min = o.min;
      }

      if (typeof max !== "number") {
        max = o.max;
      }

      if (num < min) {
        num = min;
      }

      if (num > max) {
        num = max;
      }

      return this.convertToPercent(num);
    },

    toFixed: function (num) {
      num = num.toFixed(9);
      return +num;
    },

    _prettify: function (num) {
      if (!this.options.prettify_enabled) {
        return num;
      }

      if (this.options.prettify && typeof this.options.prettify === "function") {
        return this.options.prettify(num);
      } else {
        return this.prettify(num);
      }
    },

    prettify: function (num) {
      var n = num.toString();
      return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + this.options.prettify_separator);
    },

    checkEdges: function (left, width) {
      if (!this.options.force_edges) {
        return this.toFixed(left);
      }

      if (left < 0) {
        left = 0;
      } else if (left > 100 - width) {
        left = 100 - width;
      }

      return this.toFixed(left);
    },

    validate: function () {
      var o = this.options,
        r = this.result,
        v = o.values,
        vl = v.length,
        value,
        i;

      if (typeof o.min === "string") o.min = +o.min;
      if (typeof o.max === "string") o.max = +o.max;
      if (typeof o.from === "string") o.from = +o.from;
      if (typeof o.to === "string") o.to = +o.to;
      if (typeof o.step === "string") o.step = +o.step;

      if (typeof o.from_min === "string") o.from_min = +o.from_min;
      if (typeof o.from_max === "string") o.from_max = +o.from_max;
      if (typeof o.to_min === "string") o.to_min = +o.to_min;
      if (typeof o.to_max === "string") o.to_max = +o.to_max;

      if (typeof o.keyboard_step === "string") o.keyboard_step = +o.keyboard_step;
      if (typeof o.grid_num === "string") o.grid_num = +o.grid_num;

      if (o.max < o.min) {
        o.max = o.min;
      }

      if (vl) {
        o.p_values = [];
        o.min = 0;
        o.max = vl - 1;
        o.step = 1;
        o.grid_num = o.max;
        o.grid_snap = true;


        for (i = 0; i < vl; i++) {
          value = +v[i];

          if (!isNaN(value)) {
            v[i] = value;
            value = this._prettify(value);
          } else {
            value = v[i];
          }

          o.p_values.push(value);
        }
      }

      if (typeof o.from !== "number" || isNaN(o.from)) {
        o.from = o.min;
      }

      if (typeof o.to !== "number" || isNaN(o.from)) {
        o.to = o.max;
      }

      if (o.type === "single") {

        if (o.from < o.min) {
          o.from = o.min;
        }

        if (o.from > o.max) {
          o.from = o.max;
        }

      } else {

        if (o.from < o.min || o.from > o.max) {
          o.from = o.min;
        }
        if (o.to > o.max || o.to < o.min) {
          o.to = o.max;
        }
        if (o.from > o.to) {
          o.from = o.to;
        }

      }

      if (typeof o.step !== "number" || isNaN(o.step) || !o.step || o.step < 0) {
        o.step = 1;
      }

      if (typeof o.keyboard_step !== "number" || isNaN(o.keyboard_step) || !o.keyboard_step || o.keyboard_step < 0) {
        o.keyboard_step = 5;
      }

      if (typeof o.from_min === "number" && o.from < o.from_min) {
        o.from = o.from_min;
      }

      if (typeof o.from_max === "number" && o.from > o.from_max) {
        o.from = o.from_max;
      }

      if (typeof o.to_min === "number" && o.to < o.to_min) {
        o.to = o.to_min;
      }

      if (typeof o.to_max === "number" && o.from > o.to_max) {
        o.to = o.to_max;
      }

      if (r) {
        if (r.min !== o.min) {
          r.min = o.min;
        }

        if (r.max !== o.max) {
          r.max = o.max;
        }

        if (r.from < r.min || r.from > r.max) {
          r.from = o.from;
        }

        if (r.to < r.min || r.to > r.max) {
          r.to = o.to;
        }
      }

      if (typeof o.min_interval !== "number" || isNaN(o.min_interval) || !o.min_interval || o.min_interval < 0) {
        o.min_interval = 0;
      }

      if (typeof o.max_interval !== "number" || isNaN(o.max_interval) || !o.max_interval || o.max_interval < 0) {
        o.max_interval = 0;
      }

      if (o.min_interval && o.min_interval > o.max - o.min) {
        o.min_interval = o.max - o.min;
      }

      if (o.max_interval && o.max_interval > o.max - o.min) {
        o.max_interval = o.max - o.min;
      }
    },

    decorate: function (num, original) {
      var decorated = "",
        o = this.options;

      if (o.prefix) {
        decorated += o.prefix;
      }

      decorated += num;

      if (o.max_postfix) {
        if (o.values.length && num === o.p_values[o.max]) {
          decorated += o.max_postfix;
          if (o.postfix) {
            decorated += " ";
          }
        } else if (original === o.max) {
          decorated += o.max_postfix;
          if (o.postfix) {
            decorated += " ";
          }
        }
      }

      if (o.postfix) {
        decorated += o.postfix;
      }

      return decorated;
    },

    updateFrom: function () {
      this.result.from = this.options.from;
      this.result.from_percent = this.convertToPercent(this.result.from);
      if (this.options.values) {
        this.result.from_value = this.options.values[this.result.from];
      }
    },

    updateTo: function () {
      this.result.to = this.options.to;
      this.result.to_percent = this.convertToPercent(this.result.to);
      if (this.options.values) {
        this.result.to_value = this.options.values[this.result.to];
      }
    },

    updateResult: function () {
      this.result.min = this.options.min;
      this.result.max = this.options.max;
      this.updateFrom();
      this.updateTo();
    },


    // =============================================================================================================
    // Grid

    appendGrid: function () {
      if (!this.options.grid) {
        return;
      }

      var o = this.options,
        i, z,

        total = o.max - o.min,
        big_num = o.grid_num,
        big_p = 0,
        big_w = 0,

        small_max = 4,
        local_small_max,
        small_p,
        small_w = 0,

        result,
        html = '';



      this.calcGridMargin();

      if (o.grid_snap) {
        big_num = total / o.step;
        big_p = this.toFixed(o.step / (total / 100));
      } else {
        big_p = this.toFixed(100 / big_num);
      }

      if (big_num > 4) {
        small_max = 3;
      }
      if (big_num > 7) {
        small_max = 2;
      }
      if (big_num > 14) {
        small_max = 1;
      }
      if (big_num > 28) {
        small_max = 0;
      }

      for (i = 0; i < big_num + 1; i++) {
        local_small_max = small_max;

        big_w = this.toFixed(big_p * i);

        if (big_w > 100) {
          big_w = 100;

          local_small_max -= 2;
          if (local_small_max < 0) {
            local_small_max = 0;
          }
        }
        this.coords.big[i] = big_w;

        small_p = (big_w - (big_p * (i - 1))) / (local_small_max + 1);

        for (z = 1; z <= local_small_max; z++) {
          if (big_w === 0) {
            break;
          }

          small_w = this.toFixed(big_w - (small_p * z));

          html += '<span class="irs-grid-pol small" style="left: ' + small_w + '%"></span>';
        }

        html += '<span class="irs-grid-pol" style="left: ' + big_w + '%"></span>';

        result = this.convertToValue(big_w);
        if (o.values.length) {
          result = o.p_values[result];
        } else {
          result = this._prettify(result);
        }

        html += '<span class="irs-grid-text js-grid-text-' + i + '" style="left: ' + big_w + '%">' + result + '</span>';
      }
      this.coords.big_num = Math.ceil(big_num + 1);



      this.$cache.cont.addClass("irs-with-grid");
      this.$cache.grid.html(html);
      this.cacheGridLabels();
    },

    cacheGridLabels: function () {
      var $label, i,
        num = this.coords.big_num;

      for (i = 0; i < num; i++) {
        $label = this.$cache.grid.find(".js-grid-text-" + i);
        this.$cache.grid_labels.push($label);
      }

      this.calcGridLabels();
    },

    calcGridLabels: function () {
      var i, label, start = [], finish = [],
        num = this.coords.big_num;

      for (i = 0; i < num; i++) {
        this.coords.big_w[i] = this.$cache.grid_labels[i].outerWidth(false);
        this.coords.big_p[i] = this.toFixed(this.coords.big_w[i] / this.coords.w_rs * 100);
        this.coords.big_x[i] = this.toFixed(this.coords.big_p[i] / 2);

        start[i] = this.toFixed(this.coords.big[i] - this.coords.big_x[i]);
        finish[i] = this.toFixed(start[i] + this.coords.big_p[i]);
      }

      if (this.options.force_edges) {
        if (start[0] < -this.coords.grid_gap) {
          start[0] = -this.coords.grid_gap;
          finish[0] = this.toFixed(start[0] + this.coords.big_p[0]);

          this.coords.big_x[0] = this.coords.grid_gap;
        }

        if (finish[num - 1] > 100 + this.coords.grid_gap) {
          finish[num - 1] = 100 + this.coords.grid_gap;
          start[num - 1] = this.toFixed(finish[num - 1] - this.coords.big_p[num - 1]);

          this.coords.big_x[num - 1] = this.toFixed(this.coords.big_p[num - 1] - this.coords.grid_gap);
        }
      }

      this.calcGridCollision(2, start, finish);
      this.calcGridCollision(4, start, finish);

      for (i = 0; i < num; i++) {
        label = this.$cache.grid_labels[i][0];
        label.style.marginLeft = -this.coords.big_x[i] + "%";
      }
    },

    // Collisions Calc Beta
    // TODO: Refactor then have plenty of time
    calcGridCollision: function (step, start, finish) {
      var i, next_i, label,
        num = this.coords.big_num;

      for (i = 0; i < num; i += step) {
        next_i = i + (step / 2);
        if (next_i >= num) {
          break;
        }

        label = this.$cache.grid_labels[next_i][0];

        if (finish[i] <= start[next_i]) {
          label.style.visibility = "visible";
        } else {
          label.style.visibility = "hidden";
        }
      }
    },

    calcGridMargin: function () {
      if (!this.options.grid_margin) {
        return;
      }

      this.coords.w_rs = this.$cache.rs.outerWidth(false);
      if (!this.coords.w_rs) {
        return;
      }

      if (this.options.type === "single") {
        this.coords.w_handle = this.$cache.s_single.outerWidth(false);
      } else {
        this.coords.w_handle = this.$cache.s_from.outerWidth(false);
      }
      this.coords.p_handle = this.toFixed(this.coords.w_handle  / this.coords.w_rs * 100);
      this.coords.grid_gap = this.toFixed((this.coords.p_handle / 2) - 0.1);

      this.$cache.grid[0].style.width = this.toFixed(100 - this.coords.p_handle) + "%";
      this.$cache.grid[0].style.left = this.coords.grid_gap + "%";
    },



    // =============================================================================================================
    // Public methods

    update: function (options) {
      if (!this.input) {
        return;
      }

      this.is_update = true;

      this.options.from = this.result.from;
      this.options.to = this.result.to;

      this.options = $.extend(this.options, options);
      this.validate();
      this.updateResult(options);

      this.toggleInput();
      this.remove();
      this.init(true);
    },

    reset: function () {
      if (!this.input) {
        return;
      }

      this.updateResult();
      this.update();
    },

    destroy: function () {
      if (!this.input) {
        return;
      }

      this.toggleInput();
      this.$cache.input.prop("readonly", false);
      $.data(this.input, "ionRangeSlider", null);

      this.remove();
      this.input = null;
      this.options = null;
    }
  };

  $.fn.ionRangeSlider = function (options) {
    return this.each(function() {
      if (!$.data(this, "ionRangeSlider")) {
        $.data(this, "ionRangeSlider", new IonRangeSlider(this, options, plugin_count++));
      }
    });
  };

  // =================================================================================================================
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  // MIT license

  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
        || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
  }());

}));


(function () {
  /**
   * 书本类
   * @param data
   * @constructor
   */
  var FB = function (data) {
    // 当前页
    this.currentPageIndex = 0;

    // 总页数
    this.allPageCount = 0;
    data.width = data.width*data.ratioWidth;
    data.height = data.height*data.ratioHeight;
    // 参数设置
    this._bookData = data;

    // 书页
    this.pageList = [];

    this.isAutoZoom = false;

    this.zoomScale = 1;

    for(var i=0; i<1;i++){
      this.initTemplate(i);
    }
    this.initSilider();
    this.init();

    // 触屏区域
    this.touchRectSize = new FB.Size(this.width / 4, this.height / 4);
  };
  /**
   * 坐标类
   * @param x
   * @param y
   * @returns {{x: *, y: *}}
   * @constructor
   */
  FB.Point = function (x, y) {
    return {
      x: x,
      y: y
    }
  };

  /**
   * Size大小类
   * @param w
   * @param h
   * @returns {{width: *, height: *}}
   * @constructor
   */
  FB.Size = function (w, h) {
    return {
      width: w,
      height: h
    };
  };

  /**
   * 触屏区域
   * @type {{LeftTop: number, LeftBottom: number, RightTop: number, RightBottom: number}}
   */
  FB.TouchPostion = {
    LeftTop: 0,
    LeftBottom: 1,
    RightTop: 2,
    RightBottom: 3
  };

  var transformName = "transform";
  var transformNameMs = "-ms-transform";
  var transformNameMoz = "-moz-transform";
  var transformNameWebkit = "-webkit-transform";
  var transformNameO = "-o-transform";
  var vendor;

  /**
   * 初始化书本
   * @param obj
   */
  FB.prototype.init = function (obj) {

    obj = obj || this._bookData;
    this._bookData = obj;
    if (!this._bookData) {
      this._bookData = obj;
    }

    // 书页宽度
    this.width = obj.width;

    // 书页高度
    this.height = obj.height;
    this.startIndex = obj.startIndex;
    //编辑链接地址
    this.editUrl = obj.editUrl;
    //缩放宽
    this.ratioWidth = obj.ratioWidth || 1;
    //缩放高
    this.ratioHeight = obj.ratioHeight || 1;
    vendor = this.getPrefix();
    obj.zoomScale && (this.zoomScale = obj.zoomScale);

    this._isSinglePage = obj.isSinglePage;

    this.startKeyboard = obj.startKeyboard;

    var container = $(obj.container);
    this.container = container;
    var children = container.children();
    this.OriginChildren = children;

    // 如果是自动单页
    if (this._isSinglePage == 'auto' && this.isSinglePage()) {
      this.autoZoom();
    }

    //this._onPageFlipStart = obj.onPageFlipStart;
    this._onFlipEndPage = obj.onFlipEndPage;
    //this._onPageMissing = obj.onPageMissing;
    this._onInitComplete = obj.onInitComplete;

    var cPaddingY = this.isAutoZoom ? (window.innerHeight - this.height) / 2 : (this.getBigRectWidth() - this.height);
    //container.width(this.width * (this.isSinglePage() ? 1 : 2)).css('overflow', 'hidden').css('padding', cPaddingY + 'px 0px');
    container.width(this.width * (this.isSinglePage() ? 1 : 2));

    this.fbStage = $('<div class="FBStage"></div>');
    var fbStage = this.fbStage;
    fbStage.width(this.width * (this.isSinglePage() ? 1 : 2)).height(this.height);

    var target = this;

    this.allPageCount = obj.allPageCount;
    children.each(function (index, item) {
      target.addPage.call(target, item);
    });

    if (this.isSinglePage()) {
      var blankPage = $('<div class="FBBlankPage"></div>').width(obj.width).height(obj.height);
      this._BlankPage = this.generatePage(blankPage);
      this.fbStage.append(this._BlankPage);
    }

    // 阴影
    this._pageShadow = $('<div class="FBPageShadow"></div>');
    this._pageShadow.width(this.width * (this.isSinglePage() ? 1 : 2)).height(this.height);
    fbStage.append(this._pageShadow);
    this.pageList[this.currentPageIndex].css('z-index', 9);
    container.append(fbStage);

    this.initEvent();

    this._onInitComplete && this._onInitComplete.call(this);
  };

  /**
   * 自动缩放以适应屏幕
   */
  FB.prototype.autoZoom = function () {
    var xPercent = window.innerWidth / this.width,
      yPercent = window.innerHeight / this.height;
    this.width *= xPercent;
    this.height *= xPercent;
    console.log('this.width',document.documentElement.clientWidth);
    this.OriginChildren.each(function () {
      $(this).css('transform-origin', 'center center 0px').css('transform', 'scale(' + xPercent + ')');
      $(this).css('-webkit-transform-origin', 'center center 0px').css('-webkit-transform', 'scale(' + xPercent + ')');
      $(this).css('-ms-transform-origin', 'center center 0px').css('-ms-transform', 'scale(' + xPercent + ')');
      $(this).css('-moz-transform-origin', 'center center 0px').css('-moz-transform', 'scale(' + xPercent + ')');
      $(this).css('-o-transform-origin', 'center center 0px').css('-o-transform', 'scale(' + xPercent + ')');
    });
    this.isAutoZoom = true;
    console.log('this.zoomScale',xPercent);
    this.zoomScale = xPercent;

    var data =  this._bookData;
    var that = this;
    $('#bookShadow').css({
      width:data.width* that.zoomScale+'px',
      height:data.height* that.zoomScale+'px'
    })
    $('#main,#pageList').css({
      width:that.zoomScale ==1 ? data.width *2+'px' : data.width * that.zoomScale+'px',
      height:that.zoomScale ==1 ? data.height +'px' : data.height * that.zoomScale+'px'
    })
  };

  /**
   * 生成DOM Page
   * @param item
   */
  FB.prototype.generatePage = function (item) {
    var page = $('<div class="FBPage" ></div>');
    page.css('left', this.width * (this.isSinglePage() ? 0 : 1) + 'px').css('z-index', 0);

    page.FBContainer = $('<div class="FBPageContainer"></div>');
    page.FBContainer.width(this.getBigRectWidth()).height(this.getBigRectWidth());
    this.isNext ? page.width(this.width).height(this.height).append(page.FBContainer).appendTo(this.fbStage) :
      page.width(this.width).height(this.height).append(page.FBContainer).prependTo(this.fbStage);

    page.FBPage = $('<div class="FBInnerPage"></div>');
    page.FBPage.width(this.width).height(this.height);

    page.OriginPage = $(item);
    if (this.isAutoZoom || this.zoomScale != 1) {

      $(item).css('transform-origin-origin', '0% 0%').css('transform', 'scale(' + this.zoomScale + ')');
      $(item).css('-webkit-transform-origin', '0% 0%').css('-webkit-transform', 'scale(' + this.zoomScale + ')');
      $(item).css('-ms-transform-origin', '0% 0%').css('-ms-transform', 'scale(' + this.zoomScale + ')');
      $(item).css('-moz-transform-origin', '0% 0%').css('-moz-transform', 'scale(' + this.zoomScale + ')');
      $(item).css('-o-transform-origin', '0% 0%').css('-o-transform', 'scale(' + this.zoomScale + ')');
    }
    page.FBPage.append(page.OriginPage).appendTo(page.FBContainer);

    // 光效
    var FBLight = $('<div class="FBPageLight"></div>');
    FBLight.width(this.width).height(this.height);
    page.FBLight = FBLight;
    page.FBPage.append(FBLight);
    return page;
  };

  /**
   * 是否是单页
   * @returns {boolean}
   */
  FB.prototype.isSinglePage = function () {
    if (this._isSinglePage != undefined && this._isSinglePage != 'auto') {
      return !!this._isSinglePage;
    } else {
      return window.innerHeight > window.innerWidth;
    }
  };

  /**
   * 获取点击事件响应数据,返回参照点
   * @param p
   */
  FB.prototype.getReferencePoint = function (p) {
    var trs = this.touchRectSize;
    var x = this.isSinglePage() ? 1 : 2;
    // 右上
    if (p.x > this.width * x - trs.width && p.x <= this.width * x
      && p.y >= 0 && p.y <  trs.height) {
      // 参照点
      return {
        x: this.width * x,
        y: 0,
        direct: FB.TouchPostion.RightTop
      };
    }
    // 右下
    if (p.x > this.width * x - trs.width && p.x <= this.width * x
      && p.y > this.height - trs.height && p.y <= this.height) {
      return {
        x: this.width * x,
        y: this.height,
        direct: FB.TouchPostion.RightBottom
      };
    }
    // 左上
    if (p.x >= 0 && p.x < trs.width
      && p.y >= 0 && p.y < trs.height) {
      return {
        x: 0,
        y: 0,
        direct: FB.TouchPostion.LeftTop
      };
    }
    // 左下
    if (p.x >= 0 && p.x < trs.width
      && p.y > this.height - trs.height && p.y <= this.height) {
      return {
        x: 0,
        y: this.height,
        direct: FB.TouchPostion.LeftBottom
      };
    }
    /*
     * 修改源码，源码返回null后第一次打开点击左边后再次点击后边翻页此方法不执行，
     * 所以做如下修改
     * */
    return null
  };

  /**
   * 初始化翻书事件
   */
  FB.prototype.initEvent = function () {
    var isOnFlipBook = false;
    var isOnBackScrolling = false;
    var t = this;

    // 触屏开始事件
    var _onTouchStart = function (e) {
      if (!isOnBackScrolling) {
        //console.log('Touch start');
        isOnFlipBook = true;
        // 获取舞台中的相对坐标点
        var sp = t.getStagePoint(e);
        t._onTouches.call(t, sp, 0);
      }
      return false;
    };

    // 触屏移动事件
    var _onTouchMove = function (e) {
      if (isOnFlipBook && !isOnBackScrolling) {
        //console.log('Touch move.');
        var sp = t.getStagePoint(e);
        t._onTouches.call(t, sp, 1);
      }
      return false;
    };

    // 触屏结束事件
    var _onTouchEnd = function (e) {
      if (isOnFlipBook) {
        isOnFlipBook = false;
        if (!isOnBackScrolling) {
          isOnBackScrolling = true;
          var sp = t.getStagePoint(e);
          var mp = t._referPoint;
          if (!mp) {
            isOnBackScrolling = false;
            return false;
          }
          var d2sLong = t.getTwoPointLong(sp, mp);

          var endPoint = mp;
          var isNext = false;
          if (d2sLong > t.getBigRectWidth() / 20) {
            endPoint = {
              x: t.isSinglePage() ? -t.width : 0,
              y: mp.y
            };
            if (mp.x == 0) {
              endPoint.x = t.width * 2;
            }
            isNext = true;
          }
          var animateCount = 30;
          var xUnit = (endPoint.x - sp.x) / animateCount,
            yUnit = (endPoint.y - sp.y) / animateCount;

          var _timeFrame = 0;
          var endInterval = setInterval(function () {

            isOnBackScrolling = true;
            sp = {
              x: sp.x + xUnit,
              y: sp.y + yUnit
            };
            var isEnd = false;
            if ((Math.abs(Math.abs(sp.x) - Math.abs(endPoint.x)) <= Math.abs(xUnit)) || (Math.abs(Math.abs(sp.y) - Math.abs(endPoint.y)) <= Math.abs(yUnit))) {
              sp.x = endPoint.x;
              sp.y = endPoint.y;
              clearInterval(endInterval);
              isEnd = true;
            }
            t._onTouches.call(t, sp, 1);
            if (isEnd && isNext) {
              if (mp.direct == 0 || mp.direct == 1) {
                t.currentPageIndex -= t.isSinglePage() ? 1 : 2;
              } else {
                t.currentPageIndex += t.isSinglePage() ? 1 : 2;
              }
              if (t.currentPageIndex < 0) {
                t.currentPageIndex = 0;
              } else if (t.currentPageIndex >= t.allPageCount) {
                t.currentPageIndex = t.isSinglePage() ? t.allPageCount - 1 : t.allPageCount;
              }
              t.onPageFlipEnd ? t.onPageFlipEnd.call(t) : null;
              t._onFlipEndPage ? t._onFlipEndPage.call(t) : null;
            }
            if (isEnd) {
              isOnBackScrolling = false;

              // clearTimeout(endTimeout);
            }
          }, _timeFrame);

          // var endTimeout = setTimeout(function () {
          //     clearInterval(endInterval);
          //     isOnBackScrolling = false;
          // }, _timeFrame * (animateCount + 1));
        }
      }
    };
    //新添加键盘翻页
    var keyTouch = this.keyTouch = function (ops) {
      if(isOnBackScrolling){
        // 翻页动画执行时不再处理键盘事件
        return;
      }
      var sp = {
        x: ops.x,
        y: ops.y
      };
      t._onTouches.call(t, sp, 0);
      t._onTouches.call(t, sp, 1);
      if (!isOnBackScrolling) {
        isOnBackScrolling = true;
        var mp = t._referPoint;
        if (!mp) {
          isOnBackScrolling = false;
          return false;
        }

        var d2sLong = t.getTwoPointLong(sp, mp);

        var endPoint = mp;
        var isNext = false;
        if (d2sLong > t.getBigRectWidth() / 8) {
          endPoint = {
            x: t.isSinglePage() ? -t.width : 0,
            y: mp.y
          };
          if (mp.x == 0) {
            endPoint.x = t.width * 2;
          }
          isNext = true;
        }
        var animateCount = 15;
        var xUnit = (endPoint.x - sp.x) / animateCount,
          yUnit = (endPoint.y - sp.y) / animateCount;

        var _timeFrame = 20;
        var endInterval = setInterval(function () {
          isOnBackScrolling = true;
          sp = {
            x: sp.x + xUnit,
            y: sp.y + yUnit
          };
          var isEnd = false;
          if ((Math.abs(Math.abs(sp.x) - Math.abs(endPoint.x)) <= Math.abs(xUnit)) || (Math.abs(Math.abs(sp.y) - Math.abs(endPoint.y)) <= Math.abs(yUnit))) {
            sp.x = endPoint.x;
            sp.y = endPoint.y;
            clearInterval(endInterval);
            isEnd = true;
          }
          t._onTouches.call(t, sp, 1);
          if (isEnd && isNext) {
            if (mp.direct == 0 || mp.direct == 1) {
              t.currentPageIndex -= t.isSinglePage() ? 1 : 2;
            } else {
              t.currentPageIndex += t.isSinglePage() ? 1 : 2;
            }
            if (t.currentPageIndex < 0) {
              t.currentPageIndex = 0;
            } else if (t.currentPageIndex >= t.allPageCount) {
              t.currentPageIndex = t.isSinglePage() ? t.allPageCount - 1 : t.allPageCount;
            }
            t.onPageFlipEnd ? t.onPageFlipEnd.call(t) : null;
            t._onFlipEndPage ? t._onFlipEndPage.call(t) : null;
          }
          if (isEnd) {
            isOnBackScrolling = false;
            // clearTimeout(endTimeout);
          }
        }, _timeFrame);

        // var endTimeout = setTimeout(function () {
        //     clearInterval(endInterval);
        //     isOnBackScrolling = false;
        // }, _timeFrame * (animateCount + 1));
      }

    }



    var _keyboard = function (e) {
      console.log('key',t);
      console.log('key1',e);
      if(!t.startKeyboard){
        return;
      }
      var previous = 37, next = 39;

      if(t.currentPageIndex >= t.allPageCount && e.keyCode == 39){
        return;
      }
      if(t.currentPageIndex == 0 && e.keyCode == 37){
        return;
      }
      console.log('t', t.height);
      e.stopPropagation()
      switch (e.keyCode) {
        case previous:
          var sp = {
            x:100 * t.ratioWidth,
            y:t.height - (150 * t.ratioHeight)
          };
          keyTouch(sp);
          break;
        case next:
          var sp = {
            x: t.width *2 - (100 * t.ratioWidth),
            y:t.height - (150 * t.ratioHeight)
          };
          keyTouch(sp);
          break;
      }
    }
    this.fbStage.on("mousedown", _onTouchStart);
    this.container.on("mousemove", _onTouchMove);
    this.container.on("mouseup", _onTouchEnd);
    this.fbStage.on("touchstart", _onTouchStart);
    this.container.on("touchmove", _onTouchMove);
    this.container.on("touchend", _onTouchEnd);
    $('body').on("keydown", _keyboard);
  };

  /**
   * 增加页面
   * @param html
   * @param index
   */
  FB.prototype.addPage = function (html, index) {

    var node = html;
    if (typeof html === 'string') {
      node = $(html);
    }
    if (!this.pageList[index]) {
      var page = this.generatePage.call(this, node);
      page.addClass("FBPage-" + index || 0);
      if (arguments.length == 1) {
        this.pageList.push(page);
        // this.pageList.splice(index, 0, page)
      } else {
        if (this.isNext === true || this.isNext === false) {
          //this.pageList.splice(index, 1, page)
          // 因为存在跨页,所以无法使用splice方法
          this.pageList[index] = page;
        } else {
          console.warn('Replace page index is %d, but all page count is %d. add page failed.', index, this.allPageCount);
        }
      }
    }
  };

  /**
   * 触屏事件处理
   * @param sp
   * @param type
   * @returns {boolean}
   * @private
   */
  FB.prototype._onTouches = function (sp, type) {
    if (type == 2) {
      // 结束事件
    } else {
      // 获取参照点
      var mp;
      if (type == 0) {
        mp = this.getReferencePoint(sp);
        this._referPoint = mp;
      } else {
        mp = this._referPoint;
      }
      if (mp) {
        var coreData = this.culCoreData(sp, mp);
        // 判断有效值(是否可以移动到该位置)
        if (!this.checkIsValidMove(mp, sp, coreData.xDistance)) {
          // console.warn('Invalid point...');
          return false;
        }
        var data = this.getCurrentCutPageData(coreData.angle, coreData.containerMove, coreData.pageMove, coreData.distance, sp);

        if (!this.isSinglePage()) {
          if ((data.isNext && this.currentPageIndex >= 0 && this.currentPageIndex < this.allPageCount)
            || (!data.isNext && this.currentPageIndex > 0 && this.currentPageIndex <= this.allPageCount)) {
            if (type == 0) {
              this.flipCutStart(data);
            }
            this.renderCutPage(data);
          }
        } else {
          if ((data.isNext && this.currentPageIndex >= 0 && this.currentPageIndex < this.allPageCount - 1)
            || (!data.isNext && this.currentPageIndex > 0 && this.currentPageIndex <= this.allPageCount)) {
            if (type == 0) {
              this.flipCutStart(data);
            }
            this.renderCutPage(data);
          }
        }
      }
    }
    return true;
  };

  /**
   * 核心数据计算
   * @param sp
   * @param mp
   * @returns {{distance: number, angle: number, hd: number, containerMove: {x: number, y: number}, pageMove: {x: number, y: number}}}
   */
  FB.prototype.culCoreData = function (sp, mp) {
    var distance = this.getTwoPointLong(sp, mp);

    // 计算以参照点为顶点的角度
    var angle = this.getAngle(sp, mp);
    // 计算出与x轴交点
    // 发现一个异常，当角度小于该值时，计算出的xDistance出现值巨大的异常，因此加上此判断修复该问题
    if (angle < -57.29577951308232){
      angle = -57;
    }
    if (angle > 57.29577951308232){
      angle = 57;
    }
    var hd = 2 * Math.PI / 360 * angle;
    var xDistance = (distance / 2) / Math.cos(hd);

    // 计算出与y轴交点
    var hd2 = 2 * Math.PI / 360 * (90 - angle);
    var yDistance = (distance / 2) / Math.cos(hd2);

    // Container移动的距离计算
    // 对角线长度
    var maxL = this.getBigRectWidth();
    var containerMove = {
      x: (this.width - xDistance) * Math.cos(hd) - maxL,
      y: (sp.y >= 0 && sp.y <= this.height) ? 0 : this.width * Math.tan(hd) * Math.cos(hd)
    };

    // Page移动的距离计算
    var pageMove = {
      x: (this.width - xDistance) * Math.cos(hd) - distance / 2,
      y: (this.width - xDistance) * Math.sin(hd) + (distance / 2) * Math.tan(hd)
    };

    return {
      distance: distance,
      angle: angle,
      hd: hd,
      containerMove: containerMove,
      pageMove: pageMove,
      xDistance: xDistance,
      yDistance: yDistance
    };
  };

  /**
   * 移动的点是否有效
   * @param mp
   * @param sp
   * @param xDistance
   * @returns {boolean}
   */
  FB.prototype.checkIsValidMove = function (mp, sp, xDistance) {
    var maxL = this.getBigRectWidth();
    var diagonalPoint = this.getDiagonalPoint(mp.direct);
    var d2sLong = this.getTwoPointLong(diagonalPoint, sp);
    return !(xDistance > this.width || d2sLong > maxL);
  };

  /**
   * 获取剪切页面的数据信息
   * @param angle
   * @param moveP
   * @param pageMoveP
   * @param distance
   * @param sp
   * @returns {*}
   */
  FB.prototype.getCurrentCutPageData = function (angle, moveP, pageMoveP, distance, sp) {
    var data = {
      sp: sp,
      angle: angle,
      distance: distance
    };
    data.fbCP = {left: 0, right: 0};
    data.fbCOrigin = {x: 0, y: 0};
    data.fbCTransfrom = {x: 0, y: 0};
    data.fbCAngle = angle;
    data.fbPTransform1 = {x: 0, y: 0};
    data.fbPTransform2 = {x: 0, y: 0};
    data.fbPAngle = angle;

    var maxL = this.getBigRectWidth();
    switch (this._referPoint.direct) {
      case FB.TouchPostion.RightTop:
        data.pLeft = this.isSinglePage() ? 0 : this.width;
        data.fbCP = {left: 0, top: 0};
        data.fbCOrigin = {x: 0, y: 0};
        data.fbCTransfrom = {x: moveP.x, y: moveP.y};
        data.fbCAngle = -angle;
        data.fbPTransform1 = {x: -moveP.x, y: -moveP.y};
        data.fbPTransform2 = {x: pageMoveP.x, y: pageMoveP.y};
        data.fbPAngle = -angle;
        data.isNext = true;
        break;
      case FB.TouchPostion.RightBottom:
        data.pLeft = this.isSinglePage() ? 0 : this.width;
        data.fbCP = {left: 0, top: this.height - maxL};
        data.fbCOrigin = {x: 0, y: 100};
        data.fbCTransfrom = {x: moveP.x, y: moveP.y};
        data.fbCAngle = -angle;
        data.fbPTransform1 = {x: -moveP.x, y: (-moveP.y + maxL - this.height)};
        data.fbPTransform2 = {x: pageMoveP.x, y: pageMoveP.y};
        data.fbPAngle = -angle;
        data.isNext = true;
        break;
      case FB.TouchPostion.LeftTop:
        data.pLeft = 0;
        data.fbCP = {left: this.width - maxL, top: 0};
        data.fbCOrigin = {x: 100, y: 0};
        data.fbCTransfrom = {x: -moveP.x, y: moveP.y};
        data.fbCAngle = angle;
        data.fbPTransform1 = {x: -this.width, y: moveP.y};
        data.fbPTransform2 = {x: distance / 2, y: Math.abs(pageMoveP.y)};
        data.fbPAngle = angle;
        data.isNext = false;
        break;
      case FB.TouchPostion.LeftBottom:
        data.pLeft = 0;
        data.fbCP = {left: this.width - maxL, top: this.height - maxL};
        data.fbCOrigin = {x: 100, y: 100};
        data.fbCTransfrom = {x: -moveP.x, y: moveP.y};
        data.fbCAngle = angle;
        data.fbPTransform1 = {x: -this.width, y: -moveP.y + maxL - this.height};
        data.fbPTransform2 = {x: distance / 2, y: pageMoveP.y};
        data.fbPAngle = angle;
        data.isNext = false;
        break;
      default:
        return null;
    }
    return data;
  };

  /**
   * 翻页开始执行事件
   */
  FB.prototype.flipCutStart = function (data) {
    //console.log('Total Page Count:', this.allPageCount);
    //添加参数判断上一页还是下一页
    this.isNext = data.isNext;
    this.onPageFlipStart && this.onPageFlipStart();
    this.pageList.forEach(function (item) {
      console.log('item',item);
      if (item) item.hide().css('z-index', 0);
    });

    var isSingle = this.isSinglePage();


    var c = data.isNext ? this.currentPageIndex : this.currentPageIndex - 1;
    // 上一页或下一页(剪切页)
    var p = data.isNext ? c + 1 : c - 1;

    var b = data.isNext ? p + 1 : p - 1;
    // 剪切页,如不存在,则调用missing
    var cutPage = this.pageList[p] || (this.onPageMissing && this.onPageMissing.call(this, p));
    if (isSingle) {
      c = this.currentPageIndex;
      cutPage = this._BlankPage; // Blank Page
      b = data.isNext ? c + 1 : c - 1;
    } else {
      if (this.lastPageIndex != null) {
        // 如果为跳页翻书,则显示上一页码的页面
        if(data.isNext){
          this.pageList[this.lastPageIndex - 1] && this.pageList[this.lastPageIndex - 1].show().css('z-index', 0);
          this.pageList[this.lastPageIndex] && this.pageList[this.lastPageIndex].hide().css('z-index', 7);
        }else{
          this.pageList[this.lastPageIndex - 1] && this.pageList[this.lastPageIndex - 1].show().css('z-index', 0);
          this.pageList[this.lastPageIndex] && this.pageList[this.lastPageIndex].show().css('z-index', 7);
        }
      }else {
        this.pageList[this.currentPageIndex - 1] && this.pageList[this.currentPageIndex - 1].show().css('z-index', 9);
        this.pageList[this.currentPageIndex] && this.pageList[this.currentPageIndex].show().css('z-index', 9);
      }

      /*this.pageList[this.currentPageIndex - 1] && this.pageList[this.currentPageIndex - 1].show().css('z-index', 9);
       this.pageList[this.currentPageIndex] && this.pageList[this.currentPageIndex].show().css('z-index', 9);*/
    }
    if (!cutPage) {
      console.warn('No next page.');
      return;
    }

    // 当前页
    var currentPage = this.pageList[c] || (this.onPageMissing && this.onPageMissing.call(this, c));

    // 底页
    var bottomPage = this.pageList[b] || (this.onPageMissing && this.onPageMissing.call(this, b));

    // 当前页
    currentPage.show().css('z-index', 9);

    // 处理上一页或下一页(剪切页)
    cutPage.show().css('z-index', 10);

    // 上上一页或下下一页(底页)
    bottomPage && bottomPage.show().css('z-index', 7);

    // 翻页结束处理事件
    /*		this._onPageFlipEnd = function () {
     // 将右页的FBPage层级从 7 调成 11
     console.log('翻页结束');
     bottomPage ? bottomPage.css('z-index', 11) : ''

     }*/
  };

  /**
   * 绘制剪切页面
   * @param data
   */
  FB.prototype.renderCutPage = function (data) {
    //console.log(data);
    this.isNext = data.isNext;
    var isSingle = this.isSinglePage();
    var c = data.isNext ? this.currentPageIndex : this.currentPageIndex - 1;

    // 上一页或下一页(剪切页)
    var p = data.isNext ? c + 1 : c - 1;

    var b = data.isNext ? p + 1 : p - 1;
    // 剪切页
    var cutPage = this.pageList[p] || (this.onPageMissing && this.onPageMissing.call(this, p));

    if (isSingle) {
      c = this.currentPageIndex;
      cutPage = this._BlankPage; // Blank Page
      b = data.isNext ? c + 1 : c - 1;
    }
    if (!cutPage) {
      console.warn('No next page for render.');
      return;
    }
    // 当前页
    var currentPage = this.pageList[c] || (this.onPageMissing && this.onPageMissing.call(this, c));

    // 底页
    var bottomPage = this.pageList[b] || (this.onPageMissing && this.onPageMissing.call(this, b));
    //console.log('b',b);
    // 当前页
    currentPage.css('left', data.pLeft + 'px');
    currentPage.FBContainer.css('left', data.fbCP.left + 'px').css('top', data.fbCP.top + 'px');
    currentPage.FBContainer.css('transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    currentPage.FBContainer.css('-ms-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    currentPage.FBContainer.css('-moz-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    currentPage.FBContainer.css('-webkit-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    currentPage.FBContainer.css('-o-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    currentPage.FBContainer.css(transformName, "rotate(" + data.fbCAngle + "deg) translate3d(" + data.fbCTransfrom.x + "px, " + data.fbCTransfrom.y + "px, 0px)");
    currentPage.FBContainer.css(transformNameMs, "rotate(" + data.fbCAngle + "deg) translate3d(" + data.fbCTransfrom.x + "px, " + data.fbCTransfrom.y + "px, 0px)");
    currentPage.FBContainer.css(transformNameMoz, "rotate(" + data.fbCAngle + "deg) translate3d(" + data.fbCTransfrom.x + "px, " + data.fbCTransfrom.y + "px, 0px)");
    currentPage.FBContainer.css(transformNameWebkit, "rotate(" + data.fbCAngle + "deg) translate3d(" + data.fbCTransfrom.x + "px, " + data.fbCTransfrom.y + "px, 0px)");
    currentPage.FBContainer.css(transformNameO, "rotate(" + data.fbCAngle + "deg) translate3d(" + data.fbCTransfrom.x + "px, " + data.fbCTransfrom.y + "px, 0px)");

    currentPage.FBPage.css('transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    currentPage.FBPage.css('-ms-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    currentPage.FBPage.css('-moz-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    currentPage.FBPage.css('-webkit-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    currentPage.FBPage.css('-o-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    if (data.isNext) {
      currentPage.FBPage.css(transformName, "translate3d(" + data.fbPTransform1.x + "px, " + data.fbPTransform1.y + "px, 0px) rotate(" + (360 - data.fbCAngle) + "deg)");
      currentPage.FBPage.css(transformNameMs, "translate3d(" + data.fbPTransform1.x + "px, " + data.fbPTransform1.y + "px, 0px) rotate(" + (360 - data.fbCAngle) + "deg)");
      currentPage.FBPage.css(transformNameMoz, "translate3d(" + data.fbPTransform1.x + "px, " + data.fbPTransform1.y + "px, 0px) rotate(" + (360 - data.fbCAngle) + "deg)");
      currentPage.FBPage.css(transformNameWebkit, "translate3d(" + data.fbPTransform1.x + "px, " + data.fbPTransform1.y + "px, 0px) rotate(" + (360 - data.fbCAngle) + "deg)");
      currentPage.FBPage.css(transformNameO, "translate3d(" + data.fbPTransform1.x + "px, " + data.fbPTransform1.y + "px, 0px) rotate(" + (360 - data.fbCAngle) + "deg)");
    } else {
      var ly = 0;
      if (this._referPoint.direct == 1) {
        ly = -(data.fbCTransfrom.y + this.height - this.getBigRectWidth());
      } else if (this._referPoint.direct == 0) {
        ly = data.fbCTransfrom.y < 0 ? -data.fbCTransfrom.y : 0;
      }
      var lx = -(data.fbCTransfrom.x + this.width - this.getBigRectWidth());
      currentPage.FBPage.css(transformName, "translate3d(" + lx + "px, " + ly + "px, 0px) rotate(" + (360 - data.fbCAngle) + "deg)");
      currentPage.FBPage.css(transformNameMs, "translate3d(" + lx + "px, " + ly + "px, 0px) rotate(" + (360 - data.fbCAngle) + "deg)");
      currentPage.FBPage.css(transformNameMoz, "translate3d(" + lx + "px, " + ly + "px, 0px) rotate(" + (360 - data.fbCAngle) + "deg)");
      currentPage.FBPage.css(transformNameWebkit, "translate3d(" + lx + "px, " + ly + "px, 0px) rotate(" + (360 - data.fbCAngle) + "deg)");
      currentPage.FBPage.css(transformNameO, "translate3d(" + lx + "px, " + ly + "px, 0px) rotate(" + (360 - data.fbCAngle) + "deg)");
    }

    // 处理上一页或下一页(剪切页)
    cutPage.css('left', data.pLeft + 'px');

    cutPage.FBContainer.css('left', data.fbCP.left + 'px').css('top', data.fbCP.top + 'px');
    cutPage.FBContainer.css('transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    cutPage.FBContainer.css('-ms-transform', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    cutPage.FBContainer.css('-moz-transform', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    cutPage.FBContainer.css('-webkit-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    cutPage.FBContainer.css('-o-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    cutPage.FBContainer.css(transformName, "rotate(" + data.fbCAngle + "deg) translate3d(" + data.fbCTransfrom.x + "px, " + data.fbCTransfrom.y + "px, 0px)");
    cutPage.FBContainer.css(transformNameMs, "rotate(" + data.fbCAngle + "deg) translate3d(" + data.fbCTransfrom.x + "px, " + data.fbCTransfrom.y + "px, 0px)");
    cutPage.FBContainer.css(transformNameMoz, "rotate(" + data.fbCAngle + "deg) translate3d(" + data.fbCTransfrom.x + "px, " + data.fbCTransfrom.y + "px, 0px)");
    cutPage.FBContainer.css(transformNameWebkit, "rotate(" + data.fbCAngle + "deg) translate3d(" + data.fbCTransfrom.x + "px, " + data.fbCTransfrom.y + "px, 0px)");
    cutPage.FBContainer.css(transformNameO, "rotate(" + data.fbCAngle + "deg) translate3d(" + data.fbCTransfrom.x + "px, " + data.fbCTransfrom.y + "px, 0px)");

    cutPage.FBPage.css('transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    cutPage.FBPage.css('-ms-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    cutPage.FBPage.css('-moz-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    cutPage.FBPage.css('-webkit-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    cutPage.FBPage.css('-o-transform-origin', data.fbCOrigin.x + '% ' + data.fbCOrigin.y + '% 0px');
    cutPage.FBPage.css(transformName, "translate3d(" + data.fbPTransform1.x + "px, " + data.fbPTransform1.y + "px, 0px) translate3d(" + data.fbPTransform2.x + "px, " + data.fbPTransform2.y + "px, 0px) rotate(" + data.fbPAngle + "deg)");
    cutPage.FBPage.css(transformNameMs, "translate3d(" + data.fbPTransform1.x + "px, " + data.fbPTransform1.y + "px, 0px) translate3d(" + data.fbPTransform2.x + "px, " + data.fbPTransform2.y + "px, 0px) rotate(" + data.fbPAngle + "deg)");
    cutPage.FBPage.css(transformNameMoz, "translate3d(" + data.fbPTransform1.x + "px, " + data.fbPTransform1.y + "px, 0px) translate3d(" + data.fbPTransform2.x + "px, " + data.fbPTransform2.y + "px, 0px) rotate(" + data.fbPAngle + "deg)");
    cutPage.FBPage.css(transformNameWebkit, "translate3d(" + data.fbPTransform1.x + "px, " + data.fbPTransform1.y + "px, 0px) translate3d(" + data.fbPTransform2.x + "px, " + data.fbPTransform2.y + "px, 0px) rotate(" + data.fbPAngle + "deg)");
    cutPage.FBPage.css(transformNameO, "translate3d(" + data.fbPTransform1.x + "px, " + data.fbPTransform1.y + "px, 0px) translate3d(" + data.fbPTransform2.x + "px, " + data.fbPTransform2.y + "px, 0px) rotate(" + data.fbPAngle + "deg)");


    //bottomPage.css('left', data.pLeft + 'px');
    //上上一页或下下一页
    if (bottomPage) {
      // 向前翻页
      bottomPage.css('left', data.pLeft + 'px');
      bottomPage.FBContainer.css('left', '0px').css('top', '0px');
      bottomPage.FBContainer.css('transform-origin', '0% 0% 0px');
      bottomPage.FBContainer.css('-ms-transform-origin', '0% 0% 0px');
      bottomPage.FBContainer.css('-moz-transform-origin', '0% 0% 0px');
      bottomPage.FBContainer.css('-webkit-transform-origin', '0% 0% 0px');
      bottomPage.FBContainer.css('-o-transform-origin', '0% 0% 0px');
      bottomPage.FBContainer.css(transformName, "rotate(0deg) translate3d(" + data.fbCP.left + "px, " + 0 + "px, 0px)");
      bottomPage.FBContainer.css(transformNameMs, "rotate(0deg) translate3d(" + data.fbCP.left + "px, " + 0 + "px, 0px)");
      bottomPage.FBContainer.css(transformNameMoz, "rotate(0deg) translate3d(" + data.fbCP.left + "px, " + 0 + "px, 0px)");
      bottomPage.FBContainer.css(transformNameWebkit, "rotate(0deg) translate3d(" + data.fbCP.left + "px, " + 0 + "px, 0px)");
      bottomPage.FBContainer.css(transformNameO, "rotate(0deg) translate3d(" + data.fbCP.left + "px, " + 0 + "px, 0px)");

      bottomPage.FBPage.css('transform-origin', '0% 0% 0px');
      bottomPage.FBPage.css('-ms-transform-origin', '0% 0% 0px');
      bottomPage.FBPage.css('-moz-transform-origin', '0% 0% 0px');
      bottomPage.FBPage.css('-webkit-transform-origin', '0% 0% 0px');
      bottomPage.FBPage.css('-o-transform-origin', '0% 0% 0px');
      bottomPage.FBPage.css(transformName, "rotate(0deg) translate3d(" + (data.fbCP.left * -1) + "px, " + 0 + "px, 0px)");
      bottomPage.FBPage.css(transformNameMs, "rotate(0deg) translate3d(" + (data.fbCP.left * -1) + "px, " + 0 + "px, 0px)");
      bottomPage.FBPage.css(transformNameMoz, "rotate(0deg) translate3d(" + (data.fbCP.left * -1) + "px, " + 0 + "px, 0px)");
      bottomPage.FBPage.css(transformNameWebkit, "rotate(0deg) translate3d(" + (data.fbCP.left * -1) + "px, " + 0 + "px, 0px)");
      bottomPage.FBPage.css(transformNameO, "rotate(0deg) translate3d(" + (data.fbCP.left * -1) + "px, " + 0 + "px, 0px)");

    }

    // 上上一页或下下一页(底页)
    if (isSingle) {
      bottomPage.css('left', '0px');
      bottomPage.FBContainer.css('left', '0px').css('top', '0px');
      bottomPage.FBContainer.css('transform-origin', '0% 0% 0px');
      bottomPage.FBContainer.css('-ms-transform-origin', '0% 0% 0px');
      bottomPage.FBContainer.css('-moz-transform-origin', '0% 0% 0px');
      bottomPage.FBContainer.css('-webkit-transform-origin', '0% 0% 0px');
      bottomPage.FBContainer.css('-o-transform-origin', '0% 0% 0px');
      bottomPage.FBContainer.css(transformName, "rotate(0deg) translate3d(0px, 0px, 0px)");
      bottomPage.FBContainer.css(transformNameMs, "rotate(0deg) translate3d(0px, 0px, 0px)");
      bottomPage.FBContainer.css(transformNameMoz, "rotate(0deg) translate3d(0px, 0px, 0px)");
      bottomPage.FBContainer.css(transformNameWebkit, "rotate(0deg) translate3d(0px, 0px, 0px)");
      bottomPage.FBContainer.css(transformNameO, "rotate(0deg) translate3d(0px, 0px, 0px)");

      bottomPage.FBPage.css('transform-origin', '0% 0% 0px');
      bottomPage.FBPage.css('-ms-transform-origin', '0% 0% 0px');
      bottomPage.FBPage.css('-moz-transform-origin', '0% 0% 0px');
      bottomPage.FBPage.css('-webkit-transform-origin', '0% 0% 0px');
      bottomPage.FBPage.css('-o-transform-origin', '0% 0% 0px');
      bottomPage.FBPage.css(transformName, "translate3d(0px, 0px, 0px) translate3d(0px, 0px, 0px) rotate(0deg)");
      bottomPage.FBPage.css(transformNameMs, "translate3d(0px, 0px, 0px) translate3d(0px, 0px, 0px) rotate(0deg)");
      bottomPage.FBPage.css(transformNameMoz, "translate3d(0px, 0px, 0px) translate3d(0px, 0px, 0px) rotate(0deg)");
      bottomPage.FBPage.css(transformNameWebkit, "translate3d(0px, 0px, 0px) translate3d(0px, 0px, 0px) rotate(0deg)");
      bottomPage.FBPage.css(transformNameO, "translate3d(0px, 0px, 0px) translate3d(0px, 0px, 0px) rotate(0deg)");
    }

    // 底部阴影处理
    if ((!isSingle && ((this.currentPageIndex >= this.allPageCount - 2 && data.isNext) || (this.currentPageIndex <= 3 && !data.isNext)))
      || (isSingle && ((this.currentPageIndex >= this.allPageCount - 1 && data.isNext) || (this.currentPageIndex <= 0 && !data.isNext)))
    ) {

    } else {
      var opacity = 1 - Math.abs(data.sp.x - this._referPoint.x) / (this.width * 2);

      var bColors = [[0.4, 'rgba(0,0,0,0)'], [0.5, 'rgba(0,0,0,' + (0.4 * opacity) + ')'], [0.6, 'rgba(0,0,0,0)']], cols = [], b
      /**
       * 计算横坐标和纵坐标百分比
       * */
      var b1 = {
        x: this._referPoint.x / this._pageShadow.width() * 100,
        y: this._referPoint.y / this._pageShadow.height() * 100
      }
      var b2 = {x: data.sp.x / this._pageShadow.width() * 100, y: data.sp.y / this._pageShadow.height() * 100}
      if (vendor == '-webkit-') {
        //chrome翻页渐变
        this._pageShadow.css('z-index', 8)
          .css('background-image', '-webkit-gradient(linear, ' + this._referPoint.x + ' ' + this._referPoint.y + ', ' + data.sp.x + ' ' + data.sp.y
            + ', from(rgba(0, 0, 0, 0)),to(rgba(0, 0, 0, 0)), color-stop(0.4, rgba(0,0,0,0)), color-stop(0.5, rgba(0,0,0,' + (0.5 * opacity) + ')), color-stop(0.6, rgba(0,0,0,0)))');

      } else {

        var c0 = {x: b1.x / 100 * this._pageShadow.width(), y: b1.y / 100 * this._pageShadow.height()};
        var c1 = {x: b2.x / 100 * this._pageShadow.width(), y: b2.y / 100 * this._pageShadow.height()};
        var dx = c1.x - c0.x, dy = c1.y - c0.y;
        var bAngle = Math.atan2(dy, dx);
        var angle2 = bAngle - Math.PI / 2,
          diagonal = Math.abs(this._pageShadow.width() * Math.sin(angle2)) + Math.abs(this._pageShadow.height() * Math.cos(angle2)),
          gradientDiagonal = Math.sqrt(dy * dy + dx * dx),
          corner = FB.Point((c1.x < c0.x) ? this._pageShadow.width() : 0, (c1.y < c0.y) ? this._pageShadow.height() : 0),
          slope = Math.tan(bAngle),
          inverse = -1 / slope,
          x = (inverse * corner.x - corner.y - slope * c0.x + c0.y) / (inverse - slope),
          c = {x: x, y: inverse * x - inverse * corner.x + corner.y},
          segA = (Math.sqrt(Math.pow(c.x - c0.x, 2) + Math.pow(c.y - c0.y, 2)));
        /**
         *兼容除chrome渐变颜色值
         */
        for (b = 0; b < 3; b++) {
          cols.push(' ' + bColors[b][1] + ' ' + ((segA + gradientDiagonal * bColors[b][0]) * 100 / diagonal) + '%');
        }
        this._pageShadow.css('z-index', 8)
          .css('background-image', '' + vendor + 'linear-gradient( ' + (-bAngle) +
            'rad,rgba(0, 0, 0, 0),rgba(0, 0, 0, 0),' + cols.join(',') + ')');
      }

    }
    var opacity = 1 - Math.abs(data.sp.x - this._referPoint.x) / (this.width * 2);
    // 光效处理
    var hd = 2 * Math.PI / 360 * data.angle;
    var light_SP = {
      x: data.fbCOrigin.x * this.width / 100,
      y: data.fbCOrigin.y * this.height / 100
    };

    var light_EP = {
      x: (data.distance / 2) * Math.cos(hd),
      y: (data.distance / 2) * Math.sin(hd) + ((this._referPoint.direct % 2 != 0) ? this.height : 0)
    };

    if (this._referPoint.direct < 2) {
      light_EP.x = this.width - light_EP.x;
    }


    var colors = [[0.6, 'rgba(0,0,0,0)'], [0.8, 'rgba(0,0,0,' + (0.3 * opacity) + ')'], [1, 'rgba(0,0,0,0)']]

    var p0 = {x: light_SP.x, y: light_SP.y}
    var p1 = {x: light_EP.x, y: light_EP.y}
    var l0 = {x: p0.x / this.width * 100, y: p0.y / this.height * 100}
    var l1 = {x: p1.x / this.width * 100, y: p1.y / this.height * 100}
    var cols = [], cols1 = [];
    if (vendor == '-webkit-') {
      /**
       *兼容chrome渐变颜色值
       */
      for (var j = 0; j < 3; j++) {
        cols1.push('color-stop(' + colors[j][0] + ', ' + colors[j][1] + ')');
      }
      cutPage.FBLight.css('background-image',
        '-webkit-gradient(linear, ' +
        l0.x + '% ' +
        l0.y + '%,' +
        l1.x + '% ' +
        l1.y + '%, ' +
        cols1.join(',') + ' )');
      //box-shadow:0 0 10px rgba(0, 204, 204, .5);
    } else {
      var dx = p1.x - p0.x,
        dy = p1.y - p0.y,
        angle = Math.atan2(dy, dx),
        angle2 = angle - Math.PI / 2,
        diagonal = Math.abs(this.width * Math.sin(angle2)) + Math.abs(this.height * Math.cos(angle2)),
        gradientDiagonal = Math.sqrt(dy * dy + dx * dx),
        corner = FB.Point((p1.x < p0.x) ? this.width : 0, (p1.y < p0.y) ? this.height : 0),
        slope = Math.tan(angle),
        inverse = -1 / slope,
        x = (inverse * corner.x - corner.y - slope * p0.x + p0.y) / (inverse - slope),
        c = {x: x, y: inverse * x - inverse * corner.x + corner.y},
        segA = (Math.sqrt(Math.pow(c.x - p0.x, 2) + Math.pow(c.y - p0.y, 2)));
      /**
       *兼容除chrome渐变颜色值
       */
      for (var j = 0; j < 3; j++) {
        cols.push(' ' + colors[j][1] + ' ' + ((segA + gradientDiagonal * colors[j][0]) * 100 / diagonal) + '%');
      }
      cutPage.FBLight.css('background-image', '' + vendor + 'linear-gradient(' + (-angle) + 'rad,' + cols.join(',') + ')');
    }


  };

  /**
   * 获取对角点
   * @param pointType
   * @returns {FB.Point}
   */
  FB.prototype.getDiagonalPoint = function (pointType) {
    var p = new FB.Point(0, 0);
    switch (pointType) {
      case FB.TouchPostion.LeftTop:
        p.x = this.width;
        p.y = this.height;
        break;
      case FB.TouchPostion.LeftBottom:
        p.x = this.width;
        p.y = 0;
        break;
      case FB.TouchPostion.RightTop:
        p.x = this.isSinglePage() ? 0 : this.width;
        p.y = this.height;
        break;
      case FB.TouchPostion.RightBottom:
        p.x = this.isSinglePage() ? 0 : this.width;
        p.y = 0;
        break;
      default :
        p = null;
    }
    return p;
  };

  /**
   * 获取当前位置在Stage上的坐标
   * @param e
   * @returns {FB.Point}
   */
  FB.prototype.getStagePoint = function (e) {
    var isTouch = e.type.indexOf('touch') != -1;
    var pageX = isTouch ? e.originalEvent.changedTouches[0].pageX : e.pageX,
      pageY = isTouch ? e.originalEvent.changedTouches[0].pageY : e.pageY;
    var offset = this.fbStage.offset();
    return new FB.Point(pageX - offset.left, pageY - offset.top)
  };

  /**
   * 获取两点之间的距离
   * @param start
   * @param end
   * @returns {number}
   */
  FB.prototype.getTwoPointLong = function (start, end) {
    var dx = start.x - end.x,
      dy = start.y - end.y;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  };

  /**
   * 获取大方块边长
   * @returns {number|*}
   */
  FB.prototype.getBigRectWidth = function () {
    if (!this._FBBigRectWidth) {
      this._FBBigRectWidth = Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));

    }
    return this._FBBigRectWidth;
  };

  /**
   * 获取角度
   * @param start
   * @param end
   * @returns {number}
   */
  FB.prototype.getAngle = function (start, end) {
    var x = start.x - end.x;
    var y = start.y - end.y;
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    if (z == 0) {
      return 0;
    }
    return (Math.asin(y / z) / Math.PI * 180);
  };

  // Gets the CSS3 vendor prefix

  FB.prototype.getPrefix = function () {

    var vendorPrefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
      len = vendorPrefixes.length,
      vendor = '';

    while (len--) {
      if ((vendorPrefixes[len] + 'Transform') in document.body.style) {
        vendor = '-' + vendorPrefixes[len].toLowerCase() + '-';
      }
    }
    return vendor;

  }

  /**
   *翻页开始执行事件
   */
  FB.prototype.onPageFlipStart = function (n) {
    var currentIndex = this.currentPageIndex;
    var allIndex = this.allPageCount;
    var pageHtml;
    if(this.isNext && (currentIndex+1 < allIndex)) {
      // 从目标页的前一页到后两页
      for(var i= currentIndex;i <= currentIndex + 3;i++){
        // 页码符合规则且该页不存在的时候添加插入页面
        if(i>0 &&i<allIndex && !$('#page' + i)[0]){
          pageHtml = document.createElement('div');
          pageHtml.setAttribute("id","page"+i);
          this.addPage(pageHtml, i);
          $('#page'+i).html(this.bookTemplate(i))
        }
      }

    }else if(!this.isNext && (currentIndex-1) >= 0 ){
      for(var i=currentIndex - 1 ;i>= currentIndex - 3;i--){
        if(i>=0 &&  !$('#page' + i)[0]){
          pageHtml = document.createElement('div');
          pageHtml.setAttribute("id","page"+i);
          this.addPage(pageHtml, i);
          $('#page'+i).html(this.bookTemplate(i));
        }
      }
    }

    if (this.isNext && currentIndex !== allIndex) {
      this.pageList[currentIndex + 1] && this.pageList[currentIndex + 1].FBPage.css('box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 20px');
    } else {
      this.pageList[currentIndex - 2] && this.pageList[currentIndex - 2].FBPage.css('box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 20px');
    }

  };
  /**
   *翻页结束执行事件
   */
  FB.prototype.onPageFlipEnd = function () {
    var currentIndex = this.currentPageIndex;

    $('#currentPage')[0].innerText = currentIndex;

    var allIndex = this.allPageCount;
    var index,pageHtml;

    console.log('currentIndex',currentIndex);
    slider.update({
      from: currentIndex
      // etc.
    });
    var setZindex = this.isNext ? currentIndex : currentIndex-1;
    //翻页结束后修改当前页面zindex
    this.pageList[setZindex] ? this.pageList[setZindex].css('z-index', 11) : null;

    //清除拖动翻页保留页
    if (this.lastPageIndex != null) {
      this.pageList[this.lastPageIndex] && this.pageList[this.lastPageIndex].hide();
      this.lastPageIndex = null;
    }

    if (this.isNext && currentIndex !== 0) {
      this.pageList[currentIndex - 1] && this.pageList[currentIndex - 1].FBPage.css('box-shadow', 'none');
    } else {
      this.pageList[currentIndex] && this.pageList[currentIndex].FBPage.css('box-shadow', 'none');
    }
    this.pageList[currentIndex] && this.pageList[currentIndex].find('img.imgLoading').lazyload({
      effect : "fadeIn"
    });
    this.pageList[currentIndex-1] && this.pageList[currentIndex-1].find('img.imgLoading').lazyload({
      effect : "fadeIn"
    });

  };

  FB.prototype.onPageMissing = function (pageIndex) {
    console.log('pageIndex',pageIndex);
    if(pageIndex >=0 && pageIndex<this.allPageCount &&!$('#page' + pageIndex)[0]){
      var page = document.createElement('div');
      page.setAttribute("id","page" + pageIndex);
      this.addPage(page, pageIndex);
      $("#page"+pageIndex).html(this.bookTemplate(pageIndex));
      return this.pageList[pageIndex];
    }
    if($('#page' + pageIndex)[0]) {
      return $('#page' + pageIndex).parents('.FBPage');
    }
  };

  /**
   *绘制pod模板
   */
  FB.prototype.bookTemplate = function (n) {

    var podData = this._bookData.podData;
    var data =  this._bookData;
    var pageBox = $('<div class="page"></div>');
    if(data.editUrl && podData[n].content_type != 4&& podData[n].content_type != 5){
      var editBtn = $('<a class="tf_btn" href="'+data.editUrl+ '?page='+n+'&contentType='+podData[n].content_type+'">编辑当前页面</a>');
      editBtn.css({
        position: 'absolute',
        background: 'rgba(0,0,0,.8)',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '120px',
        textAlign: 'center',
        height: '30px',
        lineHeight: '30px',
        left: '50%',
        zIndex: '30',
        marginLeft: '-60px',
        top: '50%',
        marginTop: '15px',
        display:'none',
        textDecoration:'none'
      });
      editBtn.appendTo(pageBox);
      $('.FBPage').hover(function () {
        $(this).find('.tf_btn').show();
      },function () {
        $(this).find('.tf_btn').hide();
      })
    }
    if(n>0 && n<data.allPageCount && this._bookData.isSinglePage){
      if(n%2){
        pageBox.addClass('even')
      }else{
        pageBox.addClass('odd')
      }
    }

    /**
     *设置文字居中居左居右
     * @param ops
     * @returns {*}
     */
    function fontAlign(ops){
      switch(ops){
        case 1:
          return 'left';
        case 2:
          return 'right';
        case 3:
          return 'center';
      }
    }
    //得到图片自身的旋转
    function getOrientationRotation(orientation) {
      switch (orientation) {
        case 3:
          return 180;
        case 6:
          return 90;
        case 8:
          return 270;
        default:
          return 0;
      }
    }

    function handlePostionXY(imageMetaData,data) {
      //显示区域的大小
      var width = imageMetaData.element_width - imageMetaData.element_content_left - imageMetaData.element_content_right;
      var height = imageMetaData.element_height - imageMetaData.element_content_top - imageMetaData.element_content_bottom;
      //图片的宽高     //旋转就调换宽高
      var oWidth = imageMetaData.image_content_expand.image_height;
      var oHeight = imageMetaData.image_content_expand.image_width;
      //要显示图片的大小
      var scale, x1, y1, ox, oy, oScale;
      // 居中裁剪方式
      if ((oWidth / oHeight) > (width / height)) {// 宽度超过，以高度为准
        scale = (height / oHeight).toFixed(2);
      } else {// 高度超过，以宽度为准
        scale = (width / oWidth).toFixed(2);
      }

      //旋转后的高宽
      var rotated_width = oHeight * scale * data.ratioWidth;
      var rotated_height = oWidth * scale * data.ratioHeight;

      // 0度时候 得到其居中裁剪的值
      if ((oHeight / oWidth) > (width / height)) {// 宽度超过，以高度为准
        oScale = (height / oWidth).toFixed(2);
        oy = 0;
        ox = -(oHeight * oScale - width) / 2;
      } else {// 高度超过，以宽度为准
        oScale = (width / oHeight).toFixed(2);
        ox = 0;
        oy = -(oWidth * oScale - height) / 2;
      }

      //原始的高宽
      var original_width = oHeight * oScale * data.ratioWidth;
      var original_height = oWidth * oScale * data.ratioHeight;

      //计算偏移量
      var dx = (rotated_width - original_width) / 2;
      var dy = (rotated_height - original_height) / 2;
      x1 = -(dx + Math.abs(ox));
      y1 = -(dy + Math.abs(oy));
      return {x: x1, y: y1}
    }
    /**
     *绘制pod内页元素
     */
    console.log('n111',n);
    if(podData[n].element_list.length>0){
      for(var j=0; j<podData[n].element_list.length;j++){
        var liStyle = podData[n].element_list[j];
        var pageList = $('<div class="page_center_list podPage_'+n+'"></div>');
        var imgBox = $('<div class="imgBox"></div>');
        var pageImg = $('<img class="imgLoading"  />');
        var imageCfig = liStyle.image_content_expand;
        var imageRotation = imageCfig.image_rotation;
        var rotation = imageCfig.image_rotation + getOrientationRotation(imageCfig.image_orientation);
        var boxWidth = Math.floor(liStyle.element_width*data.ratioWidth);
        var boxHeight =Math.floor(liStyle.element_height*data.ratioHeight);
        var imgData = {};
        pageList.css({
          width:boxWidth < 1 ? 1: boxWidth,
          height:boxHeight < 1 ? 1: boxHeight,
          'position': 'absolute',
          'top':liStyle.element_top*data.ratioHeight,
          'left':liStyle.element_left*data.ratioWidth,
          'overflow':'hidden',
          'backgroundImage':liStyle.element_background ? 'url('+liStyle.element_background+')' : 'none',
          'backgroundSize':'100%',
          'zIndex':liStyle.element_depth,
          'transform':'rotate('+liStyle.element_rotation +'deg)'
        });

        if(liStyle.element_mask_image){
          var svgWidth = liStyle.element_width*data.ratioWidth - (liStyle.element_content_left+liStyle.element_content_right+imageCfig.image_padding_left)* data.ratioWidth
          var svgHeight =  liStyle.element_height*data.ratioHeight-(liStyle.element_content_top+liStyle.element_content_bottom+imageCfig.image_padding_top)* data.ratioHeight
          var svgTransform =  'rotate(' + imageRotation + ' ' + (svgWidth/2) + ' ' + (svgHeight/2) +')';
          var top = (imageCfig.image_padding_top + imageCfig.image_start_point_y) * data.ratioHeight;
          var left = (imageCfig.image_padding_left + imageCfig.image_start_point_x ) * data.ratioWidth;
          /*if (imageRotation == 90 || imageRotation == 270) {
           if(imageCfig.image_start_point_x1 == 0 && imageCfig.image_start_point_y1 == 0){
           var offset = handlePostionXY(liStyle,data);
           left = offset.x;
           top = offset.y;
           }else{
           left = imageCfig.image_start_point_x1;
           top = imageCfig.image_start_point_y1;
           }

           console.log('offset',offset)
           }*/
          var imageWidth = imageCfig.image_width * imageCfig.image_scale * data.ratioWidth;
          var imageHeight = imageCfig.image_height * imageCfig.image_scale * data.ratioHeight;
          // if(imageCfig.image_orientation == 6 || imageCfig.image_orientation == 8){
          // 	 imageWidth = imageCfig.image_height * imageCfig.image_scale * data.ratioHeight;
          // 	 imageHeight = imageCfig.image_width * imageCfig.image_scale * data.ratioWidth;
          // }
          if(rotation == 90 || rotation == 270) {
            imageWidth = imageCfig.image_height * imageCfig.image_scale * data.ratioHeight;
            imageHeight = imageCfig.image_width * imageCfig.image_scale * data.ratioWidth;
          }

          /*imgBox = $("<svg></svg>");
           imgBox.attr({
           "id":"svg_mask_wrap"+n,
           width:svgWidth,
           height:svgHeight,
           baseProfile:'full',
           version:'1.2'
           });
           imgBox.appendTo(pageList);
           var defs = $("<defs></defs>");
           defs.appendTo(imgBox);
           var mask = $("<mask></mask>");
           mask.attr({
           id:'svg_mask_' + n,
           maskUnits:'userSpaceOnUse',
           maskContentUnits:'userSpaceOnUse',
           "transform":'scale(1)'
           });
           mask.appendTo(defs);
           var image = $('<image></image>');
           image.attr({
           fill:'black',
           width:svgWidth,
           height:svgHeight,
           'xlink:href':liStyle.element_mask_image
           });
           image.appendTo(mask);
           var image1 = $('<image></image>');
           image1.attr({
           mask:"url(#svg_mask_"+n+")",
           y:top,
           x:left,
           width:imageWidth,
           height:imageHeight

           })*/

          var imgBox1=$("<svg id='svg_mask_wrap"+n+"' width='"+svgWidth+"' height='"+svgHeight+"' baseProfile='full' version='1.2'>" +
            "<defs><mask id='svg_mask_"+n+"' maskUnits='userSpaceOnUse' maskContentUnits='userSpaceOnUse'" +
            "transform='scale(1)'><image fill='black' width='"+svgWidth+"' height='"+svgHeight+"' xlink:href='" +
            liStyle.element_mask_image+"' /></mask></defs><image mask='url(#svg_mask_"+n+")'  y='"+top +"' x='"+left +"' " +
            "width='"+imageWidth+"' height='"+imageHeight+"'  xlink:href='" +
            liStyle.image_content_expand.image_url+'@' + imageCfig.image_rotation + 'r_2o'+"' /><rect mask='url(#svg_mask_"+n+")' x='0' y='0' width='100%' height='100%'  class='svg_hover_style'  fill='#000000' opacity='0'/></svg>");
          imgBox1.appendTo(imgBox);
        }
        imgBox.css({
          'top':Math.floor(liStyle.element_content_top*data.ratioWidth),
          'left':Math.floor(liStyle.element_content_left*data.ratioHeight),
          'right':Math.floor(liStyle.element_content_right*data.ratioHeight),
          'bottom':Math.floor(liStyle.element_content_bottom*data.ratioWidth),
          'position': 'absolute',
          'overflow':'hidden'
        });
        imgBox.appendTo(pageList)
        switch (liStyle.element_type){
          case 1:
            if(!liStyle.element_deleted){
              if(!liStyle.element_content){
                pageList.css({
                  display:'none'
                })
              }
              if(!liStyle.element_mask_image){
                pageImg.attr({
                  'data-original':imageCfig.image_url + '@' + imageRotation+ 'r_2o'
                });
                /*if (imageRotation == 90 || imageRotation == 270) {
                 if(imageCfig.image_start_point_x1 == 0 && imageCfig.image_start_point_y1 == 0){
                 var offset = handlePostionXY(liStyle,data);
                 imageCfig.image_start_point_x = offset.x;
                 imageCfig.image_start_point_y = offset.y;
                 }else{
                 imageCfig.image_start_point_x = imageCfig.image_start_point_x1;
                 imageCfig.image_start_point_y = imageCfig.image_start_point_y1;
                 }

                 console.log('offset',offset)
                 }*/

                // if(imageCfig.image_orientation == 6 || imageCfig.image_orientation == 8){
                // 	imgData.width = Math.floor(imageCfig.image_height *data.ratioHeight)* imageCfig.image_scale;
                // 	imgData.height = Math.floor(imageCfig.image_width *data.ratioWidth)* imageCfig.image_scale;
                // }else{
                // 	imgData.width = Math.floor(imageCfig.image_width *data.ratioWidth)* imageCfig.image_scale;
                // 	imgData.height = Math.floor(imageCfig.image_height *data.ratioHeight)* imageCfig.image_scale;
                // }
                if(rotation == 90 || rotation == 270){
                  imgData.width = Math.floor(imageCfig.image_height *data.ratioHeight)* imageCfig.image_scale;
                  imgData.height = Math.floor(imageCfig.image_width *data.ratioWidth)* imageCfig.image_scale;
                }else{
                  imgData.width = Math.floor(imageCfig.image_width *data.ratioWidth)* imageCfig.image_scale;
                  imgData.height = Math.floor(imageCfig.image_height *data.ratioHeight)* imageCfig.image_scale;
                }
                pageImg.css({
                  width:imgData.width,
                  height:imgData.height,
                  'top':Math.floor((imageCfig.image_padding_top + imageCfig.image_start_point_y)) *data.ratioHeight,
                  'left':Math.floor((imageCfig.image_padding_left + imageCfig.image_start_point_x ))*data.ratioWidth,
                  'position': 'absolute'
                  /*'transform':'rotate('+imageRotation +'deg)'*/
                });
                pageImg.appendTo(imgBox)
              }
            }
            break;
          case 5:
            if(!liStyle.element_deleted) {
              pageImg.attr({
                'data-original':imageCfig.image_url
              });
              var gWidth =Math.floor(Math.floor(imageCfig.image_width *data.ratioWidth)* imageCfig.image_scale);
              var gHeight = Math.floor(Math.floor(imageCfig.image_height *data.ratioHeight)* imageCfig.image_scale);
              pageImg.css({
                width:gWidth <1 ? 1: gWidth,
                height:gHeight < 1 ? 1:gHeight,
                'top':Math.floor((imageCfig.image_padding_top + imageCfig.image_start_point_y)*data.ratioHeight),
                'left':Math.floor((imageCfig.image_padding_left + imageCfig.image_start_point_x )*data.ratioWidth),
                'position': 'absolute'
              });


              pageImg.appendTo(imgBox)
            }
            break;
          case 2:
            console.log('liStyle',liStyle);
            if(!liStyle.element_deleted) {
              pageImg.attr({
                'data-original':imageCfig.image_url
              });
              pageImg.css({
                width:Math.floor(imageCfig.image_width *data.ratioWidth)* imageCfig.image_scale,
                height:Math.floor(imageCfig.image_height* data.ratioHeight)* imageCfig.image_scale,
                'top':(imageCfig.image_padding_top + imageCfig.image_start_point_y)*data.ratioHeight,
                'left':(imageCfig.image_padding_left + imageCfig.image_start_point_x )*data.ratioWidth,
                'position': 'absolute'
              });

              pageImg.appendTo(imgBox)
            }
            break;
        }
        /*	pageImg.lazyload({
         effect : "fadeIn"
         });*/
        pageList.appendTo(pageBox)


      }
    }

    return pageBox.css({
      'background-image':'url('+podData[n].page_image+')',
      'background-color':podData[n].page_color,
      'background-size':100+'%',
      'width':data.width+'px',
      'height':data.height+'px',
      'position':'relative'
    });
  };

  /*初始化渲染*/
  FB.prototype.initTemplate = function (index) {
    var data =  this._bookData;
    var that = this;
    console.log('that.zoomScale',that.zoomScale);
    $('#bookShadow').css({
      width:data.width+'px',
      height:data.height+'px'
    })
    $('#main,#pageList').css({
      width:data.width *2+'px',
      height:data.height +'px'
    })

    var pageHtml =  this.bookTemplate(index);
    var appenDom = this._bookData.container;
    pageHtml.appendTo(appenDom);
    $('img.imgLoading').lazyload({
      effect : "fadeIn"
    });

    setTimeout(function () {
      $('.FBPage').hover(function () {
        $(this).find('.tf_btn').show();
      },function () {
        $(this).find('.tf_btn').hide();
      })
    },100)

  };

  /**
   *po拖动翻页
   */
  FB.prototype.initSilider = function () {
    var podBox = this._bookData;
    var that = this;
    var silider = $('<div class="range_slider" style="display:none;" >' +
      '<input type="text" id="example_id" name="example_name" value="" />' +
      '</div>');
    silider.appendTo('#main');
    var selector = '[data-rangeSlider]',
      elements = document.querySelectorAll(selector);
    var sp;
    $("#example_id").ionRangeSlider({
      min:0,
      max:podBox.allPageCount -1,
      from:0,
      type:'single',

      onChange:function (data) {

      },
      onFinish:function (data) {
        var value =  data.from;
        var isNext = value > that.currentPageIndex ? true : false;
        var currNum;
        if(isNext){
          if(value -that.currentPageIndex == 1){
            currNum = value;
          }else{
            currNum = value-1;
          }
        }else{
          //console.log('减法',value -fb.currentPageIndex);
          if(value -that.currentPageIndex == -1 || value -that.currentPageIndex == -2){
            currNum = value+1
          }else{
            currNum = value +2
          }

        }

        if(that.zoomScale ==1){
          sp = {
            x:isNext ? that.width *2 - 100  : 100 * that.ratioWidth,
            y:that.height - (150 * that.ratioHeight)
          };
        }else{
          sp = {
            x:isNext ? that.width - (100 *that.zoomScale) : 100 * that.zoomScale,
            y:that.height - (150 * that.zoomScale)
          };
        }

        //fb.currentPageIndex == value ? null : fb.keyTouch(sp);
        if (that.currentPageIndex != value  && that.currentPageIndex != currNum) {
          //保留上次页码
          that.lastPageIndex = that.currentPageIndex;
          //只翻偶数页
          if(currNum % 2 > 0 && that.zoomScale ==1){
            isNext ? that.currentPageIndex = currNum - 1 : that.currentPageIndex = currNum + 1;
          }else{
            if(value == 0){
              that.currentPageIndex = that.zoomScale ==1 ? value +2 :value +1
            }else if(value == podBox.allPageCount){
              that.currentPageIndex = that.zoomScale ==1 ? value -2 :value -1
            }else{
              that.currentPageIndex = currNum
            }
          }
          that.keyTouch(sp);
        }
      },
      prettify:function (num) {
        if(num ==0){
          $(".irs-single").hide();
          return ' '
        }else if(num == podBox.allPageCount-1){
          $(".irs-single").hide();
          return ' '
        } else{
          console.log('页面样式',that._bookData)
          var bookData = that._bookData.podData;
          if(bookData[that.currentPageIndex].content_type == 8){
            $(".irs-single").hide();
            return ''
          }else if(bookData[that.currentPageIndex].content_type == 9){
            $(".irs-single").hide();
            return ''
          }else if(bookData[that.currentPageIndex].content_type == 4){
            $(".irs-single").hide();
            return ''
          }else if(bookData[that.currentPageIndex].content_type == 5){
            $(".irs-single").hide();
            return ''
          }else{
            $(".irs-single").hide();
            return ''
          }

        }
      }
    });
    window.slider = $("#example_id").data("ionRangeSlider");
  };

  /**
   *左右翻页
   */
  FB.prototype.aboutFlip = function (ops) {

    if(ops == 'next'){
      var sp = {
        x:this.width *2 - (100*this.ratioHeight),
        y: this.height -(150  *this.ratioHeight)
      };
      this.keyTouch(sp);
    }

    if(ops == 'previous'){
      var sp = {
        x:100 * this.ratioWidth,
        y: this.height -(150  *this.ratioHeight)
      };
      this.keyTouch(sp);
    }
  }
  window.Timeface = window.Timeface || {};
  Timeface.FlipBook = FB;
})();


/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2015 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.7
 *
 */

(function($, window, document, undefined) {
  var $window = $(window);

  $.fn.lazyload = function(options) {
    var elements = this;
    var $container;
    var settings = {
      threshold       : 0,
      failure_limit   : 0,
      event           : "scroll",
      effect          : "show",
      container       : window,
      data_attribute  : "original",
      skip_invisible  : false,
      appear          : null,
      load            : null,
      placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
    };

    function update() {
      var counter = 0;

      elements.each(function() {
        var $this = $(this);
        if (settings.skip_invisible && !$this.is(":visible")) {
          return;
        }
        if ($.abovethetop(this, settings) ||
          $.leftofbegin(this, settings)) {
          /* Nothing. */
        } else if (!$.belowthefold(this, settings) &&
          !$.rightoffold(this, settings)) {
          $this.trigger("appear");
          /* if we found an image we'll load, reset the counter */
          counter = 0;
        } else {
          if (++counter > settings.failure_limit) {
            return false;
          }
        }
      });

    }

    if(options) {
      /* Maintain BC for a couple of versions. */
      if (undefined !== options.failurelimit) {
        options.failure_limit = options.failurelimit;
        delete options.failurelimit;
      }
      if (undefined !== options.effectspeed) {
        options.effect_speed = options.effectspeed;
        delete options.effectspeed;
      }

      $.extend(settings, options);
    }

    /* Cache container as jQuery as object. */
    $container = (settings.container === undefined ||
    settings.container === window) ? $window : $(settings.container);

    /* Fire one scroll event per scroll. Not one scroll event per image. */
    if (0 === settings.event.indexOf("scroll")) {
      $container.on(settings.event, function() {
        return update();
      });
    }

    this.each(function() {
      var self = this;
      var $self = $(self);

      self.loaded = false;

      /* If no src attribute given use data:uri. */
      if ($self.attr("src") === undefined || $self.attr("src") === false) {
        if ($self.is("img")) {
          $self.attr("src", settings.placeholder);
        }
      }

      /* When appear is triggered load original image. */
      $self.one("appear", function() {
        if (!this.loaded) {
          if (settings.appear) {
            var elements_left = elements.length;
            settings.appear.call(self, elements_left, settings);
          }
          $("<img />")
            .one("load", function() {
              var original = $self.attr("data-" + settings.data_attribute);
              $self.hide();
              if ($self.is("img")) {
                $self.attr("src", original);
              } else {
                $self.css("background-image", "url('" + original + "')");
              }
              $self[settings.effect](settings.effect_speed);

              self.loaded = true;

              /* Remove image from array so it is not looped next time. */
              var temp = $.grep(elements, function(element) {
                return !element.loaded;
              });
              elements = $(temp);

              if (settings.load) {
                var elements_left = elements.length;
                settings.load.call(self, elements_left, settings);
              }
            })
            .attr("src", $self.attr("data-" + settings.data_attribute));
        }
      });

      /* When wanted event is triggered load original image */
      /* by triggering appear.                              */
      if (0 !== settings.event.indexOf("scroll")) {
        $self.on(settings.event, function() {
          if (!self.loaded) {
            $self.trigger("appear");
          }
        });
      }
    });

    /* Check if something appears when window is resized. */
    $window.on("resize", function() {
      update();
    });

    /* With IOS5 force loading images when navigating with back button. */
    /* Non optimal workaround. */
    if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
      $window.on("pageshow", function(event) {
        if (event.originalEvent && event.originalEvent.persisted) {
          elements.each(function() {
            $(this).trigger("appear");
          });
        }
      });
    }

    /* Force initial check if images should appear. */
    $(document).ready(function() {
      update();
    });

    return this;
  };

  $.belowthefold = function(element, settings) {
    var fold;

    if (settings.container === undefined || settings.container === window) {
      fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
    } else {
      fold = $(settings.container).offset().top + $(settings.container).height();
    }

    return fold <= $(element).offset().top - settings.threshold;
  };

  $.rightoffold = function(element, settings) {
    var fold;

    if (settings.container === undefined || settings.container === window) {
      fold = $window.width() + $window.scrollLeft();
    } else {
      fold = $(settings.container).offset().left + $(settings.container).width();
    }

    return fold <= $(element).offset().left - settings.threshold;
  };

  $.abovethetop = function(element, settings) {
    var fold;

    if (settings.container === undefined || settings.container === window) {
      fold = $window.scrollTop();
    } else {
      fold = $(settings.container).offset().top;
    }

    return fold >= $(element).offset().top + settings.threshold  + $(element).height();
  };

  $.leftofbegin = function(element, settings) {
    var fold;

    if (settings.container === undefined || settings.container === window) {
      fold = $window.scrollLeft();
    } else {
      fold = $(settings.container).offset().left;
    }

    return fold >= $(element).offset().left + settings.threshold + $(element).width();
  };

  $.inviewport = function(element, settings) {
    return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
      !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
  };

  $.extend($.expr[":"], {
    "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
    "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
    "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
    "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
    "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
    /* Maintain BC for couple of versions. */
    "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
    "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
    "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
  });

})(jQuery, window, document);
