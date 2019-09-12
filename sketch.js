// P_2_1_1_02
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * changing strokeweight on diagonals in a grid with colors
 *
 * MOUSE
 * position x          : left diagonal strokeweight
 * position y          : right diagonal strokeweight
 * left click          : new random layout
 *
 * KEYS
 * s                   : save png
 * 1                   : round strokecap
 * 2                   : square strokecap
 * 3                   : project strokecap
 * 4                   : color left diagonal
 * 5                   : color right diagonal
 * 6                   : transparency left diagonal
 * 7                   : transparency right diagonal
 * 0                   : default
 */
'use strict';

var tileCount = 20;
var actRandomSeed = 0;

var actStrokeCap;

var colorLeft;
var colorRight;
var alphaLeft = 255;
var alphaRight = 255;

var canvasHeight = 800;
var canvasWidth = 300;

function setup() {
    createCanvas(canvasWidth, canvasHeight);

    actStrokeCap = ROUND;
    colorLeft = color(197, 0, 123, alphaLeft);
    colorRight = color(87, 35, 129, alphaRight);
}

function draw() {
    clear();
    strokeCap(actStrokeCap);

    var params = getURLParams();
    // random real stop for drawing
    var busStopId = params.stop_id ? parseInt(params.stop_id) : 300613;

    var stop = allStops.find(function(stop) {
        return stop.stop_id === busStopId
    });

    randomSeed(busStopId);

    for (var gridY = 0; gridY < tileCount; gridY++) {
        for (var gridX = 0; gridX < tileCount; gridX++) {

            var posX = width / tileCount * gridX;
            var posY = ((height - 200) / tileCount * gridY)  + 200;

            var toggle = int(random(0, 2));

            if (toggle == 0) {
                stroke(colorLeft);
                strokeWeight(random(0, 15));
                line(posX, posY, posX + width / tileCount, posY + height / tileCount);
            }
            if (toggle == 1) {
                stroke(colorRight);
                // strokeWeight(mouseY / 15);
                strokeWeight(random(0, 15));
                line(posX, posY + width / tileCount, posX + height / tileCount, posY);
            }
        }
    }

    var borderWidth = 20;

    // outside border
    strokeWeight(borderWidth);
    stroke(colorLeft);
    noFill();
    rect(
        borderWidth / 2,
        borderWidth / 2,
        canvasWidth - borderWidth,
        canvasHeight- borderWidth
    );

    // top line
    line(
        0, 200, canvasWidth, 200
    );

    noStroke();
    fill(colorRight);
    textSize(30);
    textAlign(CENTER);
    text(
        stop.stop_name.replace('/', '/\n'), canvasWidth / 2, 100
    );

}

function keyReleased() {
    if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');

    if (key == '1') actStrokeCap = ROUND;
    if (key == '2') actStrokeCap = SQUARE;
    if (key == '3') actStrokeCap = PROJECT;

    var black = color(0, 0, 0, 255);
    if (key == '4') {
        if (colorsEqual(colorLeft, black)) {
            colorLeft = color(197, 0, 123, alphaLeft);
        } else {
            colorLeft = color(0, 0, 0, alphaLeft);
        }
    }
    if (key == '5') {
        if (colorsEqual(colorRight, black)) {
            colorRight = color(87, 35, 129, alphaRight);
        } else {
            colorRight = color(0, 0, 0, alphaRight);
        }
    }

    if (key == '6') {
        if (alphaLeft == 255) {
            alphaLeft = 127;
        } else {
            alphaLeft = 255;
        }
        colorLeft = color(red(colorLeft), green(colorLeft), blue(colorLeft), alphaLeft);
    }
    if (key == '7') {
        if (alphaRight == 255) {
            alphaRight = 127;
        } else {
            alphaRight = 255;
        }
        colorRight = color(red(colorRight), green(colorRight), blue(colorRight), alphaRight);
    }

    if (key == '0') {
        actStrokeCap = ROUND;
        alphaLeft = 255;
        alphaRight = 255;
        colorLeft = color(0, 0, 0, alphaLeft);
        colorRight = color(0, 0, 0, alphaRight);
    }
}

function colorsEqual(col1, col2) {
    return col1.toString() == col2.toString();
}
