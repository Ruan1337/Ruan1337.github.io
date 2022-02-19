function readLocalStorage() {
    if (localStorage.getItem("cols")) cols = Number(localStorage.getItem("cols"));
    if (localStorage.getItem("rows")) rows = Number(localStorage.getItem("rows"));
    relayStartCols = cols;
    relayStartRows = rows;
    if (localStorage.getItem("puzzleSize")) {
        puzzleCanvas.width = puzzleCanvas.height = puzzleSize = Number(localStorage.getItem("puzzleSize"));
    }
    if (localStorage.getItem("marathonLength")) marathonLength = Number(localStorage.getItem("marathonLength"));
    if (localStorage.getItem("multibldLength")) multibldLength = Number(localStorage.getItem("multibldLength"));
    if (localStorage.getItem("puzzleTextColor")) puzzleTextColor = localStorage.getItem("puzzleTextColor");
    if (localStorage.getItem("puzzleTextRatio")) puzzleTextRatio = Number(localStorage.getItem("puzzleTextRatio"));
    if (localStorage.getItem("puzzleMargin")) puzzleMargin = Number(localStorage.getItem("puzzleMargin"));
    if (localStorage.getItem("puzzleRadiusFactor")) puzzleRadiusFactor = Number(localStorage.getItem("puzzleRadiusFactor"));
    if (localStorage.getItem("puzzleBorder")) puzzleBorder = (localStorage.getItem("puzzleBorder") == "true");
    if (localStorage.getItem("puzzleBase")) puzzleBase = Number(localStorage.getItem("puzzleBase"));
    if (localStorage.getItem("patternScheme")) patternScheme = localStorage.getItem("patternScheme");
    if (localStorage.getItem("lightness")) lightness = Number(localStorage.getItem("lightness"));
    if (localStorage.getItem("colorLive0")) colorLive[0] = localStorage.getItem("colorLive0");
    if (localStorage.getItem("colorLive1")) colorLive[1] = localStorage.getItem("colorLive1");
    if (localStorage.getItem("colorLive2")) colorLive[2] = localStorage.getItem("colorLive2");
    if (localStorage.getItem("colorLive3")) colorLive[3] = localStorage.getItem("colorLive3");
    if (localStorage.getItem("invertControl")) invertControl = Number(localStorage.getItem("invertControl"));
    if (localStorage.getItem("hoverOn")) hoverOn = (localStorage.getItem("hoverOn") == "true");
    if (localStorage.getItem("disableFunctionButton")) disableFunctionButton = (localStorage.getItem("disableFunctionButton") == "true");
    if (localStorage.getItem("timerAccuracy")) timerAccuracy = Number(localStorage.getItem("timerAccuracy"));
    if (localStorage.getItem("useMinutes")) useMinutes = (localStorage.getItem("useMinutes") == "true");
    if (localStorage.getItem("useHours")) useHours = (localStorage.getItem("useHours") == "true");
    if (localStorage.getItem("updateFreq")) updateFreq = Number(localStorage.getItem("updateFreq"));
    if (localStorage.getItem("language")) language = Number(localStorage.getItem("language"));

    if (localStorage.getItem("sessionName")) sessionName = JSON.parse(localStorage.getItem("sessionName"));
    if (localStorage.getItem("maxSessionIndex")) maxSessionIndex = Number(localStorage.getItem("maxSessionIndex"));
    if (localStorage.getItem("resultSession")) resultSession = Number(localStorage.getItem("resultSession"));
    if (localStorage.getItem("resultSolves")) resultSolves = JSON.parse(localStorage.getItem("resultSolves"));
    if (localStorage.getItem("resultArray")) resultArray = JSON.parse(localStorage.getItem("resultArray"));
    if (localStorage.getItem("averageNumber")) averageNumber = JSON.parse(localStorage.getItem("averageNumber"));
    if (localStorage.getItem("averageType")) averageType = JSON.parse(localStorage.getItem("averageType"));
    appendSession();
    clearResult();
    reloadResult();

    useRainbow = (patternScheme.indexOf("Live") < 0);
    defineType();
    genColor();
}

