export default function Instructs({ nextClick, skipClick, nextText }) {
  const CubeScript = [
    {
      id: 1,
      text: "Alright, get your game face on! We're diving into the world of... *drumroll*... cubes! 🎲",
    },
    {
      id: 2,
      text: "Welcome to 'Caesar's Cube Conundrum'! It's like a brain salad with a side of Caesar cipher! 🥗💡",
    },
    {
      id: 3,
      text: "Explore the depths of cube-rrific fun and unlock secrets hidden within! Need a hint? Check below! 😂",
    },
    {
      id: 4,
      text: "Your mission, should you choose to accept it: flip those cubes like a pro and uncover the hidden truth!",
    },
    {
      id: 5,
      text: "Feeling lost? No worries! Check out the Caesar cipher page on your computer for more clues!",
    },
    {
      id: 6,
      text: "Catch you in the flipside! Let's cube it up in the next round! 🎲✌️",
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
