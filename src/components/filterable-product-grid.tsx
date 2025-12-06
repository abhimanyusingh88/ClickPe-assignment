"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface FilterableProductGridProps {
  initialProducts: Product[];
}

export function FilterableProductGrid({ initialProducts }: FilterableProductGridProps) {
  // State for filters
  const [searchBank, setSearchBank] = useState("");
  const [maxApr, setMaxApr] = useState<number | "">("");
  const [minIncome, setMinIncome] = useState<number | "">("");
  const [minCreditScore, setMinCreditScore] = useState<number | "">("");

  // Filtering Logic
  const filteredProducts = initialProducts.filter((product) => {
    // 1. Bank Name Search is here yha pe karenge dekh le achhe se baar baar gadbad ho rha yha 
    if (searchBank && !product.bank.toLowerCase().includes(searchBank.toLowerCase())) {
      return false;
    }

    
    if (maxApr !== "" && product.rate_apr > Number(maxApr)) {
      return false;
    }

   
    if (minIncome !== "" && product.min_income > Number(minIncome)) {
      return false;
    }

    
    if (minCreditScore !== "" && product.min_credit_score > Number(minCreditScore)) {
      return false;
    }

    return true;
  });

  const clearFilters = () => {
    setSearchBank("");
    setMaxApr("");
    setMinIncome("");
    setMinCreditScore("");
  };

  const hasFilters = searchBank || maxApr !== "" || minIncome !== "" || minCreditScore !== "";

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-slate-800">Filter Products</h2>
          {hasFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2"
            >
              <X className="w-3 h-3 mr-1" /> Clear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Bank Search */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500">Bank Name</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search HDFC, SBI..."
                value={searchBank}
                onChange={(e) => setSearchBank(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* APR Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500">Max APR (%)</Label>
            <Input
              type="number"
              placeholder="e.g. 12"
              value={maxApr}
              onChange={(e) => setMaxApr(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>

          {/* Income Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500">My Monthly Income (₹)</Label>
            <Input
              type="number"
              placeholder="e.g. 50000"
              value={minIncome}
              onChange={(e) => setMinIncome(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>

          {/* Credit Score Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500">My Credit Score</Label>
            <Input
              type="number"
              placeholder="e.g. 750"
              value={minCreditScore}
              onChange={(e) => setMinCreditScore(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <p className="text-slate-500">No products match your filters.</p>
            <Button variant="link" onClick={clearFilters}>Clear filters to see all</Button>
          </div>
        )}
      </div>
    </div>
  );
}