function startUpSetting() {
    document.querySelector("#adjWidth").value = cols;
    document.querySelector("#adjWidthSlider").value = cols;
    document.querySelector("#adjHeight").value = rows;
    document.querySelector("#adjHeightSlider").value = rows;
    document.querySelector("#adjMara").value = marathonLength;
    document.querySelector("#adjMaraSlider").value = marathonLength;
    document.querySelector("#adjMultibld").value = multibldLength;
    document.querySelector("#adjMultibldSlider").value = multibldLength;
    document.querySelector("#solveType").value = mode;

    document.querySelector("#puzzleTextColor").value = puzzleTextColor;
    document.querySelector("#adjPuzzleTextRatio").value = puzzleTextRatio;
    document.querySelector("#adjPuzzleTextRatioSlider").value = puzzleTextRatio;
    document.querySelector("#adjPuzzleSize").value = puzzleSize;
    document.querySelector("#adjPuzzleSizeSlider").value = puzzleSize;
    document.querySelector("#adjMargin").value = puzzleMargin;
    document.querySelector("#adjMarginSlider").value = puzzleMargin;
    document.querySelector("#adjRadius").value = puzzleRadiusFactor;
    document.querySelector("#adjRadiusSlider").value = puzzleRadiusFactor;
    document.querySelector("#adjBorder").checked = puzzleBorder;
    document.querySelector("#adjBase").value = puzzleBase;
    document.querySelector("#adjBaseSlider").value = puzzleBase;
    setDefaultSelected("puzzleScheme", patternScheme);
    document.querySelector("#rainbowLightness").value = lightness;
    document.querySelector("#rainbowLightnessSlider").value = lightness;
    document.querySelector("#liveDoneColor").value = colorLive[0];
    document.querySelector("#liveCurrentColor").value = colorLive[1];
    document.querySelector("#liveNextColor").value = colorLive[2];
    document.querySelector("#liveFurtherColor").value = colorLive[3];

    document.querySelector("#invertControl").checked = invertControl;
    document.querySelector("#hoverControl").checked = hoverOn;
    document.querySelector("#functionButtonControl").checked = disableFunctionButton;
    setDefaultSelected("accuracy", timerAccuracy);
    setDefaultSelected("minutes", useMinutes + useHours);
    setDefaultSelected("freq", updateFreq);
    setDefaultSelected("language", language);

    setDefaultSelected("resultSession", resultSession);
    document.querySelector("#adjAverageNumber1").value = averageNumber[0];
    document.querySelector("#adjAverageNumber2").value = averageNumber[1];
    setDefaultSelected("adjAverageType1", averageType[0]);
    setDefaultSelected("adjAverageType2", averageType[1]);
    setLandscape();
}

function puzzleSizeOnChange(slider) {
    let colsField, rowsField;
    if (slider == 0) {
        colsField = document.querySelector("#adjWidth").value;
        rowsField = document.querySelector("#adjHeight").value;
    } else {
        colsField = document.querySelector("#adjWidthSlider").value;
        rowsField = document.querySelector("#adjHeightSlider").value;
    }
    if (isNaN(colsField) || isNaN(rowsField)) {
        colsField.value = cols;
        rowsField.value = rows;
        return false;
    }
    numInputCols = Number(colsField), numInputRows = Number(rowsField);
    if (numInputCols < 2 || numInputRows < 2 || numInputCols > 20 || numInputRows > 20
    || numInputCols % 1 || numInputRows % 1 || (numInputCols == cols && numInputRows == rows)) {
        document.querySelector("#adjWidth").value = document.querySelector("#adjWidthSlider").value = cols;
        document.querySelector("#adjHeight").value = document.querySelector("#adjHeightSlider").value = rows;
        return false;
    }
    cols = numInputCols;
    rows = numInputRows;
    setDrawSize();
    document.querySelector("#adjWidth").value = cols;
    document.querySelector("#adjHeight").value = rows;
    document.querySelector("#adjWidthSlider").value = cols;
    document.querySelector("#adjHeightSlider").value = rows;
    setPuzzleOnSizeChange();
}

function pxSizeOnChange(slider) {
    let inputSize;
    (slider == 0) ? inputSize = document.querySelector("#adjPuzzleSize").value : inputSize = document.querySelector("#adjPuzzleSizeSlider").value;
    if (isNaN(inputSize) || Number(inputSize) < 100 || Number(inputSize) > 2000) {
        inputMara.value = puzzleSize;
        return false;
    }
    puzzleSize = Number(inputSize);
    puzzleCanvas.width = puzzleSize;
    puzzleCanvas.height = puzzleSize;
    document.querySelector("#adjPuzzleSize").value = puzzleSize;
    document.querySelector("#adjPuzzleSizeSlider").value = puzzleSize;
    localStorage.setItem("puzzleSize", puzzleSize);
    setPuzzleOnSizeChange();
}

