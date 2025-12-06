"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { Zap, Banknote, Clock } from "lucide-react";
import { ChatSheet } from "./chat-sheet";
// import ChatSheet from "./chat-sheet";



interface ProductCardProps {
  product: Product;
  isBestMatch?: boolean;
}

export function ProductCard({ product, isBestMatch }: ProductCardProps) {
  const getBadges = (p: Product) => {
    const badges = [];
    if (p.rate_apr < 11) badges.push({ text: "Low APR", color: "bg-green-500" });
    if (p.processing_fee_pct === 0) badges.push({ text: "Zero Processing Fee", color: "bg-blue-500" });
    if (p.prepayment_allowed) badges.push({ text: "No Prepayment Penalty", color: "bg-indigo-500" });
    if (p.min_credit_score < 700) badges.push({ text: "Low Credit Score OK", color: "bg-orange-500" });
    if (p.disbursal_speed === "instant" || p.bank === "Bajaj Finserv")
      badges.push({ text: "Fast Disbursal", color: "bg-yellow-500" });
    return badges.slice(0, 3);
  };

  const badges = getBadges(product);

  return (
    <Card
      className={`relative flex flex-col h-full ${
        isBestMatch
          ? "border-2 border-primary shadow-lg scale-[1.01]"
          : "border-slate-200"
      }`}
    >
      {isBestMatch && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <Badge className="bg-primary text-primary-foreground px-4 py-1">
            <Zap className="w-3 h-3 mr-1 fill-current" /> Best Match
          </Badge>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              {product.bank}
            </p>
            <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
          </div>
          <Badge variant="outline" className="capitalize">
            {product.type.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-4 my-2">
          <div className="bg-slate-50 p-2 rounded-lg">
            <p className="text-xs text-muted-foreground">Interest Rate</p>
            <p className="font-bold text-lg text-primary">{product.rate_apr}%</p>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg">
            <p className="text-xs text-muted-foreground">Min Credit Score</p>
            <p className="font-bold text-lg">{product.min_credit_score}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {badges.map((b, i) => (
            <Badge
              key={i}
              className={`${b.color} text-white hover:${b.color} border-none`}
            >
              {b.text}
            </Badge>
          ))}
        </div>

        <div className="space-y-1 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4" />
            <span>Min Income: ₹{product.min_income.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              Tenure: {product.tenure_min_months}-{product.tenure_max_months} months
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <ChatSheet
          product={product}
          trigger={
            <Button className="w-full cursor-pointer bg-slate-900 hover:bg-slate-800">
              Ask About Product
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
