let rows = 4, cols = 4, puzzleBase = 10, maxSize = 20;
let puzzle = [], puzzleList = [], numberBaseList = [], customizeList = [];
let multibldPuzzle = [], multibldPuzzleSpace = [], multibldState = [], multibldStateSpace = [];
let pieces;
let baseList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let colorList = [0], pieceType = [], colorLive = ["#90c8ff", "#ffc8ff", "#ffe8ff", "#d0d0d0"];
let patternScheme = 'Rows, Cols', mode = "std", colorNum = 6;
let useRainbow = true, rainbowStart = 0, rainbowEnd = 324, rainbowDir = 1;
let saturation = 100, lightness = 75;
let moves = 0;
let spaceX, spaceY, spacePos;
let invertControl = 0, hoverOn = true;
let sum = 0;
let newSolve = false;
let liveSolved = 0, liveIndex = 0;
let relay = false, relayInProgress = false, relayColsChange = true, relayRowsChange = true;
let marathon = false, marathonInProgress = false;
let bld = false, bldIsConfirmed = 1, bldInProgress = false, bldFinishMemo = false, multibld = false;
let solvesDone = 0, marathonLength = 42, multibldLength = 2, multibldFailed = 0;
let multibldInProgress = false, multibldFinishMemo = false, multibldProgress = -1; // < multibldLength = inspection, >= multibldLength = solving
let relayStartCols = cols, relayStartRows = rows;
let unsolved = false, solveInProgress = false;
let startTime = memoFinishTime = currentTime = endTime = 0, timeString = "";
let useMinutes = 1, useHours = 0, timerAccuracy = 1000, updateFreq = 60, intervalID;
let puzzleTextColor = "#FFFFFF", puzzleTextRatio = 0.66, puzzleSize = 620, puzzleMargin = 2, puzzleRadiusFactor = 0, puzzleBorder = false, drawPuzzleOffset = 0;
let onMainPage = true;
let puzzleCanvas = document.querySelector("#puzzleCanvas"), spacebarCanvas = document.querySelector("#spacebarCanvas"), summary = document.querySelector('#summary');
let ctx = puzzleCanvas.getContext("2d"), ctxSpace = spacebarCanvas.getContext("2d"), disableFunctionButton = false, disableSummary = false;
let randPieceZ;
let scrambleString = "", relayProgress;
ctx.lineWidth = 1, ctxSpace.lineWidth = 3;
ctxSpace.strokeStyle = "#888";

function initWindow() {
    puzzleCanvas.width = puzzleCanvas.height = puzzleSize = Math.floor(Math.min(0.8 * window.innerHeight, 0.8 * window.innerWidth));
    setLandscape();
    document.querySelector("#adjPuzzleSize").value = puzzleSize;
    document.querySelector("#adjPuzzleSizeSlider").value = puzzleSize;
    localStorage.setItem("puzzleSize", puzzleSize);
}

function initTouch() {
    puzzleCanvas.addEventListener('touchstart', mouse, false);
    puzzleCanvas.addEventListener('touchend', mouse, false);
    puzzleCanvas.addEventListener('touchmove', mouse, false);
}

function mouse(e) {
    e.preventDefault();
    e.stopPropagation();
    if(e.type == "touchstart" || (e.type == "touchmove" && hoverOn) || e.type == "touchend" || e.type == "touchleave") {
        let bbox = puzzleCanvas.getBoundingClientRect();
        let touch = e.touches[0];
        clickMove((parseInt(touch.pageX) - bbox.left) * (puzzleCanvas.width / bbox.width), (parseInt(touch.pageY) - bbox.top) * (puzzleCanvas.height / bbox.height));
    }
    return false;
}

window.onresize = function() {
    setLandscape();
}

function setLandscape() {
    if (window.innerWidth < window.innerHeight) {
        if (landscape >= 1) {
            landscape = 0;
            drawSpacebarCanvas();
            document.querySelector("#timeAo5").innerHTML = (averageBoxList[language][2] + averageTitleString[3 - landscape] + averageTitleString[averageType[0]] + averageNumber[0]);
            document.querySelector("#movesAo5").innerHTML = (averageBoxList[language][3] + averageTitleString[3 - landscape] + averageTitleString[averageType[0]] + averageNumber[0]);
            document.querySelector("#tpsAo5").innerHTML = ("TPS" + averageTitleString[3 - landscape] + averageTitleString[averageType[0]] + averageNumber[0]);
            document.querySelector("#timeAo12").innerHTML = (averageBoxList[language][2] + averageTitleString[3 - landscape] + averageTitleString[averageType[1]] + averageNumber[1]);
            document.querySelector("#movesAo12").innerHTML = (averageBoxList[language][3] + averageTitleString[3 - landscape] + averageTitleString[averageType[1]] + averageNumber[1]);
            document.querySelector("#tpsAo12").innerHTML = ("TPS" + averageTitleString[3 - landscape] + averageTitleString[averageType[1]] + averageNumber[1]);
        }
    } else {
        if (landscape == 0) {
            landscape = 1;
            drawSpacebarCanvas();
            document.querySelector("#timeAo5").innerHTML = (averageBoxList[language][2] + averageTitleString[3 - landscape] + averageTitleString[averageType[0]] + averageNumber[0]);
            document.querySelector("#movesAo5").innerHTML = (averageBoxList[language][3] + averageTitleString[3 - landscape] + averageTitleString[averageType[0]] + averageNumber[0]);
            document.querySelector("#tpsAo5").innerHTML = ("TPS" + averageTitleString[3 - landscape] + averageTitleString[averageType[0]] + averageNumber[0]);
            document.querySelector("#timeAo12").innerHTML = (averageBoxList[language][2] + averageTitleString[3 - landscape] + averageTitleString[averageType[1]] + averageNumber[1]);
            document.querySelector("#movesAo12").innerHTML = (averageBoxList[language][3] + averageTitleString[3 - landscape] + averageTitleString[averageType[1]] + averageNumber[1]);
            document.querySelector("#tpsAo12").innerHTML = ("TPS" + averageTitleString[3 - landscape] + averageTitleString[averageType[1]] + averageNumber[1]);
        }
    }
}

function drawSpacebarCanvas() {
    if (landscape == 1) {
        spacebarCanvas.style = "position: fixed; left: 0;";
        spacebarCanvas.style.top = (0.1 * window.innerHeight) + "px";
        spacebarCanvas.width = 0.1 * window.innerWidth;
        spacebarCanvas.height = 0.8 * window.innerHeight;
        summary.style.left = (0.12 * window.innerWidth) + "px";
        summary.style.bottom = (0.05 * window.innerHeight) + "px";
    } else {
        spacebarCanvas.style = "position: fixed; bottom: 0;";
        spacebarCanvas.style.left = (0.1 * window.innerWidth) + "px";
        spacebarCanvas.width = 0.8 * window.innerWidth;
        spacebarCanvas.height = 0.1 * window.innerHeight;
        summary.style.left = (0.05 * window.innerWidth) + "px";
        summary.style.bottom = (0.12 * window.innerHeight) + "px";
    }
    ctxSpace.strokeRect(0, 0, spacebarCanvas.width, spacebarCanvas.height);
    if (language == 0) {
        (landscape == 1) ? ctxSpace.font = (0.18 * spacebarCanvas.width) + "px sans-serif": ctxSpace.font = (0.6 * spacebarCanvas.height) + "px sans-serif";
    } else {
        (landscape == 1) ? ctxSpace.font = (0.23 * spacebarCanvas.width) + "px sans-serif": ctxSpace.font = (0.6 * spacebarCanvas.height) + "px sans-serif";
    }
    ctxSpace.fillStyle = "#888";
    ctxSpace.textBaseline = "middle";
    ctxSpace.textAlign = "center";
    if (!(solveInProgress)) {
        ctxSpace.fillText(buttonLanguageList[language][1], spacebarCanvas.width / 2, spacebarCanvas.height / 2);
    } else if (multibld) {
        if (multibldProgress == (2 * multibldLength - 1)) {
            ctxSpace.fillText(buttonLanguageList[language][3], spacebarCanvas.width / 2, spacebarCanvas.height / 2);
        } else if (multibldProgress < (3 * multibldLength - 1)) {
            ctxSpace.fillText(buttonLanguageList[language][4], spacebarCanvas.width / 2, spacebarCanvas.height / 2);
        }
    } else if (bld && !(multibld) && bldIsConfirmed == 0) {
        ctxSpace.fillText(buttonLanguageList[language][3], spacebarCanvas.width / 2, spacebarCanvas.height / 2);
    }
    if (!(onMainPage) || disableFunctionButton) spacebarCanvas.style.visibility = 'hidden';
    if (!(onMainPage) || disableSummary) summary.style.visibility = 'hidden';
}

