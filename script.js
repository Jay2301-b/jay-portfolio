// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-loaded');
  document.getElementById('year').textContent = new Date().getFullYear();
  initializeMenu();
  initializeScrollButton();
  initializeEmailForm();
});

function initializeMenu() {
  const hamburger = document.getElementById('hamb');
  const menu = document.getElementById('menu');

  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    menu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      menu.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
      hamburger.classList.remove('active');
      menu.classList.remove('active');
    }
  });
}

// SCROLL DOWN BUTTON
function initializeScrollButton() {
  const scrollDown = document.getElementById('scrollDown');
  
  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// EMAIL CONTACT FORM - Using Formspree
function initializeEmailForm() {
  const emailBtn = document.getElementById('emailBtn');
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if (emailBtn) {
    emailBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const nameInput = contactForm.querySelector('input[name="name"]');
      const emailInput = contactForm.querySelector('input[name="email"]');
      const messageInput = contactForm.querySelector('textarea[name="message"]');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      // Validate form
      if (!name || !email || !message) {
        formMsg.textContent = '❌ Please fill all fields!';
        formMsg.style.color = '#d32f2f';
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formMsg.textContent = '❌ Please enter a valid email!';
        formMsg.style.color = '#d32f2f';
        return;
      }

      // Disable button
      emailBtn.disabled = true;
      emailBtn.style.opacity = '0.6';

      // Show sending message
      formMsg.textContent = '📧 Sending email...';
      formMsg.style.color = '#1e90ff';

      // Create FormData
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('message', message);
      formData.append('_subject', `New message from ${name}`);

      // Send using Formspree
      fetch('https://formspree.io/f/mbjqloqd', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          formMsg.textContent = '✅ Email sent successfully!';
          formMsg.style.color = '#4caf50';
          
          // Clear form
          setTimeout(() => {
            contactForm.reset();
            formMsg.textContent = '';
            emailBtn.disabled = false;
            emailBtn.style.opacity = '1';
          }, 2000);
        } else {
          throw new Error('Failed to send');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        formMsg.textContent = '❌ Failed to send email. Please try again.';
        formMsg.style.color = '#d32f2f';
        emailBtn.disabled = false;
        emailBtn.style.opacity = '1';
      });
    });
  }
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  });

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌙';
  }
}

// ===== AI CHATBOT =====

const aiToggle = document.getElementById('aiToggle');
const aiChatbot = document.getElementById('aiChatbot');
const closeChatbot = document.getElementById('closeChatbot');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');

const knowledgeBase = {
  skills: {
    keywords: ['skill', 'what do you', 'expertise', 'good at', 'know', 'proficient', 'backend', 'technology'],
    response: "Jay specializes in: Node.js, Express.js, MongoDB, PostgreSQL, REST APIs, JWT Authentication, Socket.io, Redis, and clean code architecture. He focuses on scalable systems and efficient databases!"
  },
  projects: {
    keywords: ['project', 'work', 'build', 'create', 'portfolio', 'showcase', 'api', 'server', 'database'],
    response: "Jay has built 3 main projects:\n1. RESTful API Server - Scalable API with auth (Node.js, Express, MongoDB)\n2. E-commerce Backend - Complete backend with payment gateway (Node.js, PostgreSQL, JWT)\n3. Real-time Chat Server - WebSocket server with message queuing (Node.js, Socket.io, Redis)"
  },
  contact: {
    keywords: ['contact', 'reach', 'email', 'call', 'phone', 'whatsapp', 'message', 'communicate', 'connect', 'hire'],
    response: "You can reach Jay at:\n📧 Email: buddhbattijay2301@gmail.com\n📱 WhatsApp: +917069550828\n📞 Phone: +917069550828\nOr use the contact form on the website!"
  },
  freelance: {
    keywords: ['freelance', 'hire', 'work', 'available', 'rate', 'project', 'contract', 'job'],
    response: "Yes! Jay is available for freelance work. He offers:\n✅ Backend API Development\n✅ Database Design & Optimization\n✅ Server Architecture\n✅ Remote & On-site work\nContact him via email or the contact form!"
  },
  experience: {
    keywords: ['experience', 'background', 'history', 'worked', 'career', 'professional'],
    response: "Jay is a passionate Backend Developer with BCA degree (65%). He specializes in building scalable server systems, efficient databases, and robust APIs."
  },
  education: {
    keywords: ['education', 'degree', 'study', 'college', 'school', 'qualification'],
    response: "Jay's Education:\n🎓 BCA – 65%\n🎓 12th Grade – 55%\n🎓 10th Grade – 60%"
  },
  resume: {
    keywords: ['resume', 'cv', 'download', 'profile'],
    response: "You can download Jay's Resume from the navigation menu at the top right. It has all his backend development details!"
  },
  about: {
    keywords: ['about', 'who is', 'tell me', 'introduce', 'jay'],
    response: "Hey! I'm Jay Buddhbhatti, a Backend Developer who loves building scalable & robust systems. I focus on clean architecture, efficient databases, and secure APIs. Currently working with Node.js, Express, and various databases!"
  },
  database: {
    keywords: ['database', 'sql', 'mongodb', 'postgresql', 'nosql'],
    response: "Jay has expertise in both SQL (PostgreSQL) and NoSQL (MongoDB) databases. He specializes in database design, optimization, and schema management for scalable applications."
  }
};

if (aiToggle) {
  aiToggle.addEventListener('click', () => {
    aiChatbot.classList.toggle('active');
    if (aiChatbot.classList.contains('active')) {
      userInput.focus();
    }
  });
}

if (closeChatbot) {
  closeChatbot.addEventListener('click', () => {
    aiChatbot.classList.remove('active');
  });
}

if (sendBtn) {
  sendBtn.addEventListener('click', sendMessage);
}

if (userInput) {
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

document.querySelectorAll('.suggestion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const question = btn.getAttribute('data-question');
    userInput.value = question;
    sendMessage();
  });
});

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  userInput.value = '';

  setTimeout(() => {
    const response = getSmartResponse(message);
    addMessage(response, 'bot');
  }, 500);
}

function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  messageDiv.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getSmartResponse(userMessage) {
  const message = userMessage.toLowerCase();

  for (const [category, data] of Object.entries(knowledgeBase)) {
    for (const keyword of data.keywords) {
      if (message.includes(keyword)) {
        return data.response;
      }
    }
  }

  if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
    return "Hey! 👋 Welcome to Jay's portfolio. How can I help you today?";
  }

  if (message.includes('thank')) {
    return "You're welcome! 😊 Feel free to ask me anything else!";
  }

  return "That's a great question! 🤔 I can help with skills, projects, contact, or freelance info. What would you like to know?";
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
