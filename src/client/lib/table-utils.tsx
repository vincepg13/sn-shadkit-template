/* eslint-disable no-restricted-globals */
/* eslint-disable @servicenow/sdk-app-plugin/no-unsupported-node-builtins */
import {
  SnTableUtils,
  SnTableApi,
  DataTableColumnHeader,
  ColumnDef,
  SnRow,
  SnRowItem,
} from "sn-shadcn-kit";

type SnFieldElement = { name: string; label: string };

export async function getTableRoutingData(
  table: string,
  page: number,
  pageSize: number,
  query: string,
  fields: SnFieldElement[],
  signal: AbortSignal
) {
  const pageIndex = page ? page - 1 : 0;
  const offset = pageIndex * pageSize;

  const sorting = SnTableUtils.getDefaultSortingFromQuery(query);
  if (!sorting.length) sorting.push({ id: "name", desc: false });
  let sortQuery = query || "ORDERBYname";

  if (!sortQuery.includes("ORDERBY")) sortQuery += "^ORDERBYname";

  const fieldList = fields.map((field) => field.name);

  const { getTableRows } = SnTableApi;
  const tableData = await getTableRows(table, sortQuery, fieldList.toString(), offset, pageSize, signal);

  const total = +(tableData.headers["x-total-count"] || 0);
  const columns = getColumns(fields);

  return {
    pageIndex,
    pageSize,
    sorting,
    query,
    columns,
    pageCount: Math.ceil(total / pageSize),
    schema: fields,
    data: tableData.data.result,
    totalRowCount: total,
    uuid: crypto.randomUUID(),
  };
}

export function getColumns(fields: SnFieldElement[]) {
  return fields.map((field) => {
    const { name, label } = field;
    return getGenericColumn(name, label);
  });
}

const getGenericColumn = (id: string, label: string): ColumnDef<SnRow, SnRowItem> => ({
  id,
  accessorKey: id,
  cell: ({ getValue }) => <div className="whitespace-normal text-left">{getValue().display_value}</div>,
  header: ({ column }) => <DataTableColumnHeader column={column} title={label} />,
});
