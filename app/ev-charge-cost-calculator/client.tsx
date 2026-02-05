"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  SettingsIcon,
  ClockIcon, 
  HelpCircleIcon,
  CarIcon
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Common EV Models for Presets
const EV_PRESETS = [
  { name: "Tesla Model 3 / Y (Standard)", battery: 60 },
  { name: "Tesla Model 3 / Y (Long Range)", battery: 75 },
  { name: "BYD Atto 3", battery: 60.5 },
  { name: "BYD Seal (Standard)", battery: 61.4 },
  { name: "BYD Seal (Performance)", battery: 82.5 },
  { name: "BYD Dolphin", battery: 44.9 },
  { name: "Mustang Mach-E", battery: 88 },
  { name: "Hyundai Ioniq 5", battery: 77.4 },
  { name: "Kia EV6", battery: 77.4 },
  { name: "Nissan Leaf", battery: 40 },
  { name: "Custom Vehicle", battery: 50 },
];

// Standard charging levels for comparison
const CHARGING_LEVELS = [
  { name: "Level 1 (Wall Outlet)", power: 1.9, type: "AC", desc: "Standard household outlet (120V)" },
  { name: "Level 2 (Home Station)", power: 7.0, type: "AC", desc: "Typical home wallbox (240V)" },
  { name: "Level 2 (Public Fast)", power: 11, type: "AC", desc: "Office/Shopping center chargers" },
  { name: "Level 3 (DC Fast)", power: 50, type: "DC", desc: "Standard highway fast charger" },
  { name: "Tesla Supercharger", power: 150, type: "DC", desc: "High-speed network charging" },
  { name: "Ultra-Fast DC", power: 350, type: "DC", desc: "Latest generation hyper-chargers" },
];

