interface ICard {
    /** Kartennamen*/
    name: string;
    /** Source der Karten*/
    src: string;
}
interface IScore {
    /** Spielername*/
    name: string;
    score: number;
}

declare function convertSecondsToString(seconds: number): string;
declare class Timer {
    private __intervalId;
    private __elapsedTime;
    start(cb: () => any): void;
    stop(): number;
    getElapsedTime(): number;
}
