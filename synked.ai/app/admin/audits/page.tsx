"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

interface AuditReport {
  id: string;
  contactName: string;
  contactEmail: string;
  overallScore: number;
  status: "in_progress" | "completed" | "expired";
  summary: string;
  createdAt: string;
  completedAt: string | null;
  company: { id: string; name: string } | null;
  client: { id: string; name: string } | null;
}

export default function AuditsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [audits, setAudits] = useState<AuditReport[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const page = Number(searchParams.get("page") ?? 1);

  const fetchAudits = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (search) params.set("search", search);
    if (status && status !== "all") params.set("status", status);

    try {
      const res = await fetch(`/api/admin/audits?${params}`);
      if (!res.ok) {
        setAudits([]);
        setTotal(0);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setAudits(data.audits ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setAudits([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status && status !== "all") params.set("status", status);
    router.push(`/admin/audits?${params}`);
  }

  return (
    <div>
      <PageHeader title="Audits" description={`${total} total`} />

      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search audits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            router.push(`/admin/audits?status=${v === "all" ? "" : v}`);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </form>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : audits.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No audits found
                </TableCell>
              </TableRow>
            ) : (
              audits.map((audit) => (
                <TableRow
                  key={audit.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin/audits/${audit.id}`)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{audit.contactName}</p>
                      <p className="text-xs text-muted-foreground">
                        {audit.contactEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{audit.company?.name ?? "—"}</TableCell>
                  <TableCell>
                    <span className="font-mono font-bold text-lg">
                      {audit.overallScore}
                    </span>
                    <span className="text-muted-foreground text-xs">/100</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={audit.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(audit.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
