import { ProductCard } from "@/components/product-card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";

export default async function Dashboard() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .limit(5);

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-10 text-red-500 text-center">
        Error loading loans: {error.message}
      </div>
    );
  }

  const bestMatch = products?.[0];
  const otherMatches = products?.slice(1) || [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto space-y-8">

       
        <header className="mb-6 sm:mb-8 px-1 sm:px-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Your Loan Matches
            </h1>
            <p className="text-slate-500 mt-1 sm:mt-2 text-sm sm:text-base">
              Based on your profile, we found these top recommendations.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/products">
                <Button variant="secondary" className="cursor-pointer">View All Products</Button>
            </Link>
            <LogoutButton />
          </div>
        </header>

        {/* Best Match */}
        {bestMatch && (
          <section className="px-1 sm:px-0">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs sm:text-sm">
                Top Pick
              </span>
            </h2>
            <div className="w-full max-w-md">
              <ProductCard product={bestMatch} isBestMatch />
            </div>
          </section>
        )}

     
        <section className="px-1 sm:px-0">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-700">
            Other Great Options
          </h2>

          <div className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            gap-4 
            sm:gap-6
          ">
            {otherMatches.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}