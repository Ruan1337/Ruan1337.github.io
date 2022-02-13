let resultSolves = [], sessionSolves = 0, resultSession = 1, finishedSolves = 0;
let resultArray = [], sessionName = ["0", "1"];
let averageNumber = [5, 12], averageType = [1, 1]; // 1 = ao, 0 = mo
let timeAo = movesAo = tpsAo = 0, maxIndex = [0, 0, 0], minIndex = [0, 0, 0];
let sessionStatSum = [0, 0, 0];

function sessionChange(x) {
    clearResult();
    resultSession = x;
    document.querySelector('#sessionStats').innerHTML = infoBarList[language][7] + finishedSolves + "/" + sessionSolves + "): " + infoBarList[language][2] + 0 + infoBarList[language][3] + 0 + infoBarList[language][4] + 0;
    localStorage.setItem("resultSession", resultSession);
    if (resultSolves[resultSession] > 0) {
        reloadResult();
    } else {
        resultArray[resultSession] = [];
        resultSolves[resultSession] = 0;
    }
}

function setSessionName() {
    let tempSessionName = prompt(infoBarList[language][8]);
    if (tempSessionName) {
        sessionName[resultSession] = tempSessionName;
        let tempSessionId = "#session" + resultSession;
        document.querySelector(tempSessionId).innerHTML = tempSessionName
        localStorage.setItem("sessionName", JSON.stringify(sessionName));
    } else {
        return false;
    }
}

