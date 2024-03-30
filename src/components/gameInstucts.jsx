export default function Instructs({ nextClick, skipClick, nextText }) {
  const CubeScript = [
    {
      id: 1,
      text: "i'm gonna try you out in a game",
    },
    {
      id: 2,
      text: "it's called ceaser ",
    },
    {
      id: 3,
      text: "it's as easy as rating a ceaser, and i love ceaser salads lol😂",
    },
    {
      id: 4,
      text: "you need to flip the cubes in order to find the true sentence",
    },
    {
      id: 5,
      text: "if you get stuck, scan the hint below",
    },
    {
      id: 5,
      text: "see you in the next corner !",
    },
  ];
  return (
    <div className="speachBox">
      <button className="skipBTn" onClick={skipClick}>
        Skip
      </button>
      <div className="textPart">{CubeScript[nextText].text}</div>
      <button className="nextBtn" onClick={nextClick}>
        Next
      </button>
    </div>
  );
}
