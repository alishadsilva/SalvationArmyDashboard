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
define(['dojo/_base/declare',
"dijit/_TemplatedMixin",
'dijit/_WidgetsInTemplateMixin',
"dojo/dom-style",
'dojo/_base/lang',
'jimu/BaseWidget',
"esri/tasks/query",
"esri/tasks/QueryTask",
"esri/geometry/geometryEngine",
"dojo/_base/array",
'dojo/query',
"dojo/parser",
"dojo/dom-construct",
"dojox/layout/TableContainer",
"dojo/domReady!"
],
function(declare, _TemplatedMixin, _WidgetsInTemplateMixin, domStyle, lang, BaseWidget, Query, QueryTask, geometryEngine, arrayUtils, query, parser, domConstruct, TableContainer) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {

    baseClass: 'jimu-widget-popup',

    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
    },

    startup: function() {
      this.inherited(arguments);
      var programmatic = new TableContainer(
        {
          cols: 1
        }, dojo.byId("select1"))

      this.map.on("click", lang.hitch(this, function queryfeatures(evt){
        domConstruct.empty("select1")
        queryTask= new QueryTask("https://services2.arcgis.com/ffEKAbD1SATUihBS/arcgis/rest/services/GenasysSAInputshosted/FeatureServer/0")
          var queryparams= new Query()
          queryparams.where="1=1"
          queryparams.outFields=['*']
          queryparams.returnGeometry=true
          queryparams.spatialRelationship= Query.SPATIAL_REL_CONTAINS
          var test= geometryEngine.buffer(evt.mapPoint, 20, "miles")
          queryparams.geometry= test
          queryTask
            .execute(queryparams)
            .addCallback(lang.hitch(this, function (response) {
              var content=[]
              var tc = query("#select1")
              arrayUtils.map(response.features, lang.hitch(this, function (feature) {
                var num=geometryEngine.distance(evt.mapPoint, feature.geometry, "miles")
                var distance= num.toFixed(2)

                var innerhtml= "<p id =\"p1\"><b>Distance: </b>"+ distance +" mi </p> <p id = \"p2\"><b>Corp Name: </b>" + feature.attributes.USER_Corps + " </p><p id=\"p3\"> <b>Corp Address: </b>" +"<a id='zoomto' style= 'color: aqua' href=#>" +feature.attributes.USER_Cor_1 +"</a></p> <p id=\"p4\"> <b> Total Volunteers interested in responding to disasters: </b>"+ feature.attributes.USER_Appro +"</p> <p id=\"p5\"> <b>Number of Kitchens: </b>" + feature.attributes.USER_Kitch + "</p> <p id=\"p6\"> <b>Number of available canteens: </b>"+feature.attributes.USER_Cante+  "</p> <p id=\"p7\"><b>Amount & types of vehicles: </b>" +feature.attributes.USER_Oth_1 +"</p> <p id=\"p8\"> <b> Meals a day: </b>" +feature.attributes.USER_Meals +"</p> <p id=\"p9\"><b> What is the Facility good at? </b>"+feature.attributes.USER_What_ + "<p> <p id=\"p10\"><b> Number of active EDS volunteers: </b>" + feature.attributes.USER_How_m +"</p> <p>---------------------------------------------------------------------------</p>"
                var testdiv= domConstruct.create("div", {id: "test", innerHTML: innerhtml }, tc[0], "first")
                domStyle.set(testdiv, "font-family", "inherit")
                var zoomtonode= query("#zoomto")
                zoomtonode[0].addEventListener("click", lang.hitch(this, function(){
                this.map.centerAndZoom(feature.geometry,18)
                }))
              }));
            }))
          }))   
      console.log('startup');
    },

    onOpen: function(){
      console.log('onOpen');
    },

    onClose: function(){
      console.log('onClose');
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    },

    showVertexCount: function(count){
      this.vertexCount.innerHTML = 'The vertex count is: ' + count;
    }
  });
});