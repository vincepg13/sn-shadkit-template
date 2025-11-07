import { useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { getTableRoutingData } from "@/lib/table-utils";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  DataTable,
  SnDataTableSkeleton,
  resolveUpdater,
  getSortedQuery,
  SortingState,
  Updater,
  SnFilter,
  SnPersonalise,
} from "sn-shadcn-kit/table";
import { Loader } from "lucide-react";

//Static fields instead of loading a view
const problemFields = [
  { name: "number", label: "Number" },
  { name: "short_description", label: "Short Description" },
  { name: "state", label: "State" },
  { name: "priority", label: "Priority" },
  { name: "opened_by", label: "Opened By" },
  { name: "assigned_to", label: "Assigned To" },
  { name: "opened_at", label: "Opened At" },
];

function extractOrder(query: string) {
  const match = query.match(/(ORDERBY(?:DESC)?[A-Za-z0-9_]+)(?=$|\^)/);
  return match ? match[1] : null;
}

//Tanstack Query fetcher
export const demoQuery = (page: number, query: string, pageSize: number) => ({
  queryKey: ["demoData", page, query, pageSize],
  placeholderData: keepPreviousData,
  queryFn: async ({ signal }: { signal: AbortSignal }) =>
    await getTableRoutingData("problem", page, pageSize, query, problemFields, signal),
});

export function DemoPage() {
  const [sp, setSp] = useSearchParams();
  const [hidden, setHidden] = useState(true);
  const [pageSize, setPageSize] = useState(10);

  const qc = useQueryClient();
  const page = Number(sp.get("page") || 1);
  const query = sp.get("query") || "ORDERBYDESCopened_at";
  const builderHostRef = useRef<HTMLDivElement | null>(null);

  //Execute the query
  const { data, isLoading, isFetching } = useQuery(demoQuery(page, query, pageSize));
  if (!data) return <div>Loading...</div>;

  //On page number or size change, update the URL params or set a new page size
  const handlePageChange = (updater: Updater<{ pageIndex: number; pageSize: number }>) => {
    const newState = resolveUpdater(updater, { pageIndex: data.pageIndex, pageSize: data.pageSize });
    if (newState.pageSize !== pageSize) setPageSize(newState.pageSize);

    const next = new URLSearchParams(sp);
    next.set("page", String(newState.pageIndex + 1));
    setSp(next, { replace: false });
  };

  //On sort change, update the URL params with the mapped query
  const handleSortChange = (updater: Updater<SortingState>) => {
    const newSorting = resolveUpdater(updater, data.sorting);
    const query = getSortedQuery(newSorting, data.query);

    const next = new URLSearchParams(sp);
    next.set("query", query);
    next.set("page", "1");
    setSp(next, { replace: false });
  };

  //On filter change, update the URL params with the new query
  const orderPart = extractOrder(query);
  const filterQuery = query.startsWith("ORDERBY") ? "" : query;
  const handleQueryChange = (newQuery: string) => {
    console.log("New filter query: ", newQuery);
    const next = new URLSearchParams(sp);
    next.set("query", newQuery + (newQuery && orderPart ? `^${orderPart}` : ""));
    next.set("page", "1");
    setSp(next, { replace: false });
  };

  return (
    <div className="flex flex-col gap-4">
      <Alert>
        <AlertTitle className="flex gap-2 items-center justify-between border-b pb-2 mb-1 text-lg">
          <span>Tanstack Query: Problem Table Demo</span>
          <img src="https://avatars.githubusercontent.com/u/72518640?s=280&v=4" className="w-8" />
        </AlertTitle>
        <AlertDescription className="text-base">
          This demo page shows how to use the DataTable component from sn-shadcn-kit with data fetching via Tanstack
          Query. This means each route is cached, e.g. going from one page on the table to another and then back will
          not trigger a new fetch. A useful pattern so you don't have to rely on individual components fetching their
          own data.
        </AlertDescription>
      </Alert>
      {isLoading ? (
        <SnDataTableSkeleton rowCount={10} columnCount={7} />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center justify-between">
            <div className="flex-1">
              <SnFilter
                table="problem"
                encodedQuery={filterQuery}
                onQueryBuilt={handleQueryChange}
                onToggle={() => setHidden(!hidden)}
                builderPortalTarget={builderHostRef.current}
              />
            </div>
            <div className="flex items-center gap-2">
              {isFetching && <Loader className="animate-spin" />}
              <SnPersonalise
                lmEndpoint="/api/659318/react_form/list_mechanic"
                table="problem"
                onChange={() => {
                  console.log("Personalisation changed");
                  qc.invalidateQueries({ queryKey: ["tableData"] });
                }}
              />
            </div>
          </div>

          <div ref={builderHostRef} className={hidden ? "hidden" : "block"}></div>

          <DataTable
            pageIndex={data.pageIndex}
            pageSize={pageSize}
            pageCount={data.pageCount}
            data={data.data}
            columns={data.columns}
            totalRowCount={data.totalRowCount}
            sorting={data.sorting}
            onSortingChange={handleSortChange}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
