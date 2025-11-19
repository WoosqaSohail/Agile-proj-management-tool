import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { AlertCircle, Info, LogIn } from "lucide-react";
import { demoAccounts, getRoleColor } from "../lib/demo-accounts";
import type { DemoAccount } from "../types";

interface LoginScreenProps {
  onLogin: (account: DemoAccount) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const account = demoAccounts.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (account) {
      onLogin(account);
    } else {
      setError("Invalid email or password. Try a demo account!");
    }
  };

  const handleDemoLogin = (accountId: string) => {
    const account = demoAccounts.find((acc) => acc.id === accountId);
    if (account) {
      onLogin(account);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <span className="text-white text-2xl">T</span>
          </div>
          <h1 className="mt-4">Taiga Clone</h1>
          <p className="text-slate-600">Agile Project Management</p>
        </div>

        <Card className="p-6 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-500">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Demo Account Selector */}
          <div className="space-y-3">
            <Label>Sign in with demo account</Label>
            <Select onValueChange={handleDemoLogin}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a demo role..." />
              </SelectTrigger>
              <SelectContent>
                {demoAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getRoleColor(account.role)}`}
                      >
                        {account.role}
                      </Badge>
                      <span>{account.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              type="button"
              onClick={() => setShowDemoInfo(true)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              <Info className="h-4 w-4" />
              About demo accounts
            </button>
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-500">
          Demo credentials: Use any demo account with password{" "}
          <code className="rounded bg-slate-100 px-2 py-1">demo123</code>
        </p>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgot Password?</DialogTitle>
            <DialogDescription>
              This is a demo application. Please use one of the demo accounts to
              sign in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm">Demo credentials:</p>
            <ul className="space-y-2 text-sm">
              {demoAccounts.map((account) => (
                <li key={account.id} className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getRoleColor(account.role)}`}
                  >
                    {account.role}
                  </Badge>
                  <code className="rounded bg-slate-100 px-2 py-1">
                    {account.email}
                  </code>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-600">
              Password for all accounts: <code className="rounded bg-slate-100 px-2 py-1">demo123</code>
            </p>
          </div>
          <Button onClick={() => setShowForgotPassword(false)}>Close</Button>
        </DialogContent>
      </Dialog>

      {/* Demo Info Dialog */}
      <Dialog open={showDemoInfo} onOpenChange={setShowDemoInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demo Account Information</DialogTitle>
            <DialogDescription>
              Each role has different access levels and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {demoAccounts.map((account) => (
              <div key={account.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${getRoleColor(account.role)}`}
                  >
                    {account.role}
                  </Badge>
                  <span>{account.name}</span>
                </div>
                <p className="text-sm text-slate-600">{account.description}</p>
                <code className="block rounded bg-slate-100 px-2 py-1 text-xs">
                  {account.email}
                </code>
              </div>
            ))}
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p>
                    All demo data is stored locally in your browser. No real data is
                    saved to any server.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowDemoInfo(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