function functionButtonPressed() {
    if (!(solveInProgress)) {
        document.querySelector('#scrambleBtn').click();
    } else if (bld && !(multibld) && bldIsConfirmed == 0) {
        document.querySelector('#confirmBtn').click();
    } else if (multibld) {
        if (multibldProgress == (2 * multibldLength - 1)) {
            document.querySelector('#confirmBtn').click();
        } else if (multibldProgress < (3 * multibldLength - 1)) {
            document.querySelector('#nextBtn').click();
        }
    } else {
        document.querySelector('#scrambleBtn').click();
    }
}

function genBase(base) {
    numberBaseList[0] = 0;
    numberBaseList[1] = 1;
    if (base == 10) {
        for (let i = 2;i < maxSize * maxSize;i++) {
            numberBaseList[i] = i;
        }
    } else {
        for (let i = 2;i < maxSize * maxSize;i++) {
            let maxPow = 0, numString='', remainNum = i;
            while (cols * rows - 1 >= base ** (maxPow + 1)) {
                maxPow++;
            }
            for (let j = maxPow;j >= 0;j--) {
                for (let k = base - 1;k >= 0;k--) {
                    if (k * (base ** j) > remainNum) {
                        continue;
                    } else {
                        if ((k != 0) || (numString != '')) {
                            numString += baseList[k];
                        }
                        remainNum -= k * (base ** j);
                        break;
                    }
                }
            }
            numberBaseList[i] = numString;
        }
    }
}

function genColor() {
    colorList = [];
    switch(patternScheme) {
        case('Fringes'): case('Live Fringes'):
            if (rows == cols) {
                colorNum = rows - 1;
            } else {
                colorNum = Math.max(cols - 1, rows - 1)
            }
        break;
        case('Rows, Cols'): case('Live Rows, Cols'):
            colorNum = Math.abs(cols - rows) + (Math.min(rows, cols) - 1) * 2;
        break;
        case('Rows'): case('Live Rows'):
            colorNum = rows;
        break;
        case('Cols'): case('Live Cols'):
            colorNum = cols;
        break;
        case('L2R'): case('Live L2R'): case('L2C'): case('Live L2C'):
            colorNum = rows + cols - 2;
        break;
        case('Mono'):
            colorNum = 1;
        break;
    }
    useRainbow = patternScheme.indexOf('Live') < 0;
    if (useRainbow) {
        hslColor();
    }
}

function hslColor() {
    colorList = [];
    for (let i = 0;i < colorNum;i++) {
        colorList[i] = spreadhsl(i, colorNum);
    }
}

function spreadhsl(x1, x2) {
    let hslResult, initValue, increment;
    if (rainbowDir == 1) {
        initValue = rainbowStart;
    } else {
        initValue = rainbowEnd;
    }
    increment = rainbowEnd - rainbowStart;
    if (rainbowStart > rainbowEnd) {
        increment += 360;
    }
    increment *= x1;
    increment /= x2;
    hslResult = Math.floor(initValue + increment);
    return adjustPosNeg(hslResult, 360);
}

function adjustPosNeg(val, t) {
    val %= t;
    if (val < 0) {
        val += t;
    }
    return val;
}

function defineType() {
    pieceType = [];
    switch(patternScheme) {
        case('Fringes'): case('Live Fringes'):
            if (rows == cols) {
                for (let i = 1;i < rows * cols;i++) {
                    pieceType[i] = Math.min((i - 1) % cols, Math.floor((i - 1) / cols));
                }
            } else if (rows > cols) {
                for (let i = 1;i < rows * cols;i++) {
                    if (Math.floor((i - 1) / cols) <= rows - cols)
                        pieceType[i] = Math.floor((i - 1) / cols);
                    else
                        pieceType[i] = Math.min((i - 1) % cols - cols + rows, Math.floor((i - 1) / cols));
                }
            } else {
                for (let i = 1;i < rows * cols;i++) {
                    if (Math.floor((i - 1) % cols) <= cols - rows)
                        pieceType[i] = Math.floor((i - 1) % cols);
                    else
                        pieceType[i] = Math.min((i - 1) % cols, Math.floor((i - 1) / cols) + cols - rows);
                }
            }
        break;
        case('Rows, Cols'): case('Live Rows, Cols'):
            if (rows == cols) {
                for (let i = 1;i < rows * cols;i++) {
                    if ((i - 1) % cols >= Math.floor((i - 1) / cols))
                        pieceType[i] = Math.floor((i - 1) / cols) * 2;
                    else
                        pieceType[i] = (i % cols - 1) * 2 + 1;
                }
            } else if (rows > cols) {
                for (let i = 1;i < rows * cols;i++) {
                    if (Math.floor((i - 1) / cols) <= rows - cols) {
                        pieceType[i] = Math.floor((i - 1) / cols);
                    } else {
                        if ((i - 1) % cols + rows - cols >= Math.floor((i - 1) / cols))
                            pieceType[i] = Math.floor((i - 1) / cols - rows + cols) * 2 + rows - cols;
                        else
                            pieceType[i] = (i % cols - 1) * 2 + 1 + rows - cols;
                    }
                }
            } else {
                for (let i = 1;i < rows * cols;i++) {
                    if (Math.floor((i - 1) % cols) <= cols - rows) {
                        pieceType[i] = Math.floor((i - 1) % cols);
                    } else {
                        if ((i - 1) % cols + rows - cols > Math.floor((i - 1) / cols))
                            pieceType[i] = Math.floor((i - 1) / cols) * 2 - rows + cols + 1;
                        else
                            pieceType[i] = (i % cols - cols + rows - 1) * 2 + cols - rows;
                    }
                }
            }
        break;
        case('Rows'): case('Live Rows'):
            for (let i = 1;i < rows * cols;i++)
                pieceType[i] = Math.floor((i - 1) / cols);
        break;
        case('Cols'): case('Live Cols'):
            for (let i = 1;i < rows * cols;i++)
                pieceType[i] = (i - 1) % cols;
        break;
        case('Mono'):
            for (let i = 1;i < rows * cols;i++)
                pieceType[i] = 0;
        break;
        case('L2R'): case('Live L2R'):
            for (let i = 1;i < rows * cols;i++) {
                if (Math.floor((i - 1) / cols) < rows - 2)
                    pieceType[i] = Math.floor((i - 1) / cols);
                else
                    pieceType[i] = (i - 1) % cols + rows - 2;
            }
        break;
        case('L2C'): case('Live L2C'):
            for (let i = 1;i < rows * cols;i++) {
                if ((i - 1) % cols < cols - 2)
                    pieceType[i] = (i - 1) % cols;
                else
                    pieceType[i] = Math.floor((i - 1) / cols) + cols - 2;
            }
        break;
    }
}

