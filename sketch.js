'use strict';

const tileSize = 40;

var canvasHeight = 800;
var canvasWidth = 300;

const allRoutes = [
    'B42', 'B82', 'B25', 'B17', 'Q24', 'B12', 'B14', 'Q56', 'B15',
    'B83', 'B65', 'B45', 'B91A', 'B84', 'B82+', 'B41', 'B44', 'B46',
    'B49', 'B31', 'B2', 'B44+', 'B46+', 'B1', 'B47', 'Q54', 'B48',
    'B54', 'Q55', 'Q58', 'B52', 'B60', 'B38', 'B26', 'B13', 'B57',
    'B7', 'B20', 'B62', 'Q59', 'B24', 'B32', 'B39', 'B8', 'B61', 'B35',
    'B68', 'B63', 'B43', 'B11', 'B70', 'B67', 'B16', 'B4', 'B9', 'B37',
    'B69', 'B36', 'B6', 'B3', 'B64', 'X27', 'X28', 'B74', 'X38', 'X37',
    'BX41', 'BX39', 'BX41+', 'BX12+', 'BX26', 'BX22', 'BX40', 'BX42',
    'BX5', 'BX29', 'BX4', 'BX4A', 'BX34', 'BX12', 'BX24', 'BX16',
    'BX28', 'BX38', 'BX30', 'BX15', 'M100', 'BX7', 'BX20', 'BX10',
    'BX1', 'BX2', 'BX9', 'BX13', 'BX18', 'BX3', 'BX6+', 'BX33', 'BX8',
    'BX17', 'BX21', 'BX36', 'BX35', 'BX46', 'BX19', 'BX31', 'BX32',
    'BX6', 'BX27', 'BX11', 'M14A', 'M14D', 'M60+', 'M9', 'M42', 'M50',
    'M86+', 'M20', 'M34+', 'M34A+', 'M66', 'M23+', 'M22', 'M21', 'M8',
    'M79+', 'M35', 'M55', 'M72', 'M57', 'M12', 'M116', 'M10', 'M5',
    'M4', 'M104', 'M3', 'M2', 'M11', 'M106', 'M96', 'M98', 'M15+',
    'M7', 'M1', 'M31', 'M101', 'M102', 'M103', 'M15', 'Q44+', 'Q20B',
    'Q20A', 'Q28', 'Q32', 'Q15', 'Q15A', 'Q26', 'Q48', 'Q13', 'Q31',
    'Q76', 'Q16', 'Q12', 'Q17', 'Q84', 'Q4', 'Q85', 'Q5', 'Q30', 'Q42',
    'Q3', 'Q77', 'Q1', 'Q43', 'X63', 'Q27', 'Q88', 'Q36', 'Q2', 'X68',
    'Q83', 'X64', 'Q46', 'SIM33C', 'SIM9', 'SIM15', 'SIM32', 'SIM7',
    'S40', 'S90', 'S53', 'S66', 'S76', 'S86', 'S93', 'SIM1C', 'SIM35',
    'SIM34', 'SIM3C', 'SIM3', 'SIM22', 'S46', 'S96', 'S48', 'S98',
    'S54', 'S51', 'S81', 'S52', 'S42', 'S74', 'SIM8X', 'S78', 'S84',
    'SIM10', 'SIM6', 'SIM5', 'SIM1', 'SIM26', 'SIM25', 'SIM2', 'SIM31',
    'SIM4', 'SIM4C', 'SIM8', 'S55', 'S56', 'SIM4X', 'SIM33', 'SIM30',
    'SIM11', 'S62', 'S92', 'S61', 'S91', 'S79+', 'S44', 'S94', 'S57',
    'S89', 'S59'
];


const boroughToBaseHue = {
    M: 0,
    B: 240,
    Q: 120,
    BX: 180,
    S: 270,
    // Bucket express routes into same category
    QM: 300,
    BM: 300,
    BXM: 300,
    X: 300,
    SIM: 300,
};

const routeToColor = {}
const routeToTextColor = {}

function setup() {
    colorMode(HSB)

    createCanvas(canvasWidth, canvasHeight);

    allRoutes.forEach((route) => {
        const routeNumber = parseInt(route.match(/\d+/)[0])

        // use routeNumber as seed, so that changing list ordering doesn't change color
        randomSeed(routeNumber);

        const flip = routeNumber % 2 === 1 ? -1 : 1;
        const hue = boroughToBaseHue[route.split(/\d+/)[0]] + ((routeNumber % 3) * flip);
        const saturation = 30 + random(60);
        const brightness = 50 + random(40);
        const alpha = 0.2 + random()

        routeToColor[route] = color(
           hue, saturation, brightness
        );
        routeToTextColor[route] = color(
            hue, saturation, brightness
        )
    })
}


