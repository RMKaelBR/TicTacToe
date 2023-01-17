const divSpace = document.querySelectorAll(".cell")
const prevButton = document.querySelector("#prevButton")
const nextButton = document.querySelector("#nextButton")
const spanText = document.querySelector("#spanText")
const turnSpan = document.querySelector("#turnSpan")
const xScoreBoard = document.querySelector("#xScore")
const oScoreBoard = document.querySelector("#oScore")
const vsCompButton = document.querySelector("#vsComp")
var compPlayer = false
var turn = true
var mark = ""
markToggler()
var boardHistory = []
var turnCount = 0
var xScore = 0
var oScore = 0

// Same dimensions as the play board (3x3), for storing combinations as shown on the board
var Board = [
    ["","",""],
    ["","",""],
    ["","",""]
]

// same dimension as Board, for storing columnal combinations
var BoardCols = [
    ["","",""],
    ["","",""],
    ["","",""]
]

// for storing the diagonal combinations
var BoardDiagonals = [
    ["","",""],
    ["","",""]
]

document.getElementById('resetButton').addEventListener('click', setup)
document.getElementById('newGameButton').addEventListener('click', function(){xScore=0;oScore=0;updateScores();setup();})
vsCompButton.addEventListener('click', vsCompButtonBehavior)
prevButton.addEventListener('click', prevHistory)
nextButton.addEventListener('click', nextHistory)

setup()

function setup() {
    for (let div of divSpace) {    // assign Event Listeners, styling the cell text appearances
        div.addEventListener('click', clickEvent)
        div.addEventListener('mouseover', cellHighlightEvent)
        div.addEventListener('mouseout', highlightClearerEvent)
        div.innerHTML = ""
        div.style.color = "lightgray"
    }
    for (let m of Board)    // clear Board[] array
        m.fill("")
    boardHistory.splice(0,boardHistory.length)    // clear board history
    turnSpan.innerHTML = ""
    turn = true
    markToggler()
    boardDataMiner()
    toggleReviewButtons (display="none")
    
}

function vsCompButtonBehavior() {
    compPlayer = !compPlayer
    if (compPlayer) {
        vsCompButton.style.backgroundColor = "#00890e"
        vsCompButton.style.color = "white"
    }
    else {
        vsCompButton.style.backgroundColor = ""
        vsCompButton.style.color = ""
    }
    computerClicker()
}

function whereO (boardMark) {
    return boardMark === "O"
}

function computerClicker () {
    let a = -1
    if (compPlayer&&(mark==="O")) {
        if (divSpace[4].innerHTML==="")
            a = 4
        else if (divSpace[2].innerHTML==="")
            a = 2
        else {
            for (let i=0; i<divSpace.length; i++) {
                if (divSpace[i].innerHTML==="O") {
                    console.log("#1")
                    if (i%3===0) {
                        console.log("#2")
                        if (divSpace[i+1].innerHTML==="")
                            a = i+1
                        else if (i<6)
                            if (divSpace[i+3].innerHTML==="")
                                a = i+3
                        else
                            if (divSpace[i-3].innerHTML==="") {
                                a = i-3
                                console.log("#5!")
                            }
                                
                    }
                }
            }
        }
        // console.log(a)
        if (a<0)
            do {
                a = Math.floor(Math.random() * 9)
            } while (divSpace[a].innerHTML != "")
        divSpace[a].click()
        
    }
}

// Names the click event so it becomes removable.
function clickEvent(e) {    
    clicker(e)
}

// Names the highlight event so it becomes removable.
function cellHighlightEvent(e) {    
    cellHighlighter(e)
}

// Names the mouseout event so it becomes removable.
function highlightClearerEvent(e) {    
    highlightClearer(e)
}

function clicker (divCellEvent) {
    if (Board[divCellEvent.target.id[2]][divCellEvent.target.id[3]]==="") {
        divCellEvent.target.innerHTML = mark
        Board[divCellEvent.target.id[2]][divCellEvent.target.id[3]] = mark
        boardHistoryUpdater()
        divCellEvent.target.style.color = "black"
        boardDataMiner()
        if (winChecker ())
            markToggler()
    }
    turnCount = boardHistory.length-1
}

function boardHistoryUpdater() {
    let array = []
    for (let div of divSpace) {
        array.push(div.innerHTML)
    }
    boardHistory.push(array)
}

function cellHighlighter (divCellEvent) {
    if (divCellEvent.target.innerHTML === "")
        divCellEvent.target.innerHTML = mark
}

function highlightClearer (divCellEvent) {
    divCellEvent.target.innerHTML = Board[divCellEvent.target.id[2]][divCellEvent.target.id[3]]
}

// Removes Event Listeners
function eventListeningDeafener() {
    for (let div of divSpace) {
        div.removeEventListener('click', clickEvent)
        div.removeEventListener('mouseover', cellHighlightEvent)
        div.removeEventListener('mouseout', highlightClearerEvent)
    }
}

function toggleReviewButtons (display) {
    document.getElementById("prevButton").style.display = display
    document.getElementById("nextButton").style.display = display
}

function markToggler () {
    if (turn)
        mark = "X"
    else
        mark = "O"
    turn = !turn
    spanText.innerHTML = mark + " player turn." 
    if (compPlayer)
        computerClicker ()
}

function boardDataMiner() {
    for (let i=0; i<3; i++)
        for (let o=0; o<3; o++)
            BoardCols[o][i] = Board[i][o]
    BoardDiagonals[0] = [Board[0][0],Board[1][1],Board[2][2]] //diagonal dip
    BoardDiagonals[1] = [BoardCols[2][0],BoardCols[1][1],BoardCols[0][2]] //diagonal rise
}

