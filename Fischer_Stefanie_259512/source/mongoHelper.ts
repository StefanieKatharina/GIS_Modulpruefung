import { MongoClient } from 'mongodb';

type Direction = 'asc' | 'desc';

interface IScore {
    /** Spielername*/
    name: string,
    score: number
}

export function isIScore(p: any): p is IScore {
    if (p['name'] == null || typeof p['name'] !== 'string')
        return false;
    if (p['score'] == null || typeof p['score'] !== 'number')
        return false;
    else
        return true;
}

const uri = "mongodb://localhost:27017";
const dbName = "memory-game";
const collectionName = "scores";
let client: MongoClient | undefined;

export async function startSession() {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
}

export async function stopSession() {
    await client?.close();
    client = undefined;
}

function getScoresCollection() {
    if (client == null) {
        throw new Error('No MongoClient was created. Make sure to start a session first.');
    };
    const database = client.db(dbName);
    const collection = database.collection<IScore>(collectionName);
    return collection;
}
  
export async function writeScore(score: IScore) {
    try {
        await getScoresCollection().insertOne(score);
        console.log("New score was saved", score);
    } catch(error) {
        throw new Error(error);
    }
}

export async function getScores(sort: Direction = 'asc') {
    let scores: IScore[] = [];
    try {
        await getScoresCollection().find().forEach(s => scores.push(s));
        sortScores(scores, sort);
    } catch(error) {
        throw new Error(error);
    }
    return scores;
}

function sortScores(scores: IScore[], direction: Direction) {
	for (let i = scores.length - 1; i >= 0; i--) {
		for (let j = 1; j <= i; j++) {
			if (direction === 'desc' && scores[j - 1].score < scores[j].score)
                scores[j - 1] = scores.splice(j, 1, scores[j - 1])[0];
			else if (direction === 'asc' && scores[j - 1].score > scores[j].score)
                scores[j] = scores.splice(j - 1, 1, scores[j])[0];
		}
	}
}

export function resetScores() {
    const scoresCollection = getScoresCollection().drop((err, delOK) => {
        if (err) throw err;
        if (delOK) console.log("Scores reseted!");
    });
}