function setPuzzleOnSizeChange() {
    document.querySelector("#adjWidth").value = cols;
    document.querySelector("#adjHeight").value = rows;
    relayStartCols = cols;
    relayStartRows = rows;
    localStorage.setItem("cols", cols);
    localStorage.setItem("rows", rows);
    setDrawSize();
    defineType();
    genColor();
    initPuzzle();
    redraw();
}

function solveTypeChange(x) {
    mode = x;
    switch(x) {
        case("std"):
            setSolveTypeChange(false, false, false, false, false, false);
        break;
        case("tt"):
            setSolveTypeChange(true, true, true, false, false, false);
        break;
        case("tf"):
            setSolveTypeChange(true, true, false, false, false, false);
        break;
        case("ft"):
            setSolveTypeChange(true, false, true, false, false, false);
        break;
        case("ff"):
            setSolveTypeChange(true, false, false, false, false, false);
        break;
        case("mara"):
            setSolveTypeChange(false, false, false, true, false, false);
        break;
        case("bld"):
            setSolveTypeChange(false, false, false, false, true, false);
        break;
        case("multibld"):
            setSolveTypeChange(false, false, false, false, true, true);
        break;
    }
}

function setSolveTypeChange(relayTF, colsChangeTF, rowsChangeTF, marathonTF, bldTF, multiTF) {
    relay = relayTF;
    relayColsChange = colsChangeTF;
    relayRowsChange = rowsChangeTF;
    marathon = marathonTF;
    bld = bldTF;
    multibld = multiTF;
}

function maraOnChange(slider) {
    let inputMara;
    (slider == 0) ? inputMara = document.querySelector("#adjMara").value : inputMara = document.querySelector("#adjMaraSlider").value;
    if (isNaN(inputMara) || Number(inputMara) < 2
    || Number(inputMara) % 1) {
        inputMara.value = marathonLength;
        return false;
    }
    marathonLength = Number(inputMara);
    document.querySelector("#adjMara").value = marathonLength;
    document.querySelector("#adjMaraSlider").value = marathonLength;
    localStorage.setItem("marathonLength", marathonLength);
}

function multibldOnChange(slider) {
    let inputMultibld;
    (slider == 0) ? inputMultibld = document.querySelector("#adjMultibld").value : inputMultibld = document.querySelector("#adjMultibldSlider").value;
    if (isNaN(inputMultibld) || Number(inputMultibld) < 2
    || Number(inputMultibld) % 1) {
        inputMultibld.value = multibldLength;
        return false;
    }
    multibldLength = Number(inputMultibld);
    document.querySelector("#adjMultibld").value = multibldLength;
    document.querySelector("#adjMultibldSlider").value = multibldLength;
    localStorage.setItem("multibldLength", multibldLength);
}

function changePuzzleTextColor(x) {
    puzzleTextColor = x;
    localStorage.setItem("puzzleTextColor", x);
}

function textRatioOnChange(slider) {
    let inputTextRatio;
    (slider == 0) ? inputTextRatio = document.querySelector("#adjPuzzleTextRatio").value : inputTextRatio = document.querySelector("#adjPuzzleTextRatioSlider").value;
    if (isNaN(inputTextRatio) || Number(inputTextRatio) > 1 || Number(inputTextRatio) < 0.01) {
        inputTextRatio.value = puzzleTextRatio;
        return false;
    }
    puzzleTextRatio = Math.floor(Number(inputTextRatio) * 100) / 100;
    document.querySelector("#adjPuzzleTextRatio").value = puzzleTextRatio;
    document.querySelector("#adjPuzzleTextRatioSlider").value = puzzleTextRatio;
    localStorage.setItem("puzzleTextRatio", puzzleTextRatio);
}

function marginOnChange(slider) {
    let inputSize;
    (slider == 0) ? inputSize = document.querySelector("#adjMargin").value : inputSize = document.querySelector("#adjMarginSlider").value;
    if (isNaN(inputSize) || Number(inputSize) < 0 || Number(inputSize) == puzzleMargin) {
        inputSize.value = puzzleMargin;
        return false;
    }
    puzzleMargin = Math.floor(Number(inputSize));
    document.querySelector("#adjMargin").value = puzzleMargin;
    document.querySelector("#adjMarginSlider").value = puzzleMargin;
    localStorage.setItem("puzzleMargin", puzzleMargin);
    redraw();
}

