# Lesson 1: Welcome to the Web! 🌐

## 🎯 Lesson Goals
- Understand what we're building and how the web works
- Learn about HTML, CSS, and JavaScript
- Set up your development environment
- Run your first web page

---

## 🏠 What is a Website Made Of?

Imagine building a house! A website is like a house with three main parts:

### 🏗️ HTML (The Structure)
**Think of HTML as the skeleton of your house:**
- Walls, floors, and ceilings
- Doors and windows
- Foundation and framework

HTML tells the browser: "Put this text here, that button there, and this image over here."

### 🎨 CSS (The Styling)
**Think of CSS as the paint, furniture, and decorations:**
- Colors and fonts
- Layout and spacing
- Animations and effects

CSS makes everything look beautiful and professional.

### ⚡ JavaScript (The Behavior)
**Think of JavaScript as the electricity and plumbing:**
- Making things interactive
- Responding to user actions
- Processing data and logic

JavaScript makes your website "smart" and responsive.

---

## 🔍 Let's Explore Your Project!

Your Tic-Tac-Toe project is already set up with a tool called **Vite**. Vite is like a super-fast assistant that helps you build websites quickly.

### 📁 Project Structure
Let's look at what files you have:

```
Tic-Tac-Toe/
├── index.html          ← The main page of your website
├── src/
│   ├── main.js         ← Your JavaScript code
│   ├── style.css       ← Your styling
│   └── counter.js      ← Example code (we'll replace this)
├── public/             ← Images and other files
└── package.json        ← Project settings
```

---

## 🚀 Your First Web Page

### Step 1: Start the Development Server

Open your terminal/command prompt in the Tic-Tac-Toe folder and run:

```bash
npm run dev
```

You should see something like:
```
  VITE v6.3.5  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 2: Open Your Website

Click on the link (usually `http://localhost:5173/`) or copy it into your browser. You should see a Vite welcome page!

🎉 **Congratulations! You just ran your first web application!**

---

## 🔧 Let's Make Your First Change

### Step 3: Change the Title

1. Open the `index.html` file in your code editor
2. Find this line:
   ```html
   <title>Vite App</title>
   ```
3. Change it to:
   ```html
   <title>Tic-Tac-Toe Game</title>
   ```
4. Save the file
5. Look at your browser - the title should change instantly!

**Magic!** Vite automatically updates your page when you make changes. This is called "hot reloading."

---

## 🎯 Understanding the Files

### index.html
This is the main page of your website. It's like the blueprint of your house:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tic-Tac-Toe Game</title>  ← We just changed this!
  </head>
  <body>
    <div id="app"></div>  ← This is where your game will go!
    <script type="module" src="/src/main.js"></script>  ← This loads your JavaScript
  </body>
</html>
```

### src/main.js
This file contains your JavaScript code. Right now it has some example code, but we'll replace it with our game logic.

### src/style.css
This file contains all the styling for your website. We'll use it to make our Tic-Tac-Toe board look amazing!

---

## 🧠 Key Concepts You Just Learned

1. **Web Technologies**: HTML (structure), CSS (styling), JavaScript (behavior)
2. **Development Server**: A tool that runs your website locally
3. **Hot Reloading**: Automatic updates when you change your code
4. **File Structure**: How web projects are organized
5. **Basic HTML**: Understanding tags and elements

---

## 🎮 What We're Building

By the end of this course, you'll have a Tic-Tac-Toe game that:
- ✅ Has a beautiful 3x3 game board
- ✅ Lets two players take turns (X and O)
- ✅ Detects wins, losses, and draws
- ✅ Looks professional and polished
- ✅ Works on any device

---

## 🏆 Challenge: Make It Personal

**Optional Challenge:** Try changing more things in your `index.html` file:

1. Change the page title to something fun
2. Add a `<h1>` heading to the body
3. Add some text about your game

Example:
```html
<body>
  <h1>My Awesome Tic-Tac-Toe Game!</h1>
  <p>Welcome to the coolest game ever!</p>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
```

---

## 📚 What's Next?

In **Lesson 2**, we'll:
- Build the actual Tic-Tac-Toe game board
- Learn about HTML elements and CSS styling
- Create a beautiful, responsive layout

---

## 💡 Pro Tips

- **Keep your development server running** while working on your project
- **Save your files frequently** - Vite will automatically update your browser
- **Don't worry about understanding everything at once** - we'll build knowledge step by step
- **Experiment!** Try changing things and see what happens

---

## 🎉 You Did It!

You've successfully:
- ✅ Started your development environment
- ✅ Run your first web application
- ✅ Made your first code change
- ✅ Understood the basics of web development

**You're officially a web developer now!** 🚀

---

**Ready for Lesson 2? Let's build that game board! 🎯** 