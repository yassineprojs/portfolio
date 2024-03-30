export const audios = {
  win_word: new Audio("/audio/fairy.mp3"),
};
export const playAudio = (audio) => {
  audio.currentTime = 0;
  audio.play();
};
