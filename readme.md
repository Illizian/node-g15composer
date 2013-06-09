Node g15composer Library
==============
A library for communication with the g15composer pipe

<p align="center">
	<img src="https://s3-eu-west-1.amazonaws.com/node-g15composer/node-g15composer-splash-screen.jpg" alt="Node g15composer splashscreen"/>
</p>

Requirements
------------
* Linux (tested on Ubuntu)
* Logitech G15 Keyboard
* [G15 Tools](https://help.ubuntu.com/community/LogitechG15)
* NodeJS

How to use
----------
**1. Install with NPM**

	npm install g15composer

**2. Start g15composer**

	g15composer /path/to/pipe &

**3. Include in your project**

	var g15composer = require('g15composer').init('/path/to/pipe');

Functions
---------
**Render standard text**

text(size, ['array', 'of', 'strings'])

size : S, M, L (string case-sensitive)*

	g15composer.text('M', ['This is an example message']);

**Render Text on the screen at given co-ords**

textXY(size, x, y, ['array', 'of', 'strings'])

size : pixel value (e.g. 20)*

	g15composer.textXY(10, 5, 5, ['This is an example message']);

**Buffer**

Turns buffer on (1) or off (0), allows many commands to be buffered

cache(status)

	g15composer.cache(1);
	g15composer.textXY(10, 5, 5, ['This is an example message']);
	g15composer.textXY(10, 10, 5, ['This is another example message']);
	g15composer.cache(0);

**Fill Screen with color**

fills screen with "color" (0 || 1)

fill(color)

	g15composer.fill(1);

**Set individual pixel color**

Sets the pixel at (X,Y) to color (0 or 1)

setPixel(x, y, color)

	setPixel(5, 5, 1);

**Inverse pixels in given area**

Reverses the pixels from (X1,Y1) to (X2,Y2)

inverseArea(x1, y1, x2, y2)

	g15composer.inverseArea(0, 0, 160, 20);

**Render a WBMP image to the screen**

Renders a WBMP on the screen (Must be 160*43px)

renderImage(imagePath)

	g15composer.renderImage(/path/to/image.wbmp);

**Render a binary image**

Overlays a pixel image of the given Width and Height at (X,Y) where strBinary is a string like "1001001001" for off/on values of LED in area

drawBinaryImage(x, y, w, h, strBinary)

	g15.drawBinaryImage(5, 5, 10, 11, "00110011000011001100000000000000001100000001111000000011000001000000100010000100000111100000001100000000000000");

**Render a progress bar**

Draws a progress bar from (X1,Y1) to (X2,Y2) of type (0|1|2|3) in color (0|1) and complete the progress bar done / outof

progressBar(x1, y1, x2, y2, color, done, outof, type)

	g15composer.progressBar(2, 2, 158, 10, 1, 60, 100, 2);