export default function CalculatorUI() {
  // --- STATE ---
  const [selectedPreset, setSelectedPreset] = useState("Tesla Model 3 / Y (Long Range)");
  const [batterySize, setBatterySize] = useState(75); 
  const [currentSoc, setCurrentSoc] = useState(20); // State of Charge %
  const [targetSoc, setTargetSoc] = useState(80);   // Target %
  const [electricityRate, setElectricityRate] = useState(0.25); // Cost per kWh

  // --- CALCULATIONS ---
  const results = useMemo(() => {
    // 1. Calculate Net Energy Needed (kWh)
    const percentageAdded = Math.max(0, targetSoc - currentSoc);
    const netEnergy = (percentageAdded / 100) * batterySize;

    return {
      netEnergy: netEnergy.toFixed(1), // Display value
      netEnergyRaw: netEnergy, // For calculation
      percentageAdded,
      // Generate row data
      rows: CHARGING_LEVELS.map(level => {
        // Time Formula: NetEnergy / Power
        const hoursDecimal = netEnergy > 0 ? netEnergy / level.power : 0;
        
        // Format Time
        const hours = Math.floor(hoursDecimal);
        const minutes = Math.round((hoursDecimal - hours) * 60);
        
        let timeString = "-";
        if (netEnergy > 0) {
           if (hours > 24) {
             timeString = "> 24h";
           } else {
             if (minutes === 60) {
                timeString = hours + 1 > 0 ? `${hours + 1}h 0m` : `0h 0m`;
             } else {
                timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
             }
           }
        }

        // Cost Formula: NetEnergy * Rate
        const cost = netEnergy * electricityRate;

        return {
          ...level,
          timeString,
          hoursDecimal,
          cost: cost.toFixed(2)
        };
      })
    };
  }, [batterySize, currentSoc, targetSoc, electricityRate]);

  // Handle Preset Change
  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    const model = EV_PRESETS.find(m => m.name === value);
    if (model) {
      setBatterySize(model.battery);
    }
  };

  // Handler for range slider (Battery Size)
  const handleBatteryChange = (val: number[]) => {
    setBatterySize(val[0]);
    if (selectedPreset !== "Custom Vehicle") {
      setSelectedPreset("Custom Vehicle");
    }
  };

  const handleCurrentSocChange = (val: number[]) => {
    const newVal = val[0];
    setCurrentSoc(newVal);
    if (newVal > targetSoc) setTargetSoc(newVal); 
  };
  const handleTargetSocChange = (val: number[]) => {
    const newVal = val[0];
    setTargetSoc(newVal);
    if (newVal < currentSoc) setCurrentSoc(newVal); 
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">EV Charging Time Calculator</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Select your EV or set battery size manually to estimate charging time and cost.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* INPUTS PANEL */}
        <div className="lg:col-span-5 space-y-8">
          <Card className="border-0 shadow-lg ring-1 ring-slate-200 overflow-visible bg-white">
            <CardHeader className="bg-slate-50 border-b p-6">
              <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <SettingsIcon className="w-5 h-5" />
                </div>
                Calculator Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">

              {/* USER GUIDE */}
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 text-sm text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-blue-800">
                  <HelpCircleIcon className="w-4 h-4" />
                  Quick Guide
                </div>
                <ol className="list-decimal list-inside space-y-1 ml-1">
                  <li>Select your car model (or set battery size).</li>
                  <li>Drag the sliders to set Current & Target charge.</li>
                  <li>See instant time & cost estimates on the right.</li>
                </ol>
              </div>
              
              {/* 0. QUICK SELECT EV */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <CarIcon className="w-4 h-4 text-slate-500" />
                  Select Vehicle Model
                </Label>
                <div className="relative">
                  <Select value={selectedPreset} onValueChange={handlePresetChange}>
                    <SelectTrigger className="w-full h-12 bg-white border-slate-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 data-[placeholder]:text-slate-400">
                      <SelectValue placeholder="Select an EV..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] bg-white shadow-xl border border-slate-200 z-50">
                      {EV_PRESETS.map((car) => (
                        <SelectItem key={car.name} value={car.name} className="py-3 cursor-pointer hover:bg-slate-50 focus:bg-slate-50">
                          <span className="font-medium">{car.name}</span>
                          <span className="ml-2 text-slate-400 text-xs">({car.battery} kWh)</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* 1. BATTERY CAPACITY INPUT */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                    Battery Capacity 
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <HelpCircleIcon className="w-4 h-4 text-slate-400 cursor-help"/>
                        </TooltipTrigger>
                        <TooltipContent>Total energy capacity of your EV battery in kWh.</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="text-right">
                     <span className="text-2xl font-bold text-blue-600">{batterySize}</span>
                     <span className="text-sm font-medium text-slate-500 ml-1">kWh</span>
                  </div>
                </div>
                
                <Slider 
                  value={[batterySize]} 
                  min={10} 
                  max={130} 
                  step={0.5} 
                  onValueChange={handleBatteryChange}
                  className="py-2 cursor-pointer" 
                />
              </div>

              <div className="h-px bg-slate-100" />

              {/* 2. CHARGE LEVEL INPUTS */}
              <div className="space-y-6">
                <Label className="text-base font-semibold text-slate-700">Charging Session</Label>
                
                {/* Current & Target Slider Group */}
                <div className="space-y-8">
                  {/* Current Charge */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-600">Current Battery %</span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{currentSoc}%</span>
                    </div>
                    <Slider 
                      value={[currentSoc]} 
                      min={0} max={100} step={1}
                      onValueChange={handleCurrentSocChange}
                      className="py-2 cursor-pointer"
                    />
                  </div>

                  {/* Target Charge */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-600">Target Battery %</span>
                      <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{targetSoc}%</span>
                    </div>
                    <Slider 
                      value={[targetSoc]} 
                      min={0} max={100} step={1}
                      onValueChange={handleTargetSocChange}
                      className="py-2 cursor-pointer"
                    />
                  </div>
                </div>
              
                {/* Visual Bar - Improved Visibility */}
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="relative h-6 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    {/* Background (Empty) */}
                    <div 
                      className="absolute h-full bg-slate-300/50" 
                      style={{ width: `100%` }} 
                    />
                    {/* Current Level (Gray/Existing) */}
                    <div 
                      className="absolute h-full bg-slate-400 border-r border-white/20" 
                      style={{ width: `${currentSoc}%` }} 
                    />
                    {/* Added Level (Green/New) */}
                    <div 
                      className="absolute h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ 
                        left: `${currentSoc}%`,
                        width: `${Math.max(0, targetSoc - currentSoc)}%`
                      }} 
                    />
                    {/* Markers for readability */}
                    <div className="absolute top-0 bottom-0 left-[25%] w-px bg-white/20" />
                    <div className="absolute top-0 bottom-0 left-[50%] w-px bg-white/20" />
                    <div className="absolute top-0 bottom-0 left-[75%] w-px bg-white/20" />
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <div className="text-slate-500">
                      Charge Needed: <span className="font-bold text-slate-900 text-sm">{results.percentageAdded}%</span>
                    </div>
                    <div className="text-right">
                       <span className="block font-bold text-emerald-600 text-lg leading-none">+{results.netEnergyRaw.toFixed(1)} kWh</span>
                       <span className="text-emerald-600/80">Energy to add</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="h-px bg-slate-100" />

              {/* 3. ELECTRICITY RATE */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Label className="text-sm font-semibold text-slate-700 display-block mb-1">Electricity Rate</Label>
                  <p className="text-xs text-slate-500">Cost per kWh (e.g. 0.25)</p>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <Input 
                    type="number" 
                    value={electricityRate}
                    onChange={(e) => setElectricityRate(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    className="w-28 pl-6 h-10 bg-white border-slate-300 shadow-sm text-right font-medium text-slate-900"
                  />
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* RESULTS PANEL */}
        <div className="lg:col-span-7 h-full">
          <Card className="h-full border-0 shadow-lg ring-1 ring-emerald-100 overflow-hidden bg-white">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-3 text-xl text-emerald-900">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  Estimated Results
                </CardTitle>
                <div className="text-right bg-white px-4 py-2 rounded-lg border border-emerald-100 shadow-sm">
                  <span className="block text-xs uppercase tracking-wide text-slate-400 font-semibold">Energy Required</span>
                  <span className="block text-2xl font-bold text-emerald-600">{results.netEnergy} kWh</span>
                </div>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4 w-1/3">Charger Type</th>
                    <th className="px-6 py-4 text-center">Power</th>
                    <th className="px-6 py-4 text-center">Time Est.</th>
                    <th className="px-6 py-4 text-right">Cost Est.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.rows.map((row, index) => (
                    <tr key={index} className="hover:bg-emerald-50/30 transition-colors duration-150">
                      <td className="px-6 py-4">
                         <div className="font-semibold text-slate-900">{row.name}</div>
                         <div className="text-xs text-slate-500 mt-0.5 hidden sm:block">{row.desc}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge 
                          variant="secondary" 
                          className={`font-mono text-xs ${
                            row.type === 'DC' 
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {row.power} kW
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                           <span className="text-lg font-bold text-slate-800 tabular-nums">
                             {row.timeString}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-medium text-slate-600 tabular-nums">
                          ${row.cost}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}