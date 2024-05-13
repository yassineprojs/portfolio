export const audios = {
  win_word: new Audio("./public/audio/5.mp3"),
};
export const playAudio = (audio) => {
  audio.currentTime = 0;
  audio.play();
};
