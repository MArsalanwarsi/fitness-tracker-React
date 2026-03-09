import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboard,
  updateGoals,
  updateMood,
  updateBmi,
  updateWaterGlasses,
  logActivity,
  deleteActivityLog,
  deleteWorkout,
  clearDashboardError,
  setWaterGlassesLocal,
  setMoodLocal,
  selectDashboardLoading,
  selectDashboardError,
  selectUserName,
  selectGoals,
  selectWeeklyStats,
  selectMacros,
  selectBmi,
  selectWaterGlasses,
  selectMood,
  selectStreak,
  selectActivityLogs,
  selectWorkouts,
  selectTodayStats,
  selectBmiValue,
  selectOverallPct,
  selectCaloriesLeft,
  selectWeightDelta,
  selectTotalWorkoutCalories,
  selectTotalWorkoutMinutes,
  selectTodayIndex,
} from "../../redux/slice/dashboardslice";
import { fetchUserExcersises } from "../../redux/slice/excersiseSlice";
import { createSelector } from "@reduxjs/toolkit";

const selectExercises = createSelector(
  (state) => state.excersise,
  (ex) => ex?.userExcersises ?? []
);
import {
  Flame, Footprints, Droplets, Moon, Target, Trash2,
  History, Smile, Frown, Meh, GlassWater, Utensils,
  TrendingUp, TrendingDown, Dumbbell, Scale,
  Activity, Zap, Award, BarChart2, Loader2, Search, ChevronDown, Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  BarChart, Bar, Cell, XAxis, ResponsiveContainer, Tooltip,
  CartesianGrid, AreaChart, Area,
} from "recharts";
import { toast } from "react-toastify";
import logo from "../../assets/logo/Logo_Mark.png";

// ── constants ─────────────────────────────────────────────────────────────────
const VIZ = {
  water: "#3b82f6", calories: "#f97316", steps: "#10b981",
  sleep: "#8b5cf6", weight: "#10b981", protein: "#f97316",
  carbs: "#3b82f6", fat: "#8b5cf6", red: "#ef4444",
};
const TYPE_COLOR = {
  Water: VIZ.water, Steps: VIZ.steps, Calories: VIZ.calories,
  Sleep: VIZ.sleep, Workout: VIZ.red, Weight: VIZ.weight,
};
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const UNIT_LABEL = { water: "Litres", calories: "kcal", steps: "steps", sleep: "hours", weight: "kg" };
const pct = (v, t) => Math.min(Math.round((v / t) * 100), 100);

// ── scoped styles ─────────────────────────────────────────────────────────────
const ScopedStyles = () => (
  <style>{`
    @keyframes ring-draw { from { stroke-dashoffset: 502; } }
    .fit-ring circle:last-child { animation: ring-draw .8s ease forwards; }
    @keyframes fit-pop { from { opacity:0; transform:scale(.95) translateY(5px); } }
    .fit-pop { animation: fit-pop .18s ease; }
    .fit-glass {
      width:2rem; height:2.5rem;
      border:2px solid ${VIZ.water}; border-radius:.25rem .25rem .5rem .5rem;
      display:flex; align-items:flex-end; overflow:hidden; cursor:pointer; transition:transform .15s;
    }
    .fit-glass:hover { transform:scale(1.1); }
    .fit-glass-fill { width:100%; transition:height .3s; background:${VIZ.water}; opacity:.8; }
    .fit-del { color:hsl(var(--muted-foreground)); transition:color .15s; background:none; border:none; cursor:pointer; padding:.2rem; border-radius:.35rem; display:flex; align-items:center; }
    .fit-del:hover { color:${VIZ.red}; }
    .fit-card-hover { transition:transform .2s; }
    .fit-card-hover:hover { transform:translateY(-2px); }
    .fit-log-row { transition:background .12s; }
    .fit-log-row:hover { background:hsl(var(--muted)/0.5); }
    :root { --recharts-tick: #6b7280; }
    .dark { --recharts-tick: #9ca3af; }
  `}</style>
);

