"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatsCard } from "@/components/admin/StatsCard";
import { toast } from "sonner";

interface AgentMetric {
  id: string;
  latency: number | null;
  successRate: number | null;
  errorCount: number;
  rpm: number | null;
  uptime: number | null;
  recordedAt: string;
}

interface AgentDetail {
  id: string;
  name: string;
  type: string;
  status: "ok" | "degraded" | "failing" | "offline";
  description: string | null;
  config: Record<string, unknown> | null;
  companyId: string | null;
  clientId: string | null;
  company: { id: string; name: string } | null;
  client: { id: string; name: string } | null;
  metrics: AgentMetric[];
  createdAt: string;
}

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [editCompanyId, setEditCompanyId] = useState("none");
  const [editClientId, setEditClientId] = useState("none");

  useEffect(() => {
    fetch(`/api/admin/agents/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          toast.error("Agent not found");
          router.push("/admin/agents");
        } else {
          setAgent(data);
          setEditCompanyId(data.companyId ?? "none");
          setEditClientId(data.clientId ?? "none");
        }
        setLoading(false);
      });
  }, [id, router]);

  useEffect(() => {
    if (editing) {
      Promise.all([
        fetch("/api/admin/companies?limit=100").then((r) => r.json()),
        fetch("/api/admin/clients?limit=100").then((r) => r.json()),
      ]).then(([compData, clientData]) => {
        setCompanies(compData.companies ?? []);
        setClients(clientData.clients ?? []);
      });
    }
  }, [editing]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      description: (formData.get("description") as string) || undefined,
      companyId: editCompanyId !== "none" ? editCompanyId : null,
      clientId: editClientId !== "none" ? editClientId : null,
    };

    const res = await fetch(`/api/admin/agents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const updated = await res.json();
      setAgent((prev) => (prev ? { ...prev, ...updated } : prev));
      setEditing(false);
      toast.success("Agent updated");
    } else {
      toast.error("Failed to update agent");
    }
    setSaving(false);
  }

  async function handleDelete() {
    const res = await fetch(`/api/admin/agents/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Agent deleted");
      router.push("/admin/agents");
    } else {
      toast.error("Failed to delete agent");
    }
  }

  if (loading || !agent) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const latest = agent.metrics[0];

  return (
    <div>
      <PageHeader
        title={agent.name}
        description={`${agent.type} agent`}
        backHref="/admin/agents"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(!editing)}>
              <Pencil className="size-4 mr-2" />
              {editing ? "Cancel" : "Edit"}
            </Button>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Agent</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete &ldquo;{agent.name}&rdquo;?
                    All metrics data will also be deleted.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Metrics cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <StatsCard title="Status" value={agent.status.toUpperCase()} />
        <StatsCard
          title="Latency"
          value={
            latest?.latency != null ? `${latest.latency.toFixed(0)}ms` : "—"
          }
        />
        <StatsCard
          title="Success Rate"
          value={
            latest?.successRate != null
              ? `${latest.successRate.toFixed(1)}%`
              : "—"
          }
        />
        <StatsCard title="Errors" value={latest?.errorCount ?? "—"} />
        <StatsCard
          title="Uptime"
          value={latest?.uptime != null ? `${latest.uptime.toFixed(1)}%` : "—"}
        />
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="metrics">
            Metrics ({agent.metrics.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          {editing ? (
            <Card className="max-w-2xl">
              <CardContent className="pt-6">
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={agent.name}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select name="type" defaultValue={agent.type}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="audit">Audit</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" defaultValue={agent.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="offline">Offline</SelectItem>
                          <SelectItem value="ok">Healthy</SelectItem>
                          <SelectItem value="degraded">Degraded</SelectItem>
                          <SelectItem value="failing">Failing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Select
                        value={editCompanyId}
                        onValueChange={setEditCompanyId}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No company</SelectItem>
                          {companies.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Select
                      value={editClientId}
                      onValueChange={setEditClientId}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No client</SelectItem>
                        {clients.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={4}
                      defaultValue={agent.description ?? ""}
                    />
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-2xl">
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{agent.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge status={agent.status} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    {agent.company ? (
                      <Link
                        href={`/admin/companies/${agent.company.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {agent.company.name}
                      </Link>
                    ) : (
                      <p className="font-medium">—</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    {agent.client ? (
                      <Link
                        href={`/admin/clients/${agent.client.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {agent.client.name}
                      </Link>
                    ) : (
                      <p className="font-medium">—</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {agent.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm mt-1 whitespace-pre-wrap">
                      {agent.description}
                    </p>
                  </div>
                )}
                {agent.config && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Config</p>
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                      {JSON.stringify(agent.config, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics">
          {agent.metrics.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No metrics recorded yet
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Metrics History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2 pr-4">Recorded</th>
                        <th className="pb-2 pr-4">Latency</th>
                        <th className="pb-2 pr-4">Success</th>
                        <th className="pb-2 pr-4">Errors</th>
                        <th className="pb-2 pr-4">RPM</th>
                        <th className="pb-2">Uptime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agent.metrics.map((m) => (
                        <tr key={m.id} className="border-b last:border-0">
                          <td className="py-2 pr-4">
                            {new Date(m.recordedAt).toLocaleString()}
                          </td>
                          <td className="py-2 pr-4">
                            {m.latency != null
                              ? `${m.latency.toFixed(0)}ms`
                              : "—"}
                          </td>
                          <td className="py-2 pr-4">
                            {m.successRate != null
                              ? `${m.successRate.toFixed(1)}%`
                              : "—"}
                          </td>
                          <td className="py-2 pr-4">{m.errorCount}</td>
                          <td className="py-2 pr-4">
                            {m.rpm != null ? m.rpm.toFixed(1) : "—"}
                          </td>
                          <td className="py-2">
                            {m.uptime != null ? `${m.uptime.toFixed(1)}%` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
