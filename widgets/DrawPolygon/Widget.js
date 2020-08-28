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
  "dijit/registry",
  'dojo/_base/lang',
  'jimu/utils',
  "./Compass",
  "./a11y/Widget",
  "esri/toolbars/draw",
  "esri/symbols/SimpleFillSymbol",
  "esri/graphic", 
  "esri/Color",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "dojo/dom-construct",
  "dojo/dom-style",
  "dojo/_base/array",
  "dijit/form/TextBox",
  "dijit/form/Button",
  "dojox/layout/TableContainer",
  "dijit/layout/ContentPane",
  'jimu/dijit/Message',
  'dojo/touch'
],
function(declare, BaseWidget, geometryEngine, html, on, query, registry, lang, jimuUtils, Compass, a11y, Draw, SimpleFillSymbol, Graphic, Color, Query, QueryTask, domConstruct, domStyle, arrayUtils, TextBox, Button, TableContainer, ContentPane) {
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
      this.map.graphics.clear()
      var markerpolySymbol = new SimpleFillSymbol();
          markerpolySymbol.setColor(new Color([255,255,0,0.25]));

          var toolbar = new Draw(this.map);
          toolbar.activate(Draw.POLYGON)
          toolbar.on("draw-end", addGraphic);

        function addGraphic(polyevt){
          toolbar.deactivate()
          // _onBarClick()
          var content=["Distance", "Corp Name", "Corp Address", "Specialty"]
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
          
          domConstruct.empty('select1')
          var tc = query("#select1")

          var arrayvolunteers= []
          var arraykitchens=[]
          var arraycanteens=[]
          var arraymeals=[]
          var arrayminivans=[]
          var arraycaravans=[]
          var arrayford=[]

          data= arrayUtils.map(response.features, lang.hitch(this, function (feature) {
            arrayvolunteers.push(feature.attributes.USER_Appro)
            arraykitchens.push(feature.attributes.USER_Kitch)
            arraycanteens.push(feature.attributes.USER_Cante)
            arraymeals.push(feature.attributes.meals)
            arrayminivans.push(feature.attributes.minivans)
            arraycaravans.push(feature.attributes.USER_Trail)
            arrayford.push(feature.attributes.fordtransit)

            return {
              "CorpName" : feature.attributes.USER_Corps,
              "Address" : feature.attributes.USER_Cor_1,
              "Speciality" : feature.attributes.USER_What_
            }
          }));

          function totalservices(a, b){
            return a + b;
          }

          var innerhtml= "<p id ='p2'><b>Number of Volunteers interested in responding to disaster: </b>" +arrayvolunteers.reduce(totalservices, 0) + "</p><p id ='p3'> <b> Number of Kitchens: </b>"+ arraykitchens.reduce(totalservices,0) +"</p><p id = 'p4'><b> Number of available canteens: </b>"+ arraycanteens.reduce(totalservices,0) + "</p><p id= 'p5'><b> Meals Per Day: </b>" + arraymeals.reduce(totalservices,0) + "</p><p id = 'p6'><b> Available Vehicles by type: </b>" + "</p><p id = 'p7'> <b> Mini-Vans: </b>" + arrayminivans.reduce(totalservices,0) + "</p><p id = 'p8'> <b> Caravans: </b>" + arraycaravans.reduce(totalservices,0) +"</p><p id = 'p9'> <b> Ford Transit: </b>" + arrayford.reduce(totalservices,0)+"</p>"

          if (registry.byId('cp0')){
              registry.byId('cp0').destroy()
            }
          var cp0= new ContentPane({
            id: "cp0",
            content:innerhtml,
            style: "border-bottom: groove; padding-bottom: 18px;"
          },domConstruct.create("div", {id:"cp0div"}))

          if (registry.byId('tc1')){
            registry.byId('tc1').destroy()
          }
          var contenttable= new TableContainer({
            id: "tc1",
            cols: 2
          },domConstruct.create("div",{id:"tcontainer"}, query("#select1")[0], "after"))
          domStyle.set(contenttable, "font-family", "inherit")


          if (registry.byId('cp1')){
            registry.byId('cp1').destroy()
          }
          var cp1= new ContentPane({
            id: "cp1",
            style: "margin-top: 10px;",
            content: "<p> <b> Message all locations within drawn area: </b> </p>"
          }, domConstruct.create("div", {id:"cp1div"}))


          if (registry.byId('textbox')){
            registry.byId('textbox').destroy()
          }
          var myTextBox = new TextBox({
            name: "Message",
            id: "textbox",
            style: "margin-left: 7px; width: 80%;",
            value: "" /* no or empty value! */,
            placeHolder: "Type your message here."
        }, domConstruct.create("div",{id:"textboxdiv"}));

          if (registry.byId('myButton')){
            registry.byId('myButton').destroy()
          }      

          var myButton = new Button({
            id: "myButton",
            iconClass: "dijitIconMail",
            // iconClass="myIcon",
            showLabel: false,
            label: "Send",
            style: "padding: 7px 7px 7px 7px;"
          }, domConstruct.create("button",{id:"sendbutton"}))

          contenttable.addChild(cp0)
          contenttable.addChild(cp1)
          contenttable.addChild(myTextBox)
          contenttable.addChild(myButton)

          for (x in data){
            var locid= parseInt(x)+1
            var content= "<p id = 'p20'> Location #"+ locid +"<p id='p21'> <b> Corp Name: </b>" + data[x]["CorpName"] + "</p><p id = 'p22'> <b> Corp Address: </b>" +data[x]["Address"] + "</p><p id='p23'> <b> Speciality: </b>" + data[x]["Speciality"]
            if (registry.byId("cp2" +x)){
              registry.byId("cp2" +x).destroy()
            }            
            var cp2= new ContentPane({
              id:"cp2" +x,          
              content:content,
              style: "border-top: solid; border-top-width: thin; margin-top: 25px"
            },domConstruct.create("div", {id:"cp2div"+x}))
            contenttable.addChild(cp2)
        }
    }))
  }
}
});
  clazz.inPanel = false;
  clazz.hasUIFile = false;

  clazz.extend(a11y);//for a11y
  return clazz;
});