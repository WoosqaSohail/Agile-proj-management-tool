# Organization Features - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Register Your Organization (2 minutes)
1. Go to the login page
2. Click **"Register as Organization Admin"** link at the bottom
3. Fill out the form:
   ```
   Organization Name: Your Company Name
   Admin Name: Your Full Name
   Email: your-email@company.com
   Password: [Use at least 8 characters - see strength meter]
   Confirm Password: [Match above]
   ```
4. Click **"Create Organization"**
5. ✅ You're now in the Organization Dashboard!

---

### Step 2: Create Your First User (1 minute)
1. In Organization Dashboard, you're on the **"User Management"** tab
2. Click **"Create User"** button (top right)
3. Fill in:
   ```
   Full Name: Team Member Name
   Email: member@company.com
   Role: [Select: Developer, QA, Product Owner, or Admin/Scrum Master]
   Password: [Leave "Auto-generate password" checked - easiest!]
   ```
4. Click **"Create User"**
5. ⚠️ **IMPORTANT:** Copy the auto-generated password from the success message!
6. ✅ User created! They can now log in.

---

### Step 3: Create Your First Product (2 minutes)
1. Click the **"Products"** tab
2. Click **"Create Product"** button
3. Fill in:
   ```
   Product Name: E-Commerce Platform (or your product name)
   Description: Brief description of what this product does
   Sprint Length: 14 (or your preferred sprint length in days)
   Team Members: [Check boxes for users to add to this product]
   ```
4. Click **"Create Product"**
5. ✅ Product created with backlog, sprints, and task management ready!

---

## 📋 Common Tasks

### Adding More Users
```
Organization Dashboard → User Management → Create User
```
- Choose role based on their function
- Use auto-generate password for security
- Assign to products during creation or edit later

### Editing a User
```
Organization Dashboard → User Management → Click ⋮ menu → Edit User
```
- Update role, email, or assignments
- Reassign to different products

### Deactivating/Activating Users
```
Organization Dashboard → User Management → Click ⋮ menu → Deactivate/Activate
```
- Deactivate when someone leaves
- Reactivate if they return
- No data is lost

### Managing Products
```
Organization Dashboard → Products Tab
```
- View all products in grid layout
- Edit product settings via ⋮ menu
- See member count and sprint length at a glance

### Navigating Between Org and Projects
```
From Project View: Click "Organization" in left sidebar
From Org Dashboard: Click "Back to Project Dashboard" button
```

---

## 👥 User Roles Explained

### Organization Admin (You!)
- **Access:** Everything
- **Can Do:**
  - Create/edit/delete users
  - Create/edit/delete products
  - Manage organization settings
  - Access all project features
  - View all dashboards

### Admin/Scrum Master
- **Access:** Full project and team management
- **Can Do:**
  - Sprint planning and retrospectives
  - Team management
  - Remove blockers
  - Access admin console
  - View all dashboards
- **Cannot Do:**
  - Create/delete users
  - Create products

### Product Owner
- **Access:** Product and backlog management
- **Can Do:**
  - Manage backlog
  - Define user stories
  - Prioritize features
  - View reports
- **Focus:** What to build

### Developer
- **Access:** Development features
- **Can Do:**
  - Work on tasks
  - Update task status
  - View DAG dependencies
  - Monitor CI/CD
- **Focus:** Building features

### QA Engineer
- **Access:** Testing and quality
- **Can Do:**
  - Test features
  - Report issues
  - View test dashboards
  - Monitor CI/CD
- **Focus:** Quality assurance

---

## 💡 Pro Tips

### Password Management
- ✅ Always use auto-generate for security
- ✅ Copy the password immediately when shown
- ✅ Share passwords securely (email, password manager, etc.)
- ❌ Don't use simple passwords like "password123"

### User Assignment
- Assign users to products during creation for faster setup
- Users can be assigned to multiple products
- Reassign later if team structure changes

### Product Setup
- Start with one product to learn the system
- Add more products as you scale
- Each product is independent with its own backlog/sprints

### Organization Structure
```
Your Organization
├── Users (Developers, QA, POs, etc.)
└── Products
    ├── Product 1
    │   ├── Backlog
    │   ├── Sprints
    │   └── Team Members
    ├── Product 2
    │   ├── Backlog
    │   ├── Sprints
    │   └── Team Members
    └── ...
```

---

