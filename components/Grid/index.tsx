import {IState, LetterState} from "../../pages";
import classes from './styles.module.css';

export default function Grid(props: {
    rows: (IState | null)[][]
}) {
    const classMapping: Record<LetterState, string> = {
        correct: classes.correctTile,
        incorrectPosition: classes.incorrectPositionTile,
        nonexistentLetter: classes.nonexistentLetterTile,
        input: '',
    };

    return <div className={classes.gridContainer}>
        {props.rows.map((row, index) => {
            return <div key={index} className={classes.row}>
                {row.map((tile, index) => {
                    const extraClassName = tile?.type ? classMapping[tile.type] : '';

                    return <span key={index} className={`${classes.letter} ${extraClassName}`}>
                        {tile?.letter}
                    </span>;
                })}
            </div>;
        })}
    </div>;
}
