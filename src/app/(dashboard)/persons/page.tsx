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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Persons</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus size={16} /> Add person
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Search size={16} className="text-muted-foreground" />
        <Input
          placeholder="Search by name or phone number"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {isError && <ErrorBanner message="Failed to load persons" />}

      {data && data.items.length === 0 && (
        <EmptyState title="No persons yet" description="Add a person or wait for the first call to come in." />
      )}

      {data && data.items.length > 0 && (
        <>
          <Table>
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
                      {person.full_name}
                    </Link>
                  </TableCell>
                  <TableCell>{person.phone_number}</TableCell>
                  <TableCell>{person.email ?? "—"}</TableCell>
                  <TableCell>{formatDate(person.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination page={page} pageSize={20} total={data.total} onPageChange={setPage} />
        </>
      )}

      <PersonFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
