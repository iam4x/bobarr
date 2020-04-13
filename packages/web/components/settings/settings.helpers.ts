export function reorder<TList>({
  list,
  startIndex,
  endIndex,
}: {
  list: TList[];
  startIndex: number;
  endIndex: number;
}) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result.map((row, index) => ({ ...row, score: list.length - index }));
}
