var config = {}, exec = require('child_process').exec;

module.exports = {
	init : function(path, mode) {
		if(!mode || mode === 'api') {
			config.path = path;
			console.log('node-g15 module loaded in API mode!')
			api.renderImage(__dirname+'/../resource/splash.wbmp')
			return api;
		} else if(mode === 'notifications') {
			config.path = path;
			console.log('node-g15 module loaded in notification mode!');
			api.renderImage(__dirname+'/../resource/splash.wbmp');
			notifications.next();
			return notifications;
		}
	}
};

var api = {
	sendCommand : function(command) {
		if(config.path) {
			var execQuery = "echo \'"+command+"\' > "+config.path
			exec(execQuery);
		} else {
			console.log('No path to g15composer pipe set, please launch init')
		}
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
			this.sendCommand(cmd);
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
			this.sendCommand(cmd);
		} else {
			console.log('Requirements not met!')
		}
	},
	/*
	 * Turns caching off or on, i.e. the changes are not immediately sent to the
     * LCD if caching is on (MC 1). Changes will be sent on the next MC 0.
     */
    cache : function(status) {
    	this.sendCommand('MC '+status);
    },
	/* 
	 * Clears the screen and fills it with color (0 || 1)
	 */
	fill : function(color) {
		this.sendCommand('PC '+color);
	},
	/*
	 * Sets the pixel at (X,Y) to color C (0 or 1)
	 */
	setPixel : function(x, y, color) {
		this.sendCommand('PS '+x+' '+y+' '+color)
	},
	/*
	 * Reverses the pixels from (X1,Y1) to (X2,Y2)
	 */
	inverseArea : function(x1, y1, x2, y2) {
		this.sendCommand('PR '+x1+' '+y1+' '+x2+' '+y2)
	},
	/*
	 * Renders a WBMP on the screen
	 * Must be 160*43px
	 */
	renderImage : function(imagePath) {
		this.sendCommand('WS "'+imagePath+'"');
	},
	/*
	 * Overlays a pixel image of the given Width and Height at (X,Y)
	 * strBinary is a string like "1001001001" for off/on values of LED
	 * in area
	 */
 	drawBinaryImage : function(x, y, w, h, strBinary) {
		this.sendCommand('PO '+x+' '+y+' '+w+' '+h+' \"'+strBinary+'\"')
 	},
 	/*
	 * Draws a percentage or progress bar from (X1,Y1) to (X2,Y2) using color C
	 */
	progressBar : function(x1, y1, x2, y2, color, done, outof, type) {
		this.sendCommand('DB '+x1+' '+y1+' '+x2+' '+y2+' '+color+' '+done+' '+outof+' '+type)
	}
}

var notifications = {
	// An array of message objects
	queue : new Array(),
	// Push new message to Queue
	push : function(title, message, options) {
		if(!options) {
			// Add a fake options object
			this.queue.push({title: title, message: message, options: {}}); 
		} else if(options.priority) {
			// Add notification to front of queue
			this.queue.unshift({title: title, message: message, options: options});
		} else {
			// Add notification to the end of the queue
			this.queue.push({title: title, message: message, options: options});
		}
		// Check if service is paused
		if(this.paused) this.next();
	},
	// Next - Display the next message in the queue
	next : function() {
		// Check if a message is available
		console.log('Next!')
		if(this.queue.length > 0) {
			this.paused = false;
			var message = this.queue.shift();
			var splitMessage = message.message.match(/.{1,34}/g);
			api.cache(1);
			api.fill(0);
			api.textXY(10, 2, 2, [message.title]);
			api.textXY(8, 1, 15, splitMessage);
			api.inverseArea(0, 0, 163, 12);
			api.cache(0);
			setTimeout(function() {
				notifications.next();
			}, ((message.options.delay) ? message.options.delay*1000 : 2000));
		} else {
			this.paused = true;
		}
	},
	// Clear - Clear the queue and screen
	clear : function() {
		api.fill(0);
		api.text('M', ['Message queue cleared!'])
		this.queue = [];
	}
}