function startUpInitPuzzle() {
    for (let j = 0;j < rows;j++) {
        puzzle[j] = [];
        for (let i = 0;i < cols;i++) {
            puzzle[j][i] = j * cols + i + 1;
        }
    }
    puzzle[rows - 1][cols - 1] = 0;
    unsolved = false;
}

function initPuzzle() {
    for (let j = 0;j < rows;j++) {
        puzzle[j] = [];
        for (let i = 0;i < cols;i++) {
            puzzle[j][i] = j * cols + i + 1;
        }
    }
    for (let k = 0;k < multibldLength;k ++) {
        multibldPuzzle[k] = [];
        multibldState[k] = [];
        multibldPuzzleSpace[k] = [];
        multibldStateSpace[k] = [];
        for (let j = 0;j < rows;j++) {
            multibldPuzzle[k][j] = [];
            multibldState[k][j] = [];
            for (let i = 0;i < cols;i++) {
                multibldPuzzle[k][j][i] = 0;
                multibldState[k][j][i] = 0;
            }
        }
        for (let i = 0;i < 2;i++) {
            multibldPuzzleSpace[k][i] = 0;
            multibldStateSpace[k][i] = 0;
        }
    }
    scrambleString = "";
    puzzle[rows - 1][cols - 1] = 0;
    spaceX = cols - 1;
    spaceY = rows - 1;
    unsolved = false;
    genColor();
    solvesDone = 0;
    bldIsConfirmed = 1;
    bldFinishMemo = true;
    multibldFinishMemo = true;
    multibldProgress = -1;
    liveIndex = colorNum;
    newSolve = false;
    multibldFailed = 0;
    if (solveInProgress) {
        moves = 0;
        stopTimer(false);
        relayInProgress = false;
        marathonInProgress = false;
        solveInProgress = false;
        bldInProgress = false;
        solveInProgress = false;
        multibldInProgress = false;
    }
}

function swap(x1, y1, x2, y2) {
    i = puzzle[y1][x1];
    puzzle[y1][x1] = puzzle[y2][x2];
    puzzle[y2][x2] = i;
}

function swapInList(z1, z2) {
    i = puzzleList[z1];
    puzzleList[z1] = puzzleList[z2];
    puzzleList[z2] = i;
}

function genRand(param) {
    return Math.floor(Math.random() * param);
}

function beforeScramble() {
    if (!(marathonInProgress || relayInProgress || multibldInProgress)) {
        newSolve = true;
    }
    if (relay && rows == relayStartRows && cols == relayStartCols) {
        scrambleString += ("#1: ");
        relayProgress = 0;
        relayStartCols = cols;
        relayStartRows = rows;
        relayInProgress = true;
    }
    if (marathon && solvesDone == 0) {
        scrambleString += ("#1: ");
        solvesDone = 0;
        marathonInProgress = true;
    }
    if (multibld) {
        document.querySelector('#nextBtn').style.visibility = 'visible';
        if (!(multibldInProgress)) {
            multibldProgress = -1;
            solvesDone = 0;
            multibldFailed = 0;
            multibldInProgress = true;
            moves = 0;
        }
    }
}

function scramble() {
    if (multibld) {
        for (let k = 0;k < multibldLength;k++) {
            scrambleString += (" #" + (k + 1) + ": ");
            genPuzzle();
            for (let i = 0;i < rows;i++) {
                for (let j = 0;j < cols;j++) {
                    multibldPuzzle[k][i][j] = puzzle[i][j];
                    scrambleString += puzzle[i][j];
                    if (j != (cols - 1)) 
                        scrambleString += " ";
                }
                if (i != (rows - 1)) 
                    scrambleString += "/";
            }
            multibldPuzzleSpace[k][0] = spacePos % cols;
            multibldPuzzleSpace[k][1] = Math.floor(spacePos / cols);
        }
    } else {
        genPuzzle();
        for (let i = 0;i < rows;i++) {
            for (let j = 0;j < cols;j++) {
                scrambleString += puzzle[i][j];
                if (j != (cols - 1))
                    scrambleString += " ";
            }
            if (i != (rows - 1)) 
                scrambleString += "/";
        }
    }
}

function genPuzzle() {
    for (let i = 0;i < rows * cols;i++) {
        puzzleList[i] = i + 1;
    }
    for (let i = 0;i < rows * cols;i++) {
        randPieceZ = genRand(cols * rows);
        swapInList(i, randPieceZ);
    }
    checkSolvable();
    listToPuzzle();
}

function prevPuzzle() {
    multibldProgress --;
    if (multibldProgress % multibldLength == 0) {
        document.querySelector('#prevBtn').style.visibility = 'hidden';
    } else {
        document.querySelector('#prevBtn').style.visibility = 'visible';
    }
    if (multibldProgress == 2 * multibldLength - 1) {
        document.querySelector('#confirmBtn').style.visibility = 'visible';
        document.querySelector('#nextBtn').style.visibility = 'hidden';
    } else {
        document.querySelector('#confirmBtn').style.visibility = 'hidden';
        document.querySelector('#nextBtn').style.visibility = 'visible';
    }
    storeState(multibldProgress + 1);
    copyState();
}

function copyPuzzle() {
    multibldProgress ++;
    drawSpacebarCanvas();
    if (multibldProgress == 0) {
        memoTimer();
    }
    if (multibldProgress % multibldLength) {
        document.querySelector('#prevBtn').style.visibility = 'visible';
    } else {
        document.querySelector('#prevBtn').style.visibility = 'hidden';
    }
    if (multibldProgress == 3 * multibldLength - 1) {
        document.querySelector('#nextBtn').style.visibility = 'hidden';
    }
    if (multibldProgress >= multibldLength) {
        if (multibldProgress == multibldLength) {
            multibldInProgress = 0;
            memoTimer();
            multibldFinishMemo = true;
            bldIsConfirmed = 0;
        }
        if (multibldProgress == 2 * multibldLength - 1) {
            document.querySelector('#confirmBtn').style.visibility = 'visible';
            document.querySelector('#nextBtn').style.visibility = 'hidden';
        }
        storeState(multibldProgress - 1);
        copyState();
    } else {
        copyScramble();
    }
}

function storeState(puzzleIndex) {
    for (let i = 0;i < rows;i++) {
        for (let j = 0;j < cols;j++) {
            multibldState[(puzzleIndex) % multibldLength][i][j] = puzzle[i][j];
        }
    }
    multibldStateSpace[(puzzleIndex) % multibldLength][0] = spaceX;
    multibldStateSpace[(puzzleIndex) % multibldLength][1] = spaceY;
}

function copyState() {
    if (multibldState[multibldProgress % multibldLength][0][0] + multibldState[multibldProgress % multibldLength][0][1] == 0) {
        for (let i = 0;i < rows;i++) {
            for (let j = 0;j < cols;j++) {
                puzzle[i][j] = multibldPuzzle[multibldProgress % multibldLength][i][j];
            }
        }
        spaceX = multibldPuzzleSpace[multibldProgress % multibldLength][0];
        spaceY = multibldPuzzleSpace[multibldProgress % multibldLength][1];
        redraw();
    } else {
        for (let i = 0;i < rows;i++) {
            for (let j = 0;j < cols;j++) {
                puzzle[i][j] = multibldState[multibldProgress % multibldLength][i][j];
            }
        }
        spaceX = multibldStateSpace[multibldProgress % multibldLength][0];
        spaceY = multibldStateSpace[multibldProgress % multibldLength][1];
        redraw();
    }
}

