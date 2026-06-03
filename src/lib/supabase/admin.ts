import { createClient } from "@supabase/supabase-js";
import { getChannelName } from "@/lib/game/realtime";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function broadcastToGame(
  roomCode: string,
  event: string,
  payload: Record<string, unknown>
): Promise<void> {
  const supabase = createAdminClient();
  const channel = supabase.channel(getChannelName(roomCode));

  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      void supabase.removeChannel(channel);
      resolve();
    }, 3000);

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        clearTimeout(timer);
        void channel
          .send({ type: "broadcast", event, payload })
          .then(() => { void supabase.removeChannel(channel); resolve(); })
          .catch(() => { void supabase.removeChannel(channel); resolve(); });
      }
    });
  });
}