function getDetails() {
    let clickedCell = event.srcElement;
    let tempRowIndex = clickedCell.parentElement.rowIndex, tempColIndex = clickedCell.cellIndex;
    let alertMessage = "";
    if (tempRowIndex > 0) {
        if (tempColIndex == 0) {
            if (confirm(resultInteractionList[language][0])) {
                if (tempRowIndex != sessionSolves) {
                    for (let i = tempRowIndex; i < sessionSolves; i++) {
                        for (let j = 0; j < 4; j ++) {
                            resultArray[resultSession][i][j] = resultArray[resultSession][i + 1][j];
                        }
                    }
                    sessionSolves --;
                    // finished solves?
                    resultSolves[resultSession] --;
                    localStorage.setItem("resultSolves", JSON.stringify(resultSolves));
                    localStorage.setItem("resultArray", JSON.stringify(resultArray));
                    reloadResult();
                } else {
                    sessionSolves --;
                    // finished solves?
                    resultSolves[resultSession] --;
                    localStorage.setItem("resultSolves", JSON.stringify(resultSolves));
                    localStorage.setItem("resultArray", JSON.stringify(resultArray));
                    reloadResult();
                }
            }
        } else if (tempColIndex < 4) {
            alertMessage = tempRowIndex + "." + infoBarList[2] + (Math.floor(resultArray[resultSession][tempRowIndex][0] * timerAccuracy) / timerAccuracy) + infoBarList[3] + resultArray[resultSession][tempRowIndex][1] + infoBarList[4] + (Math.floor(resultArray[resultSession][tempRowIndex][1] / resultArray[resultSession][tempRowIndex][0] * timerAccuracy) / timerAccuracy) 
            + "\n" + buttonLanguageList[1] + ": " + resultArray[resultSession][tempRowIndex][2] + "\n" + resultArray[resultSession][tempRowIndex][3];
            alert(alertMessage);
        } else {
            let tempAverageType;
            (tempColIndex < 7) ? tempAverageType = 0 : tempAverageType = 1;
            let timeListString = averageBoxList[language][2] + ": " + document.querySelector("#resultTable").rows[tempRowIndex].cells[4].innerHTML + " = ";
            let movesListString = averageBoxList[language][3] + ": " + document.querySelector("#resultTable").rows[tempRowIndex].cells[5].innerHTML + " = ";
            let tpsListString = "TPS: " + document.querySelector("#resultTable").rows[tempRowIndex].cells[6].innerHTML + " = ";
            if (tempRowIndex >= averageNumber[tempAverageType]) {
                if (language == 0) {
                    alertMessage = averageBoxList[language][1 - averageType[tempAverageType]] + " of " + averageNumber[tempAverageType] + ":\n";
                } else {
                    alertMessage = averageNumber[tempAverageType] + "次" + averageBoxList[language][1 - averageType[tempAverageType]] + ":\n";
                }
                if (averageType[tempAverageType] == 0) {
                    for (let i = tempRowIndex - averageNumber[tempAverageType] + 1; i <= tempRowIndex; i ++) {
                        timeListString += (document.querySelector("#resultTable").rows[i].cells[1].innerHTML);
                        movesListString += (document.querySelector("#resultTable").rows[i].cells[2].innerHTML);
                        tpsListString += (document.querySelector("#resultTable").rows[i].cells[3].innerHTML);
                        if (i != tempRowIndex) {
                            timeListString += ", ";
                            movesListString += ", ";
                            tpsListString += ", ";
                        }
                    }
                } else {
                    let dnfs = 0, tempMaxIndex = [], tempMinIndex = [];
                    for (let i = 0; i < 3; i ++) {
                        tempMaxIndex[i] = tempRowIndex - averageNumber[tempAverageType] + 1;
                        tempMinIndex[i] = tempRowIndex - averageNumber[tempAverageType] + 1;
                    }
                    for (let i = tempRowIndex - averageNumber[tempAverageType] + 2; i <= tempRowIndex; i ++) {
                        if ((resultArray[resultSession][i][0] < 0) && (dnfs == 0)) {
                            dnfs ++;
                            tempMaxIndex[0] = i;
                            tempMaxIndex[1] = i;
                            tempMaxIndex[2] = i;
                        } else if (dnfs == 0) {
                            for (let j = 0; j < 2; j ++) {
                                if (resultArray[resultSession][i][j] > resultArray[resultSession][tempMaxIndex[j]][j])
                                    tempMaxIndex[j] = i;
                            }
                            if ((resultArray[resultSession][i][1] / resultArray[resultSession][i][0]) > (resultArray[resultSession][tempMaxIndex[2]][1] / resultArray[resultSession][tempMaxIndex[2]][0]))
                                tempMaxIndex[2] = i;
                        }
                        for (let j = 0; j < 2; j ++) {
                            if (resultArray[resultSession][i][j] <= resultArray[resultSession][tempMinIndex[j]][j])
                                tempMinIndex[j] = i;
                        }
                        if ((resultArray[resultSession][i][1] / resultArray[resultSession][i][0]) <= (resultArray[resultSession][tempMinIndex[2]][1] / resultArray[resultSession][tempMinIndex[2]][0]))
                            tempMinIndex[2] = i;
                    }
                    for (let i = tempRowIndex - averageNumber[tempAverageType] + 1; i <= tempRowIndex; i ++) {
                        if ((i != tempMaxIndex[0]) && (i != tempMinIndex[0])) {
                            timeListString += (document.querySelector("#resultTable").rows[i].cells[1].innerHTML);
                        } else {
                            timeListString += ("(" + document.querySelector("#resultTable").rows[i].cells[1].innerHTML + ")");
                        }
                        if ((i != tempMaxIndex[1]) && (i != tempMinIndex[1])) {
                            movesListString += (document.querySelector("#resultTable").rows[i].cells[2].innerHTML);
                        } else {
                            movesListString += ("(" + document.querySelector("#resultTable").rows[i].cells[2].innerHTML + ")");
                        }
                        if ((i != tempMaxIndex[2]) && (i != tempMinIndex[2])) {
                            tpsListString += (document.querySelector("#resultTable").rows[i].cells[3].innerHTML);
                        } else {
                            tpsListString += ("(" + document.querySelector("#resultTable").rows[i].cells[3].innerHTML + ")");
                        }
                        if (i != tempRowIndex) {
                            timeListString += ", ";
                            movesListString += ", ";
                            tpsListString += ", ";
                        }
                    }
                }
                alertMessage += (timeListString + "\n" + movesListString + "\n" + tpsListString);
                alert(alertMessage);
            }
        }
    }
}

function averageLengthChange(order) {
    let inputSize;
    (order == 0) ? inputSize = document.querySelector("#adjAverageNumber1").value : inputSize = document.querySelector("#adjAverageNumber2").value;
    if (isNaN(inputSize) || Number(inputSize) < 3 || Number(inputSize) > 1000 || inputSize % 1) {
        inputSize.value = averageNumber[order];
        return false;
    }
    averageNumber[order] = Number(inputSize);
    setAverageChange();
}

