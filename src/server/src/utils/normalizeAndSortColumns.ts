function normalizeAndSortColumns(columns: string[]) {
  columns.sort();

  const indexOfId = columns.findIndex((key) => key.toLowerCase() === "id");

  if (indexOfId > -1) {
    columns.splice(indexOfId, 1);

    columns.unshift("id");
  } else {
    columns.unshift("id");
  }

  const indexOfKey = columns.findIndex(
    (key) => key.toLowerCase() === "__key__"
  );

  if (indexOfKey > -1) columns.splice(indexOfKey, 1);
}

export default normalizeAndSortColumns;
