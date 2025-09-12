import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface GuidanceData {
  title: string;
  description: string;
  steps: string[];
  precautions: string[];
}

export default function GuidancePage() {
  const { category } = useParams();
  const [data, setData] = useState<GuidanceData | null>(null);

  useEffect(() => {
    if (category) {
      // Build file path based on category (normalize spaces/underscores)
      const fileName = category.replace(/\s+/g, "_").toLowerCase() + ".json";

      import(`./Guidance/${fileName}`)
        .then((json) => setData(json))
        .catch(() => setData(null));
    }
  }, [category]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-gray-600 text-lg">No guidance found for this category.</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-green-50 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-green-700 mb-4">{data.title}</h2>
        <p className="text-gray-700 mb-6">{data.description}</p>

        <h3 className="text-xl font-semibold text-green-600 mb-2">Steps</h3>
        <ul className="list-disc list-inside mb-6 text-gray-700">
          {data.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold text-green-600 mb-2">Precautions</h3>
        <ul className="list-disc list-inside text-gray-700">
          {data.precautions.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
