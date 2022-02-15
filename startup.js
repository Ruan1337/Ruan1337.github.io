if (localStorage.getItem("secondRun")) {
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
startUpInitPuzzle();
initPuzzle();
redraw();