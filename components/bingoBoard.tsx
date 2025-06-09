/* renderiza a cartela por completo */

import BingoCell from "./bingoCell";

type BingoBoardProps = {
  board: (number | "FREE")[];
  markedNumbers?: (number | "FREE")[];
};

export default function BingoBoard({ board, markedNumbers = [] }: BingoBoardProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {board.map((num, index) => (
        <BingoCell
          key={index}
          number={num}
          marked={markedNumbers.includes(num)}
        />
      ))}
    </div>
  );
}
