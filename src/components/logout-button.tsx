"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@supabase/supabase-js";

export function LogoutButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Initialize the Supabase client for the browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Fetch the user data when the component mounts
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    // await supabase.auth.user.signOut();
    
    await supabase.auth.signOut();
    
    
    router.refresh();
    
   
    router.push("/login"); 
  };

  return (
    <div className="flex items-center gap-3">
      {user && (
        <div className="flex items-center gap-2 mr-2">
         {/* yha photo lagega uer ka */}
          <Avatar className="h-8 w-8 border border-slate-200">
            <AvatarImage src={user.user_metadata?.avatar_url} alt="User Logo" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {/* User Name (Hidden on very small screens) */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-slate-700 leading-none">
              {user.user_metadata?.full_name?.split(" ")[0] || "User"}
            </span>
          </div>
        </div>
      )}

      <Button variant="outline" size="sm" onClick={handleLogout}  className="text-slate-600 cursor-pointer hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}