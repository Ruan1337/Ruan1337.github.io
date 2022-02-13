Online 15Puzzle simulator 在线15Puzzle模拟器
==========
A simple (and crude) online 15p with settings and sessions.
一个简陋的在线15p, 带有设置和成绩分组功能.
----------

#Introduction 简介
This online 15Puzzle simulator is a sliding puzzle simulator with professional functions, which provides:
(a) variable puzzle size: from 2x2 to 20x20, unequal width and height is available
(b) plenty of customizable settings: modes, appearance, statistics, timer, etc.
(c) local storage for results and settings

This simulator can be viewed on most of the modern browsers, on mobile devices or PC.

这是一个在线15Puzzle模拟器, 带有如下专业功能:
(a) 可变的大小: 从2x2到20x20, 支持不等阶
(b) 众多的设置: 模式, 外观, 统计, 计时器等
(c) 成绩和设置的本地存储

#General 通用
How to play: Press the spacebar once, or click the Scramble button to scramble. You can also enter your customized scramble. Use a keyboard, a mouse, or touchscreen to drag around the pieces, until all of them are at their beggining states.

Puzzle (main) page - The page for main gameplay.
Result page - The page for viewing results and doing statistics.
Setting page - The page for changing a variety of settings.

如何玩: 按一次空格, 或点击打乱按钮来打乱. 也可以输入自定义打乱. 用键盘, 鼠标, 或触屏来拖拽方块, 直到它们都回到初始位置.

方块 (主) 页面 - 在这里执行复原.
成绩页面 - 记录成绩, 统计成绩.
设置页面 - 改变设置.

#Controls 控制
Keyboard:
(Left, Up, Right, Down) Arrow keys or (D, K, F, J) letter keys - control the movement of pieces. Invert control is supported.
Spacebar - scramble, or confirm solve (blindfolded), or switch to next scramble (multi blindfolded).
Esc key - cancel current attempt, or revert to solved state.
"+", "-" keys - increase (or decrease) puzzle width and height by 1.
PgUp, PgDn keys - increase (or decrease) puzzle width by 1.
Home, End keys - increase (or decrease) puzzle height by 1.

Mouse or touchscreen:
Hover is on - drag the mouse or a finger over a piece, and the piece(s) move over.
Hover is off - click on a piece, and corresponding piece(s) move over.

键盘:
(左上右下) 方向键或 (D, K, F, J) - 控制方块移动. 支持反向控制.
空格 - 打乱, 或确认复原 (盲拧), 或切换到下一个 (多盲).
Esc - 自动复原, 取消本次还原.
"+", "-" - 宽度和高度均+1 (-1).
PgUp, PgDn - 宽度+1 (-1).
Home, End - 高度+1 (-1).

鼠标或触屏:
滑动开 - 鼠标或手指划过方块来操作.
滑动关 - 点击方块操作.

#Solve types 复原模式
Standard - do one solve with infinite inspection time.
Relays - relay from biggest puzzle to the smallest puzzle.
Marathon - do many solves in the same puzzle size.
Blindfolded - do one solve with inspection peroid counted. Once inspection is finished (i.e. the first move is done), the puzzle is invisible until you confirm your solve.
Multi Blindfolded - do many solves with inspection peroid counted. Memorize these puzzles at the same time, and solve them continuously. During inspection or solving, you can go to the previous puzzle or the next puzzle.

标准 - 复原一次, 不限观察时间.
(阶数变化) 连拧 - 从最大的方块到最小, 连续复原.
(阶数不变) 连拧 - 对同样大小的方块作多次复原.
盲拧 - 复原一次, 计观察时间. 观察一旦结束 (即动了第一步), 方块不可见, 直到确认复原.
多盲 - 复原多次, 计观察时间. 同时记下所有方块状态, 随后连续复原. 在观察或复原阶段, 可以向前或向后切换.

#Color schemes 配色方案
Fringes - separate a puzzle with groups of one column conbined with one row. Recommeded for most players.
Rows, columns - separate rows and columns alternatively. Recommeded for most players.
Rows/Columns - separate into many rows/columns.
Mono - the puzzle is in single color.
Last 2 Rows/Columns - separate into rows/columns until the last 2 rows/columns. The last 2 rows/columns are separated into many columns or rows. Recommended for row-by-row or column-by-column players.
Live - highlight the current group and the next group. Especially recommended for big puzzles.

降阶 - 将整个方块分为很多阶 (一阶为一行一列). 对大多数人推荐.
行列交替 - 分为一行一列交替的配色. 对大多数人推荐.
行/列 - 分为很多行/列. 对层先/列先玩家推荐.
单色 - 整个方块的颜色相同.
按行, 最后2行按列/按列, 最后2列按行 - 分为行/列, 直到最后2行/列. 最后2行/列按列/行区分.
动态 - 高亮当前和下一组. 做高阶时尤其推荐.