// ── shared components ─────────────────────────────────────────────────────────
const useChartColors = () => {
  const [colors, setColors] = useState({ bg: "#fff", border: "#e5e7eb", text: "#111827", muted: "#6b7280", tickFill: "#6b7280" });
  useEffect(() => {
    const el = document.documentElement;
    const s = getComputedStyle(el);
    const isDark = el.classList.contains("dark");
    setColors({
      bg: isDark ? "#1f2937" : "#ffffff",
      border: isDark ? "#374151" : "#e5e7eb",
      text: isDark ? "#f9fafb" : "#111827",
      muted: isDark ? "#9ca3af" : "#6b7280",
      tickFill: isDark ? "#9ca3af" : "#6b7280",
    });
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setColors({
        bg: dark ? "#1f2937" : "#ffffff",
        border: dark ? "#374151" : "#e5e7eb",
        text: dark ? "#f9fafb" : "#111827",
        muted: dark ? "#9ca3af" : "#6b7280",
        tickFill: dark ? "#9ca3af" : "#6b7280",
      });
    });
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return colors;
};

const ChartTooltip = ({ active, payload, label, unit = "" }) => {
  const c = useChartColors();
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "6px 12px", boxShadow: "0 4px 12px rgba(0,0,0,.15)" }}>
      <p style={{ color: c.muted, fontSize: 11, fontWeight: 600, marginBottom: 2 }}>{label}</p>
      <p style={{ color: c.text, fontSize: 13, fontWeight: 700 }}>{payload[0].value?.toLocaleString()} {unit}</p>
    </div>
  );
};

const Ring = ({ value, size = 120, stroke = 9, color, children }) => {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const off = circ - (circ * Math.min(value, 100)) / 100;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="fit-ring" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .8s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">{children}</div>
    </div>
  );
};

const MacroRow = ({ label, val, target, color, extra }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {extra && <span className="text-muted-foreground">{extra}</span>}
        <span className="font-bold" style={{ color }}>
          {val}g <span className="text-muted-foreground font-normal">/ {target}g</span>
        </span>
      </div>
    </div>
    <div className="h-1.5 rounded-full overflow-hidden bg-muted">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct(val, target)}%`, background: color }} />
    </div>
  </div>
);

const MetricTile = ({ icon, label, value, sub, pct: p, color }) => (
  <Card className="fit-card-hover">
    <CardContent className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, color }}>{icon}</div>
        <span className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: p >= 100 ? VIZ.steps : "hsl(var(--muted-foreground))" }}>{p}%</span>
      </div>
      <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-0.5">{label}</p>
      <p className="text-2xl font-black leading-none mb-0.5" style={{ color }}>{value}</p>
      <p className="text-xs text-muted-foreground mb-3">{sub}</p>
      <div className="h-1.5 rounded-full overflow-hidden bg-muted">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p}%`, background: color }} />
      </div>
    </CardContent>
  </Card>
);

