import React, { useState } from 'react';
import { 
  Search, Bell, User, Flame, Footprints, Droplets, 
  Plus, Moon, Brain, Heart, Calendar, MoreHorizontal, 
  Smile, Frown, Meh, Utensils, GlassWater, Bed, History, Trash2, Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const Home = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState("calories");
  const [newVal, setNewVal] = useState("");
  const [mood, setMood] = useState('good');
  
  // User Targets (The "Goals")
  const [goals, setGoals] = useState({
    water: 3,      // Litres
    calories: 2500, // kcal
    steps: 10000,   // steps
    sleep: 8        // hours
  });

  // Current Stats (Last 7 days, index 6 is 'Today')
  const [stats, setStats] = useState({
    water: [2.1, 1.8, 2.4, 1.5, 0.8, 2.2, 1.4],
    calories: [1800, 2100, 1600, 2400, 1900, 2200, 1250],
    steps: [8000, 10000, 7500, 12000, 6000, 9500, 7420],
    sleep: 6.5
  });

  const [logs, setLogs] = useState([
    { id: 1, type: "Water", amount: "500ml", time: "09:30 AM" },
    { id: 2, type: "Steps", amount: "2,400", time: "11:15 AM" },
  ]);

  // --- Logic ---
  const handleUpdate = (type, isGoal = false) => {
    const value = parseFloat(newVal);
    if (isNaN(value)) return;

    if (isGoal) {
      setGoals(prev => ({ ...prev, [type]: value }));
    } else {
      setStats(prev => {
        if (type === 'sleep') return { ...prev, sleep: value };
        const newArr = [...prev[type]];
        newArr[6] += value; 
        return { ...prev, [type]: newArr };
      });
      setLogs(prev => [{
        id: Date.now(),
        type: type.charAt(0).toUpperCase() + type.slice(1),
        amount: type === 'water' ? `${value}L` : type === 'sleep' ? `${value}h` : value.toLocaleString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, ...prev]);
    }
    setNewVal("");
  };

  const chartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
    name: day,
    val: activeTab === "calories" ? stats.calories[i] : activeTab === "water" ? stats.water[i] : stats.steps[i]
  }));

  const overallProgress = Math.round(
    ((stats.water[6] / goals.water) + (stats.calories[6] / goals.calories) + (stats.steps[6] / goals.steps)) / 3 * 100
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 transition-all duration-300">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
            <Heart className="text-primary-foreground w-7 h-7" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">HealthMate</h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Pro Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <GoalSettingsModal goals={goals} onSave={handleUpdate} val={newVal} setVal={setNewVal} />
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          <div className="flex items-center gap-3 bg-card border p-1 pr-4 rounded-2xl shadow-sm">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center overflow-hidden">
               <User className="text-muted-foreground" />
            </div>
            <span className="text-sm font-bold">Lina Blake</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Section */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Quick Log Row */}
          <div className="flex flex-wrap gap-3 items-center">
            <h3 className="text-sm font-bold mr-2 uppercase text-muted-foreground tracking-tighter">Quick Log:</h3>
            <DataModal title="Water" icon={<GlassWater/>} unit="L" onSave={() => handleUpdate('water')} val={newVal} setVal={setNewVal} />
            <DataModal title="Steps" icon={<Footprints/>} unit="Steps" onSave={() => handleUpdate('steps')} val={newVal} setVal={setNewVal} />
            <DataModal title="Calories" icon={<Utensils/>} unit="kcal" onSave={() => handleUpdate('calories')} val={newVal} setVal={setNewVal} />
            <DataModal title="Sleep" icon={<Bed/>} unit="Hours" onSave={() => handleUpdate('sleep')} val={newVal} setVal={setNewVal} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MetricCard icon={<Droplets/>} label="Hydration" value={`${stats.water[6]}L`} target={goals.water} color="text-blue-500" unit="L" />
            <MetricCard icon={<Flame/>} label="Burned" value={stats.calories[6]} target={goals.calories} color="text-orange-500" unit="kcal" />
            <MetricCard icon={<Footprints/>} label="Walking" value={stats.steps[6]} target={goals.steps} color="text-emerald-500" unit="steps" />
          </div>

          {/* Performance Chart */}
          <Card className="rounded-[2.5rem] border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Activity Trends</CardTitle>
              <Tabs defaultValue="calories" onValueChange={setActiveTab} className="bg-muted/50 rounded-lg p-1">
                <TabsList className="bg-transparent h-8">
                  <TabsTrigger value="calories" className="text-xs px-4">Calories</TabsTrigger>
                  <TabsTrigger value="water" className="text-xs px-4">Water</TabsTrigger>
                  <TabsTrigger value="steps" className="text-xs px-4">Steps</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="h-[300px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11}} dy={10} />
                  <Tooltip cursor={{fill: 'hsl(var(--muted)/0.3)'}} contentStyle={{borderRadius: '16px', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="val" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Log Table */}
          <Card className="rounded-[2.5rem] border-border bg-card overflow-hidden shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2"><History size={16}/> Recent Activity</CardTitle>
            </CardHeader>
            <Table>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30">
                    <TableCell className="font-bold">{log.type}</TableCell>
                    <TableCell className="text-muted-foreground">{log.amount}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-mono">{log.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-[2.5rem] border-border bg-card p-8 text-center shadow-sm border-t-4 border-t-primary">
             <div className="relative inline-block mb-6">
               <svg className="w-32 h-32 transform -rotate-90">
                 <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                 <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * overallProgress) / 100} className="text-primary transition-all duration-1000" strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-black">{overallProgress}%</span>
                 <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">Daily Goal</span>
               </div>
             </div>
             <h3 className="text-xl font-bold">Lina Blake</h3>
             <div className="flex justify-center gap-4 mt-6">
                <div className="text-center bg-muted/30 px-4 py-2 rounded-2xl">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Sleep</p>
                  <p className="font-bold">{stats.sleep}h</p>
                </div>
                <div className="text-center bg-muted/30 px-4 py-2 rounded-2xl">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Weight</p>
                  <p className="font-bold">60kg</p>
                </div>
             </div>
          </Card>

          <Card className="rounded-[2.5rem] border-border bg-card p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">How's your mood?</h3>
            <div className="flex gap-2 bg-muted/30 p-2 rounded-2xl">
              {['bad', 'ok', 'good'].map((m) => (
                <Button key={m} variant={mood === m ? "default" : "ghost"} className="flex-1 rounded-xl h-12 capitalize" onClick={() => setMood(m)}>
                  {m === 'bad' ? <Frown size={20}/> : m === 'ok' ? <Meh size={20}/> : <Smile size={20}/>}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- Modals & Sub-components ---

const MetricCard = ({ icon, label, value, target, color, unit }) => {
  const progress = Math.min((value / target) * 100, 100);
  return (
    <Card className="rounded-[2rem] p-6 border-border bg-card shadow-sm hover:translate-y-[-4px] transition-all">
      <div className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mb-4 ${color}`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-1 mt-1 mb-4">
        <span className="text-2xl font-black">{value.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground">/ {target.toLocaleString()} {unit}</span>
      </div>
      <Progress value={progress} className="h-1.5 bg-muted" indicatorClassName={color.replace('text', 'bg')} />
    </Card>
  );
};

const DataModal = ({ title, icon, unit, onSave, val, setVal }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm" className="rounded-full gap-2 border-border h-9 px-4 text-xs font-bold hover:bg-primary hover:text-white transition-all">
        {icon} Log {title}
      </Button>
    </DialogTrigger>
    <DialogContent className="rounded-[2rem] bg-card border-border sm:max-w-[400px]">
      <DialogHeader><DialogTitle className="text-xl">Add {title} Entry</DialogTitle></DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Amount ({unit})</Label>
          <Input type="number" value={val} onChange={(e)=>setVal(e.target.value)} className="rounded-xl" placeholder="0.00" />
        </div>
        <Button onClick={onSave} className="w-full rounded-xl py-6 text-lg font-bold">Record Entry</Button>
      </div>
    </DialogContent>
  </Dialog>
);

const GoalSettingsModal = ({ goals, onSave, val, setVal }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm" className="rounded-xl gap-2 font-bold text-primary">
        <Target size={18}/> Set Goals
      </Button>
    </DialogTrigger>
    <DialogContent className="rounded-[2.5rem] bg-card border-border sm:max-w-[450px]">
      <DialogHeader><DialogTitle className="text-2xl font-black">Configure Daily Goals</DialogTitle></DialogHeader>
      <div className="grid grid-cols-2 gap-4 py-6">
        {Object.entries(goals).map(([key, value]) => (
          <div key={key} className="space-y-2 p-4 bg-muted/20 rounded-2xl border">
            <Label className="capitalize font-bold text-xs">{key}</Label>
            <Input 
              type="number" 
              defaultValue={value} 
              onBlur={(e) => {setVal(e.target.value); onSave(key, true)}} 
              className="bg-card border-none text-lg font-black h-8 px-0"
            />
          </div>
        ))}
      </div>
      <p className="text-[10px] text-center text-muted-foreground uppercase font-bold">Changes auto-save on blur</p>
    </DialogContent>
  </Dialog>
);

export default Home;