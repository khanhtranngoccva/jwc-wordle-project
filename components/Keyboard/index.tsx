import classes from './styles.module.css'

const ROWS = [
    [..."qwertyuiop"],
    [..."asdfghjkl"],
    ["Enter", ..."zxcvbnm", "Backspace"],
];

export default function Keyboard(props: {
    isPlaying: boolean;
    onClick: (key: string) => void;
}) {
    return <div className={classes.keyboard}>
        {ROWS.map((row, index) => {
            return <div key={index} className={classes.row}>
                {row.map((tile) => {
                    return <button key={tile} className={classes.key} onClick={() => {
                        if (props.isPlaying) {
                            props.onClick(tile);
                        }
                    }}>{tile}</button>
                })}
            </div>
        })}
    </div>;
}
