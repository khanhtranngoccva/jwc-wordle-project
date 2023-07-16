import React from "react";
import Grid from "../components/Grid";
import classes from './styles.module.css';
import {getRandomWord, getWordOfTheDay} from "../helpers/wordOfTheDay";
import Keyboard from "../components/Keyboard";

export type LetterState = "correct" | "nonexistentLetter" | "incorrectPosition" | "input";

export interface IState {
    letter: string;
    type: LetterState;
}

function initialRowState() {
    return Array.from({
        length: 6
    }, () => {
        return Array.from({
            length: 5
        }, () => {
            return null;
        });
    });
}

function initialCurrentRowState() {
    return Array.from({length: 5}, () => null)
}

export default function WordleApp() {
    const [word, setWord] = React.useState(getWordOfTheDay);
    const [attempts, setAttempts] = React.useState(0);
    const [rows, setRows] = React.useState<(IState | null)[][]>(initialRowState);
    const [currentRow, setCurrentRow] = React.useState<(IState | null)[]>(initialCurrentRowState);
    const [state, setState] = React.useState<"playing" | "win" | "lose">("playing");


    function handleWord(input: string) {
        const newRow: IState[] = [];
        const lowercaseWord = word.toLowerCase();
        const lowercaseInput = input.toLowerCase();

        for (let i = 0; i < word.length; i++) {
            if (lowercaseWord[i] === lowercaseInput[i]) {
                newRow[i] = {
                    letter: lowercaseInput[i],
                    type: "correct",
                };
            } else if (lowercaseWord.includes(lowercaseInput[i])) {
                newRow[i] = {
                    letter: lowercaseInput[i],
                    type: "incorrectPosition",
                };
            } else {
                newRow[i] = {
                    letter: lowercaseInput[i],
                    type: "nonexistentLetter",
                };
            }
        }
        const newRows = [...rows];
        newRows[attempts] = newRow;
        setRows(newRows);
        if (newRow.every(i => i.type === "correct")) {
            setState("win");
        } else if (attempts === 6) {
            setState("lose");
        } else {
        }
        setAttempts(attempts + 1);
        setCurrentRow(initialCurrentRowState);
    }

    function reset() {
        setState("playing");
        setAttempts(0);
        setRows(initialRowState);
        setCurrentRow(initialCurrentRowState);
        setWord(getRandomWord);
    }

    function handleInput(input: string) {
        const alteredCurrentRow = [...currentRow];
        if (input === "Enter") {
            if (currentRow.filter(i => i).length !== currentRow.length) return;
            const inputWord = currentRow.map(word => word?.letter).join('');
            handleWord(inputWord);
            return;
        } else if (input === "Backspace") {
            const index = currentRow.findLastIndex(i => i);
            if (index === -1) return;
            alteredCurrentRow[index] = null;
        } else if (/^[a-z]$/i.test(input)) {
            const index = currentRow.findIndex(i => !i);
            if (index === -1) return;
            alteredCurrentRow[index] = {
                letter: input.toLowerCase(),
                type: "input",
            };
        }
        setCurrentRow(alteredCurrentRow);
    }

    React.useEffect(() => {
        function handler(e: KeyboardEvent) {
            handleInput(e.key);
        }

        if (state === "playing") {
            window.addEventListener("keydown", handler);
        }

        return () => {
            return window.removeEventListener("keydown", handler);
        };
    }, [state, attempts, currentRow]);

    const rowsWithInjectedRow = [...rows];
    rowsWithInjectedRow[attempts] = currentRow;
    const shownRows = rowsWithInjectedRow.slice(0, 6);

    return <div className={classes.mainContainer}>
        <Grid rows={shownRows}></Grid>
        <Keyboard isPlaying={state === "playing"} onClick={(key) => {
            handleInput(key);
        }}></Keyboard>
        <button onClick={() => {
            reset();
        }}>Reset</button>
        {state !== 'playing' && <div>
            <h2>You {state}!</h2>
            <button onClick={() => {
                reset();
            } }>Play again</button>
        </div>}
    </div>;
}
