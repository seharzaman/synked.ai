"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";

interface AgentTemplate {
  id: string;
  name: string;
  type: string;
  graphPattern: string;
  category: string | null;
  usageCount: number;
  tags: string[];
  createdBy: { id: string; name: string } | null;
  _count: { agents: number };
  createdAt: string;
}

export default function AgentTemplatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [graphPattern, setGraphPattern] = useState(
    searchParams.get("graphPattern") ?? "all",
  );
  const page = Number(searchParams.get("page") ?? 1);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (search) params.set("search", search);
    if (graphPattern && graphPattern !== "all")
      params.set("graphPattern", graphPattern);

    const res = await fetch(`/api/admin/agent-templates?${params}`);
    const data = await res.json();
    setTemplates(data.templates ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, search, graphPattern]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (graphPattern && graphPattern !== "all")
      params.set("graphPattern", graphPattern);
    router.push(`/admin/agent-templates?${params}`);
  }

  return (
    <div>
      <PageHeader
        title="Agent Templates"
        description={`${total} total`}
        actions={
          <Button onClick={() => router.push("/admin/agent-templates/new")}>
            <Plus className="size-4 mr-1" /> New Template
          </Button>
        }
      />

      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={graphPattern}
          onValueChange={(v) => {
            setGraphPattern(v);
            router.push(
              `/admin/agent-templates?graphPattern=${v === "all" ? "" : v}`,
            );
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Patterns</SelectItem>
            <SelectItem value="conversational">Conversational</SelectItem>
            <SelectItem value="pipeline">Pipeline</SelectItem>
            <SelectItem value="reactive">Reactive</SelectItem>
            <SelectItem value="team_orchestrator">Team Orchestrator</SelectItem>
            <SelectItem value="team_autonomous">Team Autonomous</SelectItem>
          </SelectContent>
        </Select>
      </form>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Pattern</TableHead>
              <TableHead>Deployed</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : templates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No templates found
                </TableCell>
              </TableRow>
            ) : (
              templates.map((t) => (
                <TableRow
                  key={t.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin/agent-templates/${t.id}`)}
                >
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{t.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {t.graphPattern.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{t._count.agents} agents</TableCell>
                  <TableCell>{t.usageCount}x</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(t.createdAt).toLocaleDateString()}
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
