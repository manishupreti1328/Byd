"use client"
// app/ev-battery-lifespan-calculator/page.tsx
import React from "react";

type FormData = {
  dailyKm?: number;
  chargingType?: string;
  chargingFreq?: string;
  chargeLevel?: string;
  parking?: string;
  climate?: string;
  driving?: string;
};

function calculateLifespan(data: FormData) {
  let years = 10; // base ideal lifespan

  // Daily KM impact
  if (data.dailyKm) {
    if (data.dailyKm > 80) years -= 2;
    else if (data.dailyKm > 50) years -= 1;
  }

  // Charging type
  if (data.chargingType === "fast") years -= 1.5;

  // Charging frequency
  if (data.chargingFreq === "daily") years -= 1;

  // Typical charge level
  if (data.chargeLevel === "100") years -= 1.5;
  if (data.chargeLevel === "90") years -= 0.8;

  // Parking condition
  if (data.parking === "outdoor") years -= 1;

  // UAE Hot climate
  if (data.climate === "hot") years -= 1.2;

  // Driving style
  if (data.driving === "aggressive") years -= 1;

  if (years < 3) years = 3;

  return years.toFixed(1);
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const data: FormData = {
    dailyKm: searchParams.dailyKm ? Number(searchParams.dailyKm) : undefined,
    chargingType: searchParams.chargingType,
    chargingFreq: searchParams.chargingFreq,
    chargeLevel: searchParams.chargeLevel,
    parking: searchParams.parking,
    climate: searchParams.climate,
    driving: searchParams.driving,
  };

  const result =
    Object.keys(searchParams).length > 0 ? calculateLifespan(data) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">
          EV Battery Lifespan Calculator
        </h1>
        <p className="text-gray-400 mb-8">
          Estimate how long your EV battery may last based on your usage habits.
        </p>

        <form className="grid md:grid-cols-2 gap-6 bg-gray-800 p-6 rounded-xl shadow-lg">
          <input
            name="dailyKm"
            type="number"
            placeholder="Daily Driving KM"
            className="input"
          />

          <select name="chargingType" className="input">
            <option value="">Charging Type</option>
            <option value="slow">Slow / Home</option>
            <option value="fast">Fast / DC</option>
          </select>

          <select name="chargingFreq" className="input">
            <option value="">Charging Frequency</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>

          <select name="chargeLevel" className="input">
            <option value="">Typical Charge Level</option>
            <option value="80">80%</option>
            <option value="90">90%</option>
            <option value="100">100%</option>
          </select>

          <select name="parking" className="input">
            <option value="">Parking Condition</option>
            <option value="covered">Covered</option>
            <option value="outdoor">Outdoor</option>
          </select>

          <select name="climate" className="input">
            <option value="">Climate</option>
            <option value="normal">Normal</option>
            <option value="hot">Hot (UAE)</option>
          </select>

          <select name="driving" className="input md:col-span-2">
            <option value="">Driving Style</option>
            <option value="smooth">Smooth</option>
            <option value="aggressive">Aggressive</option>
          </select>

          <button
            type="submit"
            className="md:col-span-2 bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-bold"
          >
            Calculate Lifespan
          </button>
        </form>

        {result && (
          <div className="mt-10 bg-gray-800 p-6 rounded-xl text-center">
            <h2 className="text-2xl text-orange-400 font-semibold">
              Estimated Battery Lifespan
            </h2>
            <p className="text-5xl font-bold mt-4">{result} Years</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .input {
          @apply w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500;
        }
      `}</style>
    </div>
  );
}
