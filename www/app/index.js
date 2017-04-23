'use strict';

function noop() {}

// From: https://github.com/lodash/lodash/blob/master/shuffle.js
function shuffle(array) {
  var length = array == null ? 0 : array.length;
  if (!length) { return []; }

  var index = -1;
  var lastIndex = length - 1;
  var result = array;
  while (++index < length) {
    var rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
    var value = result[rand];
    result[rand] = result[index];
    result[index] = value;
  }
  return result
}

function bindEvents(thisArg, events) {
   Object.keys(events).forEach(function (selector) {
        Object.keys(events[selector]).forEach(function (event) {
            var handler = events[selector][event].bind(thisArg);
            if('document' === selector) {
                document.addEventListener(event, handler, false);
            } else if ('window' === selector) {
                window.addEventListener(event, handler, false);
            } else {
                document.querySelectorAll(selector).forEach(function (dom) {
                    dom.addEventListener(event, handler, false);
                });
            }
        });
    }); // all events bound
}

function f(name, params) {
  params = Array.prototype.slice.call(arguments, 1, arguments.length);
  return name + '(' + params.join(', ') + ')';
}

var IS_CORDOVA = !!window.cordova;

var app = {
  // options
  DATA_KEY: 'com.metaist.logicalfallacy.data',
  store: null,
  options: {
    debug: true
  },

  // internal
  idx: 0,

  // DOM
  $slug: null,
  $title: null,
  $head: null,
  $desc: null,
  $example: null,

  init: function () {
    bindEvents(this, {
      'document': {'deviceready': this.ready},
      'form input': {'change': this.change},
      'main': {'click': this.next}
    });

    if(!IS_CORDOVA) {
      this.options.debug && console.log('NOT cordova');
      bindEvents(this, {'window': {'load': this.ready}});
    }

    return this;
  },

  ready: function () {
    // Store DOM nodes
    this.$slug = document.querySelector('#content .slug');
    this.$title = document.querySelector('#content .title');
    this.$head = document.querySelector('#content .head');
    this.$desc = document.querySelector('#content .description');
    this.$example = document.querySelector('#content .example');

    // Grab preferences
    // if(IS_CORDOVA) {
    //   this.store = plugins.appPreferences;
    //   this.store.fetch(this.DATA_KEY).then(function (data) {
    //     Object.assign(this.options, data || {});
    //     // TODO: update settings UI
    //     this.render();
    //   }.bind(this));
    // }

    return this.reset()
               .next();
  },

  change: function () {
    // TODO: check values and update options

    // if (IS_CORDOVA) {
    //   this.store.store(noop, noop, this.DATA_KEY, this.options);
    // }//end if: options stored
    // return this;
  },

  render: function () {
    var data = FALLACIES[this.idx];
    this.$slug.setAttribute('class', 'icon-' + data.slug);
    this.$title.innerText = data.title;
    this.$head.innerText = data.head;
    this.$desc.innerHTML = data.description;
    this.$example.innerHTML = data.exampleText;

    return this;
  },

  reset: function () {
    this.options.debug && console.log('reset');
    FALLACIES = shuffle(FALLACIES);
    this.idx = 0;
    return this;
  },

  next: function () {
    this.options.debug && console.log('next', this.idx);
    this.idx++;
    if (this.idx >= FALLACIES.length) { this.reset(); }
    return this.render();
  },

};

app.init();