function copyScramble() {
    for (let i = 0;i < rows;i++) {
        for (let j = 0;j < cols;j++) {
            puzzle[i][j] = multibldPuzzle[multibldProgress % multibldLength][i][j];
        }
    }
    spaceX = multibldPuzzleSpace[multibldProgress % multibldLength][0];
    spaceY = multibldPuzzleSpace[multibldProgress % multibldLength][1];
    redraw();
}

function afterScramble() {
    if (multibld) {
        copyPuzzle();
        solveInProgress = true;
        multibldFinishMemo = false;
        multibldInProgress = true;
        drawSpacebarCanvas();
        startTimer();
        redraw();
    } else if (bld) {
        newSolve = true;
        solveInProgress = true;
        bldIsConfirmed = 1;
        bldInProgress = true;
        bldFinishMemo = false;
        moves = 0;
        startTimer();
        redraw();
    } else if (marathon && solvesDone == 0) {
        newSolve = true;
    } else if (relay && cols == relayStartCols && rows == relayStartRows) {
        newSolve = true;
    }
    if (!(useRainbow)) {
        liveIndex = 0;
        checkLiveSolved(0);
    }
    controlCustomizeBtn();
    redrawPuzzle();
}

function checkSolvable() {
    let copyList = [], indexNum;
    sum = 0;
    for (let i = 0;i < rows * cols;i++) {
        copyList[i] = true;
    }
    for (let i = 0;i < rows * cols;i++) {
        if (puzzleList[i] == rows * cols){
            spacePos = i;
        }
        if (copyList[i]) {
            indexNum = i;
            sum--;
            do {
                copyList[indexNum] = false;
                indexNum = puzzleList[indexNum] - 1;
                sum++;
            } while (copyList[indexNum]);
        }
    }
    spaceX = spacePos % cols;
    spaceY = Math.floor(spacePos / cols);
    sum += (rows + cols - spaceX - spaceY);
    puzzleList[spacePos] = 0;
    if (sum % 2 == 1) {
        swapRandomTwo();
    }
}

function customizeScramble() {
    let inputScramble = prompt(customizeHintList[language][0]);
    let inputPuzzle = [], inputIndex = [];
    if (!(inputScramble)) {
        return false;
    }
    for (let i = 0;i < inputScramble.length;i++) {
        if(inputScramble.charAt(i) < '0' || inputScramble.charAt(i) > '9'){
            if((inputScramble.charAt(i) != '/') && (inputScramble.charAt(i) != ' ')) {
                alert(customizeHintList[language][1]);
                return false;
            }
        }
    }
    inputRows = inputScramble.split("/");
    let rowLength = inputRows.length;
    for (let i = 0;i < inputRows.length;i++) {
        inputPuzzle[i] = inputRows[i].split(" ");
    }
    let colLength = inputPuzzle[0].length;
    for (let i = 0;i < inputRows.length;i++) {
        if (inputPuzzle[i].length != colLength) {
            alert(customizeHintList[language][2]);
            return false;
        }
    }
    if ((rowLength == 1) || (colLength == 1)) {
        alert(customizeHintList[language][3]);
        return false;
    }
    if ((rowLength > maxSize) || (colLength > maxSize)) {
        alert(customizeHintList[language][4]);
        return false;
    }
    let inputSolved = true;
    for (let i = 0;i < rowLength;i++) {
        for (let j = 0;j < colLength;j++) {
            if ((inputPuzzle[i][j] != i * colLength + j + 1) && ((i + 1) * (j + 1) != rowLength * colLength)) {
                inputSolved = false;
                break;
            }
        }
    }
    if (inputSolved) {
        alert(customizeHintList[language][5]);
        return false;
    }
    for (let i = 0;i < rowLength * colLength;i++) {
        inputIndex[i] = true;
    }
    for (let i = 0;i < rowLength;i++) {
        for (let j = 0;j < colLength;j++) {
            if (inputIndex[inputPuzzle[i][j]]) {
                inputIndex[inputPuzzle[i][j]] = false;
            } else {
                alert(customizeHintList[language][6]);
                return false;
            }
            if (inputPuzzle[i][j] >= colLength * rowLength) {
                alert(customizeHintList[language][7]);
                return false;
            }
        }
    }
    mode = "std";
    relay = relayColsChange = relayRowsChange = marathon = bld = multibld = false;
    for (let i = 0;i < colLength * rowLength;i++) {
        customizeList[i] = inputPuzzle[Math.floor(i / colLength)][i % colLength];
        if (inputPuzzle[Math.floor(i / colLength)][i % colLength] == 0) {
            customizeList[i] = rowLength * colLength;
        }
    }
    beforeScramble();
    let spacePos, copyList = [], indexNum;
    sum = 0;
    for (let i = 0;i < rowLength * colLength;i++) {
        copyList[i] = true;
    }
    for (let i = 0;i < rowLength * colLength;i++) {
        if (customizeList[i] == rowLength * colLength){
            spacePos = i;
        }
        if (copyList[i]) {
            indexNum = i;
            sum--;
            do {
                copyList[indexNum] = false;
                indexNum = customizeList[indexNum] - 1;
                sum++;
            } while (copyList[indexNum]);
        }
    }
    sum += (rowLength + colLength - spacePos % colLength - Math.floor(spacePos / colLength));
    if (sum % 2 == 1) {
        let confirmContinue = confirm(customizeHintList[language][8]);
        if (!(confirmContinue)) {
            initPuzzle();
            return false;
        }
    }
    spaceX = spacePos % colLength;
    spaceY = Math.floor(spacePos / colLength);
    rows = rowLength;
    cols = colLength;
    setDrawSize();
    for (let j = 0;j < rows;j++) {
        puzzle[j] = [];
        for (let i = 0;i < cols;i++) {
            puzzle[j][i] = 0;
        }
    }
    for (let i = 0;i < rows;i++) {
        for (let j = 0;j < cols;j++) {
            puzzle[i][j] = inputPuzzle[i][j];
        }
    }
    defineType();
    genColor();
    afterScramble();
}

function swapRandomTwo() {
    let z3, z4;
    do {
        z3 = genRand(cols * rows);
    } while (puzzleList[z3] == 0);
    do {
        z4 = genRand(cols * rows);
    } while ((puzzleList[z4] == 0) || (z4 == z3));
    swapInList(z3, z4);
    swapped = true;
}

function listToPuzzle() {
    let solved = true;
    for (let i = 0;i < rows * cols - 1;i++) {
        if (puzzleList[i] != i + 1) {
            solved = false;
            break;
        }
    }
    if (solved) {
        genPuzzle();
    }
    for (let i = 0;i < rows;i++) {
        for (let j = 0;j < cols;j++) {
            puzzle[i][j] = puzzleList[i * cols + j];
        }
    }
}

function checkNewSolve() {
    if (newSolve && !(multibld)) {
        if (bld && bldInProgress) {
            bldIsConfirmed = 0;
            bldFinishMemo = true;
            drawSpacebarCanvas();
            memoTimer();
        } else {
            startTimer();
        }
        moves = 0;
        newSolve = false;
        solveInProgress = true;
        controlCustomizeBtn();
    }
}

