import { useState } from "react";
import { useGetMandiPrices, useGetGovernmentSchemes } from "@workspace/api-client-react";

export default function SmsMode() {
  const [tab, setTab] = useState<"menu" | "prices" | "schemes">("menu");
  const { data: prices } = useGetMandiPrices();
  const { data: schemes } = useGetGovernmentSchemes();

  // Basic highly accessible styles - large text, high contrast, black and white
  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-8 font-sans">
      <div className="max-w-lg mx-auto">
        
        <div className="border-b-4 border-black pb-4 mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-wider">KISAN CONNECT</h1>
          <h2 className="text-2xl font-bold mt-1">किसान कनेक्ट (SMS MODE)</h2>
        </div>

        {tab !== "menu" && (
          <button 
            onClick={() => setTab("menu")}
            className="bg-black text-white text-xl font-bold px-6 py-3 rounded mb-8 w-full block text-center"
          >
            BACK TO MENU / वापस मेनू पर
          </button>
        )}

        {tab === "menu" && (
          <div className="space-y-4">
            <button 
              onClick={() => setTab("prices")}
              className="w-full border-4 border-black p-6 text-2xl font-bold text-left bg-gray-100 hover:bg-gray-200"
            >
              1. MANDI PRICES<br/>(मंडी भाव)
            </button>
            <button 
              onClick={() => setTab("schemes")}
              className="w-full border-4 border-black p-6 text-2xl font-bold text-left bg-gray-100 hover:bg-gray-200"
            >
              2. GOVT SCHEMES<br/>(सरकारी योजनाएं)
            </button>
            <a 
              href="/"
              className="w-full border-4 border-black p-6 text-2xl font-bold text-left block bg-gray-100 hover:bg-gray-200"
            >
              3. EXIT SMS MODE<br/>(बाहर निकलें)
            </a>
          </div>
        )}

        {tab === "prices" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-black text-white p-4">PRICES / भाव</h2>
            {!prices ? (
              <p className="text-2xl font-bold">LOADING... / लोड हो रहा है...</p>
            ) : (
              prices.map(p => (
                <div key={p.id} className="border-l-8 border-black pl-4 py-2 text-xl font-bold">
                  <p className="text-2xl">{p.crop} ({p.cropHindi})</p>
                  <p>MANDI: {p.market}</p>
                  <p>PRICE: Rs {p.modalPrice} / {p.unit}</p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "schemes" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-black text-white p-4">SCHEMES / योजनाएं</h2>
            {!schemes ? (
              <p className="text-2xl font-bold">LOADING... / लोड हो रहा है...</p>
            ) : (
              schemes.map(s => (
                <div key={s.id} className="border-4 border-black p-4 text-xl font-bold">
                  <p className="text-2xl underline mb-2">{s.name}</p>
                  <p className="text-xl mb-4">{s.nameHindi}</p>
                  <p>BENEFIT: {s.benefit}</p>
                  <p className="mt-2 text-lg font-normal">{s.description}</p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
