import { supabase } from "@/lib/supabase";
import { FilterableProductGrid } from "@/components/filterable-product-grid";
// import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = "force-dynamic"; // Ensure fresh data

export default async function AllProductsPage() {
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('rate_apr', { ascending: true }); 

  if (error) {
    return <div className="p-10 text-red-500">Error loading products: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="cursor-pointer">
                <ArrowLeft className="w-4  h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Explore All Loans</h1>
              <p className="text-slate-500 mt-1">Compare rates and features across all our banking partners.</p>
            </div>
          </div>
          <LogoutButton />
        </header>

      
        <FilterableProductGrid initialProducts={products || []} />
        
      </div>
    </div>
  );
}