function changeRadiusFactor(x) {
    if (x > 0) {
        if (puzzleRadiusFactor <= 0.45) {
            puzzleRadiusFactor = Math.floor((puzzleRadiusFactor + 0.05) * 100) / 100;
        }
    } else {
        if (puzzleRadiusFactor >= 0.05) {
            puzzleRadiusFactor = Math.floor((puzzleRadiusFactor - 0.05) * 100) / 100;
        }
    }
    document.querySelector("#adjRadius").value = puzzleRadiusFactor;
    redraw();
}

function radiusFactorOnChange(slider) {
    let inputRadiusFactor;
    (slider == 0) ? inputRadiusFactor = document.querySelector("#adjRadius").value : inputRadiusFactor = document.querySelector("#adjRadiusSlider").value;
    if (isNaN(inputRadiusFactor) || Number(inputRadiusFactor) < 0 || Number(inputRadiusFactor) > 0.5 || Number(inputRadiusFactor) == puzzleRadiusFactor) {
        inputRadiusFactor.value = puzzleRadiusFactor;
        return false;
    }
    puzzleRadiusFactor = Math.floor(Number(inputRadiusFactor) * 100) / 100;
    document.querySelector("#adjRadius").value = puzzleRadiusFactor;
    document.querySelector("#adjRadiusSlider").value = puzzleRadiusFactor;
    localStorage.setItem("puzzleRadiusFactor", puzzleRadiusFactor);
    redraw();
}

function changePieceBorder() {
    puzzleBorder = !(puzzleBorder);
    localStorage.setItem("puzzleBorder", puzzleBorder);
    redraw();
}

function baseOnChange(slider) {
    let inputSize;
    (slider == 0) ? inputSize = document.querySelector("#adjBase").value : inputSize = document.querySelector("#adjBaseSlider").value;
    if (isNaN(inputSize) || Number(inputSize) < 2 || Number(inputSize) > 36 || Number(inputSize) % 1 || Number(inputSize) == puzzleBase) {
        inputSize.value = puzzleBase;
        return false;
    }
    puzzleBase = Number(inputSize);
    document.querySelector("#adjBase").value = puzzleBase;
    document.querySelector("#adjBaseSlider").value = puzzleBase;
    localStorage.setItem("puzzleBase", puzzleBase);
    genBase(puzzleBase);
    redraw();
}

function puzzleSchemeChange(x) {
    patternScheme = x;
    localStorage.setItem("patternScheme", patternScheme);
    useRainbow = (x.indexOf("Live") < 0);
    defineType();
    genColor();
    redraw();
}

function lightnessOnChange(slider) {
    let inputSize;
    (slider == 0) ? inputSize = document.querySelector("#rainbowLightness").value : inputSize = document.querySelector("#rainbowLightnessSlider").value;
    if (isNaN(inputSize) || Number(inputSize) < 0 || Number(inputSize) > 100 || Number(inputSize) == lightness) {
        inputSize.value = lightness;
        return false;
    }
    lightness = Math.floor(Number(inputSize));
    document.querySelector("#rainbowLightness").value = lightness;
    document.querySelector("#rainbowLightnessSlider").value = lightness;
    localStorage.setItem("lightness", lightness);
    redraw();
}

function invertControlFunction() {
    invertControl = 1 - invertControl;
    localStorage.setItem("invertControl", invertControl);
}

function hoverControlFunction() {
    hoverOn = !(hoverOn);
    localStorage.setItem("hoverOn", hoverOn);
}

function disableFunctionButtonFunction() {
    disableFunctionButton = !(disableFunctionButton);
    localStorage.setItem("disableFunctionButton", disableFunctionButton);
}

function accuracyChange(x) {
    timerAccuracy = x;
    localStorage.setItem("timerAccuracy", timerAccuracy);
}

function updateFreqChange(x) {
    updateFreq = Number(x);
    localStorage.setItem("updateFreq", updateFreq);
}

function setMinutes(x) {
    useMinutes = (x > 0);
    useHours = (x == 2);
    localStorage.setItem("useMinutes", useMinutes);
    localStorage.setItem("useHours", useHours);
}

function setDefaultSelected(selectId, checkValue) {
    let select = document.getElementById(selectId);
    for (i = 0;i < select.options.length;i++){ 
        if (select.options[i].value == checkValue){ 
            select.options[i].selected = true; 
            break; 
        }  
    }
}