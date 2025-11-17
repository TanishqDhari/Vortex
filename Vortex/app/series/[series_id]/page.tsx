"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import Image from "next/image";
import { Play } from "lucide-react";
import { use } from "react";
import { useRouter } from "next/navigation";

export default function SeriesPage({
  params,
}: {
  params: Promise<{ series_id: string }>;
}) {
  const { series_id } = use(params);
  const router = useRouter();
  const [series, setSeries] = useState<any>(null);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      const seriesData = await fetch(`/api/series/${series_id}`).then((r) =>
        r.json()
      );
      const seasonData = await fetch(
        `/api/series/${series_id}/seasons`
      ).then((r) => r.json());
      setSeries(seriesData);
      setSeasons(seasonData);

      if (seasonData.length > 0) {
        setSelectedSeason(seasonData[0].season_no);
      }
    }
    load();
  }, [series_id]);

  useEffect(() => {
    if (!selectedSeason) return;

    async function loadEpisodes() {
      setLoading(true);

      const epData = await fetch(
        `/api/season/${series_id}/${selectedSeason}/episodes`
      ).then((r) => r.json());

      setEpisodes(epData);
      setLoading(false);
    }

    loadEpisodes();
  }, [selectedSeason, series_id]);

  if (!series) {
    return (
      <div className="flex items-center justify-center h-screen ml-16">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-white">
      <Sidebar />

      <main className="flex-1 ml-20">
        <div
          className="relative h-72 w-full"
          style={{
            // backgroundImage: `url(${series.cover})`,
            backgroundImage: `url("https://historicalnovelsociety.org/wp-content/uploads/2018/10/Shadow-District.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

          <div className="absolute bottom-5 left-8">
            <h1 className="text-4xl font-bold">{series.title}</h1>

            {selectedSeason && (
              <p className="opacity-80 pt-2">
                Season{" "}
                {seasons.find((s) => s.season_no === selectedSeason)?.season_no}
              </p>
            )}
          </div>
        </div>

        <div className="px-8 mt-6 mb-4 flex gap-4 overflow-x-auto">
          {seasons.map((s) => (
            <button
              key={s.season_no}
              onClick={() => setSelectedSeason(s.season_no)}
              className={`px-4 py-2 rounded-md text-sm font-semibold border ${
                selectedSeason === s.season_no
                  ? "bg-primary text-black border-primary"
                  : "bg-muted text-gray-300 hover:bg-muted/70"
              }`}
            >
              Season {s.season_no}
            </button>
          ))}
        </div>

        <div className="px-8 pb-20">
          <h2 className="text-2xl font-bold mb-4">Episodes</h2>

          {loading ? (
            <div className="text-muted-foreground">Loading episodes...</div>
          ) : episodes.length === 0 ? (
            <p className="text-muted-foreground">No episodes available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {episodes.map((e) => (
                <div
                  key={e.episode_id}
                  onClick={() => router.push(`/media/${e.episode_id}`)}
                  className="flex gap-4 bg-card p-4 rounded-lg cursor-pointer hover:bg-card/80 transition"
                >
                  <div className="relative w-40 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={e.image || "/placeholder.svg"}
                      fill
                      sizes="40vw"
                      alt="thumbnail"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      S {selectedSeason} &nbsp;&nbsp;E {e.episode_no || e.episode_id}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {e.synopsis || "No synopsis available."}
                    </p>

                    <p className="text-xs opacity-70 mt-1">{e.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
