"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  InfoIcon, 
  ZapIcon, 
  BatteryIcon, 
  ClockIcon, 
  DollarSignIcon, 
  RefreshCwIcon,
  CarIcon,
  SettingsIcon,
  CalculatorIcon
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

// Predefined EV models for quick selection
const EV_MODELS = [
  { name: "BYD Atto 3", battery: 60.5, consumption: 16, range: 420, color: "bg-blue-500", brand: "BYD" },
  { name: "BYD Dolphin", battery: 44.9, consumption: 13, range: 427, color: "bg-green-500", brand: "BYD" },
  { name: "BYD Seal", battery: 82.5, consumption: 18, range: 570, color: "bg-purple-500", brand: "BYD" },
  { name: "BYD Han", battery: 85.4, consumption: 19, range: 605, color: "bg-red-500", brand: "BYD" },
  { name: "Tesla Model 3", battery: 57.5, consumption: 15, range: 438, color: "bg-red-600", brand: "Other" },
  { name: "Tesla Model Y", battery: 75, consumption: 17, range: 488, color: "bg-red-500", brand: "Other" },
  { name: "MG ZS EV", battery: 50.8, consumption: 17, range: 320, color: "bg-orange-500", brand: "Other" },
  { name: "Hyundai Kona", battery: 64, consumption: 16, range: 415, color: "bg-cyan-500", brand: "Other" },
  { name: "Kia EV6", battery: 77.4, consumption: 18, range: 528, color: "bg-teal-500", brand: "Other" },
  { name: "Custom EV", battery: 60, consumption: 16, range: 400, color: "bg-gray-500", brand: "Custom" },
] as const;

const CHARGER_TYPES = [
  { type: "Home AC", power: 7.4, costMultiplier: 1, color: "border-green-500 text-green-700 bg-green-50" },
  { type: "Public AC", power: 22, costMultiplier: 1.5, color: "border-blue-500 text-blue-700 bg-blue-50" },
  { type: "DC Fast", power: 50, costMultiplier: 2, color: "border-orange-500 text-orange-700 bg-orange-50" },
  { type: "Ultra Fast", power: 150, costMultiplier: 2.5, color: "border-red-500 text-red-700 bg-red-50" },
] as const;

const CURRENCIES = [
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "SAR", symbol: "ر.س", name: "Saudi Riyal" },
  { code: "QAR", symbol: "ر.ق", name: "Qatari Riyal" },
  { code: "OMR", symbol: "ر.ع.", name: "Omani Rial" },
];

