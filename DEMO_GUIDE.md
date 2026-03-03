# 🎮 Blocword - Demo Guide

## 🚀 How to View Your Game

Your game is now running at: **http://localhost:8000**

Open this URL in your web browser (Chrome, Firefox, Safari, or Edge)

---

## 📱 What You'll See

### 1. **Landing Page** (First Screen)
```
🎮 Blocword
Catch the letters and spell the word!

[Login]  [Sign Up]

Blocword by llins
```

### 2. **Sign Up Screen** (Click "Sign Up")
```
Create Account

[Your Name        ]
[Email            ]
[Password         ]

[Sign Up]
[Already have an account? Login]
```

### 3. **Login Screen** (Click "Login")
```
Login

[Email            ]
[Password         ]

[Login]
[Don't have an account? Sign Up]
```

### 4. **Main Menu** (After Login/Signup)
```
🎮 Blocword
Welcome, [Your Name]! 👋

[Single Player]
[Multiplayer]
[Logout]
```

---

## 🧪 Testing the Authentication

### Test Flow 1: New User
1. Open http://localhost:8000
2. Click **"Sign Up"**
3. Enter:
   - Name: `TestPlayer`
   - Email: `test@example.com`
   - Password: `password123`
4. Click **"Sign Up"**
5. ✅ You should see: "Welcome, TestPlayer! 👋"

### Test Flow 2: Existing User
1. Click **"Logout"**
2. Click **"Login"**
3. Enter:
   - Email: `test@example.com`
   - Password: `password123`
4. Click **"Login"**
5. ✅ You should see: "Welcome, TestPlayer! 👋"

### Test Flow 3: Auto-Login
1. Close the browser tab
2. Open http://localhost:8000 again
3. ✅ You should automatically see the menu (no login needed)

---

## ⚠️ Current Limitations

Since Firebase is not configured yet, you'll see:
- ❌ "Firebase initialization failed" in browser console
- ❌ Authentication won't actually work
- ❌ Multiplayer won't work

**To make it fully functional:**
1. Follow the Firebase setup guide in `AUTHENTICATION_SETUP.md`
2. Replace the `firebaseConfig` in `game.js` with your real Firebase credentials
3. Enable Authentication in Firebase Console

---

## 🎨 What's New

### Added Features:
✅ Landing page with branding
✅ Sign up form with name, email, password
✅ Login form
✅ Personalized welcome message
✅ Logout button
✅ Auto-login on return visits
✅ Form validation
✅ Responsive design for mobile

### Updated Screens:
- **Landing Page** - New entry point
- **Sign Up** - New screen
- **Login** - New screen
- **Menu** - Now shows welcome message and logout

---

## 🎮 Playing the Game

After logging in, you can:
1. **Single Player** - Play solo with 3 difficulty levels
2. **Multiplayer** - Create/join rooms (requires Firebase setup)

---

## 📝 Files Overview

- `index.html` - All screens including auth
- `game.js` - Game logic + authentication functions
- `style.css` - Styling including auth forms
- `AUTHENTICATION_SETUP.md` - Firebase setup guide
- `README.md` - Original game documentation

---

## 🐛 Troubleshooting

**Can't see the landing page?**
- Make sure you're accessing http://localhost:8000
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

**Forms not working?**
- Check browser console for errors (F12 or Cmd+Option+I)
- Firebase needs to be configured for auth to work

**Styling looks broken?**
- Make sure all files are in the same directory
- Check that style.css loaded (view page source)

---

## 🎯 Next Steps

1. **Test the UI** - See all the new screens
2. **Set up Firebase** - Follow AUTHENTICATION_SETUP.md
3. **Test Authentication** - Create real accounts
4. **Play the Game** - Try single player and multiplayer

Enjoy your game! 🎉
