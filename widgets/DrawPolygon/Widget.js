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
    "dijit/registry",
    "dijit/form/CheckBox",
    'jimu/dijit/Message',
    'dojo/touch'
  ],
  function(declare, BaseWidget, geometryEngine, html, on, query, lang, jimuUtils, Compass, a11y, Draw,SimpleLineSymbol, SimpleFillSymbol, Graphic, Color, Query, QueryTask, domConstruct, domStyle, arrayUtils, registry, CheckBox) {
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
        // console.log("Location test")
        this.map.graphics.clear()
        var markerpolySymbol = new SimpleFillSymbol();
            markerpolySymbol.setColor(new Color([255,255,0,0.25]));

            var toolbar = new Draw(this.map);
            toolbar.activate(Draw.POLYGON)
            toolbar.on("draw-end", addGraphic);

          function addGraphic(polyevt){
            toolbar.deactivate()
            var symbol=markerpolySymbol;
            this.map.graphics.add(new Graphic(polyevt.geometry, symbol))
            toolbar.deactivate()
            var queryTask = new QueryTask(this.map._layers.GenasysSAInputshosted_5866.url)
            var queryparams= new Query()
            queryparams.geometry= this.map.graphics.graphics[0].geometry
            queryparams.where="1=1"
            queryparams.outFields=['*']
            queryparams.returnGeometry=true
            queryparams.spatialRelationship= Query.SPATIAL_REL_CONTAINS

            queryTask
            .execute(queryparams)
            .addCallback(lang.hitch(this, function (response) {
              var content=[]
              domConstruct.empty('select1')
              registry.byId('sendselected').set("disabled", false)
              registry.byId('selectall').set("disabled", false)
              var tc = query("#select1")
              arrayUtils.map(response.features, lang.hitch(this, function (feature) {
                var id= "cb_" + feature.attributes.FID
                var innerhtml= "<p id = \"p2\"><b>Corp Name: </b>" + feature.attributes.USER_Corps + " </p><p id=\"p3\"> <b>Corp Address: </b>" +"<a id='zoomto" +feature.attributes.FID+ "' href=#>"+feature.attributes.USER_Cor_1 +"</a></p> <p id=\"p4\"> <b> Total Volunteers interested in responding to disasters: </b>"+ feature.attributes.USER_Appro +"</p> <p id=\"p5\"> <b>Number of Kitchens: </b>" + feature.attributes.USER_Kitch + "</p> <p id=\"p6\"> <b>Number of available canteens: </b>"+feature.attributes.USER_Cante+  "</p> <p id=\"p7\"><b>Amount & types of vehicles: </b>" +feature.attributes.USER_Oth_1 +"</p> <p id=\"p8\"> <b> Meals a day: </b>" +feature.attributes.USER_Meals +"</p> <p id=\"p9\"><b> What is the Facility good at? </b>"+feature.attributes.USER_What_ + "<p> <p id=\"p10\"><b> Number of active EDS volunteers: </b>" + feature.attributes.USER_How_m +"</p>"

                var label= domConstruct.create("label", {for: id},tc[0], "after")
                var labeldiv= domConstruct.create("div",{id: "labeldiv",style: {padding: "2%", border: "1px solid", height:"300px"}})

                var mycb = registry.byId(id)
                if (mycb){
                  mycb.destroy()
                }

                var checkbox= domConstruct.create("input", {id: id})

                var checkboxdiv= domConstruct.create("div", {class: "checkbox", style:{width: "10%", float: "left"}})

                var contentdiv= domConstruct.create("div",{class: "contentdiv", style:{float: "right"}, innerHTML: innerhtml})

                labeldiv.appendChild(contentdiv)
                checkboxdiv.appendChild(checkbox)
                labeldiv.appendChild(checkboxdiv)
                label.appendChild(labeldiv)
                tc[0].appendChild(label)
                
                var dojocheckbox = new CheckBox({
                  name: id,
                  value: feature.attributes.FID,
                  checked: false,
              }, checkbox.id)

              var zoomtoid= "#zoomto"+ feature.attributes.FID 

              var zoomtonode= query(zoomtoid)
                zoomtonode[0].addEventListener("click", lang.hitch(this, function(){
                  this.map.centerAndZoom(feature.geometry,18)
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