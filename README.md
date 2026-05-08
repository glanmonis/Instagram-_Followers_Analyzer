<div>
  <img style="100%" src="https://capsule-render.vercel.app/api?type=waving&height=100&section=header&reversal=true&fontSize=70&fontColor=FFFFFF&fontAlign=50&fontAlignY=50&stroke=-&descSize=20&descAlign=50&descAlignY=50&color=e8d5b0"  />
</div>

###

<h1 align="center">📊 Follograph — Instagram Analytics Tool</h1>

###

<p align="left">Follograph is a modern web application that helps you analyze your Instagram data and understand your real audience.<br>
  Upload your Instagram export files and instantly discover: <br><br>
  ➜ Who doesn’t follow you back 👀<br> 
  ➜ Who you’re not following back 🤔<br> 
  ➜ Your mutual connections 🤝</p>

###

<h2 align="left">🚀 Live Demo</h2>

###

<p align="left">🔗 Try it here:<br>👉 https://instagram-followers-analyzer-theta.vercel.app/</p>

###

<h2 align="left">📸 Screenshots</h2>

###

<img src="Screenshots/Insta Analyzer 1.png" alt="Home Page"/>
<img src="Screenshots/Insta Analyzer 2.png" alt="Home Page"/>
<img src="Screenshots/Insta Analyzer 3.png" alt="Home Page"/>

###

<p align="left"> </p>

###

<h2 align="left">⚙️ Features</h2>

###

<p align="left">
  ➜ 📂 Drag & Drop JSON upload (followers & following) <br>
  ➜ ⚡Instant analysis using Flask backend <br>
  ➜ 📊 Real-time stats with animated counters <br>
  ➜ 🔍 Search usernames <br>
  ➜ 🔤 Sort (A → Z, Z → A) <br>
  ➜ 📱 Fully responsive modern UI<br>🎨 Clean, professional design (glassmorphism + dark theme) <br>
  ➜ 🔐 100% private — your data is never stored </p>

###

<h2 align="left">🛠️ Tech Stack</h2>

###

<p align="left">Frontend<br>HTML5<br>CSS3 (Custom UI design)<br>JavaScript (Vanilla JS)<br>Backend<br>Python<br>Flask<br>Deployment<br>Vercel</p>

###

<h2 align="left">📂 Project Structure</h2>

###

<p align="left">
  Follograph/<br>
  │<br>
  ├── templates/<br>
  │   └── Index.html<br>
  │<br>
  ├── static/<br>
  │   ├── Style.css<br>
  │   ├── Script.js<br>
  │   
  └── Favicon.png<br>
  │<br>
  ├── app.py<br>
  ├── requirements.txt <br>
  ├── vercel.json <br>
  └── README.md </p>

###

<h2 align="left">🧠 How It Works</h2>

###

<p align="left">
  1. Export your Instagram data<br>
  2. Upload:<br>
     • followers.json<br>
     • following.json<br>
  3. Click Run Analysis<br>
  4. View insights instantly</p>

###

<h2 align="left">📤 How to Export Your Instagram Data</h2>

###

<p align="left">Open Instagram ➜ go to Settings <br>
  Navigate to Accounts Center ➜ Your Information and Permissions ➜ Download Your Information <br>
  Select your account, choose JSON as the format, then request the download<br>
  Wait for the email, download and extract the ZIP<br>
  Upload followers.json and following.json to Follograph<br><br><br>
  </p>

###

<h2 align="left">🧠 Backend Logic</h2>

###

<p align="left">The Flask API processes uploaded JSON files and:<br><br>
  Extracts usernames from:<br>
  followers.json<br>
  following.json<br>
  Uses set operations:</p>

###

<p align="left">not_following_back = following - followers<br>not_followed_back = followers - following<br>mutual = followers & following</p>

###

<h2 align="left">🚀 Run Locally</h2>

###

<p align="left">
  1. Clone Repository<br>
  <code> git clone https://github.com/your-username/follograph.git <br>
  cd follograph </code> <br>
  
  2. Install Dependencies<br>
  <code> pip install -r requirements.txt </code> <br>
  
  3. Run Server<br>
  <code> python app.py </code> <br>
  
  4. Open Browser<br>
 <code> http://localhost:5000 </code> </p>

###

<h2 align="left">🔒 Privacy</h2>

###

<p align="left">
  • No login required<br>
  • No database used<br>
  • Files are processed in-memory<br>
  • Nothing is stored or tracked</p>

###

<h2 align="left">🧑‍💻 Developer</h2>

###

<p align="left">Glan Monis<br><br>
  🌐 Portfolio: https://glan-monis-portfolio.netlify.app<br>
  💻 GitHub: https://github.com/glanmonis<br>
  🔗 LinkedIn: https://www.linkedin.com/in/glan-monis</p>

###

<h2 align="left">⭐ Support</h2>

###

<p align="left">If you like this project, give it a ⭐ on GitHub!</p>

###

