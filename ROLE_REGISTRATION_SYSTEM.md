# Role-Based Registration & Login System

## 🎯 **Overview**
The blog application now supports role selection during registration and login with a strict limit of **maximum 3 administrators**.

## 🔧 **Features Implemented**

### 1. **Registration with Role Selection**
- ✅ Dropdown to choose between "Regular User" and "Administrator"
- ✅ Admin limit enforcement (max 3 admins)
- ✅ Automatic role assignment
- ✅ Role-based redirect after registration

### 2. **Login with Role Verification**
- ✅ Optional role selection for verification
- ✅ Role mismatch detection and error handling
- ✅ Role-based redirect after login

### 3. **Admin Limit Control**
- ✅ Maximum 3 administrators allowed
- ✅ Clear error message when limit reached
- ✅ Automatic fallback to user role suggestion

## 📝 **How It Works**

### **Registration Process:**
1. User fills registration form
2. Selects account type: "Regular User" or "Administrator"
3. System checks admin limit (if admin selected)
4. If admin limit reached (3), shows error and suggests user role
5. If within limit, creates account with selected role
6. Redirects based on role:
   - **Admin** → `/articles/my` (Admin Dashboard)
   - **User** → `/articles` (Article List)

### **Login Process:**
1. User enters email and password
2. Optionally selects expected role for verification
3. System validates credentials
4. If role specified, verifies it matches account role
5. If mismatch, shows descriptive error
6. Redirects based on role:
   - **Admin** → `/articles/my` (Admin Dashboard)
   - **User** → `/articles` (Article List)

## 🔐 **Current Status**

### **Admin Slots:**
- **Used**: 1/3 (Admin User - admin@blog.com)
- **Available**: 2 more admin registrations allowed

### **Test Accounts:**
- **Admin**: admin@blog.com / admin123
- **User**: user@blog.com / user123

## 🧪 **Testing the System**

### **Test 1: Register New Admin (Should Work)**
1. Go to `/auth/register`
2. Fill form and select "Administrator"
3. Should succeed (2 slots remaining)

### **Test 2: Register 4th Admin (Should Fail)**
1. Register 2 more admins first
2. Try to register 4th admin
3. Should show: "Maximum number of administrators (3) has been reached"

### **Test 3: Role Mismatch on Login**
1. Go to `/auth/login`
2. Use user@blog.com / user123
3. Select "Administrator" in role dropdown
4. Should show: "This account is registered as Regular User, not Administrator"

### **Test 4: Successful Role-Based Login**
1. Use admin@blog.com / admin123
2. Select "Administrator" (or leave empty)
3. Should redirect to `/articles/my`

## 📋 **Form Fields**

### **Registration Form:**
- First Name (required)
- Last Name (required)
- Username (required, unique)
- Email (required, unique)
- **Account Type (required)**: Dropdown with "Regular User" / "Administrator"
- Password (required, min 6 chars)
- Bio (optional)

### **Login Form:**
- Email (required)
- Password (required)
- **Login As (optional)**: Dropdown for role verification

## 🛡️ **Security Features**

1. **Admin Limit Enforcement**: Prevents more than 3 admins
2. **Role Validation**: Ensures selected roles are valid
3. **Role Verification**: Optional login role checking
4. **Proper Error Messages**: Clear feedback for users
5. **Automatic Fallbacks**: Suggests alternatives when limits reached

## 📊 **Admin Management**

### **Check Current Admin Status:**
```bash
node scripts/checkAdminLimit.js
```

### **View All Users and Roles:**
```bash
node scripts/checkUsers.js
```

## 🎨 **UI Improvements**

- **Role Selection Dropdown**: Clear options with descriptions
- **Helper Text**: Explains when to choose admin role
- **Error Messages**: Specific feedback for different scenarios
- **Success Messages**: Role-specific welcome messages
- **Automatic Redirects**: Role-appropriate landing pages

## 🔮 **Future Enhancements**

1. **Admin Invitation System**: Invite-only admin registration
2. **Role Change Requests**: Allow role upgrade requests
3. **Admin Activity Logging**: Track admin actions
4. **Role Permissions**: Granular permission system
5. **Bulk User Management**: Admin panel for user management

## 🐛 **Error Scenarios & Messages**

| Scenario | Error Message |
|----------|---------------|
| No role selected | "Please select a valid account type" |
| Admin limit reached | "Maximum number of administrators (3) has been reached. Please register as a regular user." |
| Role mismatch on login | "This account is registered as [ActualRole], not [ExpectedRole]" |
| Invalid role | "Please select a valid account type" |

The system is now fully functional with role-based registration and login capabilities!