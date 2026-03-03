# Firebase Authentication Setup Guide

## Additional Steps for Authentication

After completing the basic Firebase setup, follow these steps to enable authentication:

### Step 1: Enable Email/Password Authentication

1. In the Firebase Console, click **"Build"** in the left sidebar
2. Click **"Authentication"**
3. Click **"Get started"**
4. Click on the **"Sign-in method"** tab
5. Click on **"Email/Password"**
6. Toggle **"Enable"** to ON
7. Click **"Save"**

### Step 2: Update Database Rules (Security)

Since users are now authenticated, update your Realtime Database rules for better security:

1. Go to **Realtime Database** > **Rules** tab
2. Replace with these rules:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": "auth != null",
        ".write": "auth != null",
        ".indexOn": ["createdAt", "status"]
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

3. Click **"Publish"**

### Step 3: Test Your Authentication

1. Open your game in a browser
2. You should see the landing page with "Login" and "Sign Up" buttons
3. Click "Sign Up" and create an account
4. After signup, you'll be automatically logged in and see "Welcome, [Your Name]!"
5. You can logout and login again to test

### Features Implemented

✅ **Landing Page** - First screen users see with login/signup options
✅ **Sign Up** - Create new account with name, email, and password
✅ **Login** - Existing users can login
✅ **Welcome Message** - Personalized greeting with user's name
✅ **Logout** - Users can logout and return to landing page
✅ **Auto-Login** - Users stay logged in when they return to the game
✅ **Form Validation** - Email format, password length, required fields

### User Flow

1. **New User**: Landing Page → Sign Up → Menu (with welcome message)
2. **Returning User**: Landing Page → Login → Menu (with welcome message)
3. **Auto-Login**: If already logged in → Direct to Menu

### Security Notes

- Passwords are securely hashed by Firebase (never stored in plain text)
- Minimum password length: 6 characters
- Email validation is handled by Firebase
- Database rules ensure only authenticated users can access game data
- Users can only read/write their own user data

### Troubleshooting

**"Firebase initialization failed"**
- Make sure you've replaced the firebaseConfig with your actual Firebase credentials

**"Email already in use"**
- This email is already registered. Use the login screen instead.

**"Invalid email or password"**
- Check your email and password are correct
- Passwords are case-sensitive

**Can't see the landing page**
- Clear your browser cache and reload
- Check browser console for errors

### Optional Enhancements (Future)

- Password reset via email
- Google Sign-In
- Profile pictures
- Username display in multiplayer
- User statistics and leaderboards
- Email verification
