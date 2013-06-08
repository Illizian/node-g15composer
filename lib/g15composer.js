var config = {}, exec = require('child_process').exec;

var g15 = {
	sendCommand : function(command) {
		if(config.path) {
			var execQuery = "echo \'"+command+"\' > "+config.path
			exec(execQuery);
		} else {
			console.log('No path to g15composer pipe set, please launch init')
		}
	},
	init : function(path) {
		config.path = path;
		console.log('node-g15 module loaded!')
		g15.renderImage(__dirname+'/../resource/splash.wbmp')
		return g15;
	},
	/* 
	 * Render Text on the screen
	 * size : S, M, L (string case-sensitive)
	 * text : array of strings
	 */
	text : function(size, text) {
		if(size === 'S' || size === 'M' || size === 'L') {
			var cmd = 'T'+size+' ';
			for(x in text) {
				cmd = cmd + '\"'+text[x]+'\" ';
			}
			g15.sendCommand(cmd);
		} else {
			console.log('Requirements not met!')
		}
	},
	/* 
	 * Render Text on the screen at given co-ords
	 * size : pixel value (e.g. 20)
	 * text : array of strings
	 */
	textXY : function(size, x, y, text) {
		if(size && x && y && text.length) {
			var cmd = 'TO '+x+' '+y+' '+size+' 0';
			for(x in text) {
				cmd = cmd + '\"'+text[x]+'\" ';
			}
			g15.sendCommand(cmd);
		} else {
			console.log('Requirements not met!')
		}
	},
	/*
	 * Turns caching off or on, i.e. the changes are not immediately sent to the
     * LCD if caching is on (MC 1). Changes will be sent on the next MC 0.
     */
    cache : function(status) {
    	g15.sendCommand('MC '+status);
    },
	/* 
	 * Clears the screen and fills it with color (0 || 1)
	 */
	fill : function(color) {
		g15.sendCommand('PC '+color);
	},
	/*
	 * Sets the pixel at (X,Y) to color C (0 or 1)
	 */
	setPixel : function(x, y, color) {
		g15.sendCommand('PS '+x+' '+y+' '+color)
	},
	/*
	 * Reverses the pixels from (X1,Y1) to (X2,Y2)
	 */
	inverseArea : function(x1, y1, x2, y2) {
		g15.sendCommand('PR '+x1+' '+y1+' '+x2+' '+y2)
	},
	/*
	 * Renders a WBMP on the screen
	 * Must be 160*43px
	 */
	renderImage : function(imagePath) {
		g15.sendCommand('WS "'+imagePath+'"');
	},
	/*
	 * Overlays a pixel image of the given Width and Height at (X,Y)
	 * strBinary is a string like "1001001001" for off/on values of LED
	 * in area
	 */
 	drawBinaryImage : function(x, y, w, h, strBinary) {
		g15.sendCommand('PO '+x+' '+y+' '+w+' '+h+' \"'+strBinary+'\"')
 	},
 	/*
	 * Draws a percentage or progress bar from (X1,Y1) to (X2,Y2) using color C
	 */
	progressBar : function(x1, y1, x2, y2, color, done, outof, type) {
		g15.sendCommand('DB '+x1+' '+y1+' '+x2+' '+y2+' '+color+' '+done+' '+outof+' '+type)
	}
}
module.exports = g15;