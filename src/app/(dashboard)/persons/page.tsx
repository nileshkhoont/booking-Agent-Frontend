"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { ListCard } from "@/components/common/list-card";
import { PersonFormDialog } from "@/components/persons/person-form-dialog";
import { usePersons } from "@/features/persons/hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatDate } from "@/lib/utils";

export default function PersonsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading, isError } = usePersons({ q: debouncedSearch || undefined, page, page_size: 20 });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex shrink-0 justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus size={16} /> Add person
        </Button>
      </div>

      <ListCard
        toolbar={
          <div className="relative w-full max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone number"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        }
      >
        {isLoading && <LoadingSpinner className="flex-1" />}
        {isError && (
          <div className="p-4">
            <ErrorBanner message="Failed to load persons" />
          </div>
        )}

        {data && data.items.length === 0 && (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState title="No persons yet" description="Add a person or wait for the first call to come in." />
          </div>
        )}

        {data && data.items.length > 0 && (
          <>
          <div className="min-h-0 flex-1">
          <Table fillHeight bare>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>
                    <Link href={`/persons/${person.id}`} className="font-medium hover:underline">
                      {person.full_name || person.phone_number}
                    </Link>
                  </TableCell>
                  <TableCell>{person.phone_number}</TableCell>
                  <TableCell>{person.email ?? "—"}</TableCell>
                  <TableCell>{formatDate(person.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          <Pagination page={page} pageSize={20} total={data.total} onPageChange={setPage} />
          </>
        )}
      </ListCard>

      <PersonFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