function draw() {
    clear();

    const params = getURLParams();
    const busStopId = params.stop_id
        ? parseInt(params.stop_id)
        // random real stop for drawing
        : 300613;

    const stop = allStops.find((stop) => stop.stop_id === busStopId);

    randomSeed(busStopId);

    let routes = ['Blank']
    routes = routes.concat(stop.routes);
    rectMode(CENTER);

    for (let gridY = 0; gridY < 25; gridY++) {
        for (let gridX = 0; gridX < 15; gridX++) {

            let posX = tileSize * gridX + 10;
            let posY = tileSize * gridY + 230;

            let route = random(routes)

            if (route === 'Blank') continue;
            let lineColor = routeToColor[route];
            noStroke();
            fill(lineColor);

            const pattern = random(routes.length <= 3 ? 6 : 10);
            if (pattern <= 2) {
                arc(
                    posX + tileSize,
                    posY,
                    tileSize,
                    tileSize,
                    HALF_PI,
                    -HALF_PI
                );
            } else if (pattern <= 4){
                arc(
                    posX,
                    posY - tileSize / 2,
                    tileSize * 2,
                    tileSize * 2,
                    0,
                    HALF_PI
                )
            } else if (pattern <= 6) {
                arc(
                    posX + tileSize,
                    posY + tileSize / 2,
                    tileSize * 2,
                    tileSize * 2,
                    PI,
                    -HALF_PI
                );
            } else if (pattern <= 7) {
                arc(
                    posX + tileSize,
                    posY,
                    tileSize,
                    tileSize,
                    HALF_PI,
                    -HALF_PI
                );
                arc(posX, posY, tileSize, tileSize, -HALF_PI, HALF_PI);
            } else if (pattern <= 8) {
                rect(posX + tileSize / 2, posY, tileSize, tileSize);
                fill('#fff');
                arc(posX + tileSize, posY, tileSize, tileSize, HALF_PI, -HALF_PI);
                arc(posX, posY, tileSize, tileSize, -HALF_PI, HALF_PI);
            } else if (pattern <= 9) {
                rect(posX + tileSize / 2, posY, tileSize, tileSize);
                fill('#fff')
                arc(
                    posX + tileSize,
                    posY + tileSize / 2,
                    tileSize * 2,
                    tileSize * 2,
                    PI,
                    -HALF_PI
                )
            } else if (pattern <= 10) {
                rect(posX + tileSize / 2, posY, tileSize, tileSize);
                fill('#fff')
                arc(
                    posX + tileSize,
                    posY,
                    tileSize,
                    tileSize,
                    HALF_PI,
                    -HALF_PI
                )
            }

        }
    }

    let borderWidth = 20;

    // outside border
    rectMode(CORNER);
    strokeWeight(borderWidth);
    stroke('#ddd');
    noFill();
    rect(
        borderWidth / 2,
        borderWidth / 2,
        canvasWidth - borderWidth,
        canvasHeight- borderWidth
    );

    // top line
    line(0, 200, canvasWidth, 200);
    // Stop Name
    textFont('Roboto Mono');
    noStroke();
    fill('#212121');
    textSize(30);
    textAlign(CENTER);
    text(
        stop.stop_name.replace('/', '/\n'), canvasWidth / 2, 100
    );

    // individual routes
    textSize(14);
    Array.from(stop.routes).sort().forEach((route, index) => {
        // Draw the route name
        noStroke();
        fill(routeToTextColor[route]);
        text(route, 40 + index * 48, 185);

        // Draw a divider
        stroke('#ddd');
        strokeWeight(3);
        line(
            60 + index * 48,
            170,
            60 + index * 48,
            200
        );
    })

}

function keyReleased() {
    if (key == 's' || key == 'S') saveCanvas('download', 'png');
}


// working diagonal lines implementation
// let posX = width / tileCount * gridX;
// let posY = ((height - 200) / tileCount * gridY)  + 200;
//
//
//
// let route = random(routes)
//
// let lineColor = route === 'Blank' ? color('rgba(255, 255, 255, 0)') : routeToColor[route];
//
// let toggle = int(random(0, 2));
// if (toggle === 0) {
//     stroke(lineColor);
//     strokeWeight(random(3, 10));
//     line(posX, posY, posX + width / tileCount, posY + height / tileCount);
// }
// if (toggle === 1) {
//     stroke(lineColor);
//     strokeWeight(random(3, 10));
//     line(posX, posY + width / tileCount, posX + height / tileCount, posY);
// }
