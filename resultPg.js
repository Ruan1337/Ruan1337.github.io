let resultSolves = [], sessionSolves = 0, resultSession = 1, finishedSolves = 0;
let resultArray = [], sessionName = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"], maxSessionIndex = 15;
let averageNumber = [5, 12], averageType = [1, 1], averageTitleString = ["Mo", "Ao", "", "<br>"];
let timeAo = movesAo = tpsAo = 0, maxIndex = [0, 0, 0], minIndex = [0, 0, 0];
let sessionStatSum = [0, 0, 0];
let dnfs = 0, landscape = 1;
if (window.innerWidth < window.innerHeight)
    landscape = 0;
let addScramble = true;

function sessionChange(x) {
    resultSession = x;
    localStorage.setItem("resultSession", resultSession);
    if (resultSolves[resultSession] > 0) {
        reloadResult();
    } else {
        clearResult();
        resultArray[resultSession] = [];
        resultSolves[resultSession] = 0;
        sessionSolves = 0;
        finishedSolves = 0;
        updateSessionStats();
    }
    getExistSummary();
}

function getExistSummary() {
    let aoString = ["", ""];
    if (sessionSolves == 0) {
        updateSummary("-", "-");
    } else {
        if (isNaN(Number(document.querySelector("#resultTable").rows[sessionSolves].cells[4].innerHTML))) {
            aoString[0] = "-";
        } else {
            for (let i = 4; i < 7; i ++)
                aoString[0] += (document.querySelector("#resultTable").rows[sessionSolves].cells[i].innerHTML + " ");
        }
        if (isNaN(Number(document.querySelector("#resultTable").rows[sessionSolves].cells[7].innerHTML))) {
            aoString[1] = "-";
        } else {
            for (let i = 7; i < 10; i ++)
                aoString[1] += (document.querySelector("#resultTable").rows[sessionSolves].cells[i].innerHTML + " ");
        }
        updateSummary(aoString[0], aoString[1]);
    }
}

function setSessionName() {
    let tempSessionName = prompt(infoBarList[language][8]);
    if (tempSessionName) {
        sessionName[resultSession] = tempSessionName;
        let tempSessionId = "#session" + resultSession;
        document.querySelector(tempSessionId).innerHTML = tempSessionName;
        localStorage.setItem("sessionName", JSON.stringify(sessionName));
        localStoreTable();
    } else {
        return false;
    }
}

function appendSession() {
    if (localStorage.getItem("tableHtml")) {
        document.querySelector('#resultSession').innerHTML = localStorage.getItem("tableHtml");
    }
    getExistSummary();
}

function newSession() {
    let newSessionName = prompt(customizeHintList[language][10]);
    if (newSessionName) {
        maxSessionIndex ++;
        resultSession = maxSessionIndex;
        let newOption = new Option(newSessionName, maxSessionIndex);
        newOption.id = ("session" + maxSessionIndex);
        document.querySelector("#resultSession").appendChild(newOption);
        sessionName[maxSessionIndex] = newSessionName;
        resultArray[resultSession] = [];
        resultSolves[resultSession] = 0;
        sessionSolves = 0;
        finishedSolves = 0;
        document.querySelector('#sessionStats').innerHTML = infoBarList[language][7] + finishedSolves + "/" + sessionSolves + "): " + infoBarList[language][2] + 0 + infoBarList[language][3] + 0 + infoBarList[language][4] + 0;
        localStorage.setItem("maxSessionIndex", maxSessionIndex);
        localStorage.setItem("resultSolves", JSON.stringify(resultSolves));
        localStorage.setItem("resultArray", JSON.stringify(resultArray));
        localStorage.setItem("sessionName", JSON.stringify(sessionName));
        getExistSummary();
        localStoreTable();
    } else {
        return false;
    }
}