function averageTypeChange(order, aomo) {
    averageType[order] = aomo;
    setAverageChange();
}

function setAverageChange() {
    localStorage.setItem("averageNumber", JSON.stringify(averageNumber));
    localStorage.setItem("averageType", JSON.stringify(averageType));
    reloadResult();
}

function setResultCellWidth() {
    let cell = document.querySelectorAll(".resultTitle");
    cell.width = 0.2 * window.innerWidth;
}

function clearSession() {
    let confirmClear = confirm(customizeHintList[language][9]);
    if (confirmClear) {
        clearResult();
        resultArray[resultSession] = [];
        resultSolves[resultSession] = 0;
        sessionSolves = 0;
        finishedSolves = 0;
        document.querySelector('#sessionStats').innerHTML = infoBarList[language][7] + finishedSolves + "/" + sessionSolves + "): " + infoBarList[language][2] + 0 + infoBarList[language][3] + 0 + infoBarList[language][4] + 0;
        localStorage.setItem("resultSolves", JSON.stringify(resultSolves));
        localStorage.setItem("resultArray", JSON.stringify(resultArray));
    }
}

function clearResult() {
    let averageString = ["", ""];
    for (let i = 0; i < 2; i++) {
        if (averageType[i] == 1) {
            averageString[i] = averageString[i] + "Ao" + averageNumber[i];
        } else {
            averageString[i] = averageString[i] + "Mo" + averageNumber[i];
        }
    }
    timeAo = movesAo = tpsAo = 0;
    sessionStatSum = [0, 0, 0];
    document.querySelector("#resultTable").innerHTML = 
    '<tr> <td class="resultTitle"> # </td> <td class="resultTitle" id="timeSingle">' + averageBoxList[language][2] + '</td> <td class="resultTitle" id="movesSingle">' + averageBoxList[language][3] + '</td> <td class="resultTitle" id="tpsSingle"> TPS </td>' +
    '<td class="resultTitle" id="timeAo5">' + averageBoxList[language][2] + averageString[0] + '</td> <td class="resultTitle" id="movesAo5">' + averageBoxList[language][3] + averageString[0] + '</td> <td class="resultTitle" id="tpsAo5"> TPS' + averageString[0] +
    '</td> <td class="resultTitle" id="timeAo12">' + averageBoxList[language][2] +  averageString[1] + '</td> <td class="resultTitle" id="movesAo12">' + averageBoxList[language][3] + averageString[1] + '</td> <td class="resultTitle" id="tpsAo12"> TPS' + averageString[1] + '</td> </tr>';
}

