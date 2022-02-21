let language = 0; // 0 english, 1 chinese 2?
let buttonLanguageList = [
    ["Customize", "Scramble", "Solve", "Confirm solve", "Next puzzle", "Settings", "Puzzle", "Export state", "Previous puzzle", "Result", "Clear session", "Rename", "New", "Delete"],
    ["自定义", "打乱", "自动复原", "确认复原", "下一个", "设置", "方块", "导出状态", "上一个", "成绩", "清空分组", "重命名", "新建", "删除"]
];
let settingsTitleList = [
    ["Puzzle", "Appearance", "Statistics", "Color scheme", "Controls", "Timer", "General", "Session"],
    ["方块", "外观", "统计", "配色", "控制", "计时器", "通用", "分组"]
];
let settingsLanguageList = [
    ["Puzzle width (2 ~ 20)", "Puzzle height (2 ~ 20)", "Solve type", "Marathon solves (> 1)", "Multiblind solves (> 1)", "Text color",
    "Text size ratio (0 ~ 1)", "Puzzle size (> 0)", "Margin (>= 0)", "Fillet radius ratio (0 ~ 0.5)", "Border of pieces", "Base (2 ~ 36)",
    "Color scheme", "Rainbow lightness",
    "Live pieces: done", "current", "next", "other", "Invert keyboard controls", "Hover on", "Language",
    "Time/TPS accuracy", "Time format", "Timer update", "Rolling average length 1 (3 ~ 1000)",
    "Rolling average length 1 (3 ~ 1000)", "Rolling average type 1", "Rolling average type 2", "About", "Hide function button", 
    "Add scramble in details", "Hide summary"],
    ["横向阶数 (2 ~ 20)", "纵向阶数 (2 ~ 20)", "模式", "连拧个数 (> 1)", "多盲个数 (> 1)", "文字颜色",
    "文字大小比例 (0 ~ 1)", "拼图大小 (> 0)", "间隙 (>= 0)", "圆角大小比例 (0 ~ 0.5)", "块的边界", "进制数 (2 ~ 36)",
    "配色方案", "彩虹色亮度",
    "动态配色: 已完成", "当前", "下一组", "其它块", "反转键盘控制方向", "滑动", "语言",
    "时间/TPS 准确度", "时间格式", "计时器刷新", "滚动平均长度1 (3 ~ 1000)",
    "滚动平均长度2 (3 ~ 1000)", "滚动平均类型1", "滚动平均类型2", "关于", "隐藏功能键", 
    "在详情中添加打乱", "隐藏小结"]
];
let colorSchemeList = [
    ["Fringes", "Rows, Columns", "Rows", "Columns", "Mono", "Last 2 Rows", "Last 2 Columns",
    "Live Fringes", "Live Rows, Columns", "Live Rows", "Live Columns", "Live Last 2 Rows", "Live Last 2 Columns"],
    ["降阶", "行列交替", "行", "列", "单色", "按行, 最后2行按列", "按列, 最后2列按行",
    "动态降阶", "动态行列交替", "动态行", "动态列", "动态按行, 最后2行按列", "动态按列, 最后2列按行"]
];
let solveTypeList = [
    ["Standard", "N-2 Relay", "Width Relay", "Height Relay", "Width & Height Relay", "Marathon", "Blindfolded", "Multi Blindfolded"],
    ["标准", "N-2阶递减连拧", "横向阶数递减", "纵向阶数递减", "横向纵向阶数递减", "连拧", "盲拧", "多盲"]
];
let infoBarList = [
    ["Progress ", "Solved ", " Time ", " Moves ", " TPS ", 
    "Current state has been copied to clipboard", "Export is not allowed in the process of blindfolding", 
    "Session mean(", "Enter a session name:"],
    ["进度 ", "复原 ", " 时间 ", " 步数 ", " TPS ", 
    "当前状态已复制到剪切板", "盲拧过程不允许导出状态", 
    "分组平均(", "输入分组名称:"]
];
let resultInteractionList = [
    ["Delete this solve?"], 
    ["确认删除该次成绩?"]
];
let averageBoxList = [
    ["Average", "Mean", "Time", "Moves"], 
    ["去尾平均", "平均", "时间", "步数"]
];
let customizeHintList = [
    ["Enter a scramble:\nInput numbers should be in base 10.\nUse 0 to represent the space.\ne.g. 1 2 3 4/5 6 7 8/9 10 11 12/0 13 14 15",
    "Input puzzle contains unexpected symbols!\nMake sure input contains only numbers, spaces and slashes.",
    "Input puzzle contains unequal pieces per row/column!", "Input puzzle should contain at least 2 rows and 2 columns!",
    "Input puzzle is too big!", "Input puzzle is solved!", "Input puzzle contains duplicate numbers!",
    "Some numbers are too big!", "Input puzzle is not solvable. Continue with this input?",
    "Clear this session?", "Enter a name for new session", "Delete session?\nYou cannot undo this!", 
    "You can't delete your only session."],

    ["请输入一个十进制打乱, 用0代表空格. 例如1 2 3 4/5 6 7 8/9 10 11 12/0 13 14 15",
    "打乱含有其他字符, 请确保打乱只含有数字, 空格和斜杠.",
    "每行/每列的块数不相等!", "打乱应当至少有2行2列!",
    "打乱太大!", "请不要输入复原态!", "打乱含有重复数字!",
    "部分数字太大了!", "该打乱不可解, 要继续吗?",
    "确定清除该分组?", "输入新分组名称:", "删除该分组?\n该操作不可撤销!", 
    "不能删除仅有的分组."]
];
let timerUpdateList = [
    ["real time", "to 0.1s", "to seconds", "do not display"],
    ["实时刷新", "到0.1秒", "到秒", "不刷新"]
];