function checkLiveSolved(x){
    unsolved = false;
    if (!(useRainbow)) {
        let tempIndex = Math.max(0, liveIndex - x), solvedPieces, startIndexX = 0, startIndexY = 0;
        if ((patternScheme == 'Rows, Cols') || (patternScheme == 'Live Rows, Cols')) {
            if (rows == cols) {
                solvedPieces = Math.floor((tempIndex + 1) / 2) * cols + Math.floor(tempIndex / 2) * (rows - Math.floor((tempIndex + 1) / 2));
                startIndexX = Math.floor(tempIndex / 2);
                startIndexY = Math.floor((tempIndex + 1) / 2);
            } else if (rows > cols) {
                if (tempIndex < rows - cols) {
                    solvedPieces = tempIndex * cols;
                    startIndexX = 0;
                    startIndexY = tempIndex;
                } else {
                    solvedPieces = (rows - cols) * cols + Math.floor((tempIndex - rows + cols + 1) / 2) * cols + Math.floor((tempIndex - rows + cols) / 2) * (rows - Math.floor((tempIndex + rows - cols + 1) / 2));
                    startIndexX = Math.floor((tempIndex - rows + cols) / 2);
                    startIndexY = Math.floor((tempIndex - rows + cols + 1) / 2);
                }
            } else {
                if (tempIndex < cols - rows) {
                    solvedPieces = tempIndex * rows;
                    startIndexX = tempIndex;
                    startIndexY = 0;
                } else {
                    solvedPieces = (cols - rows) * rows + Math.floor((tempIndex - cols + rows + 1) / 2) * rows + Math.floor((tempIndex - cols + rows) / 2) * (cols - Math.floor((tempIndex + cols - rows + 1) / 2));
                    startIndexX = Math.floor((tempIndex - cols + rows + 1) / 2);
                    startIndexY = Math.floor((tempIndex - cols + rows) / 2);
                }
            }
        } else if (patternScheme == 'Mono') {
            solvedPieces = 0;
            startIndexX = 0;
            startIndexY = 0;
        } else if ((patternScheme == 'Rows') || (patternScheme == 'Live Rows')) {
            solvedPieces = tempIndex * cols;
            startIndexX = 0;
            startIndexY = tempIndex;
        } else if ((patternScheme == 'Cols') || (patternScheme == 'Live Cols')) {
            solvedPieces = tempIndex * rows;
            startIndexX = tempIndex;
            startIndexY = 0;
        } else if ((patternScheme == 'L2R') || (patternScheme == 'Live L2R')) {
            if (tempIndex < (rows - 2)) {
                solvedPieces = tempIndex * cols;
                startIndexX = 0;
                startIndexY = tempIndex;
            } else {
                solvedPieces = (rows - 2) * cols + (tempIndex - rows + 2) * 2;
                startIndexX = tempIndex - rows + 2;
                startIndexY = rows - 2;
            }
        } else if ((patternScheme == 'L2C') || (patternScheme == 'Live L2C')) {
            if (tempIndex < (cols - 2)) {
                solvedPieces = tempIndex * rows;
                startIndexX = tempIndex;
                startIndexY = 0;
            } else {
                solvedPieces = (cols - 2) * rows + (tempIndex - cols + 2) * 2;
                startIndexX = cols - 2;
                startIndexY = tempIndex - cols + 2;
            }
        } else if ((patternScheme == 'Fringes') || (patternScheme == 'Live Fringes')) {
            if (rows == cols) {
                solvedPieces = tempIndex * (rows + cols - tempIndex);
                startIndexX = tempIndex;
                startIndexY = tempIndex;
            } else if (rows > cols) {
                if (tempIndex < (rows - cols)) {
                    solvedPieces = tempIndex * cols;
                    startIndexX = 0;
                    startIndexY = tempIndex;
                } else {
                    solvedPieces = (rows - cols) * cols + (tempIndex - rows + cols) * (2 * cols - (tempIndex - rows + cols));
                    startIndexX = tempIndex - rows + cols;
                    startIndexY = tempIndex;
                }
            } else {
                if (tempIndex < (cols - rows)) {
                    solvedPieces = tempIndex * rows;
                    startIndexX = tempIndex;
                    startIndexY = 0;
                } else {
                    solvedPieces = (cols - rows) * rows + (tempIndex - cols + rows) * (2 * rows - (tempIndex - cols + rows));
                    startIndexX = tempIndex;
                    startIndexY = tempIndex + rows - cols;
                }
            }
        }
        do {
            for (let i = startIndexY; i < rows; i++) {
                for (let j = startIndexX; j < cols; j++) {
                    if ((i == (rows - 1)) && (j == (cols - 1))) {
                    } else if (pieceType[i * cols + j + 1] == tempIndex) {
                        if (puzzle[i][j] != (i * cols + j + 1)) {
                            unsolved = true;
                            break;
                        } else {
                            solvedPieces++;
                        }
                    }
                }
            }
            if (!(unsolved)) {
                tempIndex++;
            }
        } while ((solvedPieces < rows * cols - 1) && !(unsolved));
        liveIndex = tempIndex;
    } else {
        for (let i = cols * rows - 1;i > 0;i--) {
            if (puzzle[Math.floor((i - 1) / cols)][(i - 1) % cols] != i) {
                unsolved = true;
                break;
            }
        }
    }
    if (!(unsolved)) {
        stopSolve();
    }
}

function move(moveDirection) {
    // direction: 0-L, 1-U, 2-R, 3-D
    let nextPieceAtRight = ((1 + moveDirection) % 2) * (1 - moveDirection);
    let nextPieceAtDown = (moveDirection % 2) * (2 - moveDirection);
    checkNewSolve();
    if (((moveDirection == 0) && (spaceX < cols - 1))
    || ((moveDirection == 1) && (spaceY < rows - 1))
    || ((moveDirection == 2) && (spaceX > 0))
    || ((moveDirection == 3) && (spaceY > 0))) {
        swap(spaceX, spaceY, spaceX + nextPieceAtRight, spaceY + nextPieceAtDown);
        spaceX += nextPieceAtRight;
        spaceY += nextPieceAtDown;
        if (solveInProgress) {
            moves++;
        }
    }
    if (moveDirection <= 1) {
        checkLiveSolved(0);
    } else {
        if (((patternScheme == 'L2R') || (patternScheme == 'Live L2R')) && (liveIndex >= rows - 2) && (moveDirection == 3)) {
            checkLiveSolved(cols);
        } else if (((patternScheme == 'L2C') || (patternScheme == 'Live L2C')) && (liveIndex >= cols - 2) && (moveDirection == 2)) {
            checkLiveSolved(rows);
        } else if ((patternScheme == 'Fringes') || (patternScheme == 'Live Fringes')) {
            checkLiveSolved(1);
        } else {
            checkLiveSolved(2);
        }
    }
}

function setStroke(j, i) {
    if (puzzleBorder) {
        ctx.strokeStyle = "#000";
    } else {
        let colorIndex = pieceType[puzzle[j][i]];
        if (bld && (bldIsConfirmed == 0)) {
            if (useRainbow) {
                ctx.fillStyle = "hsl(" + colorList[0] + ", " + saturation + "%, " + lightness + "%)";
            } else {
                ctx.fillStyle = colorLive[0];
            }
        } else {
            if (useRainbow) {
                ctx.fillStyle = "hsl(" + colorList[colorIndex] + ", " + saturation + "%, " + lightness + "%)";
            } else {
                ctx.fillStyle = colorLive[liveColor(colorIndex)];
            }
        }
    }
}