// ── dialogs ───────────────────────────────────────────────────────────────────
// ── WorkoutLogDialog — picks from saved exercises ────────────────────────────
const WorkoutLogDialog = ({ onSave, loading }) => {
  const dispatch = useDispatch();
  const exercises = useSelector(selectExercises);
  const exLoading = useSelector((state) => state.excersise?.loading ?? false);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    if (open) dispatch(fetchUserExcersises());
  }, [open, dispatch]);

  const filtered = search.trim()
    ? exercises.filter((ex) => ex.name?.toLowerCase().includes(search.toLowerCase()))
    : exercises;

  const handleSelect = (ex) => {
    setSelected(ex);
    setSearch(ex.name);
    setDropOpen(false);
    if (duration) setCalories(String(Math.round(parseFloat(duration) * 6)));
  };

  const handleDurationChange = (val) => {
    setDuration(val);
    if (selected && val) setCalories(String(Math.round(parseFloat(val) * 6)));
  };

  const reset = () => {
    setSelected(null); setSearch(""); setDuration(""); setCalories(""); setDropOpen(false);
  };

  const submit = () => {
    const dur = parseFloat(duration);
    if (!selected || !dur || isNaN(dur)) return;
    const cal = parseFloat(calories) || Math.round(dur * 6);
    onSave("workout", dur, selected.name, cal);
    reset(); setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs">Workout</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Dumbbell size={16} /> Log Workout</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Exercise</Label>

            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between gap-2 border rounded-md px-3 h-9 bg-background text-sm hover:bg-muted/40 transition-colors"
                onClick={() => setDropOpen((p) => !p)}
              >
                <span className={selected ? "font-semibold" : "text-muted-foreground"}>
                  {selected ? selected.name : "Select an exercise…"}
                </span>
                {exLoading
                  ? <Loader2 size={14} className="animate-spin text-muted-foreground shrink-0" />
                  : <ChevronDown size={14} className="text-muted-foreground shrink-0" />
                }
              </button>

              {dropOpen && (
                <div className="absolute z-50 top-full mt-1 w-full rounded-xl border shadow-lg bg-card overflow-hidden">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search size={13} className="absolute left-2.5 top-2 text-muted-foreground" />
                      <Input
                        autoFocus
                        className="pl-7 h-8 text-sm"
                        placeholder="Search exercises…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {filtered.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-5">
                        {exercises.length === 0 ? "No exercises saved yet" : "No matches"}
                      </p>
                    )}
                    {filtered.map((ex) => (
                      <button
                        key={ex._id}
                        type="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/60 transition-colors border-b last:border-0"
                        onClick={() => handleSelect(ex)}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${VIZ.red}18` }}>
                          <Dumbbell size={12} style={{ color: VIZ.red }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{ex.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {ex.category?.name ?? ex.category ?? ""}{ex.difficulty ? ` · ${ex.difficulty}` : ""}
                          </p>
                        </div>
                        {selected?._id === ex._id && <Check size={14} className="text-primary shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selected && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-muted/40">
                <Dumbbell size={13} style={{ color: VIZ.red }} />
                <span className="text-sm font-semibold flex-1 truncate">{selected.name}</span>
                {selected.difficulty && (
                  <Badge variant="secondary" className="text-[10px] shrink-0">{selected.difficulty}</Badge>
                )}
                <button className="fit-del" onClick={() => { setSelected(null); setSearch(""); }}>
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Duration (min)</Label>
              <Input type="number" min="1" placeholder="30"
                value={duration} onChange={(e) => handleDurationChange(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Calories (kcal)</Label>
              <Input type="number" min="0" placeholder="Auto"
                value={calories} onChange={(e) => setCalories(e.target.value)} />
            </div>
          </div>

          {selected && duration && (
            <div className="rounded-xl bg-muted/40 border px-3 py-2.5 flex items-center justify-between">
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Exercise</p>
                <p className="text-xs font-black truncate max-w-[90px]">{selected.name}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Duration</p>
                <p className="text-sm font-black" style={{ color: VIZ.steps }}>{duration} min</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Calories</p>
                <p className="text-sm font-black" style={{ color: VIZ.calories }}>
                  {calories || Math.round(parseFloat(duration) * 6)} kcal
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button variant="ghost" onClick={() => { reset(); setOpen(false); }}>Cancel</Button>
          <Button className="gap-1.5 font-semibold" onClick={submit}
            disabled={loading || !selected || !duration}>
            {loading && <Loader2 size={14} className="animate-spin" />}
            Log Workout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Generic LogDialog (water / steps / calories / sleep / weight) ─────────────
const LogDialog = ({ type, onSave, loading }) => {
  const [val, setVal] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const submit = () => {
    const n = parseFloat(val);
    if (!val || isNaN(n)) return;
    onSave(type, n, note); setVal(""); setNote(""); setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full gap-1.5 capitalize text-xs">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-100">
        <DialogHeader><DialogTitle>Log {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle></DialogHeader>
        <div className="space-y-3 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Amount ({UNIT_LABEL[type] ?? "min"})
            </Label>
            <Input type="number" placeholder="0.0" value={val}
              onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Note (optional)</Label>
            <Input placeholder="e.g. Breakfast, Morning jog…" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="pt-2">
          <Button className="w-full font-semibold" onClick={submit} disabled={loading}>
            {loading && <Loader2 size={14} className="animate-spin mr-1" />} Record Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const GoalsDialog = ({ goals, onSave, loading }) => {
  const [inputs, setInputs] = useState({ ...goals });
  const [open, setOpen] = useState(false);
  useEffect(() => { setInputs({ ...goals }); }, [goals]);
  const fields = [
    { k: "water", label: "Water (L)" },
    { k: "calories", label: "Calories (kcal)" },
    { k: "steps", label: "Steps" },
    { k: "sleep", label: "Sleep (h)" },
    { k: "protein", label: "Protein (g)" },
    { k: "carbs", label: "Carbs (g)" },
    { k: "fat", label: "Fat (g)" },
  ];
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5"><Target size={14} /> Goals</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-115">
        <DialogHeader><DialogTitle>Configure Daily Goals</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3 pt-1">
          {fields.map(({ k, label }) => (
            <div key={k} className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">{label}</Label>
              <Input type="number" value={inputs[k]}
                onChange={(e) => setInputs((g) => ({ ...g, [k]: parseFloat(e.target.value) || 0 }))} />
            </div>
          ))}
        </div>
        <DialogFooter className="pt-3">
          <Button className="w-full font-semibold" disabled={loading}
            onClick={() => { onSave(inputs); setOpen(false); }}>
            {loading && <Loader2 size={14} className="animate-spin mr-1" />} Save Goals
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BmiDialog = ({ bmi, onSave, loading }) => {
  const [inputs, setInputs] = useState({ ...bmi });
  const [open, setOpen] = useState(false);
  useEffect(() => { setInputs({ ...bmi }); }, [bmi]);
  const calc = inputs.height > 0 ? +(inputs.weight / ((inputs.height / 100) ** 2)).toFixed(1) : null;
  const lbl = !calc ? "" : calc < 18.5 ? "Underweight" : calc < 25 ? "Normal" : calc < 30 ? "Overweight" : "Obese";
  const col = !calc ? VIZ.steps : calc < 18.5 ? VIZ.water : calc < 25 ? VIZ.steps : calc < 30 ? "#f59e0b" : VIZ.red;
  const needle = calc ? Math.min(((calc - 15) / 25) * 100, 100) : 0;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5"><Scale size={14} /> BMI</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-95">
        <DialogHeader><DialogTitle>BMI Calculator</DialogTitle></DialogHeader>
        <div className="space-y-3 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Height (cm)</Label>
            <Input type="number" value={inputs.height}
              onChange={(e) => setInputs((b) => ({ ...b, height: parseFloat(e.target.value) || 0 }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Weight (kg)</Label>
            <Input type="number" value={inputs.weight}
              onChange={(e) => setInputs((b) => ({ ...b, weight: parseFloat(e.target.value) || 0 }))} />
          </div>
          {calc && (
            <div className="rounded-xl bg-muted/50 p-4 text-center space-y-1 fit-pop">
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Your BMI</p>
              <p className="text-4xl font-black" style={{ color: col }}>{calc}</p>
              <p className="text-sm font-semibold" style={{ color: col }}>{lbl}</p>
              <div className="relative h-2.5 rounded-full overflow-hidden mt-2"
                style={{ background: "linear-gradient(to right,#3b82f6,#10b981,#f59e0b,#f97316,#ef4444)" }}>
                <div className="absolute top-1/2 w-0.5 h-4 bg-white rounded shadow"
                  style={{ left: `${needle}%`, transform: "translateX(-50%) translateY(-50%)" }} />
              </div>
              <div className="flex justify-between mt-0.5">
                {["16", "18.5", "25", "30", "40"].map((v) => (
                  <span key={v} className="text-[10px] text-muted-foreground">{v}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="pt-2">
          <Button className="w-full font-semibold" disabled={loading}
            onClick={() => { onSave(inputs); setOpen(false); }}>
            {loading && <Loader2 size={14} className="animate-spin mr-1" />} Update Stats
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function Home() {
  const dispatch = useDispatch();

  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);
  const name = useSelector(selectUserName);
  const goals = useSelector(selectGoals);
  const weeklyStats = useSelector(selectWeeklyStats);
  const macros = useSelector(selectMacros);
  const bmi = useSelector(selectBmi);
  const waterGlasses = useSelector(selectWaterGlasses);
  const mood = useSelector(selectMood);
  const streak = useSelector(selectStreak);
  const activityLogs = useSelector(selectActivityLogs);
  const workouts = useSelector(selectWorkouts);
  const today = useSelector(selectTodayStats);
  const bmiVal = useSelector(selectBmiValue);
  const overallPct = useSelector(selectOverallPct);
  const caloriesLeft = useSelector(selectCaloriesLeft);
  const weightDelta = useSelector(selectWeightDelta);
  const totalWCal = useSelector(selectTotalWorkoutCalories);
  const totalWMin = useSelector(selectTotalWorkoutMinutes);
  const todayIndex = useSelector(selectTodayIndex);

  const [chartTab, setChartTab] = useState("calories");
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);
  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearDashboardError()); }
  }, [error, dispatch]);

  // derived
  const bmiLabel = !bmiVal ? "" : bmiVal < 18.5 ? "Underweight" : bmiVal < 25 ? "Normal" : bmiVal < 30 ? "Overweight" : "Obese";
  const bmiColor = !bmiVal ? VIZ.steps : bmiVal < 18.5 ? VIZ.water : bmiVal < 25 ? VIZ.steps : bmiVal < 30 ? "#f59e0b" : VIZ.red;
  const bmiNeedle = bmiVal ? Math.min(((bmiVal - 15) / 25) * 100, 100) : 0;
  const macroTotal = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;
  const initials = name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = DAY_LABELS.map((n, i) => ({
    name: n,
    isToday: i === todayIndex,
    val: chartTab === "water" ? weeklyStats.water[i]
      : chartTab === "steps" ? weeklyStats.steps[i]
        : chartTab === "sleep" ? weeklyStats.sleep[i]
          : weeklyStats.calories[i],
  }));
  const chartColor = { calories: VIZ.calories, water: VIZ.water, steps: VIZ.steps, sleep: VIZ.sleep }[chartTab];
  const chartUnit = { calories: "kcal", water: "L", steps: "steps", sleep: "h" }[chartTab];

  // handlers
  const handleLog = (type, value, note, caloriesOverride) =>
    dispatch(logActivity({ type, value, note, caloriesOverride }))
      .unwrap()
      .then(() => toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} logged!`))
      .catch(toast.error);

  const handleGoals = (g) => dispatch(updateGoals(g)).unwrap().then(() => toast.success("Goals saved!")).catch(toast.error);
  const handleBmi = (b) => dispatch(updateBmi(b)).unwrap().then(() => toast.success("Stats updated!")).catch(toast.error);
  const handleMood = (m) => { dispatch(setMoodLocal(m)); dispatch(updateMood(m)); };
  const handleGlass = (i) => { dispatch(setWaterGlassesLocal(i + 1)); dispatch(updateWaterGlasses(i + 1)); };
  const handleDelLog = (id) => dispatch(deleteActivityLog(id)).unwrap().then(() => toast.info("Entry removed")).catch(toast.error);
  const handleDelWkt = (id) => dispatch(deleteWorkout(id)).unwrap().then(() => toast.info("Workout removed")).catch(toast.error);

  if (loading && !name) {
    return (
      <div className="bg-background flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-sm font-semibold">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScopedStyles />
      <div className="bg-background text-foreground p-4 md:p-6 space-y-6">

        {/* Header */}
        <header className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              {/* <Activity size={20} className="text-primary-foreground" /> */}

              <img src={logo} alt="Fitness Tracker Logo" className="h-10 w-10 object-contain invert" />

            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">Fitness Tracker</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Health Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              </TabsList>
            </Tabs>
            <GoalsDialog goals={goals} onSave={handleGoals} loading={loading} />
            <BmiDialog bmi={bmi} onSave={handleBmi} loading={loading} />
            <div className="flex items-center gap-2 border rounded-full pl-1 pr-3 py-1 bg-card">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-black text-primary-foreground">
                {initials}
              </div>
              <span className="text-sm font-semibold">{name || "User"}</span>
            </div>
          </div>
        </header>

        {/* ── Dashboard ── */}
        {activeSection === "dashboard" && (
          <div className="space-y-5">
            {/* Quick log */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mr-1">Quick Log:</span>
              {["water", "steps", "calories", "sleep", "weight"].map((t) => (
                <LogDialog key={t} type={t} onSave={handleLog} loading={loading} />
              ))}
              <WorkoutLogDialog onSave={handleLog} loading={loading} />
            </div>

            {/* Metric tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricTile icon={<Droplets size={17} />} label="Hydration" value={`${today.water}L`} sub={`/ ${goals.water}L`} pct={pct(today.water, goals.water)} color={VIZ.water} />
              <MetricTile icon={<Flame size={17} />} label="Calories" value={today.calories.toLocaleString()} sub={`/ ${goals.calories.toLocaleString()} kcal`} pct={pct(today.calories, goals.calories)} color={VIZ.calories} />
              <MetricTile icon={<Footprints size={17} />} label="Steps" value={today.steps.toLocaleString()} sub={`/ ${goals.steps.toLocaleString()}`} pct={pct(today.steps, goals.steps)} color={VIZ.steps} />
              <MetricTile icon={<Moon size={17} />} label="Sleep" value={`${today.sleep}h`} sub={`/ ${goals.sleep}h`} pct={pct(today.sleep, goals.sleep)} color={VIZ.sleep} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_316px] gap-5">
              <div className="space-y-5">

                {/* Activity chart */}
                <Card>
                  <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base flex items-center gap-2"><BarChart2 size={15} /> Activity Trends</CardTitle>
                    <Tabs value={chartTab} onValueChange={setChartTab}>
                      <TabsList className="h-8">
                        {["calories", "water", "steps", "sleep"].map((t) => (
                          <TabsTrigger key={t} value={t} className="text-xs px-3 capitalize">{t}</TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent className="h-56 pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barSize={26}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false}
                          tick={{ fill: "var(--recharts-tick, #6b7280)", fontSize: 11 }} dy={8} />
                        <Tooltip content={<ChartTooltip unit={chartUnit} />} cursor={{ fill: "hsl(var(--muted))", radius: 6 }} />
                        <Bar dataKey="val" radius={[5, 5, 0, 0]}>
                          {chartData.map((entry, i) => (
                            <Cell key={i}
                              fill={entry.isToday ? chartColor : `${chartColor}70`}
                              stroke={entry.isToday ? chartColor : "none"}
                              strokeWidth={entry.isToday ? 1.5 : 0}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Weight trend */}
                <Card>
                  <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base flex items-center gap-2"><TrendingDown size={15} /> Weight Trend</CardTitle>
                    <Badge variant="secondary" className="text-xs gap-1">
                      {weightDelta <= 0
                        ? <TrendingDown size={10} style={{ color: VIZ.steps }} />
                        : <TrendingUp size={10} style={{ color: VIZ.red }} />}
                      {weightDelta > 0 ? "+" : ""}{weightDelta} kg this week
                    </Badge>
                  </CardHeader>
                  <CardContent className="h-40 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={DAYS.map((name, i) => ({ name, val: weeklyStats.weight[i] }))}>
                        <defs>
                          <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={VIZ.weight} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={VIZ.weight} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false}
                          tick={{ fill: "var(--recharts-tick, #6b7280)", fontSize: 10 }} dy={6} />
                        <Tooltip content={<ChartTooltip unit="kg" />} />
                        <Area type="monotone" dataKey="val" stroke={VIZ.weight} strokeWidth={2.5}
                          fill="url(#wGrad)" dot={{ r: 3, fill: VIZ.weight, strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Activity log */}
                <Card>
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <History size={14} /> Today's Log
                      <span className="ml-auto text-xs text-muted-foreground font-normal">{activityLogs.length} entries</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {activityLogs.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">No entries yet — log something above!</p>
                    )}
                    {activityLogs.slice(0, 6).map((log) => (
                      <div key={log._id} className="fit-log-row flex items-center gap-3 px-4 py-3 border-b last:border-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black"
                          style={{ background: `${TYPE_COLOR[log.type] ?? "#888"}18`, color: TYPE_COLOR[log.type] ?? "#888" }}>
                          {log.type.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-none">{log.type}</p>
                          {log.note && <p className="text-xs text-muted-foreground mt-0.5 truncate">{log.note}</p>}
                        </div>
                        <Badge variant="secondary" className="text-xs font-semibold shrink-0"
                          style={{ background: `${TYPE_COLOR[log.type] ?? "#888"}14`, color: TYPE_COLOR[log.type] ?? "#888" }}>
                          {log.amount}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground font-mono shrink-0">{log.time}</span>
                        <button className="fit-del" onClick={() => handleDelLog(log._id)}><Trash2 size={13} /></button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">

                {/* Overall ring */}
                <Card>
                  <CardContent className="pt-6 flex flex-col items-center gap-4">
                    <Ring value={overallPct} size={136} stroke={11} color="hsl(var(--primary))">
                      <p className="text-3xl font-black leading-none">{overallPct}%</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Daily Goal</p>
                    </Ring>
                    <p className="font-bold text-base -mt-1">{name}</p>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {[
                        { l: "Sleep", v: `${today.sleep}h`, c: VIZ.sleep },
                        { l: "Weight", v: `${today.weight}kg`, c: VIZ.steps },
                        { l: "BMI", v: bmiVal ?? "–", c: bmiColor },
                        { l: "Kcal Left", v: caloriesLeft.toLocaleString(), c: VIZ.calories },
                      ].map(({ l, v, c }) => (
                        <div key={l} className="bg-muted/50 border rounded-xl p-2.5 text-center">
                          <p className="text-[10px] uppercase tracking-wide font-bold text-muted-foreground">{l}</p>
                          <p className="font-black text-base leading-tight" style={{ color: c }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Water glasses */}
                <Card>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2"><GlassWater size={14} /> Hydration</span>
                      <span className="text-xs font-bold" style={{ color: VIZ.water }}>{waterGlasses}/8 glasses</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="flex gap-1.5 flex-wrap">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="fit-glass" onClick={() => handleGlass(i)} title={`${(i + 1) * 250}ml`}>
                          <div className="fit-glass-fill" style={{ height: i < waterGlasses ? "80%" : "0%" }} />
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">Click a glass to update · 250 ml each</p>
                  </CardContent>
                </Card>

                {/* Macros */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2"><Utensils size={14} /> Macros</span>
                      <span className="text-xs text-muted-foreground">{macroTotal} kcal</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <MacroRow label="Protein" val={macros.protein} target={goals.protein} color={VIZ.protein} />
                    <MacroRow label="Carbs" val={macros.carbs} target={goals.carbs} color={VIZ.carbs} />
                    <MacroRow label="Fat" val={macros.fat} target={goals.fat} color={VIZ.fat} />
                  </CardContent>
                </Card>

                {/* Mood */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><Smile size={14} /> Today's Mood</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1.5 bg-muted/50 p-1.5 rounded-xl">
                      {[
                        { k: "bad", icon: <Frown size={17} />, label: "Bad" },
                        { k: "ok", icon: <Meh size={17} />, label: "Okay" },
                        { k: "good", icon: <Smile size={17} />, label: "Good" },
                      ].map((m) => (
                        <Button key={m.k} variant={mood === m.k ? "default" : "ghost"}
                          className="flex-1 rounded-lg h-11 flex-col gap-1 text-[10px] uppercase tracking-wider font-bold"
                          onClick={() => handleMood(m.k)}>
                          {m.icon} {m.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Streak */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2"><Award size={14} /> Streak</span>
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Flame size={10} style={{ color: VIZ.calories }} /> {streak.count} days
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1">
                      {WEEKDAYS.map((d, i) => {
                        const s = streak.week?.[i];
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black"
                              style={
                                s === "today" ? { background: VIZ.calories, color: "#fff", boxShadow: `0 0 0 3px ${VIZ.calories}30` }
                                  : s ? { background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
                                    : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
                              }>
                              {s === "today" ? "★" : s ? "✓" : "·"}
                            </div>
                            <span className="text-[10px] text-muted-foreground font-semibold">{d}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* BMI */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2"><Scale size={14} /> BMI</span>
                      {bmiVal && (
                        <Badge variant="secondary" className="text-xs"
                          style={{ background: `${bmiColor}18`, color: bmiColor }}>{bmiLabel}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-3xl font-black" style={{ color: bmiColor }}>{bmiVal ?? "–"}</span>
                      <span className="text-xs text-muted-foreground font-semibold">kg/m²</span>
                    </div>
                    <div className="relative h-2.5 rounded-full overflow-hidden"
                      style={{ background: "linear-gradient(to right,#3b82f6,#10b981,#f59e0b,#f97316,#ef4444)" }}>
                      <div className="absolute top-1/2 w-0.5 h-4 bg-white rounded shadow"
                        style={{ left: `${bmiNeedle}%`, transform: "translateX(-50%) translateY(-50%)" }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      {["16", "18.5", "25", "30", "40"].map((v) => (
                        <span key={v} className="text-[10px] text-muted-foreground">{v}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ── Workouts tab ── */}
        {activeSection === "workouts" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Workouts</h2>
              <WorkoutLogDialog onSave={handleLog} loading={loading} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "This Week", val: `${workouts.filter((w) => w.date === "Today").length} sessions`, icon: <Dumbbell size={18} />, color: VIZ.calories },
                { label: "Calories Burned", val: `${totalWCal.toLocaleString()} kcal`, icon: <Flame size={18} />, color: VIZ.red },
                { label: "Active Minutes", val: `${totalWMin} min`, icon: <Zap size={18} />, color: VIZ.steps },
              ].map(({ label, val, icon, color }) => (
                <Card key={label} className="fit-card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2" style={{ color }}>
                      {icon}
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                    </div>
                    <p className="text-2xl font-black" style={{ color }}>{val}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-sm flex items-center gap-2"><Dumbbell size={14} /> Recent Workouts</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {workouts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No workouts yet — log one above!</p>
                )}
                {workouts.map((w) => (
                  <div key={w._id} className="fit-log-row flex items-center gap-3 px-4 py-3 border-b last:border-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${VIZ.red}18` }}>
                      <Dumbbell size={16} style={{ color: VIZ.red }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{w.date}</p>
                    </div>
                    <Badge variant="secondary" style={{ background: `${VIZ.red}14`, color: VIZ.red }}>{w.duration} min</Badge>
                    <Badge variant="secondary" style={{ background: `${VIZ.calories}14`, color: VIZ.calories }}>{w.calories} kcal</Badge>
                    <button className="fit-del" onClick={() => handleDelWkt(w._id)}><Trash2 size={13} /></button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Nutrition tab ── */}
        {activeSection === "nutrition" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Nutrition</h2>
              <LogDialog type="calories" onSave={handleLog} loading={loading} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Flame size={14} /> Calories</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-5">
                  <Ring value={pct(today.calories, goals.calories)} size={108} stroke={10} color={VIZ.calories}>
                    <p className="text-xl font-black leading-none" style={{ color: VIZ.calories }}>{today.calories}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold">kcal</p>
                  </Ring>
                  <div className="space-y-2">
                    {[
                      { label: "Goal", val: goals.calories, color: undefined },
                      { label: "Consumed", val: today.calories, color: VIZ.calories },
                      { label: "Remaining", val: caloriesLeft, color: VIZ.steps },
                    ].map(({ label, val, color }) => (
                      <div key={label}>
                        <p className="text-[10px] uppercase tracking-wide font-bold text-muted-foreground">{label}</p>
                        <p className="text-lg font-black leading-none" style={{ color }}>{val.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Zap size={14} /> Macronutrients</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <MacroRow label="Protein" val={macros.protein} target={goals.protein} color={VIZ.protein} extra={`${macros.protein * 4} kcal`} />
                  <MacroRow label="Carbs" val={macros.carbs} target={goals.carbs} color={VIZ.carbs} extra={`${macros.carbs * 4} kcal`} />
                  <MacroRow label="Fat" val={macros.fat} target={goals.fat} color={VIZ.fat} extra={`${macros.fat * 9} kcal`} />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><TrendingUp size={14} /> Calorie History (7 days)</CardTitle>
              </CardHeader>
              <CardContent className="h-52 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DAYS.map((name, i) => ({ name, consumed: weeklyStats.calories[i], goal: goals.calories }))} barSize={22}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                      tick={{ fill: "var(--recharts-tick, #6b7280)", fontSize: 11 }} dy={8} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(128,128,128,0.1)", radius: 6 }} />
                    <Bar dataKey="consumed" radius={[5, 5, 0, 0]} name="Consumed">
                      {DAY_LABELS.map((_, i) => (
                        <Cell key={i} fill={i === todayIndex ? VIZ.calories : `${VIZ.calories}70`} />
                      ))}
                    </Bar>
                    <Bar dataKey="goal" fill="hsl(var(--border))" radius={[5, 5, 0, 0]} name="Goal" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}