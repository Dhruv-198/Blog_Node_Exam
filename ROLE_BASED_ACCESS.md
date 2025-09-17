# Role-Based Access Control Implementation

## Overview
The blog application now implements proper role-based access control with two distinct user roles:

### User Roles

#### 1. **Regular User** (`role: 'user'`)
- **Login Credentials**: user@blog.com / user123
- **Permissions**:
  - ✅ View all published articles
  - ✅ Read individual articles
  - ✅ Browse and search articles
  - ❌ Create articles
  - ❌ Edit articles
  - ❌ Delete articles
  - ❌ Access "My Articles" page
  - ❌ Access admin panel

#### 2. **Admin User** (`role: 'admin'`)
- **Login Credentials**: admin@blog.com / admin123
- **Permissions**:
  - ✅ All user permissions
  - ✅ Create new articles
  - ✅ Edit any article
  - ✅ Delete any article
  - ✅ Access "My Articles" page
  - ✅ Upload article images
  - ✅ Access admin panel
  - ✅ Full CRUD operations

## Implementation Details

### 1. **Middleware Protection**
```javascript
// Admin-only routes use requireAdmin middleware
router.get('/my', requireAdmin, articleController.getUserArticles);
router.get('/new', requireAdmin, ...);
router.post('/new', requireAdmin, ...);
router.get('/:id/edit', requireAdmin, ...);
router.post('/:id/edit', requireAdmin, ...);
router.post('/:id/delete', requireAdmin, ...);
```

### 2. **Controller Validation**
```javascript
// Additional checks in controllers
if (req.user.role !== 'admin') {
    return res.status(403).render('error', {
        message: 'Access denied. Admin privileges required.',
        error: {}
    });
}
```

### 3. **UI Elements**
```ejs
<!-- Navigation shows admin features only for admins -->
<% if (isAuthenticated && isAdmin) { %>
    <li class="nav-item">
        <a href="/articles/my" class="nav-link">My Articles</a>
    </li>
    <li class="nav-item">
        <a href="/articles/new" class="nav-link">Write Article</a>
    </li>
<% } %>
```

### 4. **Article Actions**
```ejs
<!-- Edit/Delete buttons only show for admins -->
<% if (user && user.role === 'admin') { %>
    <a href="/articles/<%= article._id %>/edit" class="btn btn-primary">Edit</a>
    <button class="btn btn-danger">Delete</button>
<% } %>
```

## Testing the Implementation

### As Regular User:
1. Login with: user@blog.com / user123
2. ✅ Can view all articles
3. ✅ Can read individual articles
4. ❌ No "My Articles" link in navigation
5. ❌ No "Write Article" link in navigation
6. ❌ No edit/delete buttons on articles
7. ❌ Cannot access /articles/new (403 error)
8. ❌ Cannot access /articles/my (403 error)

### As Admin User:
1. Login with: admin@blog.com / admin123
2. ✅ Can view all articles
3. ✅ Can read individual articles
4. ✅ "My Articles" link visible in navigation
5. ✅ "Write Article" link visible in navigation
6. ✅ Edit/delete buttons visible on articles
7. ✅ Can access /articles/new
8. ✅ Can access /articles/my
9. ✅ Can perform all CRUD operations

## Security Features
- JWT token validation
- Role verification at middleware level
- Controller-level permission checks
- UI element hiding based on role
- Proper error handling for unauthorized access
- Admin panel access restriction

## File Changes Made
1. `/routes/articles.js` - Added requireAdmin middleware
2. `/controllers/articleController.js` - Added admin-only checks
3. `/views/partials/navbar.ejs` - Role-based navigation
4. `/views/articleItem.ejs` - Admin-only action buttons
5. `/views/articleList.ejs` - Admin-only create buttons
6. `/scripts/createAdmin.js` - Admin user creation
7. `/scripts/createRegularUser.js` - Test user creation