function XChecker (m) {
    return m === 'X'
}

function OChecker (m) {
    return m === 'O'
}

function drawChecker(m) {
    return m === ""
}

function winChecker () {
    let xWin = false
    let oWin = false

    for (let i=0; i<3; i++) {
        // .every() returns true if every element of an array checks out in a condition, otherwise it returns false
        xWin = Board[i].every(XChecker)    
        if (xWin)
            break
        else {
            xWin = BoardCols[i].every(XChecker)
            if (xWin)
                break
            else {
                if (i<2)
                    xWin = BoardDiagonals[i].every(XChecker)
                if (xWin)
                    break
                else {
                    oWin = Board[i].every(OChecker)
                    if (oWin)
                        break
                    else {
                        oWin = BoardCols[i].every(OChecker)
                        if (oWin)
                            break
                        else {
                            if (i<2)
                                oWin = BoardDiagonals[i].every(OChecker)
                            if (oWin)
                                break
                            else 
                                continue
                        }
                    }
                }
            }
        }
    }
    if (xWin || oWin) {
        if (xWin) {
            spanText.innerHTML = "X Player wins!"
            xScore++
        }
            
        else if (oWin) {
            spanText.innerHTML = "O Player wins!"
            oScore++
        }
        gameOver()
        return false
    }
    
    else if (boardHistory.length===9) {
        spanText.innerHTML = "Draw!"
        gameOver()
        return false
    }
    else
        return true
}

function updateScores() {
    if (xScore<10)
        xScoreBoard.innerHTML ="X:  " + xScore
    else
        xScoreBoard.innerHTML ="X: " + xScore
    if (oScore<10)
        oScoreBoard.innerHTML ="O:  " + oScore
    else
        oScoreBoard.innerHTML ="O: " + oScore
}

function gameOver() {
    updateScores()
    toggleReviewButtons (display="inline")
    eventListeningDeafener()
    turnCount = boardHistory.length-1
    prevButton.disabled = false
    nextButton.disabled = true
    console.log("Took "+ (turnCount+1) + " turns to finish.")
}

function prevHistory() { 
    if (turnCount>0) {
        turnCount--
        turnSpan.innerHTML = "Showing play board on turn # " + (turnCount+1)
        boardPrinter()
        nextButton.disabled = false
    }

    if (turnCount===0)
        prevButton.disabled = true
}

function nextHistory() {
    if (turnCount<boardHistory.length-1) {
        turnCount++
        turnSpan.innerHTML = "Showing play board on turn # " + (turnCount+1)
        boardPrinter()
        prevButton.disabled = false
    }
    
    if (turnCount===boardHistory.length-1)
        nextButton.disabled = true
}

function boardPrinter() {
    for (let i=0; i<divSpace.length; i++) {
        divSpace[i].innerHTML = boardHistory[turnCount][i]
    }
}

// DEPRECATED CHECKER CODE BELOW

// function straightChecker (mark) {
//     let checkRow = true
//     let checkCol = true
    
//     for (let i=0; i<3; i++) {
//         console.log ("i:" + i + " Mark: " + mark)
//         for (let o=0; o<3; o++) {
//             console.log ("o:" + o)
//             if (checkRow) {
//                 console.log("row check")
//                 if (tiktaktoeBoard[i][o]===mark) {
//                     if (o === 2) {
//                         console.log(mark + "-Win row " + i)
//                         return true
//                     }
//                 }
//                 else {
//                     console.log(tiktaktoeBoard[i][o] + " =/= " + mark + (typeof tiktaktoeBoard[i][o]))
//                     checkRow = false
//                 }
//             }
//             if (checkCol) {
//                 console.log("col check")
//                 if (tiktaktoeBoard[o][i]===mark) {
//                     if (o === 2) {
//                         console.log(mark + "-Win col " + i)
//                         return true
//                     }
//                 }
//                 else {
//                     console.log(tiktaktoeBoard[o][i] + " =/= " + mark + (typeof tiktaktoeBoard[i][o]))
//                     checkCol = false
//                 }
//             console.log ("checkRow:" + checkRow + " checkCol:" + checkCol)
//             }
//             if (!(checkRow&&checkCol)) {
//                 // checkRow = true
//                 // checkCol = true
//                 break
//             }
                
//         }
//     }
//     return false
// }

// function diagonalChecker(mark) {
//     let checkDip = true
//     let checkRise = true
//     for (let i=0; i<3; i++) {
//         if (checkDip) {
//             if (tiktaktoeBoard[i][i]===mark)
//                 if (i===2) {
//                     console.log(mark + " Win diagonal_dip")
//                     return true
//                 }
//             else
//                 checkDip = false
//         }
//         else if (checkRise) {
//             if (tiktaktoeBoard[2-i][2-i]===mark)
//                 if (i===0) {
//                     console.log(mark + " Win diagonal_rise")
//                     return true
//                 }
//             else
//                 checkRise = false
//         }
//         else
//             break
//     }
//     return false
// }
// function winChecker () {
//     let xWin = false
//     let oWin = false
    
//     xWin = straightChecker('X')
//     if (!xWin) {
//         xWin = diagonalChecker('X')
//         if (!xWin) {
//             oWin = straightChecker('O')
//             if (!oWin)
//                 oWin = diagonalChecker('O')
//         }
//     }
   
//     if (xWin)
//         spanText.innerHTML = "X Player wins!"
//     else if (oWin)
//         spanText.innerHTML = "O Player wins!"
//     else
//         spanText.innerHTML = ""

//     checkCounter++
//     console.log ("<< FINISHED CHECK#" + checkCounter + ">>")
// }