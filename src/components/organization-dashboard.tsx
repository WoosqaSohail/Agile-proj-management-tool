import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
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
  DialogFooter,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Building2,
  Users,
  Package,
  UserPlus,
  MoreVertical,
  Search,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Key,
  Mail,
  Plus,
  FolderPlus,
  ArrowLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner@2.0.3";
import type { Organization, User, Product, UserRole } from "../types";

interface OrganizationDashboardProps {
  organization: Organization;
  onBackToDashboard: () => void;
}

export function OrganizationDashboard({ organization, onBackToDashboard }: OrganizationDashboardProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: "u-1",
      name: "Admin User",
      email: "admin@example.com",
      role: "Organization Admin",
      orgId: organization.id,
      status: "active",
      assignedProducts: [],
    },
  ]);

  const [products, setProducts] = useState<Product[]>([]);
  
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showCreateProductDialog, setShowCreateProductDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Developer" as UserRole,
    password: "",
    autoGenPassword: true,
    assignedProducts: [] as string[],
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    defaultSprintLength: 14,
    teamMembers: [] as string[],
  });

  const [searchTerm, setSearchTerm] = useState("");

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const password = newUser.autoGenPassword ? generatePassword() : newUser.password;

    const user: User = {
      id: `u-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      password,
      orgId: organization.id,
      status: "active",
      assignedProducts: newUser.assignedProducts,
    };

    setUsers((prev) => [...prev, user]);
    
    if (newUser.autoGenPassword) {
      toast.success(
        <div>
          <p>User created successfully!</p>
          <p className="text-xs mt-1">
            Password: <code className="bg-white/20 px-1 rounded">{password}</code>
          </p>
        </div>,
        { duration: 10000 }
      );
    } else {
      toast.success("User created successfully!");
    }

    setShowCreateUserDialog(false);
    resetNewUserForm();
  };

  const handleCreateProduct = () => {
    if (!newProduct.name) {
      toast.error("Please enter a product name");
      return;
    }

    const productMembers = users.filter((u) =>
      newProduct.teamMembers.includes(u.id)
    );

    const product: Product = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newProduct.name,
      description: newProduct.description,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      orgId: organization.id,
      members: productMembers,
      createdAt: new Date(),
      settings: {
        defaultSprintLength: newProduct.defaultSprintLength,
        workflowColumns: ["todo", "in-progress", "code-review", "testing", "done"],
        wipLimits: {
          "in-progress": 5,
          "code-review": 3,
          "testing": 4,
        },
      },
    };

    setProducts((prev) => [...prev, product]);
    toast.success("Product created successfully!");
    setShowCreateProductDialog(false);
    resetNewProductForm();
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.success("User deleted successfully");
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
    toast.success("User status updated");
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditUserDialog(true);
  };

  const resetNewUserForm = () => {
    setNewUser({
      name: "",
      email: "",
      role: "Developer",
      password: "",
      autoGenPassword: true,
      assignedProducts: [],
    });
  };

  const resetNewProductForm = () => {
    setNewProduct({
      name: "",
      description: "",
      defaultSprintLength: 14,
      teamMembers: [],
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "Product Owner":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "Developer":
        return "bg-green-100 text-green-700 border-green-300";
      case "QA":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "Admin/Scrum Master":
        return "bg-red-100 text-red-700 border-red-300";
      case "Organization Admin":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={onBackToDashboard}
              className="mb-2 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Project Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl">{organization.name}</h1>
              </div>
              <Badge className="bg-blue-100 text-blue-700">
                Organization Admin
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Manage users, products, and organization settings
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="users" className="w-full">
            <TabsList>
              <TabsTrigger value="users">
                <Users className="mr-2 h-4 w-4" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="products">
                <Package className="mr-2 h-4 w-4" />
                Products
              </TabsTrigger>
            </TabsList>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={() => setShowCreateUserDialog(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Assigned Products</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.assignedProducts && user.assignedProducts.length > 0 ? (
                              user.assignedProducts.map((prodId) => {
                                const product = products.find((p) => p.id === prodId);
                                return product ? (
                                  <Badge key={prodId} variant="outline" className="text-xs">
                                    {product.name}
                                  </Badge>
                                ) : null;
                              })
                            ) : (
                              <span className="text-xs text-slate-400">No products</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.status === "active" ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-700">
                              <XCircle className="mr-1 h-3 w-3" />
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleUserStatus(user.id)}
                              >
                                {user.status === "active" ? (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  {products.length} {products.length === 1 ? "product" : "products"}
                </p>
                <Button onClick={() => setShowCreateProductDialog(true)}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create Product
                </Button>
              </div>

              {products.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-sm mb-2">No products yet</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Create your first product to get started with agile project management
                    </p>
                    <Button onClick={() => setShowCreateProductDialog(true)}>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      Create Your First Product
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: product.color }}
                        >
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h3 className="text-sm mb-2">{product.name}</h3>
                      <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                        {product.description || "No description"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{product.members.length} members</span>
                        </div>
                        <span>Sprint: {product.settings?.defaultSprintLength}d</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create User Dialog */}
      <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new team member to your organization
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userName"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userRole">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value: UserRole) =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="QA">QA Engineer</SelectItem>
                  <SelectItem value="Product Owner">Product Owner</SelectItem>
                  <SelectItem value="Admin/Scrum Master">Admin/Scrum Master</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoGenPassword"
                    checked={newUser.autoGenPassword}
                    onChange={(e) =>
                      setNewUser({ ...newUser, autoGenPassword: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <label htmlFor="autoGenPassword" className="text-sm text-slate-600">
                    Auto-generate password
                  </label>
                </div>
              </div>
              {!newUser.autoGenPassword && (
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              )}
            </div>

            {products.length > 0 && (
              <div className="space-y-2">
                <Label>Assigned Products (Optional)</Label>
                <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`product-${product.id}`}
                        checked={newUser.assignedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewUser({
                              ...newUser,
                              assignedProducts: [...newUser.assignedProducts, product.id],
                            });
                          } else {
                            setNewUser({
                              ...newUser,
                              assignedProducts: newUser.assignedProducts.filter(
                                (id) => id !== product.id
                              ),
                            });
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor={`product-${product.id}`}
                        className="text-sm flex-1"
                      >
                        {product.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Product Dialog */}
      <Dialog open={showCreateProductDialog} onOpenChange={setShowCreateProductDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Set up a new product with backlog, sprints, and team members
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="productName"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="E-Commerce Platform"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">Product Description</Label>
              <Textarea
                id="productDescription"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="Describe your product..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sprintLength">Default Sprint Length (days)</Label>
              <Input
                id="sprintLength"
                type="number"
                value={newProduct.defaultSprintLength}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    defaultSprintLength: parseInt(e.target.value) || 14,
                  })
                }
                min="1"
                max="30"
              />
            </div>

            {users.length > 0 && (
              <div className="space-y-2">
                <Label>Team Members</Label>
                <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`user-${user.id}`}
                        checked={newProduct.teamMembers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewProduct({
                              ...newProduct,
                              teamMembers: [...newProduct.teamMembers, user.id],
                            });
                          } else {
                            setNewProduct({
                              ...newProduct,
                              teamMembers: newProduct.teamMembers.filter(
                                (id) => id !== user.id
                              ),
                            });
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <label htmlFor={`user-${user.id}`} className="text-sm flex-1">
                        {user.name} ({user.role})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateProductDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateProduct}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
