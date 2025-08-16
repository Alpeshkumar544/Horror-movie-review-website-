
import { useMemo, useState } from "react"; import { motion } from "framer-motion"; import { Ghost, Film, Flame, Star, Sparkles, Search, Filter, ChevronRight, Moon, Sun } from "lucide-react"; import { Button } from "@/components/ui/button"; import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; import { Badge } from "@/components/ui/badge"; import { Input } from "@/components/ui/input"; import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; import { Switch } from "@/components/ui/switch";

// --- Dummy Data -------------------------------------------------------------- const GENRES = ["Psychological", "Supernatural", "Slasher", "Found Footage", "Folk Horror", "Creature Feature", "Zombie", "Gothic"];

const MOVIES = [ { id: 1, title: "Whispers in the Attic", year: 2024, genre: "Supernatural", poster: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop", criticScore: 84, userScore: 78, tags: ["Haunted House", "Slow Burn", "Atmospheric"], blurb: "When a family inherits a creaking mansion, a child's whisper becomes a warning none should ignore.", }, { id: 2, title: "Static", year: 2023, genre: "Found Footage", poster: "https://images.unsplash.com/photo-1486693326701-1ea358b19e1d?q=80&w=1200&auto=format&fit=crop", criticScore: 72, userScore: 81, tags: ["Analog Horror", "VHS", "Cult"], blurb: "A college crew documents dead air after midnight and tunes into something that answers back.", }, { id: 3, title: "Pale Harvest", year: 2022, genre: "Folk Horror", poster: "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=1200&auto=format&fit=crop", criticScore: 90, userScore: 86, tags: ["Ritual", "Rural", "Wicker"], blurb: "A village celebrates the season with a ritual no outsider survives to describe.", }, { id: 4, title: "Nine Cuts", year: 2025, genre: "Slasher", poster: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1200&auto=format&fit=crop", criticScore: 61, userScore: 74, tags: ["Neo-Slasher", "Practical FX", "Camp"], blurb: "An editor discovers frames spliced into her film that predict real murders—hers is the final cut.", }, ];

// --- Utility ----------------------------------------------------------------
// Enhanced helper: flattens nested arrays, removes falsy/empty/whitespace-only entries to avoid rendering accidental blanks.
const cx = (...classes) =>
  classes
    .flat(Infinity) // allow nested arrays of class names
    .filter((cls) => typeof cls === "string" && cls.trim())
    .join(" ");

function ScorePill({ label, score, icon: Icon }) { const tone = score >= 80 ? "bg-green-500/20 text-green-300 border-green-600/40" : score >= 60 ? "bg-yellow-500/20 text-yellow-200 border-yellow-600/40" : "bg-red-500/20 text-red-200 border-red-600/40"; return ( <div className={cx("flex items-center gap-1 rounded-full border px-2 py-1 text-xs", tone)}> <Icon className="h-3.5 w-3.5" /> <span className="font-medium">{label} {score}</span> </div> ); }

function Poster({ src, alt }) { return ( <div className="relative aspect-[3/4] overflow-hidden rounded-xl"> <img src={src} alt={alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" /> </div> ); }

function NeonDivider() { return <div className="h-px w-full bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />; }

// --- Component --------------------------------------------------------------- export default function HorrorReviewLanding() { const [query, setQuery] = useState(""); const [genre, setGenre] = useState("all"); const [sort, setSort] = useState("trending"); const [dark, setDark] = useState(true); const [spoilerSafe, setSpoilerSafe] = useState(true);

// Movies matching user-selected filters/search
const filtered = useMemo(() => {
  let list = MOVIES.filter((m) => (genre === "all" ? true : m.genre === genre));

  const search = query.trim().toLowerCase();
  if (search) {
    list = list.filter(
      (m) =>
        m.title.toLowerCase().includes(search) ||
        m.tags.some((t) => t.toLowerCase().includes(search))
    );
  }

  switch (sort) {
    case "critic":
      list = [...list].sort((a, b) => b.criticScore - a.criticScore);
      break;
    case "user":
      list = [...list].sort((a, b) => b.userScore - a.userScore);
      break;
    case "new":
      list = [...list].sort((a, b) => b.year - a.year);
      break;
    default:
      list = [...list];
  }

  return list;
  // MOVIES is a stable constant but added for future flexibility
}, [query, genre, sort, MOVIES]);

// Dedicated trending list (top 3 by average of critic & user scores)
const trending = useMemo(
  () =>
    [...MOVIES]
      .sort(
        (a, b) =>
          (b.criticScore + b.userScore) / 2 - (a.criticScore + a.userScore) / 2
      )
      .slice(0, 3),
  []
);

return ( <div className={cx("min-h-screen font-sans antialiased", dark ? "dark" : "")}> <div className="relative isolate overflow-hidden bg-[#0a0a0a] text-zinc-200"> {/* Neon fog bg */} <div className="pointer-events-none absolute inset-0 -z-10"> <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" /> <div className="absolute bottom-0 right-1/4 h-[28rem] w-[28rem] rounded-full bg-indigo-600/20 blur-3xl" /> <div className="absolute -left-24 top-32 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" /> <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.08),transparent_60%)]" /> </div>

{/* Navbar */}
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <Ghost className="h-6 w-6 text-fuchsia-400" />
          <span className="text-lg font-black tracking-wide">NightScreams</span>
          <Badge className="ml-2 bg-fuchsia-600/20 text-fuchsia-300">Reviews</Badge>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {[
            { label: "Home", icon: Film },
            { label: "Reviews", icon: Star },
            { label: "Lists", icon: Flame },
            { label: "Trailers", icon: Sparkles },
          ].map(({ label, icon: Icon }) => (
            <a key={label} href="#" className="group inline-flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white">
              <Icon className="h-4 w-4 opacity-70 transition group-hover:opacity-100" />
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Switch checked={dark} onCheckedChange={setDark} aria-label="Toggle dark mode" />
          <span className="sr-only">Toggle theme</span>
          <Button variant="secondary" className="rounded-2xl">Sign In</Button>
        </div>
      </div>
      <NeonDivider />
    </header>

    {/* Hero */}
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-10 pt-12 md:grid-cols-2">
      <div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl font-extrabold tracking-tight md:text-6xl">
          Fear, Rated.
        </motion.h1>
        <p className="mt-4 max-w-prose text-zinc-300 md:text-lg">
          Discover brutally honest horror reviews, spoiler-safe summaries, and curated scare scores. From cult VHS nasties to prestige nightmares.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button className="rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-500">
            Browse Reviews
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="outline" className="rounded-2xl border-fuchsia-600/40 bg-black/20 text-zinc-200 hover:bg-black/40">
            Write a Review
          </Button>
        </div>

        {/* Search + Filters */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, directors, or tags…"
                className="pl-9"
              />
            </div>
          </div>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {GENRES.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="critic">Critic Score</SelectItem>
              <SelectItem value="user">User Score</SelectItem>
              <SelectItem value="new">Newest</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between gap-2 rounded-2xl border border-fuchsia-600/30 bg-black/30 p-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 opacity-70" />
              <span className="text-sm">Spoiler-safe</span>
            </div>
            <Switch checked={spoilerSafe} onCheckedChange={setSpoilerSafe} />
          </div>
        </div>
      </div>

      {/* Feature Highlight */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative">
        <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-fuchsia-600/20 to-indigo-600/20 blur-xl" />
        <Card className="overflow-hidden rounded-3xl border-fuchsia-500/30 bg-zinc-900/60 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Flame className="h-5 w-5 text-fuchsia-400" /> Trending This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {trending.map((m) => (
                <div key={m.id} className="group">
                  <div className="relative">
                    <Poster src={m.poster} alt={m.title} />
                    <div className="absolute bottom-2 left-2 flex gap-2">
                      <ScorePill label="Critic" score={m.criticScore} icon={Star} />
                      <ScorePill label="User" score={m.userScore} icon={Sparkles} />
                    </div>
                  </div>
                  <div className="mt-2 text-sm font-semibold">{m.title}</div>
                  <div className="text-xs text-zinc-400">{m.genre} • {m.year}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>

    {/* Content Grid */}
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Latest Reviews</h2>
        <a href="#" className="text-sm text-fuchsia-300 hover:text-fuchsia-200">See all</a>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((m) => (
          <motion.div key={m.id} whileHover={{ y: -4 }} className="group">
            <Card className="overflow-hidden rounded-3xl border-fuchsia-500/20 bg-zinc-900/60">
              <div className="relative">
                <Poster src={m.poster} alt={m.title} />
                <div className="absolute right-2 top-2 flex gap-2">
                  <ScorePill label="Critic" score={m.criticScore} icon={Star} />
                  <ScorePill label="User" score={m.userScore} icon={Sparkles} />
                </div>
              </div>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold leading-tight">{m.title}</h3>
                    <p className="text-xs text-zinc-400">{m.genre} • {m.year}</p>
                  </div>
                  <Button variant="ghost" className="rounded-xl text-fuchsia-300 hover:text-fuchsia-100">
                    Read <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <p className="line-clamp-3 text-sm text-zinc-300">
                  {m.blurb}
                </p>
                <div className="flex flex-wrap gap-2">
                  {m.tags.map((t) => (
                    <Badge key={t} variant="outline" className="border-fuchsia-600/30 text-xs text-zinc-300">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Callouts */}
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 md:grid-cols-3">
      {[{
        title: "Curated Lists",
        desc: "Top 10 Cozy Chills • Best Folk Horror • Underrated 2000s Slashers",
        icon: <Film className="h-5 w-5" />
      },{
        title: "No-Spoiler Summaries",
        desc: "Get the vibe, not the twist. Toggle spoilers only when you’re ready.",
        icon: <Ghost className="h-5 w-5" />
      },{
        title: "Community Ratings",
        desc: "Critic vs. Audience scores to help you pick tonight’s scare.",
        icon: <Star className="h-5 w-5" />
      }].map((c) => (
        <Card key={c.title} className="rounded-3xl border-fuchsia-500/20 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">{c.icon} {c.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-300">{c.desc}</CardContent>
        </Card>
      ))}
    </section>

    {/* Newsletter */}
    <section className="mx-auto max-w-3xl px-4 pb-20">
      <Card className="rounded-3xl border-fuchsia-500/30 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40">
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold">Join the Midnight Mailing List</h3>
              <p className="mt-1 text-sm text-zinc-300">Weekly picks, trailers, and hidden gems—no spam, just scares.</p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <Input placeholder="your@email.com" className="" />
              <Button className="rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-500">Subscribe</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    {/* Footer */}
    <footer className="border-t border-fuchsia-600/20 bg-black/30">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <Ghost className="h-5 w-5 text-fuchsia-400" />
            <span className="font-black">NightScreams</span>
          </div>
          <p className="mt-3 text-sm text-zinc-400">A modern horror hub with tasteful gore and zero spoilers by default.</p>
        </div>
        <div>
          <div className="font-semibold">Explore</div>
          <ul className="mt-2 space-y-1 text-sm text-zinc-300">
            <li><a href="#" className="hover:text-white">About</a></li>
            <li><a href="#" className="hover:text-white">Advertise</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Follow</div>
          <ul className="mt-2 space-y-1 text-sm text-zinc-300">
            <li><a href="#" className="hover:text-white">YouTube</a></li>
            <li><a href="#" className="hover:text-white">Instagram</a></li>
            <li><a href="#" className="hover:text-white">X (Twitter)</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-fuchsia-600/10 py-6 text-center text-xs text-zinc-500">© {new Date().getFullYear()} NightScreams. Stay spooky.</div>
    </footer>
  </div>
</div>

); }