export default function CalculatorUI() {
  const [selectedModel, setSelectedModel] = useState("BYD Atto 3");
  const [batteryCapacity, setBatteryCapacity] = useState(60.5);
  const [consumption, setConsumption] = useState(16);
  const [currentCharge, setCurrentCharge] = useState(20);
  const [targetCharge, setTargetCharge] = useState(80);
  const [electricityRate, setElectricityRate] = useState(0.30);
  const [selectedCharger, setSelectedCharger] = useState("Home AC");
  const [efficiencyLoss, setEfficiencyLoss] = useState(10);
  const [currency, setCurrency] = useState("AED");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [evCategory, setEvCategory] = useState("BYD"); // "BYD" or "Other"

  // Filter models based on selected category
  const filteredModels = useMemo(() => {
    if (evCategory === "BYD") {
      return EV_MODELS.filter(m => m.brand === "BYD" || m.name === "Custom EV");
    } else if (evCategory === "Other") {
      return EV_MODELS.filter(m => m.brand === "Other" || m.name === "Custom EV");
    }
    return EV_MODELS;
  }, [evCategory]);

  // Get current model details
  const currentModel = useMemo(() => 
    EV_MODELS.find(m => m.name === selectedModel) || EV_MODELS[0]
  , [selectedModel]);

  // Get current charger details
  const currentCharger = useMemo(() => 
    CHARGER_TYPES.find(c => c.type === selectedCharger) || CHARGER_TYPES[0]
  , [selectedCharger]);

  // Get current currency symbol
  const currentCurrency = useMemo(() => 
    CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]
  , [currency]);

  // Update values when EV model changes
  useEffect(() => {
    const model = EV_MODELS.find(m => m.name === selectedModel);
    if (model) {
      setBatteryCapacity(model.battery);
      setConsumption(model.consumption);
    }
  }, [selectedModel]);

  const calculations = useMemo(() => {
    const charger = CHARGER_TYPES.find(c => c.type === selectedCharger);
    const chargerPower = charger?.power || 7.4;
    const costMultiplier = charger?.costMultiplier || 1;

    // Calculate energy needed considering efficiency loss
    const energyNeeded = ((targetCharge - currentCharge) / 100) * batteryCapacity * (100 / (100 - efficiencyLoss));
    
    // Calculate charging time (hours)
    const chargingTime = energyNeeded / chargerPower;
    
    // Calculate total cost
    const totalCost = energyNeeded * electricityRate * costMultiplier;
    
    // Calculate cost per 100km
    const costPer100km = (consumption * electricityRate * costMultiplier).toFixed(2);
    
    // Format time
    const hours = Math.floor(chargingTime);
    const minutes = Math.round((chargingTime - hours) * 60);
    const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return {
      energyNeeded: energyNeeded.toFixed(2),
      chargingTime: formattedTime,
      totalCost: totalCost.toFixed(2),
      costPer100km,
      chargerPower,
      costMultiplier,
      chargingSpeed: chargerPower.toFixed(1),
    };
  }, [batteryCapacity, currentCharge, targetCharge, electricityRate, efficiencyLoss, selectedCharger, consumption]);

  const resetToDefaults = () => {
    setSelectedModel("BYD Atto 3");
    setCurrentCharge(20);
    setTargetCharge(80);
    setElectricityRate(0.30);
    setSelectedCharger("Home AC");
    setEfficiencyLoss(10);
    setCurrency("AED");
    setEvCategory("BYD");
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <CalculatorIcon className="h-7 w-7 text-blue-600" />
              EV Charging Calculator
            </h1>
            <p className="text-gray-600 mt-2">Calculate charging costs and time for any electric vehicle</p>
          </div>
          <Button 
            variant="outline" 
            onClick={resetToDefaults}
            className="gap-2"
          >
            <RefreshCwIcon className="h-4 w-4" />
            Reset All
          </Button>
        </div>

        {/* MAIN LANDSCAPE LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDE - INPUTS (2/3 on desktop) */}
          <div className="lg:w-2/3 space-y-6">
            {/* EV Selection Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CarIcon className="h-5 w-5 text-blue-600" />
                      Select Your EV
                    </CardTitle>
                    <CardDescription>
                      Choose your electric vehicle model
                    </CardDescription>
                  </div>
                  
                  {/* EV Category Tabs */}
                  <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => setEvCategory("BYD")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        evCategory === "BYD" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                      }`}
                    >
                      BYD EVs
                    </button>
                    <button
                      onClick={() => setEvCategory("Other")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        evCategory === "Other" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                      }`}
                    >
                      Other EVs
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Model Selection Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {filteredModels.map((model) => (
                    <button
                      key={model.name}
                      onClick={() => setSelectedModel(model.name)}
                      className={`
                        flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200
                        hover:scale-[1.02] hover:shadow-sm
                        ${selectedModel === model.name 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className={`w-10 h-10 rounded-full ${model.color} flex items-center justify-center mb-2`}>
                        <CarIcon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-xs text-gray-900 text-center">
                        {model.name.split(" ")[0]}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {model.battery} kWh
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom EV Input */}
                {selectedModel === "Custom EV" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-3">Custom EV Settings</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Battery Capacity (kWh)</Label>
                        <Input
                          type="number"
                          min="20"
                          max="200"
                          step="0.1"
                          value={batteryCapacity}
                          onChange={(e) => setBatteryCapacity(parseFloat(e.target.value) || 60)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Energy Consumption (kWh/100km)</Label>
                        <Input
                          type="number"
                          min="10"
                          max="30"
                          step="0.5"
                          value={consumption}
                          onChange={(e) => setConsumption(parseFloat(e.target.value) || 16)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected EV Details */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${currentModel.color} flex items-center justify-center`}>
                        <CarIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{currentModel.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {currentModel.battery} kWh
                          </Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {currentModel.consumption} kWh/100km
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {currentModel.range} km range
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {EV_MODELS.map((model) => (
                          <SelectItem key={model.name} value={model.name}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${model.color}`} />
                              {model.name} ({model.battery} kWh)
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charger Selection Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ZapIcon className="h-5 w-5 text-yellow-600" />
                  Charger Configuration
                </CardTitle>
                <CardDescription>
                  Select your charger type and location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Charger Type Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CHARGER_TYPES.map((charger) => (
                    <button
                      key={charger.type}
                      onClick={() => setSelectedCharger(charger.type)}
                      className={`
                        flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200
                        hover:scale-[1.02] hover:shadow-sm
                        ${selectedCharger === charger.type 
                          ? `${charger.color} border-2` 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <span className="font-medium text-gray-900">{charger.type}</span>
                      <span className="text-sm text-gray-600 mt-1">{charger.power} kW</span>
                      <span className="text-xs text-gray-500 mt-1">
                        {charger.costMultiplier === 1 ? 'Standard rate' : `${charger.costMultiplier}x rate`}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Charger Details */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Charger Power</Label>
                      <div className="text-2xl font-bold text-gray-900">{currentCharger.power} kW</div>
                      <p className="text-xs text-gray-500">Maximum charging speed</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Cost Multiplier</Label>
                      <div className="text-2xl font-bold text-gray-900">{currentCharger.costMultiplier}x</div>
                      <p className="text-xs text-gray-500">Compared to home rate</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Estimated Speed</Label>
                      <div className="text-2xl font-bold text-gray-900">{calculations.chargingSpeed} km/h</div>
                      <p className="text-xs text-gray-500">Range added per hour</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Battery & Cost Settings Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-gray-600" />
                  Charging Parameters
                </CardTitle>
                <CardDescription>
                  Adjust battery and cost settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Battery Settings */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="font-medium">Battery Capacity</Label>
                        <span className="font-bold text-blue-600">{batteryCapacity} kWh</span>
                      </div>
                      <Slider
                        value={[batteryCapacity]}
                        min={20}
                        max={150}
                        step={1}
                        onValueChange={([value]) => {
                          setBatteryCapacity(value);
                          if (selectedModel !== "Custom EV") setSelectedModel("Custom EV");
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="font-medium">Current Charge</Label>
                        <span className="font-bold text-orange-600">{currentCharge}%</span>
                      </div>
                      <Slider
                        value={[currentCharge]}
                        min={0}
                        max={90}
                        step={5}
                        onValueChange={([value]) => setCurrentCharge(value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="font-medium">Target Charge</Label>
                        <span className="font-bold text-purple-600">{targetCharge}%</span>
                      </div>
                      <Slider
                        value={[targetCharge]}
                        min={10}
                        max={100}
                        step={5}
                        onValueChange={([value]) => setTargetCharge(value)}
                      />
                    </div>
                  </div>

                  {/* Right Column - Cost Settings */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="font-medium flex items-center gap-2">
                        Electricity Cost
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter your local electricity rate per kWh</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <div className="flex gap-2">
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map((curr) => (
                              <SelectItem key={curr.code} value={curr.code}>
                                {curr.symbol} {curr.code} - {curr.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={electricityRate}
                          onChange={(e) => setElectricityRate(parseFloat(e.target.value) || 0)}
                          className="flex-1"
                          placeholder="0.00"
                        />
                        <div className="flex items-center px-3 bg-gray-100 rounded-lg">
                          <span className="text-gray-700">/kWh</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="font-medium">Energy Consumption</Label>
                        <span className="font-bold text-green-600">{consumption} kWh/100km</span>
                      </div>
                      <Slider
                        value={[consumption]}
                        min={10}
                        max={30}
                        step={0.5}
                        onValueChange={([value]) => setConsumption(value)}
                      />
                      <p className="text-xs text-gray-500">Average: 15-20 kWh/100km for most EVs</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="font-medium">Charging Efficiency</Label>
                        <span className="font-bold text-gray-600">{100 - efficiencyLoss}%</span>
                      </div>
                      <Slider
                        value={[efficiencyLoss]}
                        min={5}
                        max={20}
                        step={1}
                        onValueChange={([value]) => setEfficiencyLoss(value)}
                      />
                      <p className="text-xs text-gray-500">Accounts for energy loss during charging</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE - RESULTS (1/3 on desktop) */}
          <div className="lg:w-1/3">
            <Card className="h-full border-green-200 bg-gradient-to-b from-green-50 to-white">
              <CardHeader>
                <CardTitle className="text-xl text-green-800 flex items-center gap-2">
                  <CalculatorIcon className="h-6 w-6 text-green-600" />
                  Charging Results
                </CardTitle>
                <CardDescription className="text-green-700">
                  {selectedModel} • {currentCharger.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Results Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <BatteryIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Energy</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{calculations.energyNeeded} kWh</div>
                    {showAdvanced && (
                      <p className="text-xs text-gray-500 mt-2">
                        {batteryCapacity} kWh • {efficiencyLoss}% loss
                      </p>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <ClockIcon className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Time</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{calculations.chargingTime}</div>
                    {showAdvanced && (
                      <p className="text-xs text-gray-500 mt-2">
                        At {currentCharger.power} kW
                      </p>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <DollarSignIcon className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Total Cost</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {currentCurrency.symbol} {calculations.totalCost}
                    </div>
                    {showAdvanced && (
                      <p className="text-xs text-gray-500 mt-2">
                        {electricityRate} {currency}/kWh × {calculations.costMultiplier}x
                      </p>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <CarIcon className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Cost/100km</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentCurrency.symbol} {calculations.costPer100km}
                    </div>
                    {showAdvanced && (
                      <p className="text-xs text-gray-500 mt-2">
                        {consumption} kWh/100km
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Charging Progress</span>
                    <span className="font-semibold text-green-600">
                      {targetCharge - currentCharge}% added
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${targetCharge}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{currentCharge}% current</span>
                    <span>{targetCharge}% target</span>
                  </div>
                </div>

                {/* Tips Section */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <InfoIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800 text-sm mb-2">💡 Smart Charging Tips</p>
                      <ul className="text-blue-700 text-xs space-y-1">
                        <li>• Home charging saves 50-70% vs fast charging</li>
                        <li>• 80-90% charge is optimal for battery health</li>
                        <li>• Charge during off-peak hours for lower rates</li>
                        <li>• Pre-cool your car in summer for faster charging</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Advanced Toggle */}
                <div className="flex items-center justify-between border-t pt-4">
                  <Label htmlFor="advanced-mode" className="text-sm">Show Advanced Details</Label>
                  <Switch
                    id="advanced-mode"
                    checked={showAdvanced}
                    onCheckedChange={setShowAdvanced}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Compare Section - Below on all screens */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CarIcon className="h-5 w-5 text-blue-600" />
              Compare Charging Options
            </CardTitle>
            <CardDescription>
              See cost differences between charger types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Charger Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Power (kW)</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cost Multiplier</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Charging Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {CHARGER_TYPES.map((charger) => {
                    const time = (parseFloat(calculations.energyNeeded) / charger.power);
                    const hours = Math.floor(time);
                    const minutes = Math.round((time - hours) * 60);
                    const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                    const cost = (parseFloat(calculations.energyNeeded) * electricityRate * charger.costMultiplier).toFixed(2);
                    
                    return (
                      <tr 
                        key={charger.type} 
                        className={`border-b hover:bg-gray-50 ${
                          selectedCharger === charger.type ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              charger.color.split(' ')[0].replace('border-', 'bg-')
                            }`} />
                            {charger.type}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{charger.power} kW</td>
                        <td className="py-3 px-4">{charger.costMultiplier}x</td>
                        <td className="py-3 px-4 font-semibold">{formattedTime}</td>
                        <td className="py-3 px-4 font-bold text-green-600">
                          {currentCurrency.symbol} {cost}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm">
          <p>Calculations are estimates. Actual costs and times may vary based on weather, battery condition, and charger availability.</p>
        </div>
      </div>
    </TooltipProvider>
  );
}