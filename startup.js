if (localStorage.getItem("secondRun")) {
    appendSession();
    readLocalStorage();
    startUpSetting();
    setLanguage(false, language);
    genBase(puzzleBase);
    defineType();
    resetTimer();
} else {
    setLanguage(true, 0);
    initWindow();
    localStorage.setItem("secondRun", "true");
    genBase(puzzleBase);
    defineType();
    resetTimer();
}
setDrawSize();
drawSpacebarCanvas();
startUpInitPuzzle();
initPuzzle();
redraw();