function deleteSession() {
    if (confirm(customizeHintList[language][11])) {
        if (document.querySelector('#resultSession').options.length == 1) {
            alert(customizeHintList[language][12]);
            return false;
        } else {
            let tempTable = document.querySelector('#resultSession');
            resultArray[resultSession] = [];
            tempTable.removeChild(tempTable.options[tempTable.options.selectedIndex]);
            resultSession = tempTable.options[tempTable.options.selectedIndex].value;
            localStorage.setItem("resultSession", resultSession);
            localStorage.setItem("resultArray", JSON.stringify(resultArray));
            localStoreTable();
            reloadResult();
            getExistSummary();
        }
    }
}

function localStoreTable() {
    let tableHtml = document.querySelector('#resultSession').innerHTML;
    localStorage.setItem("tableHtml", tableHtml);
}

function getDetails() {
    let clickedCell = event.srcElement;
    let tempRowIndex = clickedCell.parentElement.rowIndex, tempColIndex = clickedCell.cellIndex;
    let alertMessage = "";
    if (tempRowIndex > 0) {
        if (tempColIndex == 0) {
            if (confirm(resultInteractionList[language][0])) {
                if (tempRowIndex != sessionSolves) {
                    if (resultArray[resultSession][tempRowIndex][0] >= 0)
                        finishedSolves --;
                    for (let i = tempRowIndex; i < sessionSolves; i++) {
                        for (let j = 0; j < 4; j ++) {
                            resultArray[resultSession][i][j] = resultArray[resultSession][i + 1][j];
                        }
                    }
                    sessionSolves --;
                    resultSolves[resultSession] --;
                    localStorage.setItem("resultSolves", JSON.stringify(resultSolves));
                    localStorage.setItem("resultArray", JSON.stringify(resultArray));
                    reloadResult();
                } else {
                    sessionSolves --;
                    resultSolves[resultSession] --;
                    localStorage.setItem("resultSolves", JSON.stringify(resultSolves));
                    localStorage.setItem("resultArray", JSON.stringify(resultArray));
                    reloadResult();
                }
            }
        } else if (tempColIndex < 4) {
            if (resultArray[resultSession][tempRowIndex][0] < 0) {
                if (resultArray[resultSession][tempRowIndex][1] >= 0) {
                    alertMessage = tempRowIndex + ". DNF (" + averageBoxList[language][2] + " " + convertAccuracy(resultArray[resultSession][tempRowIndex][0]) + "[" + resultArray[resultSession][tempRowIndex][4] + "]" + infoBarList[language][3] + Math.abs(resultArray[resultSession][tempRowIndex][1]) + infoBarList[language][4] + convertAccuracy(resultArray[resultSession][tempRowIndex][1] / (Math.abs(resultArray[resultSession][tempRowIndex][0]) - resultArray[resultSession][tempRowIndex][4])) + ")";
                } else {
                    alertMessage = tempRowIndex + ". DNF" + resultArray[resultSession][tempRowIndex][5] + " (" + averageBoxList[language][2] + " " + convertAccuracy(resultArray[resultSession][tempRowIndex][0])  + "[" + resultArray[resultSession][tempRowIndex][4] + "]" + infoBarList[language][3] + Math.abs(resultArray[resultSession][tempRowIndex][1]) + infoBarList[language][4] + convertAccuracy(resultArray[resultSession][tempRowIndex][1] / (Math.abs(resultArray[resultSession][tempRowIndex][0]) - resultArray[resultSession][tempRowIndex][4])) + ")";
                }
            } else if (resultArray[resultSession][tempRowIndex][4] > 0) {
                alertMessage = tempRowIndex + ". " + averageBoxList[language][2] + " " + convertAccuracy(resultArray[resultSession][tempRowIndex][0]) + "[" + resultArray[resultSession][tempRowIndex][4] + "]" + infoBarList[language][3] + resultArray[resultSession][tempRowIndex][1] + infoBarList[language][4] + convertAccuracy(resultArray[resultSession][tempRowIndex][1] / (resultArray[resultSession][tempRowIndex][0] - resultArray[resultSession][tempRowIndex][4]));
            } else {
                alertMessage = tempRowIndex + ". " + infoBarList[language][2] + convertAccuracy(resultArray[resultSession][tempRowIndex][0]) + infoBarList[language][3] + resultArray[resultSession][tempRowIndex][1] + infoBarList[language][4] + convertAccuracy(resultArray[resultSession][tempRowIndex][1] / resultArray[resultSession][tempRowIndex][0]);
            }
            if (addScramble)
                alertMessage += ("\n" + buttonLanguageList[language][1] + ": " + resultArray[resultSession][tempRowIndex][2]);
            alertMessage += ("\n" + resultArray[resultSession][tempRowIndex][3]);
            alert(alertMessage);
        } else {
            let tempAverageType;
            (tempColIndex < 7) ? tempAverageType = 0 : tempAverageType = 1;
            let timeListString = averageBoxList[language][2] + ": " + document.querySelector("#resultTable").rows[tempRowIndex].cells[4 + 3 * tempAverageType].innerHTML + " = ";
            let movesListString = averageBoxList[language][3] + ": " + document.querySelector("#resultTable").rows[tempRowIndex].cells[5 + 3 * tempAverageType].innerHTML + " = ";
            let tpsListString = "TPS: " + document.querySelector("#resultTable").rows[tempRowIndex].cells[6 + 3 * tempAverageType].innerHTML + " = ";
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
                    let tempMaxIndex = [], tempMinIndex = [];
                    dnfs = 0;
                    for (let i = 0; i < 3; i ++) {
                        tempMaxIndex[i] = tempRowIndex - averageNumber[tempAverageType] + 1;
                        tempMinIndex[i] = tempRowIndex - averageNumber[tempAverageType] + 1;
                    }
                    for (let i = tempRowIndex - averageNumber[tempAverageType] + 1; i <= tempRowIndex; i ++) {
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
                            if (resultArray[resultSession][i][1] / (resultArray[resultSession][i][0] - resultArray[resultSession][i][4]) > resultArray[resultSession][tempMaxIndex[2]][1] / (resultArray[resultSession][tempMaxIndex[2]][0] - resultArray[resultSession][tempMaxIndex[2]][4]))
                                tempMaxIndex[2] = i;
                        }
                        for (let j = 0; j < 2; j ++) {
                            if (Math.abs(resultArray[resultSession][i][j]) <= Math.abs(resultArray[resultSession][tempMinIndex[j]][j]))
                                tempMinIndex[j] = i;
                        }
                        if (Math.abs(resultArray[resultSession][i][1] / (Math.abs(resultArray[resultSession][i][0]) - resultArray[resultSession][i][4])) <= Math.abs(resultArray[resultSession][tempMinIndex[2]][1] / (Math.abs(resultArray[resultSession][tempMinIndex[2]][0]) - resultArray[resultSession][tempMinIndex[2]][4])))
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
                if (addScramble) {
                    let scrambleListString = "";
                    scrambleListString = (buttonLanguageList[language][1] + ": ");
                    for (let i = tempRowIndex - averageNumber[tempAverageType] + 1; i <= tempRowIndex; i ++) {
                        scrambleListString += ("[" + (i - tempRowIndex + averageNumber[tempAverageType]) + "]. " + resultArray[resultSession][i][2] + "\n");
                    }
                    alertMessage += ("\n" + scrambleListString);
                }
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
    getExistSummary();
}

function averageTypeChange(order, aomo) {
    averageType[order] = aomo;
    setAverageChange();
    getExistSummary();
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
        getExistSummary();
    }
}

function clearResult() {
    let averageString = ["", ""];
    for (let i = 0; i < 2; i++) {
        if (window.innerWidth < window.innerHeight) {
            averageString[i] += "<br>";
        }
        averageString[i] += (averageTitleString[averageType[i]] + averageNumber[i]);
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
        finishedSolves = sessionSolves;
        for (let i = 1; i <= sessionSolves; i++) {
            if (resultArray[resultSession][i][0] < 0)
                finishedSolves --;
        }
        for (let i = 1; i <= sessionSolves; i++) {
            let newResult = document.createElement("tr");
            if (resultArray[resultSession][i][0] < 0) {
                newResult.innerHTML = "<td>" + i + "</td> <td>DNF</td> <td>DNF</td> <td>DNF</td>";
            } else {
                sessionStatSum[0] += resultArray[resultSession][i][0];
                sessionStatSum[1] += resultArray[resultSession][i][1];
                if (resultArray[resultSession][i][4] > 0) {
                    sessionStatSum[2] += resultArray[resultSession][i][1] / (resultArray[resultSession][i][0] - resultArray[resultSession][i][4]);
                    newResult.innerHTML = "<td>" + i + "</td> <td>" + resultArray[resultSession][i][0] + "</td> <td>" + resultArray[resultSession][i][1] + "</td> <td>" + convertAccuracy(resultArray[resultSession][i][1] / (Math.abs(resultArray[resultSession][i][0]) - resultArray[resultSession][i][4])) + "</td>";
                } else {
                    sessionStatSum[2] += resultArray[resultSession][i][1] / resultArray[resultSession][i][0];
                    newResult.innerHTML = "<td>" + i + "</td> <td>" + resultArray[resultSession][i][0] + "</td> <td>" + resultArray[resultSession][i][1] + "</td> <td>" + convertAccuracy(resultArray[resultSession][i][1] / resultArray[resultSession][i][0]) + "</td>";
                }
            }
            for (let l = 0; l < 2; l++) {
                if (i < averageNumber[l]) {
                    newResult.innerHTML = newResult.innerHTML + "<td> - </td> <td> - </td> <td> - </td>";
                } else {
                    timeAo = movesAo = tpsAo = 0;
                    dnfs = 0;
                    if (averageType[l] == 1) {
                        for (let m = 0; m < 3; m++) {
                            maxIndex[m] = i - averageNumber[0] + 1;
                            minIndex[m] = i - averageNumber[0] + 1;
                        }
                        for (let k = i - averageNumber[l] + 1; k <= i; k++) {
                            if (resultArray[resultSession][k][0] < 0) {
                                dnfs ++;
                                maxIndex[0] = k;
                                maxIndex[1] = k;
                                maxIndex[2] = k;
                            }
                            if (dnfs == 0) {
                                if (resultArray[resultSession][k][0] > resultArray[resultSession][maxIndex[0]][0])
                                    maxIndex[0] = k;
                                if (resultArray[resultSession][k][1] > resultArray[resultSession][maxIndex[1]][1])
                                    maxIndex[1] = k;
                                if (resultArray[resultSession][k][1] / (resultArray[resultSession][k][0] - resultArray[resultSession][k][4]) > resultArray[resultSession][maxIndex[2]][1] / (resultArray[resultSession][maxIndex[2]][0] - resultArray[resultSession][maxIndex[2]][4]))
                                    maxIndex[2] = k;
                            }
                            if (Math.abs(resultArray[resultSession][k][0]) <= Math.abs(resultArray[resultSession][minIndex[0]][0]))
                                minIndex[0] = k;
                            if (Math.abs(resultArray[resultSession][k][1]) <= Math.abs(resultArray[resultSession][minIndex[1]][1]))
                                minIndex[1] = k;
                            if (Math.abs(resultArray[resultSession][k][1] / (Math.abs(resultArray[resultSession][k][0]) - resultArray[resultSession][k][4])) <= Math.abs(resultArray[resultSession][minIndex[2]][1] / (Math.abs(resultArray[resultSession][minIndex[2]][0]) - resultArray[resultSession][minIndex[2]][4])))
                                minIndex[2] = k;
                        }
                        if (dnfs > 1) {
                            newResult.innerHTML += "<td>DNF</td> <td>DNF</td> <td>DNF</td>";
                            continue;
                        }
                        for (let k = i - averageNumber[l] + 1; k <= i; k++) {
                            if ((k != maxIndex[0]) && (k != minIndex[0]))
                                timeAo += resultArray[resultSession][k][0];
                            if ((k != maxIndex[1]) && (k != minIndex[1]))
                                movesAo += resultArray[resultSession][k][1];
                            if ((k != maxIndex[2]) && (k != minIndex[2]))
                                tpsAo += resultArray[resultSession][k][1] / (resultArray[resultSession][k][0] - resultArray[resultSession][k][4]);
                        }
                        timeAo = convertAccuracy(timeAo / (averageNumber[l] - 2));
                        movesAo = convertAccuracy(movesAo / (averageNumber[l] - 2));
                        tpsAo = convertAccuracy(tpsAo / (averageNumber[l] - 2));
                    } else {
                        for (let k = i - averageNumber[l] + 1; k <= i; k++) {
                            if (resultArray[resultSession][k][0] < 0) {
                                dnfs ++;
                                break;
                            }
                        }
                        if (dnfs > 0) {
                            newResult.innerHTML += "<td>DNF</td> <td>DNF</td> <td>DNF</td>";
                            continue;
                        }
                        for (let k = i - averageNumber[l] + 1; k <= i; k++) {
                            timeAo += resultArray[resultSession][k][0];
                            movesAo += resultArray[resultSession][k][1];
                            tpsAo += resultArray[resultSession][k][1] / (resultArray[resultSession][k][0] - resultArray[resultSession][k][4]);
                        }
                        timeAo = convertAccuracy(timeAo / averageNumber[l]);
                        movesAo = convertAccuracy(movesAo / averageNumber[l]);
                        tpsAo = convertAccuracy(tpsAo / averageNumber[l]);
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
    getExistSummary();
}

function updateSessionStats() {
    if (sessionSolves > 0) {
        document.querySelector('#sessionStats').innerHTML = infoBarList[language][7] + finishedSolves + "/" + sessionSolves + "): " + infoBarList[language][2] + convertAccuracy(sessionStatSum[0] / finishedSolves) + infoBarList[language][3] + convertAccuracy(sessionStatSum[1] / finishedSolves) + infoBarList[language][4] + convertAccuracy(sessionStatSum[2] / finishedSolves);
    } else {
        document.querySelector('#sessionStats').innerHTML = infoBarList[language][7] + "0/0): " + infoBarList[language][2] + 0 + infoBarList[language][3] + 0 + infoBarList[language][4] + 0;
    }
}

function getSessionDetails() {
    if (sessionSolves > 0) {
        let alertMessage = infoBarList[language][7] + finishedSolves + "/" + sessionSolves + "):\n";
        let timeListString = averageBoxList[language][2] + ": " + convertAccuracy(sessionStatSum[0] / finishedSolves) + " = ";
        let movesListString = averageBoxList[language][3] + ": " + convertAccuracy(sessionStatSum[1] / finishedSolves) + " = ";
        let tpsListString = "TPS: " + convertAccuracy(sessionStatSum[2] / finishedSolves) + " = ";
        for (let i = 1; i <= sessionSolves; i++) {
            timeListString += document.querySelector("#resultTable").rows[i].cells[1].innerHTML;
            movesListString += document.querySelector("#resultTable").rows[i].cells[2].innerHTML;
            tpsListString += document.querySelector("#resultTable").rows[i].cells[3].innerHTML;
            if (i != sessionSolves) {
                timeListString += ", ";
                movesListString += ", ";
                tpsListString += ", ";
            }
        }
        alertMessage += (timeListString + "\n" + movesListString + "\n" + tpsListString);
        if (addScramble) {
            let scrambleListString = buttonLanguageList[language][1] + ": ";
            for (let i = 1; i <= sessionSolves; i++)
                scrambleListString += ("[" + i + "]. " + resultArray[resultSession][i][2] + "\n");
            alertMessage += ("\n" + scrambleListString);
        }
        alert(alertMessage);
    }
}

function updateSummary(ao5, ao12) {
    document.querySelector("#summary").innerHTML = (finishedSolves + "/" + sessionSolves + "<br>" + averageTitleString[averageType[0]] + averageNumber[0] + ": " + ao5 + "<br>" + averageTitleString[averageType[1]] + averageNumber[1] + ": " + ao12);
}

function convertAccuracy(x) {
    return Math.round(Math.abs(x) * timerAccuracy) / timerAccuracy;
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
    let tempUnsolved = [1, 1];
    if (unsolved) 
        tempUnsolved[0] = -1;
    if (unsolved && multibld && (multibldFailed > 0))
        tempUnsolved[1] = -1;
    resultArray[resultSession][sessionSolves] = [];
    resultArray[resultSession][sessionSolves][0] = tempUnsolved[0] * (currentTime - startTime) / 1000;
    resultArray[resultSession][sessionSolves][1] = tempUnsolved[1] * moves;
    resultArray[resultSession][sessionSolves][2] = scrambleString;
    resultArray[resultSession][sessionSolves][3] = timeString;
    if (bld) {
        resultArray[resultSession][sessionSolves][4] = (memoFinishTime - startTime) / 1000;
    } else {
        resultArray[resultSession][sessionSolves][4] = 0;
    }
    if (unsolved && multibld && (multibldFailed > 0))
        resultArray[resultSession][sessionSolves][5] = "[" + (multibldLength - multibldFailed) + "/" + multibldLength + "]";
    let tempTPS = Math.round(Math.abs(moves / (Math.abs(resultArray[resultSession][sessionSolves][0]) - resultArray[resultSession][sessionSolves][4]) * 1000)) / 1000;
    let displayTime = convertAccuracy(resultArray[resultSession][sessionSolves][0]), displayTPS = convertAccuracy(tempTPS);
    let newResult = document.createElement("tr");
    newResult.className = "resultItem";
    if (tempUnsolved[0] > 0) {
        sessionStatSum[0] += resultArray[resultSession][sessionSolves][0];
        sessionStatSum[1] += resultArray[resultSession][sessionSolves][1];
        sessionStatSum[2] += resultArray[resultSession][sessionSolves][1] / (resultArray[resultSession][sessionSolves][0] - resultArray[resultSession][sessionSolves][4]);
        newResult.innerHTML = "<td>" + sessionSolves + "</td> <td>" + displayTime + "</td> <td>" + resultArray[resultSession][sessionSolves][1] + "</td> <td>" + displayTPS + "</td>";
    } else {
        newResult.innerHTML = "<td>" + sessionSolves + "</td> <td>DNF</td> <td>DNF</td> <td>DNF</td>";
    }
    let aoString = ["", ""];
    for (let l = 0; l < 2; l++) {
        if (sessionSolves < averageNumber[l]) {
            newResult.innerHTML += "<td> - </td> <td> - </td> <td> - </td>";
            aoString[l] = "-";
        } else {
            timeAo = movesAo = tpsAo = 0;
            dnfs = 0;
            if (averageType[l] == 1) {
                for (let m = 0; m < 3; m++) {
                    maxIndex[m] = sessionSolves - averageNumber[0] + 1;
                    minIndex[m] = sessionSolves - averageNumber[0] + 1;
                }
                for (let k = sessionSolves - averageNumber[l] + 1; k <= sessionSolves; k++) {
                    if (resultArray[resultSession][k][0] < 0) {
                        dnfs ++;
                        maxIndex[0] = k;
                        maxIndex[1] = k;
                        maxIndex[2] = k;
                    }
                    if (dnfs == 0) {
                        if (resultArray[resultSession][k][0] > resultArray[resultSession][maxIndex[0]][0])
                            maxIndex[0] = k;
                        if (resultArray[resultSession][k][1] > resultArray[resultSession][maxIndex[1]][1])
                            maxIndex[1] = k;
                        if (resultArray[resultSession][k][1] / (resultArray[resultSession][k][0] - resultArray[resultSession][k][4]) > resultArray[resultSession][maxIndex[2]][1] / (resultArray[resultSession][maxIndex[2]][0] - resultArray[resultSession][maxIndex[2]][4]))
                            maxIndex[2] = k;
                    }
                    if (Math.abs(resultArray[resultSession][k][0]) <= Math.abs(resultArray[resultSession][minIndex[0]][0]))
                        minIndex[0] = k;
                    if (Math.abs(resultArray[resultSession][k][1]) <= Math.abs(resultArray[resultSession][minIndex[1]][1]))
                        minIndex[1] = k;
                    if (Math.abs(resultArray[resultSession][k][1] / (Math.abs(resultArray[resultSession][k][0]) - resultArray[resultSession][k][4])) <= Math.abs(resultArray[resultSession][minIndex[2]][1] / (Math.abs(resultArray[resultSession][minIndex[2]][0]) - resultArray[resultSession][minIndex[2]][4])))
                        minIndex[2] = k;
                }
                if (dnfs > 1) {
                    newResult.innerHTML += "<td>DNF</td> <td>DNF</td> <td>DNF</td>";
                    continue;
                }
                for (let k = sessionSolves - averageNumber[l] + 1; k <= sessionSolves; k++) {
                    if ((k != maxIndex[0]) && (k != minIndex[0]))
                        timeAo += resultArray[resultSession][k][0];
                    if ((k != maxIndex[1]) && (k != minIndex[1]))
                        movesAo += resultArray[resultSession][k][1];
                    if ((k != maxIndex[2]) && (k != minIndex[2]))
                        tpsAo += resultArray[resultSession][k][1] / (resultArray[resultSession][k][0] - resultArray[resultSession][k][4]);
                }
                timeAo = convertAccuracy(timeAo / (averageNumber[l] - 2));
                movesAo = convertAccuracy(movesAo / (averageNumber[l] - 2));
                tpsAo = convertAccuracy(tpsAo / (averageNumber[l] - 2));
            } else {
                for (let k = sessionSolves - averageNumber[l] + 1; k <= sessionSolves; k++) {
                    if (resultArray[resultSession][k][0] < 0) {
                        dnfs ++;
                        break;
                    }
                }
                if (dnfs > 0) {
                    newResult.innerHTML += "<td>DNF</td> <td>DNF</td> <td>DNF</td>";
                    continue;
                }
                for (let k = sessionSolves - averageNumber[l] + 1; k <= sessionSolves; k++) {
                    timeAo += resultArray[resultSession][k][0];
                    movesAo += resultArray[resultSession][k][1];
                    tpsAo += resultArray[resultSession][k][1] / (resultArray[resultSession][k][0] - resultArray[resultSession][k][4]);
                }
                timeAo = convertAccuracy(timeAo / averageNumber[l]);
                movesAo = convertAccuracy(movesAo / averageNumber[l]);
                tpsAo = convertAccuracy(tpsAo / averageNumber[l]);
            }
            newResult.innerHTML += ("<td>" + timeAo + "</td> <td>" + movesAo + "</td> <td>" + tpsAo + "</td>");
            aoString[l] = timeAo + " " + movesAo + " " + tpsAo;
        }
    }
    document.querySelector("#resultTable").appendChild(newResult);
    localStorage.setItem("resultSolves", JSON.stringify(resultSolves));
    localStorage.setItem("resultArray", JSON.stringify(resultArray));
    updateSessionStats();
    updateSummary(aoString[0], aoString[1]);
}

//setResultCellWidth();