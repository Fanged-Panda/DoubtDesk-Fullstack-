const coursesSeed = [
  { id: 1, category: "Science", title: "HSC Physics", price: 3000 },
  { id: 2, category: "Admission", title: "Engineering Prep", price: 4500 },
  { id: 3, category: "Math", title: "SSC Math", price: 2500 },
  { id: 4, category: "Biology", title: "Medical Prep", price: 4800 },
  { id: 5, category: "English", title: "Spoken English", price: 1800 },
  { id: 6, category: "ICT", title: "Programming Basics", price: 3500 }
];

const defaultUsers = [
  { name: "Student Demo", email: "student@demo.com", password: "123456", role: "student", institute: "Demo College", levelOfStudy: "HSC" },
  { name: "Teacher Demo", email: "teacher@demo.com", password: "123456", role: "teacher", institute: "Demo College", qualification: "MSc" },
  { name: "Admin Demo", email: "admin@demo.com", password: "123456", role: "admin", phoneNumber: "01700000000" }
];

const store = {
  get(key, fallback) {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

if (!localStorage.getItem("dd-users")) store.set("dd-users", defaultUsers);
if (!localStorage.getItem("dd-courses")) store.set("dd-courses", coursesSeed);
if (!localStorage.getItem("dd-enrollments")) store.set("dd-enrollments", {});
if (!localStorage.getItem("dd-questions")) {
  store.set("dd-questions", [
    { id: 1, studentEmail: "student@demo.com", title: "Newton's Law confusion", description: "Need derivation of F=ma.", status: "pending", answer: "" },
    { id: 2, studentEmail: "student@demo.com", title: "Calculus limit", description: "How to solve sinx/x?", status: "solved", answer: "Use standard limit as x -> 0." }
  ]);
}

const app = document.getElementById("app");

const rolePaths = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  admin: "/admin/dashboard"
};

function currentUser() {
  return store.get("dd-session", null);
}

function setCurrentUser(user) {
  store.set("dd-session", user);
}

function route() {
  const hash = window.location.hash || "#/";
  return hash.startsWith("#") ? hash.slice(1) : hash;
}

function go(path) {
  window.location.hash = `#${path}`;
}

function navHtml() {
  const user = currentUser();
  const desktopPublic = `
    <a class="nav-link" href="#/" data-scroll-courses="1">Courses</a>
    <div class="dropdown" id="join-dropdown">
      <button class="nav-button" id="join-btn">Join as</button>
      <div class="menu">
        <a href="#/login/teacher">Teacher</a>
        <a href="#/login/student">Student</a>
        <a href="#/login/admin">Admin</a>
      </div>
    </div>
  `;

  const desktopPrivate = user
    ? `
    <a class="nav-link" href="#${rolePaths[user.role]}">Dashboard</a>
    ${user.role === "teacher" ? '<a class="nav-link" href="#/teacher/solved">Solved Questions</a>' : ""}
    <a class="nav-link" href="#/${user.role}/profile">Profile</a>
    <button class="cta" id="logout-btn">Logout</button>
  `
    : "";

  const mobilePublic = `
    <a class="nav-link" href="#/" data-scroll-courses="1">Courses</a>
    <a class="nav-link" href="#/login/teacher">Teacher Login</a>
    <a class="nav-link" href="#/login/student">Student Login</a>
    <a class="nav-link" href="#/login/admin">Admin Login</a>
  `;

  const mobilePrivate = user
    ? `
    <a class="nav-link" href="#${rolePaths[user.role]}">Dashboard</a>
    ${user.role === "teacher" ? '<a class="nav-link" href="#/teacher/solved">Solved Questions</a>' : ""}
    <a class="nav-link" href="#/${user.role}/profile">Profile</a>
    <button class="cta" id="mobile-logout-btn">Logout</button>
  `
    : "";

  return `
    <header class="navbar">
      <div class="nav-inner">
        <a class="brand" href="#${user ? rolePaths[user.role] : "/"}">
          <img src="./assets/logo.png" alt="DoubtDesk logo" />
          <span>DoubtDesk</span>
        </a>
        <div class="nav-links">${user ? desktopPrivate : desktopPublic}</div>
        <button class="mobile-toggle" id="mobile-toggle">☰</button>
      </div>
      <div class="mobile-panel" id="mobile-panel">${user ? mobilePrivate : mobilePublic}</div>
    </header>
  `;
}

function footerHtml() {
  return `
    <footer class="footer">
      <div class="footer-inner">
        <div>© ${new Date().getFullYear()} DoubtDesk. All rights reserved.</div>
        <div class="footer-links">
          <a href="#/">Privacy Policy</a>
          <a href="#/">Terms of Service</a>
          <a href="#/">FAQ</a>
        </div>
      </div>
    </footer>
  `;
}

function homePage() {
  const courses = store.get("dd-courses", []);
  const user = currentUser();
  const enrollments = store.get("dd-enrollments", {});
  const currentEnrollments = user && user.role === "student" ? enrollments[user.email] || [] : [];

  const cards = courses
    .map((course) => {
      const enrolled = currentEnrollments.includes(course.title);
      return `
        <article class="course-card">
          <div class="course-top">
            <h3>${course.category}</h3>
            <p>${course.title}</p>
          </div>
          <div class="course-main">
            <h4>${course.title}</h4>
            <ul>
              <li>All subjects covered</li>
              <li>Ask unlimited questions</li>
              <li>24/7 doubt posting facility</li>
            </ul>
            <div class="actions">
              <button class="pill purple">${course.price} BDT</button>
              <button class="pill ${enrolled ? "gray" : "green"}" data-enroll="${course.title}" ${enrolled ? "disabled" : ""}>
                ${enrolled ? "Already Enrolled" : "Enroll Now"}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <main class="main">
      <section class="section">
        <h1 class="hero-title">From Confusion to Clarity - DoubtDesk</h1>
        <div class="hero-card">
          <div class="hero-copy">
            <h3>DoubtDesk - Your Personal Doubt-Solving Companion</h3>
            <p>Struggling with a question? DoubtDesk helps students get clear, subject-specific answers from expert teachers.</p>
          </div>
          <div class="hero-media">
            <img src="./assets/stress.png" alt="Student thinking" />
          </div>
        </div>
      </section>
      <section class="section" id="courses-section">
        <h2 class="hero-title">Our Popular Courses</h2>
        <div class="cards">${cards}</div>
      </section>
    </main>
  `;
}

function authPanel(title, inner, hint = "") {
  return `<main class="main"><section class="section"><div class="panel"><h2>${title}</h2>${inner}${hint}</div></section></main>`;
}

function loginPage(role, title, registerPath) {
  return authPanel(
    title,
    `<form id="login-form" class="form-grid">
      <input type="email" name="email" placeholder="Enter your email" required />
      <input type="password" name="password" placeholder="Enter your password" required />
      <button class="cta" type="submit">Login</button>
      <div id="login-message"></div>
    </form>`,
    `<p>Don't have an account? <a href="#${registerPath}" style="color:#2563eb;font-weight:700">Register now.</a></p>`
  );
}

function registerPage(role, title) {
  const fields = {
    student: `
      <input name="name" placeholder="Enter your name" required />
      <input name="institute" placeholder="Enter your institute's name" required />
      <select name="levelOfStudy" required>
        <option value="">Select Study Level</option>
        <option>SSC</option>
        <option>HSC</option>
        <option>Admission</option>
      </select>
      <input name="email" type="email" placeholder="Enter your email address" required />
      <input name="password" type="password" placeholder="Enter password" required />
      <input name="confirmPassword" type="password" placeholder="Confirm password" required />
    `,
    teacher: `
      <input name="name" placeholder="Enter your name" required />
      <input name="institute" placeholder="Enter your institute's name" required />
      <input name="qualification" placeholder="Enter your qualification" required />
      <input name="email" type="email" placeholder="Enter your email address" required />
      <input name="password" type="password" placeholder="Enter password" required />
      <input name="confirmPassword" type="password" placeholder="Confirm password" required />
    `,
    admin: `
      <input name="name" placeholder="Enter your name" required />
      <input name="phoneNumber" placeholder="Enter your phone number" required />
      <input name="email" type="email" placeholder="Enter your email" required />
      <input name="password" type="password" placeholder="Enter password" required />
      <input name="confirmPassword" type="password" placeholder="Confirm password" required />
    `
  };

  return authPanel(
    title,
    `<form id="register-form" class="form-grid" data-role="${role}">${fields[role]}
      <button class="cta" type="submit">Submit</button>
      <div id="register-message"></div>
    </form>`,
    `<p>Already have an account? <a href="#/login/${role}" style="color:#2563eb;font-weight:700">Login now.</a></p>`
  );
}

function studentDashboard() {
  const user = guardRole("student");
  if (!user) return "";
  const courses = store.get("dd-enrollments", {})[user.email] || [];

  const rows = courses.length
    ? courses
        .map((course) => `<tr><td>${course}</td><td><button class="cta" data-go-course="${course}">Go to Course</button></td></tr>`)
        .join("")
    : `<tr><td colspan="2">You haven't enrolled in any courses yet.</td></tr>`;

  return `
    <main class="main"><section class="section">
      <div class="panel">
        <h2>Student Dashboard</h2>
        <table class="table">
          <thead><tr><th>Enrolled Course</th><th>Action</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <button class="cta" style="margin-top:14px" id="buy-course-btn">Buy Courses</button>
      </div>
    </section></main>
  `;
}

function studentCourseDetails() {
  const user = guardRole("student");
  if (!user) return "";
  const selected = sessionStorage.getItem("dd-selected-course") || (store.get("dd-enrollments", {})[user.email] || [])[0] || "No course selected";
  return `
    <main class="main"><section class="section"><div class="panel">
      <h2>Course Details</h2>
      <p><strong>Course:</strong> ${selected}</p>
      <ul>
        <li>Subject 1: Core Concepts</li>
        <li>Subject 2: Practice Questions</li>
        <li>Subject 3: Weekly Assessment</li>
      </ul>
      <button class="cta" id="ask-doubt-nav">Ask Doubt</button>
    </div></section></main>
  `;
}

function studentAskDoubt() {
  guardRole("student");
  return authPanel(
    "Ask a Doubt",
    `<form id="ask-doubt-form" class="form-grid">
      <input name="title" placeholder="Question title" required />
      <textarea name="description" rows="5" placeholder="Question description" required></textarea>
      <button class="cta" type="submit">Post Question</button>
      <div id="doubt-message"></div>
    </form>`
  );
}

function studentQuestionHistory() {
  const user = guardRole("student");
  if (!user) return "";
  const questions = store.get("dd-questions", []).filter((q) => q.studentEmail === user.email);
  const rows = questions
    .map(
      (q) => `<tr><td>${q.title}</td><td><span class="badge ${q.status === "solved" ? "solved" : "pending"}">${q.status}</span></td><td>${q.answer || "-"}</td></tr>`
    )
    .join("");

  return `<main class="main"><section class="section"><div class="panel"><h2>Question History</h2><table class="table"><thead><tr><th>Question</th><th>Status</th><th>Answer</th></tr></thead><tbody>${rows || "<tr><td colspan='3'>No questions yet.</td></tr>"}</tbody></table></div></section></main>`;
}

function enrollPage() {
  const user = guardRole("student");
  if (!user) return "";
  const enrollments = store.get("dd-enrollments", {})[user.email] || [];
  return `<main class="main"><section class="section"><div class="panel"><h2>Enrollment Summary</h2><p>Current enrolled courses:</p><ul>${enrollments.map((c) => `<li>${c}</li>`).join("") || "<li>No courses</li>"}</ul></div></section></main>`;
}

function profilePage(role) {
  const user = guardRole(role);
  if (!user) return "";
  return `<main class="main"><section class="section"><div class="panel"><h2>${role[0].toUpperCase() + role.slice(1)} Profile</h2><div class="form-grid"><input value="${user.name || ""}" disabled /><input value="${user.email || ""}" disabled /><input value="${user.institute || user.qualification || user.phoneNumber || "N/A"}" disabled /></div></div></section></main>`;
}

function teacherDashboard() {
  guardRole("teacher");
  const questions = store.get("dd-questions", []).filter((q) => q.status !== "solved");
  const cards = questions
    .map(
      (q) => `<tr><td>${q.title}</td><td>${q.description}</td><td><span class="badge pending">${q.status}</span></td><td><button class="cta" data-solve="${q.id}">Solve</button></td></tr>`
    )
    .join("");
  return `<main class="main"><section class="section"><div class="panel"><h2>Pending Questions</h2><table class="table"><thead><tr><th>Question</th><th>Description</th><th>Status</th><th>Action</th></tr></thead><tbody>${cards || "<tr><td colspan='4'>No pending questions assigned.</td></tr>"}</tbody></table></div></section></main>`;
}

function teacherSolved() {
  guardRole("teacher");
  const solved = store.get("dd-questions", []).filter((q) => q.status === "solved");
  return `<main class="main"><section class="section"><div class="panel"><h2>Solved Questions</h2><table class="table"><thead><tr><th>Question</th><th>Answer</th></tr></thead><tbody>${solved.map((q) => `<tr><td>${q.title}</td><td>${q.answer}</td></tr>`).join("") || "<tr><td colspan='2'>No solved questions yet.</td></tr>"}</tbody></table></div></section></main>`;
}

function adminDashboard() {
  guardRole("admin");
  const users = store.get("dd-users", []);
  const courses = store.get("dd-courses", []);
  const questions = store.get("dd-questions", []);
  const enrollments = Object.values(store.get("dd-enrollments", {})).flat().length;

  const stats = [
    { label: "Students", value: users.filter((u) => u.role === "student").length },
    { label: "Teachers", value: users.filter((u) => u.role === "teacher").length },
    { label: "Courses", value: courses.length },
    { label: "Pending Questions", value: questions.filter((q) => q.status !== "solved").length },
    { label: "Money Flow (BDT)", value: enrollments * 1000 }
  ];

  return `<main class="main"><section class="section"><div class="panel"><h2>Admin Dashboard</h2><div class="grid-3">${stats.map((s) => `<div class="stat"><h3>${s.label}</h3><p>${s.value}</p></div>`).join("")}</div></div></section></main>`;
}

function adminTables(type) {
  guardRole("admin");
  const users = store.get("dd-users", []);
  const courses = store.get("dd-courses", []);
  const questions = store.get("dd-questions", []);

  if (type === "students") {
    const students = users.filter((u) => u.role === "student");
    return panelTable("Students Management", ["Name", "Email", "Institute"], students.map((s) => [s.name, s.email, s.institute || "-"]));
  }
  if (type === "teachers") {
    const teachers = users.filter((u) => u.role === "teacher");
    return panelTable("Teachers Management", ["Name", "Email", "Qualification"], teachers.map((t) => [t.name, t.email, t.qualification || "-"]));
  }
  if (type === "courses") {
    return panelTable("Courses Management", ["Category", "Title", "Price"], courses.map((c) => [c.category, c.title, `${c.price} BDT`]));
  }
  if (type === "qa") {
    return panelTable("Questions & Answers", ["Question", "Status", "Answer"], questions.map((q) => [q.title, q.status, q.answer || "-"]));
  }
  return panelTable("Money Flow Management", ["Metric", "Value"], [["Total Enrollments", Object.values(store.get("dd-enrollments", {})).flat().length], ["Estimated Revenue", `${Object.values(store.get("dd-enrollments", {})).flat().length * 1000} BDT`]]);
}

function addCoursePage() {
  guardRole("admin");
  return authPanel(
    "Add Course",
    `<form id="add-course-form" class="form-grid">
      <input name="category" placeholder="Category" required />
      <input name="title" placeholder="Course title" required />
      <input name="price" type="number" placeholder="Price in BDT" required />
      <button class="cta" type="submit">Add Course</button>
      <div id="add-course-message"></div>
    </form>`
  );
}

function panelTable(title, headers, rows) {
  return `<main class="main"><section class="section"><div class="panel"><h2>${title}</h2><table class="table"><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${headers.length}">No data found.</td></tr>`}</tbody></table></div></section></main>`;
}

function guardRole(role) {
  const user = currentUser();
  if (!user || user.role !== role) {
    go(`/login/${role}`);
    return null;
  }
  return user;
}

function renderRoute(path) {
  switch (path) {
    case "/":
      return homePage();
    case "/login/student":
      return loginPage("student", "Student Login", "/register/student");
    case "/login/teacher":
      return loginPage("teacher", "Teacher Login", "/register/teacher");
    case "/login/admin":
      return loginPage("admin", "Admin Login", "/register/admin");
    case "/register/student":
      return registerPage("student", "Student Registration");
    case "/register/teacher":
      return registerPage("teacher", "Teacher Registration");
    case "/register/admin":
      return registerPage("admin", "Admin Registration");
    case "/student/dashboard":
      return studentDashboard();
    case "/student/course-details":
      return studentCourseDetails();
    case "/student/ask-doubt":
      return studentAskDoubt();
    case "/student/question-history":
      return studentQuestionHistory();
    case "/student/enroll":
      return enrollPage();
    case "/student/profile":
      return profilePage("student");
    case "/teacher/dashboard":
      return teacherDashboard();
    case "/teacher/solved":
      return teacherSolved();
    case "/teacher/profile":
      return profilePage("teacher");
    case "/admin/dashboard":
      return adminDashboard();
    case "/admin/students":
      return adminTables("students");
    case "/admin/teachers":
      return adminTables("teachers");
    case "/admin/courses":
      return adminTables("courses");
    case "/admin/add-course":
      return addCoursePage();
    case "/admin/qa":
      return adminTables("qa");
    case "/admin/money-flow":
      return adminTables("money");
    case "/admin/profile":
      return profilePage("admin");
    default:
      return authPanel("Page Not Found", `<p>Route <strong>${path}</strong> does not exist.</p><p><a href="#/">Go back home</a></p>`);
  }
}

function handleGlobalEvents() {
  const join = document.getElementById("join-dropdown");
  const joinBtn = document.getElementById("join-btn");
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobilePanel = document.getElementById("mobile-panel");

  if (join && joinBtn) {
    joinBtn.addEventListener("click", () => join.classList.toggle("open"));
    document.addEventListener("click", (e) => {
      if (!join.contains(e.target)) join.classList.remove("open");
    });
  }

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener("click", () => mobilePanel.classList.toggle("open"));
  }

  const logout = document.getElementById("logout-btn");
  const mobileLogout = document.getElementById("mobile-logout-btn");
  [logout, mobileLogout].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      setCurrentUser(null);
      go("/");
      render();
    });
  });

  document.querySelectorAll("[data-scroll-courses='1']").forEach((el) => {
    el.addEventListener("click", (e) => {
      const onHome = route() === "/";
      if (!onHome) return;
      e.preventDefault();
      document.getElementById("courses-section")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-enroll]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const courseTitle = btn.getAttribute("data-enroll");
      const user = currentUser();
      if (!user || user.role !== "student") {
        sessionStorage.setItem("dd-after-login", "enroll");
        sessionStorage.setItem("dd-selected-course", courseTitle);
        go("/login/student");
        return;
      }

      const enrollments = store.get("dd-enrollments", {});
      const list = enrollments[user.email] || [];
      if (!list.includes(courseTitle)) list.push(courseTitle);
      enrollments[user.email] = list;
      store.set("dd-enrollments", enrollments);
      sessionStorage.setItem("dd-selected-course", courseTitle);
      go("/student/enroll");
    });
  });

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(loginForm);
      const email = String(fd.get("email") || "").trim();
      const password = String(fd.get("password") || "");
      const currentPath = route();
      const role = currentPath.split("/").pop();
      const msg = document.getElementById("login-message");

      const users = store.get("dd-users", []);
      const user = users.find((u) => u.email === email && u.password === password);
      if (!user || user.role !== role) {
        msg.innerHTML = '<p class="error">Invalid email or password for this role.</p>';
        return;
      }

      setCurrentUser(user);
      msg.innerHTML = '<p class="success">Success! Logging in...</p>';

      const after = sessionStorage.getItem("dd-after-login");
      if (after === "enroll" && role === "student") {
        sessionStorage.removeItem("dd-after-login");
        setTimeout(() => go("/student/enroll"), 200);
        return;
      }
      setTimeout(() => go(rolePaths[role]), 200);
    });
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(registerForm);
      const role = registerForm.getAttribute("data-role");
      const data = Object.fromEntries(fd.entries());
      const msg = document.getElementById("register-message");
      const users = store.get("dd-users", []);

      if (data.password !== data.confirmPassword) {
        msg.innerHTML = '<p class="error">Passwords do not match.</p>';
        return;
      }
      if (users.some((u) => u.email === data.email)) {
        msg.innerHTML = '<p class="error">This email is already registered.</p>';
        return;
      }

      delete data.confirmPassword;
      data.role = role;
      users.push(data);
      store.set("dd-users", users);
      msg.innerHTML = '<p class="success">Registration successful. Redirecting...</p>';
      setTimeout(() => go(`/login/${role}`), 250);
    });
  }

  const buyBtn = document.getElementById("buy-course-btn");
  if (buyBtn) buyBtn.addEventListener("click", () => go("/"));

  document.querySelectorAll("[data-go-course]").forEach((btn) => {
    btn.addEventListener("click", () => {
      sessionStorage.setItem("dd-selected-course", btn.getAttribute("data-go-course"));
      go("/student/course-details");
    });
  });

  const askDoubtNav = document.getElementById("ask-doubt-nav");
  if (askDoubtNav) askDoubtNav.addEventListener("click", () => go("/student/ask-doubt"));

  const askDoubtForm = document.getElementById("ask-doubt-form");
  if (askDoubtForm) {
    askDoubtForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = currentUser();
      if (!user) return;
      const fd = new FormData(askDoubtForm);
      const questions = store.get("dd-questions", []);
      questions.unshift({
        id: Date.now(),
        studentEmail: user.email,
        title: fd.get("title"),
        description: fd.get("description"),
        status: "pending",
        answer: ""
      });
      store.set("dd-questions", questions);
      document.getElementById("doubt-message").innerHTML = '<p class="success">Question posted successfully.</p>';
      askDoubtForm.reset();
    });
  }

  document.querySelectorAll("[data-solve]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-solve"));
      const questions = store.get("dd-questions", []);
      const target = questions.find((q) => q.id === id);
      if (target) {
        target.status = "solved";
        target.answer = "This is the teacher solution for your question.";
      }
      store.set("dd-questions", questions);
      render();
    });
  });

  const addCourseForm = document.getElementById("add-course-form");
  if (addCourseForm) {
    addCourseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(addCourseForm);
      const courses = store.get("dd-courses", []);
      courses.push({
        id: Date.now(),
        category: fd.get("category"),
        title: fd.get("title"),
        price: Number(fd.get("price"))
      });
      store.set("dd-courses", courses);
      document.getElementById("add-course-message").innerHTML = '<p class="success">Course added successfully.</p>';
      addCourseForm.reset();
    });
  }
}

function render() {
  const path = route();
  app.innerHTML = `
    <div class="site">
      ${navHtml()}
      ${renderRoute(path)}
      ${footerHtml()}
    </div>
  `;
  handleGlobalEvents();
}

window.addEventListener("hashchange", render);
window.addEventListener("load", render);