function reloadResult() {
    clearResult();
    if (resultSolves[resultSession] > 0) {
        sessionSolves = resultSolves[resultSession];
        // finished solves?
        for (let i = 1; i <= sessionSolves; i++) {
            let newResult = document.createElement("tr");
            newResult.innerHTML = "<td>" + i + "</td> <td>" + resultArray[resultSession][i][0] + "</td> <td>" + resultArray[resultSession][i][1] + "</td> <td>" + Math.floor(resultArray[resultSession][i][1] / resultArray[resultSession][i][0] * 1000) / 1000; + "</td>";
            sessionStatSum[0] += resultArray[resultSession][i][0];
            sessionStatSum[1] += resultArray[resultSession][i][1];
            sessionStatSum[2] += (resultArray[resultSession][i][1] / resultArray[resultSession][i][0]);
            for (let l = 0; l < 2; l++) {
                if (i < averageNumber[l]) {
                    newResult.innerHTML = newResult.innerHTML + "<td> - </td> <td> - </td> <td> - </td>";
                } else {
                    timeAo = movesAo = tpsAo = 0;
                    if (averageType[l] == 1) {
                        for (let m = 0; m < 3; m++) {
                            maxIndex[m] = i - averageNumber[0] + 1;
                            minIndex[m] = i - averageNumber[0] + 1;
                        }
                        for (let k = i - averageNumber[l] + 2; k <= i; k++) {
                            for (let j = 0; j < 2; j ++) {
                                if (resultArray[resultSession][k][j] > resultArray[resultSession][maxIndex[j]][j])
                                    maxIndex[j] = k;
                                if (resultArray[resultSession][k][j] <= resultArray[resultSession][minIndex[j]][j])
                                    minIndex[j] = k;
                            }
                            if (Math.floor(resultArray[resultSession][k][1] / resultArray[resultSession][k][0]) > Math.floor(resultArray[resultSession][maxIndex[2]][1] / resultArray[resultSession][maxIndex[2]][0]))
                                maxIndex[2] = k;
                            if (Math.floor(resultArray[resultSession][k][1] / resultArray[resultSession][k][0]) <= Math.floor(resultArray[resultSession][minIndex[2]][1] / resultArray[resultSession][minIndex[2]][0]))
                                minIndex[2] = k;
                        }
                        for (let k = i - averageNumber[l] + 1; k <= i; k++) {
                            if ((k != maxIndex[0]) && (k != minIndex[0])) {
                                timeAo += resultArray[resultSession][k][0];
                            }
                            if ((k != maxIndex[1]) && (k != minIndex[1]))
                                movesAo += resultArray[resultSession][k][1];
                            if ((k != maxIndex[2]) && (k != minIndex[2]))
                                tpsAo += (resultArray[resultSession][k][1] / resultArray[resultSession][k][0]);
                        }
                        timeAo = Math.floor(timeAo / (averageNumber[l] - 2) * timerAccuracy) / timerAccuracy;
                        movesAo = Math.floor(movesAo / (averageNumber[l] - 2) * timerAccuracy) / timerAccuracy;
                        tpsAo = Math.floor(tpsAo / (averageNumber[l] - 2) * timerAccuracy) / timerAccuracy;
                    } else {
                        for (let k = i - averageNumber[l] + 1; k <= i; k++) {
                            timeAo += resultArray[resultSession][k][0];
                            movesAo += resultArray[resultSession][k][1];
                            tpsAo += (resultArray[resultSession][k][1] / resultArray[resultSession][k][0]);
                        }
                        timeAo = Math.floor(timeAo / averageNumber[l] * timerAccuracy) / timerAccuracy;
                        movesAo = Math.floor(movesAo / averageNumber[l] * timerAccuracy) / timerAccuracy;
                        tpsAo = Math.floor(tpsAo / averageNumber[l] * timerAccuracy) / timerAccuracy;
                    }
                    newResult.innerHTML += ("<td>" + timeAo + "</td> <td>" + movesAo + "</td> <td>" + tpsAo + "</td>");
                }
            }
            document.querySelector("#resultTable").appendChild(newResult);
        }
    } else {
        sessionSolves = 0;
        finishedSolves = 0;
    }
    updateSessionStats();
}

function updateSessionStats() {
    if (sessionSolves > 0) {
        document.querySelector('#sessionStats').innerHTML = infoBarList[language][7] + finishedSolves + "/" + sessionSolves + "): " + infoBarList[language][2] + Math.floor(sessionStatSum[0] / sessionSolves * timerAccuracy) / timerAccuracy + infoBarList[language][3] + Math.floor(sessionStatSum[1] / sessionSolves * timerAccuracy) / timerAccuracy + infoBarList[language][4] + Math.floor(sessionStatSum[2] / sessionSolves * timerAccuracy) / timerAccuracy;
    } else {
        document.querySelector('#sessionStats').innerHTML = infoBarList[language][7] + finishedSolves + "/" + sessionSolves + "): " + infoBarList[language][2] + 0 + infoBarList[language][3] + 0 + infoBarList[language][4] + 0;
    }
}

