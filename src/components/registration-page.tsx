import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { AlertCircle, CheckCircle2, ArrowLeft, Building2, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner@2.0.3";
import type { Organization } from "../types";

interface RegistrationPageProps {
  onRegister: (orgData: Organization, adminData: {
    name: string;
    email: string;
    password: string;
  }) => void;
  onBackToLogin: () => void;
}

export function RegistrationPage({ onRegister, onBackToLogin }: RegistrationPageProps) {
  const [formData, setFormData] = useState({
    orgName: "",
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 50) return "bg-red-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };
  const getPasswordStrengthLabel = (strength: number) => {
    if (strength < 50) return "Weak";
    if (strength < 75) return "Good";
    return "Strong";
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.orgName.trim()) {
      newErrors.orgName = "Organization name is required";
    }

    if (!formData.adminName.trim()) {
      newErrors.adminName = "Admin name is required";
    }

    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Generate unique org ID
    const orgId = `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const organization: Organization = {
      id: orgId,
      name: formData.orgName,
      createdAt: new Date(),
      createdBy: formData.adminEmail,
      settings: {
        defaultSprintLength: 14,
        workflowColumns: ["todo", "in-progress", "code-review", "testing", "done"],
        wipLimits: {
          "in-progress": 5,
          "code-review": 3,
          "testing": 4,
        },
      },
    };

    const adminData = {
      name: formData.adminName,
      email: formData.adminEmail,
      password: formData.password,
    };

    onRegister(organization, adminData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Back to Login Button */}
        <button
          onClick={onBackToLogin}
          className="mb-6 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>

        {/* Logo and Header */}
        <div className="mb-8 text-center">
          <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <span className="text-white text-2xl">T</span>
          </div>
          <h1 className="mt-4">Create Your Organization</h1>
          <p className="text-slate-600">
            Register as an Organization Admin to get started
          </p>
        </div>

        <Card className="p-8 shadow-xl">
          {/* Info Banner */}
          <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex gap-3">
              <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm mb-1">Organization Registration</p>
                <p className="text-xs text-slate-600">
                  This registration is exclusively for Organization Admins, Project Managers, and Scrum Masters.
                  You'll be able to create products, manage teams, and invite users after registration.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Building2 className="h-4 w-4 text-slate-600" />
                <h3 className="text-sm">Organization Details</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgName">
                  Organization Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orgName"
                  type="text"
                  placeholder="Acme Corporation"
                  value={formData.orgName}
                  onChange={(e) => handleInputChange("orgName", e.target.value)}
                  className={errors.orgName ? "border-red-500" : ""}
                />
                {errors.orgName && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.orgName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Account Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="h-4 w-4 text-slate-600" />
                <h3 className="text-sm">Admin Account Details</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="adminName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.adminName}
                  onChange={(e) => handleInputChange("adminName", e.target.value)}
                  className={errors.adminName ? "border-red-500" : ""}
                />
                {errors.adminName && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.adminName}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="john@acme.com"
                    value={formData.adminEmail}
                    onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                    className={`pl-10 ${errors.adminEmail ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.adminEmail && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.adminEmail}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Password strength:</span>
                      <span className={`font-medium ${
                        passwordStrength < 50 ? "text-red-600" :
                        passwordStrength < 75 ? "text-yellow-600" : "text-green-600"
                      }`}>
                        {getPasswordStrengthLabel(passwordStrength)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getPasswordStrengthColor(passwordStrength)}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}
                {errors.password && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Passwords match</span>
                  </div>
                )}
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Role Assignment Info */}
            <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm mb-1">Automatic Role Assignment</p>
                  <p className="text-xs text-slate-600">
                    You'll be assigned the <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">Organization Admin</Badge> role upon registration, giving you full access to manage users, products, and organization settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg">
              <Building2 className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button
              onClick={onBackToLogin}
              className="text-blue-600 hover:underline"
            >
              Sign in here
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
