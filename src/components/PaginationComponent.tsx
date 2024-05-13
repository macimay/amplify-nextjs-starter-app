import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
export default function PaginationComponent({
  nextToken,

  callback,
}: {
  nextToken: string | null;
  callback: (page: number) => void;
}) {
  const currentPage = 0;
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage > 0 && (
            <PaginationPrevious
              onClick={() => {
                callback(currentPage - 1);
              }}
            />
          )}
        </PaginationItem>
        <PaginationItem>
          {nextToken && (
            <PaginationNext
              onClick={() => {
                callback(currentPage + 1);
              }}
            ></PaginationNext>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
