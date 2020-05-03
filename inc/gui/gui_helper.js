/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
//init global gui values
myWidth = 0;
myHeight = 0;
var objCanvas = document.getElementById('gameCanvas');
ct = objCanvas.getContext('2d'); //table
var objCanvas2 = document.getElementById('gameCanvas2');
ct2 = objCanvas2.getContext('2d'); //active Player
var objCanvas3 = document.getElementById('gameCanvas3');
ct3 = objCanvas3.getContext('2d'); //nicks + dealerbutton
var objCanvas4 = document.getElementById('gameCanvas4');
ct4 = objCanvas4.getContext('2d'); //text
var objCanvas5 = document.getElementById('gameCanvas5');
ct5 = objCanvas5.getContext('2d'); //cardholders
var objCanvas6 = document.getElementById('gameCanvas6');
ct6 = objCanvas6.getContext('2d'); //cards
var objCanvas7 = document.getElementById('gameCanvas7');
ct7 = objCanvas7.getContext('2d'); //PlayerActions

//default loader theme
$( document ).on( "mobileinit", function() {
  $.mobile.loader.prototype.options.text = "loading ...";
  $.mobile.loader.prototype.options.textVisible = true;
  $.mobile.loader.prototype.options.theme = "c";
  $.mobile.loader.prototype.options.html = "";
});

// Avatar server URL
var avatarServerURL = 'http://pokerth.net/avatardav/';

///////////// GUI HELPER FUNCTION ////////////
CanvasRenderingContext2D.prototype.roundRect = function (xx,yy, ww,hh, rad, fill, stroke) {
    if (typeof(rad) == "undefined") rad = 5;
    this.beginPath();
    this.moveTo(xx+rad, yy);
    this.arcTo(xx+ww, yy,    xx+ww, yy+hh, rad);
    this.arcTo(xx+ww, yy+hh, xx,    yy+hh, rad);
    this.arcTo(xx,    yy+hh, xx,    yy,    rad);
    this.arcTo(xx,    yy,    xx+ww, yy,    rad);
    if (stroke) this.stroke();  // Default to no stroke
    if (fill || typeof(fill)=="undefined") this.fill();  // Default to fill
}; // end of fillRoundedRect method

function checkBrowserName(name){  
   var agent = navigator.userAgent.toLowerCase();  
   if (agent.indexOf(name.toLowerCase())>-1) {  
     return true;  
   }  
   return false;  
 };  
 
 //autosort listviews
 function sortListView() { //outdated 
	// Find all lists that use the autodivider feature and should be sorted
	
//		var list = $('ul[data-autodividers="true"][data-sort="true"]');
//		list.each(function (i, item) {
//			var that = $(item);
//			// Gel all the list items into an array (excluding te dividers)
//			var lis = that.find('li').not('.ui-li-divider').get();
//
//			// Sort the list items alphabetically, descending
//			lis.sort(function (a, b) {
//				var valA = $(a).text().toLowerCase(),
//					valB = $(b).text().toLowerCase();
//				if (valA < valB) {
//					return -1;
//				}
//				if (valA > valB) {
//					return 1;
//				}
//				return 0;
//			});
//
//			// Remove all list items
//			that.empty();
//
//			// Rebuild the list with the ordered items
//			$.each(lis, function (i, li) {
//				that.append(li);
//			});
//
//			// Refresh/rebuild the listview
//			that.listview('refresh');
//		});
};