function setLanguage(systemDefault, languageValue) {
    if (systemDefault) {
        switch (navigator.language.toLowerCase().substr(0, 2)) {
            case "zh":
                language = 1;
                break;
            case "en": default:
                language = 0;
                break;
        }
    } else {
        language = languageValue;
    }
    localStorage.setItem("language", language);

    document.querySelector('#customizeBtn').value = buttonLanguageList[language][0];
    document.querySelector('#scrambleBtn').value = buttonLanguageList[language][1];
    document.querySelector('#solveBtn').value = buttonLanguageList[language][2];
    document.querySelector('#confirmBtn').value = buttonLanguageList[language][3];
    document.querySelector('#nextBtn').value = buttonLanguageList[language][4];
    document.querySelector('#settingsBtn').value = buttonLanguageList[language][5];
    document.querySelector('#backBtn').value = buttonLanguageList[language][6];
    document.querySelector('#exportBtn').value = buttonLanguageList[language][7];
    document.querySelector('#prevBtn').value = buttonLanguageList[language][8];
    document.querySelector('#resultBtn').value = buttonLanguageList[language][9];
    document.querySelector('#clrSession').value = buttonLanguageList[language][10];
    document.querySelector('#renameSession').value = buttonLanguageList[language][11];
    document.querySelector('#newSession').value = buttonLanguageList[language][12];
    document.querySelector('#deleteSession').value = buttonLanguageList[language][13];

    document.querySelector("#statusBar").textContent = infoBarList[language][2] + "0" + infoBarList[language][3] + "0" + infoBarList[language][4] + "0";

    let averageString = ["", ""];
    for (let i = 0; i < 2; i++) {
        if (averageType[i] == 1) {
            averageString[i] = averageString[i] + "Ao" + averageNumber[i];
        } else {
            averageString[i] = averageString[i] + "Mo" + averageNumber[i];
        }
    }
    
    document.querySelector('#titleLabel1').innerHTML = "-----" + settingsTitleList[language][0] + "-----";
    document.querySelector('#titleLabel2').innerHTML = "-----" + settingsTitleList[language][1] + "-----";
    document.querySelector('#titleLabel3').innerHTML = "-----" + settingsTitleList[language][2] + "-----";
    document.querySelector('#titleLabel4').innerHTML = "-----" + settingsTitleList[language][3] + "-----";
    document.querySelector('#titleLabel5').innerHTML = "-----" + settingsTitleList[language][4] + "-----";
    document.querySelector('#titleLabel6').innerHTML = "-----" + settingsTitleList[language][5] + "-----";
    document.querySelector('#titleLabel7').innerHTML = "-----" + settingsTitleList[language][6] + "-----";
    document.querySelector('#resultSessionLabel').innerHTML = settingsTitleList[language][7];

    document.querySelector('#std').innerHTML = solveTypeList[language][0];
    document.querySelector('#tt').innerHTML = solveTypeList[language][1];
    document.querySelector('#tf').innerHTML = solveTypeList[language][2];
    document.querySelector('#ft').innerHTML = solveTypeList[language][3];
    document.querySelector('#ff').innerHTML = solveTypeList[language][4];
    document.querySelector('#mara').innerHTML = solveTypeList[language][5];
    document.querySelector('#bld').innerHTML = solveTypeList[language][6];
    document.querySelector('#multibld').innerHTML = solveTypeList[language][7];

    document.querySelector('#scheme1').innerHTML = colorSchemeList[language][0];
    document.querySelector('#scheme2').innerHTML = colorSchemeList[language][1];
    document.querySelector('#scheme3').innerHTML = colorSchemeList[language][2];
    document.querySelector('#scheme4').innerHTML = colorSchemeList[language][3];
    document.querySelector('#scheme5').innerHTML = colorSchemeList[language][4];
    document.querySelector('#scheme6').innerHTML = colorSchemeList[language][5];
    document.querySelector('#scheme7').innerHTML = colorSchemeList[language][6];
    document.querySelector('#scheme8').innerHTML = colorSchemeList[language][7];
    document.querySelector('#scheme9').innerHTML = colorSchemeList[language][8];
    document.querySelector('#scheme10').innerHTML = colorSchemeList[language][9];
    document.querySelector('#scheme11').innerHTML = colorSchemeList[language][10];
    document.querySelector('#scheme12').innerHTML = colorSchemeList[language][11];
    document.querySelector('#scheme13').innerHTML = colorSchemeList[language][12];

    document.querySelector('#timer1').innerHTML = timerUpdateList[language][0];
    document.querySelector('#timer2').innerHTML = timerUpdateList[language][1];
    document.querySelector('#timer3').innerHTML = timerUpdateList[language][2];
    document.querySelector('#timer4').innerHTML = timerUpdateList[language][3];

    document.querySelector('#averageBox1').innerHTML = averageBoxList[language][0];
    document.querySelector('#meanBox1').innerHTML = averageBoxList[language][1];
    document.querySelector('#averageBox2').innerHTML = averageBoxList[language][0];
    document.querySelector('#meanBox2').innerHTML = averageBoxList[language][1];

    document.querySelector('#puzzleWidthLabel').innerHTML = settingsLanguageList[language][0];
    document.querySelector('#puzzleHeightLabel').innerHTML = settingsLanguageList[language][1];
    document.querySelector('#solveTypeLabel').innerHTML = settingsLanguageList[language][2];
    document.querySelector('#marathonSolvesLabel').innerHTML = settingsLanguageList[language][3];
    document.querySelector('#multibldSolvesLabel').innerHTML = settingsLanguageList[language][4];
    document.querySelector('#textColorLabel').innerHTML = settingsLanguageList[language][5];
    document.querySelector('#textSizeLabel').innerHTML = settingsLanguageList[language][6];
    document.querySelector('#puzzleSizeLabel').innerHTML = settingsLanguageList[language][7];
    document.querySelector('#marginLabel').innerHTML = settingsLanguageList[language][8];
    document.querySelector('#filletLabel').innerHTML = settingsLanguageList[language][9];
    document.querySelector('#borderLabel').innerHTML = settingsLanguageList[language][10];
    document.querySelector('#baseLabel').innerHTML = settingsLanguageList[language][11];
    document.querySelector('#colorSchemeLabel').innerHTML = settingsLanguageList[language][12];
    document.querySelector('#rainbowLightnessLabel').innerHTML = settingsLanguageList[language][13];
    document.querySelector('#liveDoneLabel').innerHTML = settingsLanguageList[language][14];
    document.querySelector('#liveCurrentLabel').innerHTML = settingsLanguageList[language][15];
    document.querySelector('#liveNextLabel').innerHTML = settingsLanguageList[language][16];
    document.querySelector('#liveOtherLabel').innerHTML = settingsLanguageList[language][17];
    document.querySelector('#invertKeyboardLabel').innerHTML = settingsLanguageList[language][18];
    document.querySelector('#switchHoverLabel').innerHTML = settingsLanguageList[language][19];
    document.querySelector('#languageLabel').innerHTML = settingsLanguageList[language][20];
    document.querySelector('#accuracyLabel').innerHTML = settingsLanguageList[language][21];
    document.querySelector('#minutesLabel').innerHTML = settingsLanguageList[language][22];
    document.querySelector('#updateFreqLabel').innerHTML = settingsLanguageList[language][23];
    document.querySelector('#averageNumberLabel1').innerHTML = settingsLanguageList[language][24];
    document.querySelector('#averageNumberLabel2').innerHTML = settingsLanguageList[language][25];
    document.querySelector('#averageTypeLabel1').innerHTML = settingsLanguageList[language][26];
    document.querySelector('#averageTypeLabel2').innerHTML = settingsLanguageList[language][27];
    document.querySelector('#about').innerHTML = settingsLanguageList[language][28];
    document.querySelector('#disableFunctionButtonLabel').innerHTML = settingsLanguageList[language][29];
    document.querySelector('#addScrambleLabel').innerHTML = settingsLanguageList[language][30];
    document.querySelector('#disableSummaryLabel').innerHTML = settingsLanguageList[language][31];
    setDefaultSelected("language", language);

    drawSpacebarCanvas();
    reloadResult();
}