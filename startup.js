startUpSetting();
genBase(puzzleBase);
defineType();
resetTimer();
if (localStorage.getItem("secondRun")) {
    readLocalStorage();
} else {
    initWindow();
    localStorage.setItem("secondRun", "true");
}
startUpInitPuzzle();
initPuzzle();
redraw();