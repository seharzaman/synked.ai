"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Insight {
  id: string;
  industry: string;
  category: string;
  finding: string;
  evidenceCount: number;
  avgROI: number | null;
  tags: string[];
  createdBy: { id: string; name: string } | null;
  createdAt: string;
}

export default function InsightsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const page = Number(searchParams.get("page") ?? 1);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (search) params.set("search", search);

    const res = await fetch(`/api/admin/insights?${params}`);
    const data = await res.json();
    setInsights(data.insights ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/admin/insights?${params}`);
  }

  return (
    <div>
      <PageHeader
        title="Intelligence Insights"
        description={`${total} findings`}
        actions={
          <Button onClick={() => router.push("/admin/insights/new")}>
            <Plus className="size-4 mr-1" /> New Insight
          </Button>
        }
      />

      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search insights..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </form>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Finding</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>Avg ROI</TableHead>
              <TableHead>Tags</TableHead>
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
            ) : insights.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No insights found
                </TableCell>
              </TableRow>
            ) : (
              insights.map((insight) => (
                <TableRow
                  key={insight.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin/insights/${insight.id}`)}
                >
                  <TableCell className="font-medium max-w-xs truncate">
                    {insight.finding}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{insight.industry}</Badge>
                  </TableCell>
                  <TableCell>{insight.category}</TableCell>
                  <TableCell>{insight.evidenceCount}</TableCell>
                  <TableCell>
                    {insight.avgROI ? `${insight.avgROI}%` : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {insight.tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
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
