const Chain = require('markov-chains').default
const instructions = require('./instructions.json')

const BPM = 102;
const SECONDS_PER_MINUTE = 60;
const EIGHTH_NOTES_IN_BEAT = 2;
const EIGHTH_NOTE_INTERVAL_S = SECONDS_PER_MINUTE / (EIGHTH_NOTES_IN_BEAT * BPM);
const DELIMITER = ',';
const SONG_LENGTH = 301;

const notes = instructions.tracks[1].notes.slice(0)
const eighthNotes = [];

for (let time = 0; time <= SONG_LENGTH; time += EIGHTH_NOTE_INTERVAL_S) {
 const names = notes
   .filter(
     note => time <= note.time && note.time < time + EIGHTH_NOTE_INTERVAL_S
   )
   .map(({ name }) => name)
   .sort();
 eighthNotes.push(names.join(DELIMITER));
}

const phrases = [];
const phraseLength = 32;
const enCopy = eighthNotes.slice(0);
while (enCopy.length > 0) {
 phrases.push(enCopy.splice(0, phraseLength));
}

const phrasesWithIndex = phrases.map(phrase =>
 phrase.map((names, i) =>
   names.length === 0 ? `${i}` : `${i}${DELIMITER}${names}`
 )
)
const chain = new Chain(phrasesWithIndex);

exports.phrase = () => {
  const phrase = chain.walk();
  let units = []
  phrase.forEach(str => {
    const [t, ...names] = str.split(DELIMITER);
    const parsedT = Number.parseInt(t, 10);
    units.push({time: t, notes: names})
  })
  return units
}
