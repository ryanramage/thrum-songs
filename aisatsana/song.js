const { tick } = require('thrum')
const lengths = require('thrum/lib/lengths')
const piano = require('./lib/piano')
const random = require('random')
//const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

let length = lengths['8n']
let range = random.uniform(0, 2)
let _velocity = random.uniform(90, 127)

tick(({spp, userState, actions}) => {
  if (!userState.scheduled || !Object.keys(userState.scheduled).length) {
    userState.scheduled = {}
    let startspp = spp + length
    let nextPhrase = piano.phrase()
    nextPhrase.forEach((unit, i) => {
      let phraseStart = startspp + (i * length)
      let adjusted = phraseStart + Math.round(range())
      unit.phraseStart = phraseStart
      userState.scheduled[adjusted] = unit
    })
  }

  // play scheduled
  let unit = userState.scheduled[spp]
  if (!unit) return {spp, userState, actions}
  let velocity = Math.round(_velocity())
  unit.notes.forEach(note => {
    console.log(note, length, velocity)
    actions.push({to: 'toMidi', note, length, velocity })
  })
  delete userState.scheduled[spp]
  return {spp, userState, actions}
})
