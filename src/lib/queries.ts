import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

export type Broadcast = Database["public"]["Tables"]["broadcasts"]["Row"];
export type Destination = Database["public"]["Tables"]["destinations"]["Row"];
export type LibraryItem = Database["public"]["Tables"]["library_items"]["Row"];
export type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
export type AnalyticsEvent = Database["public"]["Tables"]["analytics_events"]["Row"];

async function getUserId() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("No autenticado");
  return data.user.id;
}

// ============ BROADCASTS ============
export function useBroadcasts() {
  return useQuery({
    queryKey: ["broadcasts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("broadcasts")
        .select("*")
        .order("scheduled_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateBroadcast() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Broadcast> & { title: string }) => {
      const owner_id = await getUserId();
      const { data, error } = await supabase
        .from("broadcasts")
        .insert({ ...input, owner_id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["broadcasts"] }),
  });
}

export function useDeleteBroadcast() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("broadcasts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["broadcasts"] }),
  });
}

// ============ DESTINATIONS ============
export function useDestinations() {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("destinations").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertDestination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { platform: string; display_name: string; connected: boolean; color?: string }) => {
      const owner_id = await getUserId();
      const { data, error } = await supabase
        .from("destinations")
        .upsert({ owner_id, ...input }, { onConflict: "owner_id,platform" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["destinations"] }),
  });
}

// ============ LIBRARY ============
export function useLibraryItems() {
  return useQuery({
    queryKey: ["library_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("library_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateLibraryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<LibraryItem> & { title: string }) => {
      const owner_id = await getUserId();
      const { data, error } = await supabase
        .from("library_items")
        .insert({ ...input, owner_id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["library_items"] }),
  });
}

// ============ TEAM ============
export function useTeamMembers() {
  return useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useInviteTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { invited_email: string; display_name?: string; role: Database["public"]["Enums"]["team_role"] }) => {
      const owner_id = await getUserId();
      const { data, error } = await supabase
        .from("team_members")
        .insert({ ...input, owner_id, status: "pending" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team_members"] }),
  });
}

export function useRemoveTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team_members"] }),
  });
}

// ============ ANALYTICS ============
export function useAnalyticsEvents(sinceDays = 30) {
  return useQuery({
    queryKey: ["analytics_events", sinceDays],
    queryFn: async () => {
      const since = new Date(Date.now() - sinceDays * 86400_000).toISOString();
      const { data, error } = await supabase
        .from("analytics_events")
        .select("*")
        .gte("occurred_at", since)
        .order("occurred_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

// ============ HELPERS ============
export function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