function setDrawSize() {
    puzzlePieceSize = Math.floor(Math.min((puzzleSize - (rows - 1) * puzzleMargin) / rows, (puzzleSize - (cols - 1) * puzzleMargin) / cols));
    puzzleTextSize = Math.floor(puzzleTextRatio * puzzlePieceSize);
    (rows > cols) ? drawPuzzleOffset = Math.floor((rows - cols) * (puzzlePieceSize + puzzleMargin) / 2): drawPuzzleOffset = 0;
}

function redrawPuzzle() {
    ctx.clearRect(0, 0, puzzleCanvas.width, puzzleCanvas.height);
    for (let i = 0;i < cols;i++) {
        for (let j = 0;j < rows;j++) {
            if (puzzle[j][i] != 0) {
                let colorIndex = pieceType[puzzle[j][i]];
                if (bld && (bldIsConfirmed == 0)) {
                    if (useRainbow) {
                        ctx.fillStyle = "hsl(" + colorList[0] + ", " + saturation + "%, " + lightness + "%)";
                    } else {
                        ctx.fillStyle = colorLive[0];
                    }
                } else {
                    if (useRainbow) {
                        ctx.fillStyle = "hsl(" + colorList[colorIndex] + ", " + saturation + "%, " + lightness + "%)";
                    } else {
                        ctx.fillStyle = colorLive[liveColor(colorIndex)];
                    }
                }
                if (puzzleRadiusFactor == 0) {
                    ctx.fillRect((puzzlePieceSize + puzzleMargin) * i + drawPuzzleOffset, (puzzlePieceSize + puzzleMargin) * j, puzzlePieceSize, puzzlePieceSize);
                    if (puzzleBorder) {
                        ctx.strokeRect((puzzlePieceSize + puzzleMargin) * i + drawPuzzleOffset, (puzzlePieceSize + puzzleMargin) * j, puzzlePieceSize, puzzlePieceSize);
                    }
                } else if (puzzleRadiusFactor == 0.5) {
                    let puzzleRadius = puzzlePieceSize * puzzleRadiusFactor;
                    ctx.beginPath();
                    ctx.arc((puzzlePieceSize + puzzleMargin) * i + puzzlePieceSize / 2 + drawPuzzleOffset, (puzzlePieceSize + puzzleMargin) * j + puzzlePieceSize / 2, puzzleRadius, 0, 2 * Math.PI);
                    ctx.fill();
                    if (puzzleBorder) {
                        ctx.strokeStyle = "#000";
                        ctx.beginPath();
                        ctx.arc((puzzlePieceSize + puzzleMargin) * i + puzzlePieceSize / 2 + drawPuzzleOffset, (puzzlePieceSize + puzzleMargin) * j + puzzlePieceSize / 2, puzzleRadius, 0, 2 * Math.PI);
                        ctx.stroke();
                    }
                } else {
                    let puzzleRadius = puzzlePieceSize * puzzleRadiusFactor, lineLength = puzzlePieceSize - 2 * puzzleRadius;
                    let pieceStartX = (puzzlePieceSize + puzzleMargin) * i, pieceStartY = (puzzlePieceSize + puzzleMargin) * j;
                    drawFilletRect(puzzleRadius, lineLength, pieceStartX, pieceStartY);
                    ctx.fill();
                    if (puzzleBorder) {
                        ctx.strokeStyle = "#000";
                        drawFilletRect(puzzleRadius, lineLength, pieceStartX, pieceStartY);
                        ctx.stroke();
                    }
                }
            }
        }
    }
    ctx.font = puzzleTextSize + "px sans-serif";
    ctx.fillStyle = puzzleTextColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    if (!(bld) || bldIsConfirmed != 0 || (multibld && multibldProgress < multibldLength)) {
        for (let i = 0;i < cols;i++) {
            for (let j = 0;j < rows;j++) {
                if (puzzle[j][i] != 0) {
                    ctx.fillText(numberBaseList[puzzle[j][i]], puzzlePieceSize * (i + 0.5) + puzzleMargin * i + drawPuzzleOffset, puzzlePieceSize * (j + 0.5) + puzzleMargin * j);
                }
            }
        }
    }
}

function drawFilletRect(puzzleRadius, lineLength, pieceStartX, pieceStartY) {
    ctx.beginPath();
    ctx.arc(pieceStartX + puzzleRadius + drawPuzzleOffset, pieceStartY + puzzleRadius, puzzleRadius, Math.PI, Math.PI * 3 / 2);
    ctx.lineTo(pieceStartX + puzzleRadius + lineLength + drawPuzzleOffset, pieceStartY);
    ctx.arc(pieceStartX + puzzleRadius + lineLength + drawPuzzleOffset, pieceStartY + puzzleRadius, puzzleRadius, Math.PI * 3 / 2, 0);
    ctx.lineTo(pieceStartX + puzzlePieceSize + drawPuzzleOffset, pieceStartY + puzzleRadius + lineLength);
    ctx.arc(pieceStartX + puzzleRadius + lineLength + drawPuzzleOffset, pieceStartY + puzzleRadius + lineLength, puzzleRadius, 0, Math.PI / 2);
    ctx.lineTo(pieceStartX + puzzleRadius + drawPuzzleOffset, pieceStartY + puzzlePieceSize);
    ctx.arc(pieceStartX + puzzleRadius + drawPuzzleOffset, pieceStartY + puzzleRadius + lineLength, puzzleRadius, Math.PI / 2, Math.PI);
    ctx.lineTo(pieceStartX + drawPuzzleOffset, pieceStartY + puzzleRadius);
}

function redraw() {
    redrawPuzzle();
    updateStatus();
}

function liveColor(x1) {
    if (x1 < liveIndex) {
        return 0;
    } else if (x1 == liveIndex) {
        return 1;
    } else if (x1 == liveIndex + 1) {
        return 2;
    } else {
        return 3;
    }
}

