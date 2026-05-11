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

interface Blueprint {
  id: string;
  name: string;
  slug: string;
  category: string;
  industry: string | null;
  usageCount: number;
  tags: string[];
  createdBy: { id: string; name: string } | null;
  _count: { deliverables: number };
  createdAt: string;
}

export default function BlueprintsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all",
  );
  const page = Number(searchParams.get("page") ?? 1);

  const fetchBlueprints = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (search) params.set("search", search);
    if (category && category !== "all") params.set("category", category);

    const res = await fetch(`/api/admin/blueprints?${params}`);
    const data = await res.json();
    setBlueprints(data.blueprints ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, search, category]);

  useEffect(() => {
    fetchBlueprints();
  }, [fetchBlueprints]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "all") params.set("category", category);
    router.push(`/admin/blueprints?${params}`);
  }

  return (
    <div>
      <PageHeader
        title="Blueprints"
        description={`${total} total`}
        actions={
          <Button onClick={() => router.push("/admin/blueprints/new")}>
            <Plus className="size-4 mr-1" /> New Blueprint
          </Button>
        }
      />

      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search blueprints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            router.push(`/admin/blueprints?category=${v === "all" ? "" : v}`);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
            <SelectItem value="workflow">Workflow</SelectItem>
            <SelectItem value="rag">RAG</SelectItem>
            <SelectItem value="full_system">Full System</SelectItem>
          </SelectContent>
        </Select>
      </form>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Tags</TableHead>
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
            ) : blueprints.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No blueprints found
                </TableCell>
              </TableRow>
            ) : (
              blueprints.map((bp) => (
                <TableRow
                  key={bp.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin/blueprints/${bp.id}`)}
                >
                  <TableCell className="font-medium">{bp.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{bp.category}</Badge>
                  </TableCell>
                  <TableCell>{bp.industry ?? "—"}</TableCell>
                  <TableCell>{bp.usageCount}x</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {bp.tags.slice(0, 3).map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(bp.createdAt).toLocaleDateString()}
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
