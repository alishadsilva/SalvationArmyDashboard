///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'jimu/BaseWidget',
    'dojo/_base/html',
    'dojo/on',
    'dojo/query',
    'dojo/_base/lang',
    "./a11y/Widget",
    "esri/toolbars/draw",
    "dojo/dom-construct",
    "dojo/dom-style",
    'jimu/dijit/Message',
    'dojo/touch'
  ],
  function(declare, BaseWidget, html, on, query, lang, a11y, Draw, domConstruct,domStyle) {
    var clazz = declare([BaseWidget], {

      name: 'ClearPolygon',
      baseClass: 'jimu-widget-clearpolygon',

      moveTopOnActive: false,

      startup: function() {
        this.inherited(arguments);
        this.a11y_updateLabel(this.nls._widgetLabel);
        this.placehoder = html.create('div', {
          'class': 'place-holder',
          title: this.label
        }, this.domNode);
        this.own(on(this.placehoder, 'click', lang.hitch(this, this.onClearClick)))
        this.placehoder.title ="Clear Polygon";
      },

      onClearClick: function(evt) {
        this.map.graphics.clear()
        toolbar.deactivate()
        // dojo.empty("display1")
        domConstruct.empty("select1")
        domConstruct.destroy('tc1')
        var barclick= query("#_20_panel")[0]
        domStyle.set(barclick, "left", "-360px")
          }
        });
    clazz.inPanel = false;
    clazz.hasUIFile = false;

    clazz.extend(a11y);//for a11y
    return clazz;
  });