function updateStatus() {
    let statusRow = document.querySelector("#statusBar");
    let d = new Date;
    currentTime = d.getTime();
    let realTime, memoTime;
    let timeContent, movesContent, tpsContent, marathonContent, multibldContent, multibldResult;
    marathonContent = "";
    multibldContent = "";
    multibldResult = "";
    movesContent = "";
    if (marathon) {
        marathonContent = "[" + infoBarList[language][0] + solvesDone + " / " + marathonLength + "] ";
    }
    if (multibld) {
        if (multibldProgress >= 2 * multibldLength) {
            multibldResult = " [" + infoBarList[language][1] + (multibldLength - multibldFailed) + " / " + multibldLength + "]";
        }
        multibldContent = "[" + infoBarList[language][0] + (multibldProgress % multibldLength + 1) + " / " + multibldLength + "] ";
    }
    if (solveInProgress) {
        realTime = convertAccuracy((currentTime - startTime) / 1000);
        if (bld) {
            if (updateFreq == 0) {
                timeContent = "-- [--]";
                movesContent = "--";
                tpsContent = "--";
            } else {
                movesContent = moves;
                if ((multibld && multibldFinishMemo) || (!(multibld) && bldFinishMemo)) {
                    memoTime = (memoFinishTime - startTime) / 1000;
                    switch (updateFreq) {
                        case (60):
                            timeContent = timeConvert(realTime) + ' [' + timeConvert(memoTime) + ']';
                            tpsContent = convertAccuracy(moves / (realTime - memoTime));
                            break;
                        case (10):
                            timeContent = timeConvert(Math.floor(realTime * 10) / 10) + ' [' + timeConvert(Math.floor(memoTime * 10) / 10) + ']';
                            tpsContent = Math.round(moves * 10 / (realTime - memoTime)) / 10;
                            break;
                        case (1):
                            timeContent = timeConvert(Math.floor(realTime)) + ' [' + timeConvert(Math.floor(memoTime)) + ']';
                            tpsContent = Math.round(moves / (realTime - memoTime));
                            break;
                        default:
                            break;
                    }
                } else {
                    tpsContent = 0;
                    switch (updateFreq) {
                        case (60):
                            timeContent = timeConvert(realTime);
                            break;
                        case (10):
                            timeContent = timeConvert(Math.floor(realTime * 10) / 10);
                            break;
                        case (1):
                            timeContent = timeConvert(Math.floor(realTime));
                            break;
                        default:
                            break;
                    }
                    timeContent = timeContent + ' [' + timeContent + ']';
                }
            }
        } else {
            if ((realTime == 0) && (moves == 0)) {
                tpsContent = "0";
            } else {
                if (updateFreq == 0) {
                    timeContent = "--";
                    movesContent = "--";
                    tpsContent = "--";
                } else {
                    movesContent = moves;
                    switch (updateFreq) {
                        case (60):
                            timeContent = timeConvert(realTime);
                            tpsContent = convertAccuracy(moves / realTime);
                            break;
                        case (10):
                            timeContent = timeConvert(Math.floor(realTime * 10) / 10);
                            tpsContent = Math.floor(moves * 10 / realTime) / 10;
                            break;
                        case (1):
                            timeContent = timeConvert(Math.floor(realTime));
                            tpsContent = Math.floor(moves / realTime);
                            break;
                        default:
                    }
                }
            }
        }
    } else {
        realTime = convertAccuracy((endTime - startTime) / 1000);
        movesContent = moves;
        if (bld) {
            if (bldFinishMemo) {
                memoTime = (memoFinishTime - startTime) / 1000;
                timeContent = timeConvert(realTime) + ' [' + timeConvert(memoTime) + ']';
                tpsContent = convertAccuracy(moves / (realTime - memoTime));
            } else {
                timeContent = timeConvert(realTime) + ' [' + timeConvert(realTime) + ']';
                tpsContent = "0";
            }
        } else {
            timeContent = timeConvert(realTime);
            if (realTime == 0 && (moves != 0 || !(solveInProgress))) {
                tpsContent = "0";
            } else {
                tpsContent = convertAccuracy(moves / realTime);
            }
        }
    }
    statusRow.textContent = marathonContent + multibldContent + infoBarList[language][2] + timeContent + infoBarList[language][3] + movesContent + infoBarList[language][4] + tpsContent + multibldResult;
}

function timeConvert(inputTime) {
    if (useMinutes) {
        let tempMinutes = Math.floor(inputTime / 60), tempSeconds = convertAccuracy(inputTime % 60);
        if (useHours) {
            if (tempMinutes >= 60) {
                return (Math.floor(tempMinutes / 60) + ":" + tempMinutes % 60 + ":" + tempSeconds);
            } else if (tempMinutes > 0) {
                return (tempMinutes + ":" + tempSeconds);
            } else {
                return inputTime;
            }
        } else {
            if (tempMinutes > 0) {
                return (tempMinutes + ":" + tempSeconds);
            } else {
                return inputTime;
            }
        }
    } else {
        return inputTime;
    }
}

document.onkeydown = function(event) {
    let e = event || window.event;
    if (e && onMainPage) {
        switch(e.keyCode) {
            // L U R D;D K F J
            case(37): case(68):
                if (solveInProgress && multibld && multibldProgress < multibldLength) {
                } else
                    move(2 * invertControl);
            break;
            case(38): case(75):
                if (solveInProgress && multibld && multibldProgress < multibldLength) {
                } else
                    move(1 + 2 * invertControl);
            break;
            case(39): case(70):
                if (solveInProgress && multibld && multibldProgress < multibldLength) {
                } else
                    move(2 - 2 * invertControl);
            break;
            case(40): case(74):
                if (solveInProgress && multibld && multibldProgress < multibldLength) {
                } else
                    move(3 - 2 * invertControl);
            break;
            case(32):
                event.preventDefault();
                if (!(solveInProgress)) {
                    document.querySelector('#scrambleBtn').click();
                } else if (bld && !(multibld) && bldIsConfirmed == 0) {
                    document.querySelector('#confirmBtn').click();
                } else if (multibld) {
                    if (multibldProgress == (2 * multibldLength - 1)) {
                        document.querySelector('#confirmBtn').click();
                    } else if (multibldProgress < (3 * multibldLength - 1)) {
                        document.querySelector('#nextBtn').click();
                    }
                } else {
                    document.querySelector('#scrambleBtn').click();
                }
            break;
            case(13):
                event.preventDefault();
            break;
            case(27):
                document.querySelector('#solveBtn').click();
            break;
            case(33):
                if (cols < maxSize) cols ++;
                setPuzzleOnSizeChange();
            break;
            case(34):
                if (cols > 2) cols --;
                setPuzzleOnSizeChange();
            break;
            case(36):
                if (rows < maxSize) rows ++;
                setPuzzleOnSizeChange();
            break;
            case(35):
                if (rows > 2) rows --;
                setPuzzleOnSizeChange();
            break;
            case(109): case(173): case(189): // minus: numpad/firefox/others
                if ((rows > 2) && (cols > 2)) {
                    rows --;
                    cols --;
                }
                setPuzzleOnSizeChange();
            break;
            case(107): case(61): case(187): // minus: numpad/firefox/others
                if ((rows < maxSize) && (cols < maxSize)) {
                    rows ++;
                    cols ++;
                }
                setPuzzleOnSizeChange();
            break;
        }
        redraw();
    }
}

function getLocationOnCanvas(x, y) {
    let bbox = puzzleCanvas.getBoundingClientRect();
    return {
        x: (x - bbox.left) * (puzzleCanvas.width / bbox.width),
        y: (y - bbox.top) * (puzzleCanvas.height / bbox.height)
    }
}

function clickMove(canvasX, canvasY) {
    let clickX, clickY;
    if ((canvasX <= puzzleSize) && (canvasY <= puzzleSize)) {
        let tempX = spaceX, tempY = spaceY;
        if ((canvasX % (puzzlePieceSize + puzzleMargin) <= puzzlePieceSize) && (canvasY % (puzzlePieceSize + puzzleMargin) <= puzzlePieceSize)) {
            clickX = Math.floor((canvasX - drawPuzzleOffset) / (puzzlePieceSize + puzzleMargin));
            clickY = Math.floor(canvasY / (puzzlePieceSize + puzzleMargin));
            if (multibld && !(multibldFinishMemo)) {
            } else if (clickX >= 0 && clickY >= 0 && clickX < cols && clickY < rows) {
                if (clickY == tempY) {
                    for (let i = 0;i < Math.abs(tempX - clickX);i++) {
                        move(Math.sign(tempX - clickX) + 1);
                    }
                } else if (clickX == tempX) {
                    for (let i = 0;i < Math.abs(tempY - clickY);i++) {
                        move(Math.sign(tempY - clickY) + 2);
                    }
                }
            }
            if ((clickX == tempX) && (clickY == tempY)) {
                updateStatus();
            } else {
                redraw();
            }
        }
    }
}

puzzleCanvas.onmousedown = function(e) {
    let location = getLocationOnCanvas(e.clientX, e.clientY);
    clickMove(location.x, location.y);
}

