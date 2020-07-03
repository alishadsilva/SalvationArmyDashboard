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
    "esri/dijit/LocateButton",
    'dojo/_base/html',
    'dojo/on',
    'dojo/query',
    'dojo/_base/lang',
    'jimu/utils',
    "./Compass",
    "./a11y/Widget",
    "esri/toolbars/draw", 
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/graphic", 
    "esri/Color",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/_base/array",
    'jimu/dijit/Message',
    'dojo/touch'
  ],
  function(declare, BaseWidget, LocateButton, html, on, query, lang, jimuUtils, Compass, a11y, Draw,SimpleLineSymbol, SimpleFillSymbol, Graphic, Color, Query, QueryTask, domConstruct, domStyle, arrayUtils) {
    var clazz = declare([BaseWidget], {

      name: 'DrawPolygon',
      baseClass: 'jimu-widget-drawpolygon',

      moveTopOnActive: false,

      startup: function() {
        this.inherited(arguments);
        this.a11y_updateLabel(this.nls._widgetLabel);
        this.placehoder = html.create('div', {
          'class': 'place-holder',
          title: this.label
        }, this.domNode);
        this.own(on(this.placehoder, 'click', lang.hitch(this, this.onLocationClick)))
        this.placehoder.title ="Draw Polygon";
      },

      onLocationClick: function(evt) {
        console.log("Location test")
        var markerpolySymbol = new SimpleFillSymbol();
            markerpolySymbol.setColor(new Color([255,255,0,0.25]));

            var toolbar = new Draw(this.map);
            toolbar.activate(Draw.POLYGON)
            toolbar.on("draw-end", addGraphic);

          function addGraphic(polyevt){
            var symbol=markerpolySymbol;
            this.map.graphics.add(new Graphic(polyevt.geometry, symbol))
            toolbar.deactivate()
            var queryTask = new QueryTask(this.map._layers.GenasysSAInputshosted_5866.url)
            var queryparams= new Query()
            queryparams.geometry= this.map.graphics.graphics[1].geometry
            queryparams.where="1=1"
            queryparams.outFields=['*']
            queryparams.spatialRelationship= Query.SPATIAL_REL_CONTAINS

            queryTask
            .execute(queryparams)
            .addCallback(lang.hitch(this, function (response) {
              console.log(response)
              var tc = query("#select1")
              arrayUtils.map(response.features, lang.hitch(this, function (feature) {
                var innerhtml= "<b>Corp Name: </b>" + feature.attributes.USER_Corps + "<br> <b>Corp Address: </b>" + feature.attributes.USER_Cor_1 +  "<br> <b> Total Volunteers interested in responding to disasters: </b>"+ feature.attributes.USER_Appro +"<br> <b>Number of Kitchens: </b>" + feature.attributes.USER_Kitch + "<br> <b>Number of available canteens: </b>"+feature.attributes.USER_Cante+  "<br> <b>Amount & types of vehicles: </b>" +feature.attributes.USER_Oth_1 +"<br> <b> Meals a day: </b>" +feature.attributes.USER_Meals +"<br> <b> What is the Facility good at? </b>"+feature.attributes.USER_What_ + "<br> <b> Number of active EDS volunteers: </b>" + feature.attributes.USER_How_m +"<br>---------------------------------------------------------------------------<br>"
                var testdiv= domConstruct.create("div", {id: "test", innerHTML: innerhtml }, tc[0], "first")
                domStyle.set(testdiv, "font-family", "inherit")
              }));
            }))
           }
          }
        });
    clazz.inPanel = false;
    clazz.hasUIFile = false;

    clazz.extend(a11y);//for a11y
    return clazz;
  });