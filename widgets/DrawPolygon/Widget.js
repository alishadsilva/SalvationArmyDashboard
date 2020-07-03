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
    "esri/geometry/geometryEngine",
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
  function(declare, BaseWidget, geometryEngine, html, on, query, lang, jimuUtils, Compass, a11y, Draw,SimpleLineSymbol, SimpleFillSymbol, Graphic, Color, Query, QueryTask, domConstruct, domStyle, arrayUtils) {
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
              var content=[]
              var tc = query("#select1")
              arrayUtils.map(response.features, lang.hitch(this, function (feature) {
                // arrayUtils.map(feature.attributes, lang.hitch(this, function (attribute){
                //   console.log(attribute)
                // }))
                var innerhtml= "<p id = \"p2\"><b>Corp Name: </b>" + feature.attributes.USER_Corps + " </p><p id=\"p3\"> <b>Corp Address: </b>" +"<a id='zoomto' href=#>" +feature.attributes.USER_Cor_1 +"</a></p> <p id=\"p4\"> <b> Total Volunteers interested in responding to disasters: </b>"+ feature.attributes.USER_Appro +"</p> <p id=\"p5\"> <b>Number of Kitchens: </b>" + feature.attributes.USER_Kitch + "</p> <p id=\"p6\"> <b>Number of available canteens: </b>"+feature.attributes.USER_Cante+  "</p> <p id=\"p7\"><b>Amount & types of vehicles: </b>" +feature.attributes.USER_Oth_1 +"</p> <p id=\"p8\"> <b> Meals a day: </b>" +feature.attributes.USER_Meals +"</p> <p id=\"p9\"><b> What is the Facility good at? </b>"+feature.attributes.USER_What_ + "<p> <p id=\"p10\"><b> Number of active EDS volunteers: </b>" + feature.attributes.USER_How_m +"</p> <p>---------------------------------------------------------------------------</p>"
                var testdiv= domConstruct.create("div", {id: "test", innerHTML: innerhtml }, tc[0], "first")
                domStyle.set(testdiv, "font-family", "inherit")
                var zoomtonode= query("#zoomto")
                zoomtonode[0].addEventListener("click", lang.hitch(this, function(){
                  this.map.centerAndZoom(feature.geometry,18)
                  var query = new Query();
                  query.geometry=feature.geometry
                  this.map._layers.GenasysSAInputshosted_5866.selectFeatures(query)
                }))
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