puzzleCanvas.onmousemove = function(e) {
    if (hoverOn) {
        let location = getLocationOnCanvas(e.clientX, e.clientY);
        clickMove(location.x, location.y);
    }
}

function stopRelay() {
    if (relay) {
        if (relayRowsChange) {
            if (rows == 2) {
                relayInProgress = false;
                rows = relayStartRows;
                cols = relayStartCols;
                setDrawSize();
                if (solveInProgress) {
                    stopTimer(true);
                }
                solveInProgress = false;
                defineType();
                genColor();
                initPuzzle();
            }
        }
        if (relayColsChange) {
            if (cols == 2) {
                relayInProgress = false;
                cols = relayStartCols;
                if (solveInProgress) {
                    stopTimer(true);
                }
                solveInProgress = false;
                setDrawSize();
                defineType();
                genColor();
                initPuzzle();
            }
        }
        if (relayInProgress) {
            if (relayRowsChange || relayColsChange) {
                if (relayRowsChange) {
                    rows--;
                    setDrawSize();
                    defineType();
                    genColor();
                }
                if (relayColsChange) {
                    cols--;
                    setDrawSize();
                    defineType();
                    genColor();
                }
            } else {
                if (cols > 2) {
                    cols--;
                    setDrawSize();
                    defineType();
                    genColor();
                } else if (rows == 2) {
                    relayInProgress = false;
                    if (solveInProgress) {
                        stopTimer(true);
                    }
                    solveInProgress = false;
                    rows = relayStartRows;
                    cols = relayStartCols;
                    setDrawSize();
                    defineType();
                    genColor();
                    initPuzzle();
                } else {
                    rows--;
                    cols = relayStartCols;
                    setDrawSize();
                    defineType();
                    genColor();
                }
            }
        }
        if (relayInProgress) {
            relayProgress ++;
            scrambleString += (" #" + (relayProgress + 1) + ": ");
            beforeScramble();
            scramble();
            afterScramble();
        }
    }
    redraw();
}

function stopMarathon() {
    if (marathon) {
        if (solvesDone < marathonLength) {
            solvesDone++;
            if (solvesDone < marathonLength)
                scrambleString += (" #" + (solvesDone + 1) + ": ");
        }
        if (solvesDone == marathonLength) {
            marathonInProgress = false;
            if (solveInProgress) {
                stopTimer(true);
            }
            solveInProgress = false;
        }
    }
    if (marathonInProgress) {
        beforeScramble();
        scramble();
        afterScramble();
    }
}

function stopRegular() {
    if (solveInProgress) {
        stopTimer(true);
    }
    solveInProgress = false;
}

function bldConfirm() {
    if (multibld) {
        copyPuzzle();
        for (let i = 0; i < multibldLength; i++) {
            unsolved = false;
            for (let j = 1;j < rows * cols;j++) {
                if (multibldState[i][Math.floor((j - 1) / cols)][(j - 1) % cols] != j) {
                    unsolved = true;
                    break;
                }
            }
            if (unsolved) {
                multibldFailed++;
            }
        }
        document.querySelector('#prevBtn').style.visibility = 'hidden';
        if (multibldFailed > 0) {
            unsolved = true;
        }
    }
    unsolved ? bldIsConfirmed = -1 : bldIsConfirmed = 1;
    solveInProgress = false;
    drawSpacebarCanvas();
    stopTimer(true);
}

function startTimer() {
    switch (updateFreq) {
        case (60):
            intervalID = setInterval("updateStatus()", 16);
            break;
        case (10):
            intervalID = setInterval("updateStatus()", 40);
            break;
        case (1):
            intervalID = setInterval("updateStatus()", 80);
            break;
        default:
            break;
    }
    let d = new Date();
    startTime = d.getTime();
}

function memoTimer() {
    drawFilletRect();
    let d = new Date();
    memoFinishTime = d.getTime();
    redraw();
}

function stopTimer(x) {
    clearInterval(intervalID);
    let d = new Date();
    timeString = d.toLocaleDateString()  + " " + d.toLocaleTimeString();
    endTime = d.getTime();
    updateStatus();
    if (x) {
        addResult();
    }
}

function resetTimer() {
    startTime = endTime = memoFinishTime = currentTime = 0;
    moves = 0;
}

function stopSolve() {
    if (!(bld)) {
        if (marathon || relay) {
            stopRelay();
            stopMarathon();
        } else {
            if (!(unsolved)) {
                stopRegular();
            }
        }
        controlCustomizeBtn();
    }
    redraw();
}

function controlPageRowBtn() {

}

function controlCustomizeBtn() {
    let cbtn = document.querySelector('#customizeBtn');
    let cfbtn = document.querySelector('#confirmBtn');
    let pbtn = document.querySelector('#prevBtn');
    let nbtn = document.querySelector('#nextBtn');
    if (solveInProgress) {
        if (bld && bldInProgress) {
            if (bldFinishMemo) {
                cbtn.style.visibility = 'hidden';
                cfbtn.style.visibility = 'visible';
            } else {
                cbtn.style.visibility = 'hidden';
                cfbtn.style.visibility = 'hidden';
            }
            if (multibld) {
                nbtn.style.visibility = 'visible';
                pbtn.style.visibility = 'visible';
            } else {
                nbtn.style.visibility = 'hidden';
                pbtn.style.visibility = 'hidden';
            }
        } else {
            cfbtn.style.visibility = 'hidden';
            cbtn.style.visibility = 'hidden';
        }
    } else {
        cfbtn.style.visibility = 'hidden';
        cbtn.style.visibility = 'visible';
        if (multibld && (startTime != 0)) {
            nbtn.style.visibility = 'visible';
            pbtn.style.visibility = 'hidden';
        } else {
            nbtn.style.visibility = 'hidden';
            pbtn.style.visibility = 'hidden';
        }
    }
}

function exportState() {
    if (solveInProgress && bld && (multibldFinishMemo || (!(multibld) && bldFinishMemo))) {
        alert(infoBarList[language][6]);
    } else {
        let transfer = document.createElement('input');
        let exportString = "";
        document.body.appendChild(transfer);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                exportString += puzzle[i][j];
                (j == cols - 1) ? exportString += "/" : exportString += " ";
            }
        }
        exportString = exportString.substr(0, exportString.length - 1);
        transfer.value = exportString;
        transfer.focus();
        transfer.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        transfer.blur();
        alert(infoBarList[language][5]);
        document.body.removeChild(transfer);
    }
}

function setPage(x){
    let pgs = document.querySelectorAll('.pg');
    for (let i = 0;i < 3;i++) {
        if (i == x) {
            pgs[i].style.display = "block";
        } else {
            pgs[i].style.display = "none";
        }
    }

    let bbtn = document.querySelector('#backBtn');
    let rbtn = document.querySelector('#resultBtn');
    let sbtn = document.querySelector('#settingsBtn');
    bbtn.style.visibility = 'visible';
    rbtn.style.visibility = 'visible';
    sbtn.style.visibility = 'visible';
    if (x == 0) {
        bbtn.style.visibility = 'hidden';
        if (!(disableFunctionButton))
            spacebarCanvas.style.visibility = 'visible';
        if (!(disableSummary))
            summary.style.visibility = 'visible';
    }
    else {
        spacebarCanvas.style.visibility = 'hidden';
        summary.style.visibility = 'hidden';
        if (x == 1)
            rbtn.style.visibility = 'hidden';
        else
            sbtn.style.visibility = 'hidden';
    }
    onMainPage = (x == 0);
}