## 🎯 Workflow Example

### New Team Member Onboarding
1. **Org Admin Creates User**
   ```
   Organization Dashboard → Create User
   Name: Jane Smith
   Email: jane@company.com
   Role: Developer
   Products: [Select relevant products]
   Password: [Auto-generate]
   ```

2. **Share Credentials**
   - Copy password from success message
   - Email to Jane: "Your login is jane@company.com, password: [copied password]"

3. **Jane Logs In**
   - Goes to login page
   - Enters email and password
   - Sees landing page with role-specific views

4. **Jane Starts Working**
   - Selects Developer Dashboard
   - Views assigned tasks
   - Starts working on sprint items

---

## 🚨 Troubleshooting

### "I can't see the Organization link"
- ✅ Make sure you're logged in as Organization Admin
- ✅ Check your role badge in the top-right corner
- ✅ Only Organization Admins can access org features

### "User can't log in with provided password"
- ✅ Verify you copied the entire password (no spaces)
- ✅ Check caps lock is off
- ✅ Try using the demo accounts first to confirm login works

### "Product isn't showing up"
- ✅ Make sure you're looking in Products tab, not Projects sidebar
- ✅ Products you create appear in the Products tab
- ✅ Refresh the page if needed

### "Can't assign user to product"
- ✅ Create the product first
- ✅ Then edit the user to assign products
- ✅ Or assign during product creation

---

## 📊 Dashboard Overview

### Organization Dashboard Layout
```
┌─────────────────────────────────────────────┐
│  [Your Org Name]  [Organization Admin]      │
│  Manage users, products, and org settings   │
├─────────────────────────────────────────────┤
│  [User Management] [Products]  ← Tabs       │
├─────────────────────────────────────────────┤
│                                             │
│  USER MANAGEMENT:                           │
│  ┌──────────┬──────────┬──────────┐        │
│  │ Search   │          │ [Create] │        │
│  └──────────┴──────────┴──────────┘        │
│                                             │
│  User Table:                                │
│  Name  Email  Role  Products  Status  [⋮]  │
│                                             │
│  PRODUCTS:                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐         │
│  │Product1│ │Product2│ │Product3│         │
│  │  [⋮]   │ │  [⋮]   │ │  [⋮]   │         │
│  └────────┘ └────────┘ └────────┘         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎓 Next Steps

After setting up your organization:

1. **Create all team members** (5-10 minutes)
   - One by one or plan for bulk import feature
   - Assign appropriate roles

2. **Set up products** (10-15 minutes per product)
   - Create main products your team works on
   - Assign team members to each

3. **Explore project features** (ongoing)
   - Navigate to project dashboard
   - Create sprints and user stories
   - Use AI-powered features for task generation
   - Monitor progress with dashboards

4. **Train your team** (1 hour team session)
   - Show them how to log in
   - Tour of their role-specific dashboard
   - Basic task management
   - How to use AI suggestions

---

## 📞 Need Help?

### For Demo/Testing
- Use the existing demo accounts on login page
- They show you what different roles can see
- Switch between roles to understand permissions

### Documentation
- See `ORGANIZATION_FEATURES_IMPLEMENTATION.md` for technical details
- Check component source code for specifics

### Common Questions

**Q: Can users be in multiple products?**
A: Yes! Assign them during user creation or edit later.

**Q: Can I change someone's role?**
A: Yes, edit the user and select a new role from the dropdown.

**Q: What happens when I deactivate a user?**
A: They can't log in, but their data/history remains intact.

**Q: Can I delete products?**
A: Yes, via the ⋮ menu on each product card. Use with caution!

**Q: How do I change my organization name?**
A: Organization settings page (coming in future enhancement).

---

## ✅ Success Checklist

After setup, you should have:
- [ ] Organization registered
- [ ] Organization Admin account working
- [ ] At least one team member created
- [ ] At least one product created
- [ ] Team members assigned to products
- [ ] Able to navigate between Org Dashboard and Projects
- [ ] Team members can log in successfully

---

**Quick Reference Card**
```
Register Org     → Login page → "Register as Organization Admin"
Add User         → Org Dashboard → User Management → Create User
Add Product      → Org Dashboard → Products → Create Product
Access Org Dash  → Left sidebar → "Organization" (Org Admin only)
Back to Projects → Org Dashboard → "Back to Project Dashboard"
```

Happy organizing! 🎉
