const { tick } = require('thrum')
const lengths = require('thrum/lib/lengths')
const piano = require('./lib/piano')
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

let length = lengths['8n']
let nextPhrase = piano.phrase()

tick(({spp, userState, actions}) => {
  if (spp % length !== 0) return {spp, userState, actions}
  let unit = nextPhrase.shift()
  let velocity = random(90, 127)
  unit.notes.forEach(note => actions.push({to: 'toMidi', note, length, velocity }))
  if (!nextPhrase.length) nextPhrase = piano.phrase()
  return {spp, userState, actions}
})