function addResult() {
    sessionSolves ++;
    if (!(unsolved)) {
        finishedSolves ++;
    }
    resultSolves[resultSession] = sessionSolves;
    if (sessionSolves == 1) {
        resultArray[resultSession] = [];
    }
    resultArray[resultSession][sessionSolves] = [];
    resultArray[resultSession][sessionSolves][0] = (currentTime - startTime) / timerAccuracy;
    resultArray[resultSession][sessionSolves][1] = moves;
    let tempTPS = Math.floor(moves / (currentTime - startTime) * 1000 * timerAccuracy) / timerAccuracy;
    let newResult = document.createElement("tr");
    newResult.className = "resultItem";
    newResult.innerHTML = "<td>" + sessionSolves + "</td> <td>" + resultArray[resultSession][sessionSolves][0] + "</td> <td>" + resultArray[resultSession][sessionSolves][1] + "</td> <td>" + tempTPS + "</td>";
    sessionStatSum[0] += resultArray[resultSession][sessionSolves][0];
    sessionStatSum[1] += resultArray[resultSession][sessionSolves][1];
    sessionStatSum[2] += (resultArray[resultSession][sessionSolves][1] / resultArray[resultSession][sessionSolves][0]);
    for (let l = 0; l < 2; l++) {
        if (sessionSolves < averageNumber[l]) {
            newResult.innerHTML = newResult.innerHTML + "<td> - </td> <td> - </td> <td> - </td>";
        } else {
            timeAo = movesAo = tpsAo = 0;
            if (averageType[l] == 1) {
                for (let m = 0; m < 3; m++) {
                    maxIndex[m] = sessionSolves - averageNumber[0] + 1;
                    minIndex[m] = sessionSolves - averageNumber[0] + 1;
                }
                for (let k = sessionSolves - averageNumber[l] + 2; k <= sessionSolves; k++) {
                    for (let j = 0; j < 2; j ++) {
                        if (resultArray[resultSession][k][j] > resultArray[resultSession][maxIndex[j]][j])
                            maxIndex[j] = k;
                        if (resultArray[resultSession][k][j] <= resultArray[resultSession][minIndex[j]][j])
                            minIndex[j] = k;
                    }
                    if (Math.floor(resultArray[resultSession][k][1] / resultArray[resultSession][k][0]) > Math.floor(resultArray[resultSession][maxIndex[2]][1] / resultArray[resultSession][maxIndex[2]][0]))
                        maxIndex[2] = k;
                    if (Math.floor(resultArray[resultSession][k][1] / resultArray[resultSession][k][0]) <= Math.floor(resultArray[resultSession][minIndex[2]][1] / resultArray[resultSession][minIndex[2]][0]))
                        minIndex[2] = k;
                }
                for (let k = sessionSolves - averageNumber[l] + 1; k <= sessionSolves; k++) {
                    if ((k != maxIndex[0]) && (k != minIndex[0]))
                        timeAo += resultArray[resultSession][k][0];
                    if ((k != maxIndex[1]) && (k != minIndex[1]))
                        movesAo += resultArray[resultSession][k][1];
                    if ((k != maxIndex[2]) && (k != minIndex[2]))
                        tpsAo += (resultArray[resultSession][k][1] / resultArray[resultSession][k][0]);
                }

                timeAo = Math.floor(timeAo / (averageNumber[l] - 2) * timerAccuracy) / timerAccuracy;
                movesAo = Math.floor(movesAo / (averageNumber[l] - 2) * timerAccuracy) / timerAccuracy;
                tpsAo = Math.floor(tpsAo / (averageNumber[l] - 2) * timerAccuracy) / timerAccuracy;
            } else {
                for (let k = sessionSolves - averageNumber[l] + 1; k <= sessionSolves; k++) {
                    timeAo += resultArray[resultSession][k][0];
                    movesAo += resultArray[resultSession][k][1];
                    tpsAo += (resultArray[resultSession][k][1] / resultArray[resultSession][k][0]);
                }
                timeAo = Math.floor(timeAo / averageNumber[l] * timerAccuracy) / timerAccuracy;
                movesAo = Math.floor(movesAo / averageNumber[l] * timerAccuracy) / timerAccuracy;
                tpsAo = Math.floor(tpsAo / averageNumber[l] * timerAccuracy) / timerAccuracy;
            }
            newResult.innerHTML += ("<td>" + timeAo + "</td> <td>" + movesAo + "</td> <td>" + tpsAo + "</td>");
        }
    }
    resultArray[resultSession][sessionSolves][2] = scrambleString;
    resultArray[resultSession][sessionSolves][3] = timeString; // solved time
    document.querySelector("#resultTable").appendChild(newResult);
    localStorage.setItem("resultSolves", JSON.stringify(resultSolves));
    localStorage.setItem("resultArray", JSON.stringify(resultArray));
    updateSessionStats();
}

//setResultCellWidth();