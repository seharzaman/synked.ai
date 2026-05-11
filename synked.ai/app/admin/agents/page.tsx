"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
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

interface Agent {
  id: string;
  name: string;
  type: string;
  status: "ok" | "degraded" | "failing" | "offline";
  createdAt: string;
  company: { id: string; name: string } | null;
  client: { id: string; name: string } | null;
  metrics: Array<{
    latency: number | null;
    successRate: number | null;
    uptime: number | null;
  }>;
}

export default function AgentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const page = Number(searchParams.get("page") ?? 1);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (search) params.set("search", search);
    if (status && status !== "all") params.set("status", status);

    const res = await fetch(`/api/admin/agents?${params}`);
    const data = await res.json();
    setAgents(data.agents ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, search, status]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status && status !== "all") params.set("status", status);
    router.push(`/admin/agents?${params}`);
  }

  return (
    <div>
      <PageHeader
        title="AI Agents"
        description={`${total} total`}
        actions={
          <Button asChild>
            <Link href="/admin/agents/new">
              <Plus className="size-4 mr-2" />
              Add Agent
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ok">Healthy</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="failing">Failing</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead>Uptime</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : agents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No agents found
                </TableCell>
              </TableRow>
            ) : (
              agents.map((agent) => {
                const latest = agent.metrics[0];
                return (
                  <TableRow
                    key={agent.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/admin/agents/${agent.id}`)}
                  >
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {agent.type}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={agent.status} />
                    </TableCell>
                    <TableCell>
                      {agent.company ? (
                        <Link
                          href={`/admin/companies/${agent.company.id}`}
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {agent.company.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {latest?.latency != null
                        ? `${latest.latency.toFixed(0)}ms`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {latest?.uptime != null
                        ? `${latest.uptime.toFixed(1)}%`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => router.push(`/admin/agents?page=${page - 1}`)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground flex items-center">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => router.push(`/admin/agents?page=${page + 1}`)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
