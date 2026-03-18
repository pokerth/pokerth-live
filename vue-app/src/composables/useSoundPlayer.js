/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
import { useConfigStore } from '@/stores'

let extension = ''
const sounds = {}
const activeSounds = []

function initialize() {
  const audioElement = document.createElement('audio')
  if (typeof audioElement.canPlayType === 'function') {
    if (audioElement.canPlayType('audio/mpeg') === 'probably') {
      extension = 'mp3'
    } else if (audioElement.canPlayType("audio/ogg codecs='vorbis'") === 'probably') {
      extension = 'ogg'
    } else if (audioElement.canPlayType('audio/mpeg') === 'maybe') {
      extension = 'mp3'
    } else if (audioElement.canPlayType("audio/ogg codecs='vorbis'") === 'maybe') {
      extension = 'ogg'
    }
  }
}

function cleanActive() {
  for (let i = activeSounds.length - 1; i >= 0; i--) {
    if (activeSounds[i].ended) {
      activeSounds.splice(i, 1)
    }
  }
}

function createAudio(name) {
  const audioElement = new Audio(`/sounds/${name}.${extension}`)
  audioElement.addEventListener('ended', cleanActive, false)
  sounds[name] = sounds[name] || []
  sounds[name].push(audioElement)
  return audioElement
}

function getAudioElement(name) {
  if (sounds[name]) {
    for (const el of sounds[name]) {
      if (el.ended) return el
    }
  }
  return createAudio(name)
}

function play(name) {
  if (extension !== '') {
    const audioObj = getAudioElement(name)
    audioObj.play()
    activeSounds.push(audioObj)
  }
}

function stop() {
  for (let i = activeSounds.length - 1; i >= 0; i--) {
    activeSounds[i].pause()
    activeSounds[i].currentTime = 0
  }
  activeSounds.length = 0
}

const ACTION_SOUNDS = ['', 'fold', 'check', 'call', 'bet', 'raise', 'allin']

export function useSoundPlayer() {
  initialize()

  function playActionSound(action) {
    const config = useConfigStore()
    if (config.playSoundEvents && ACTION_SOUNDS[action]) {
      play(ACTION_SOUNDS[action])
    }
  }

  return {
    play,
    stop,
    playActionSound,
  }
}
