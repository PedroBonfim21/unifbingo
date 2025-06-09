/*  renderiza um campo do bingo */
type BingoCellProps = {
  number: number | "FREE";
  marked?: boolean;
};

export default function BingoCell({ number, marked = false }: BingoCellProps) {
  return (
    <div
      className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-lg font-bold rounded-lg border 
        ${marked ? "bg-purple-700 text-white" : "bg-white text-purple-800"}
        ${number === "FREE" ? "italic border-dashed" : "border-solid"}
      `}
    >
      {number}
    </div>
  );
}