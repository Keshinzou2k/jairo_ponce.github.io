'use strict';

// Setup project galleries
function setupProjectGalleries() {
  // This function is now handled by the template rendering
  // to avoid duplicate image handling
}

// Remove the event listener since we're using the template system
// document.addEventListener('DOMContentLoaded', setupProjectGalleries);

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// filter variables
const filterFunc = function (selectedValue) {
  const filterItems = document.querySelectorAll("[data-filter-item]");
  filterItems.forEach(item => {
    const category = item.dataset.category?.toLowerCase();
    if (selectedValue === "all") {
      item.style.display = "block";
      item.classList.add("active");
    } else if (category && category === selectedValue) {
      item.style.display = "block";
      item.classList.add("active");
    } else {
      item.style.display = "none";
      item.classList.remove("active");
    }
  });
};

// Initialize filtering system
const initializeFiltering = () => {
  const projectItems = document.querySelectorAll("[data-filter-item]");
  const filterContainer = document.querySelector(".filter-list");
  const selectList = document.querySelector(".select-list");
  const select = document.querySelector("[data-select]");
  const selectValue = document.querySelector("[data-select-value]");

  // Predefined categories
  const categories = new Set([
    'all',
    'web application',
    'board design'
  ]);

  // Clear existing filter buttons and select items
  if (filterContainer) {
    filterContainer.innerHTML = '';
  }
  if (selectList) {
    selectList.innerHTML = '';
  }

  // Create filter buttons and select items
  categories.forEach(category => {
    // Create filter button
    const filterItem = document.createElement('li');
    filterItem.className = 'filter-item';
    const btn = document.createElement('button');
    btn.setAttribute('data-filter-btn', '');
    btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    if (category === 'all') {
      btn.classList.add('active');
    }
    filterItem.appendChild(btn);
    filterContainer?.appendChild(filterItem);

    // Create select item
    const selectItem = document.createElement('li');
    selectItem.className = 'select-item';
    const selectBtn = document.createElement('button');
    selectBtn.setAttribute('data-select-item', '');
    selectBtn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    selectItem.appendChild(selectBtn);
    selectList?.appendChild(selectItem);
  });

  // Reinitialize select functionality
  select?.addEventListener("click", function () { 
    elementToggleFunc(this); 
  });

  // Add event listeners to new select items
  const selectItems = document.querySelectorAll("[data-select-item]");
  selectItems.forEach(item => {
    item.addEventListener("click", function () {
      const selectedValue = this.innerText.toLowerCase();
      if (selectValue) {
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);
      }
    });
  });

  // Setup filter buttons
  setupFilterButtons(selectValue);
};

// add event in all filter button items for large screen
const setupFilterButtons = (selectValue) => {
  const filterBtns = document.querySelectorAll("[data-filter-btn]");
  let lastClickedBtn = filterBtns[0];

  filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) {
        selectValue.innerText = this.innerText;
      }
      filterFunc(selectedValue);
      
      // Update active state of filter buttons
      lastClickedBtn?.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });
};

// Initialize filtering on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeFiltering();
  setupFilterButtons();
});

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// Project modal variables
const modalProjectItems = document.querySelectorAll(".project-item");
const projectModalContainer = document.querySelector("[data-project-modal-container]");
const projectModalCloseBtn = document.querySelector("[data-project-modal-close-btn]");
const projectOverlay = document.querySelector("[data-project-overlay]");
const projectModalImg = document.querySelector("[data-project-modal-img]");
const projectModalTitle = document.querySelector("[data-project-modal-title]");
const projectModalOverview = document.querySelector("[data-project-modal-overview]");

function setupModalGallery(item) {
  const galleryContainer = document.querySelector('[data-project-modal-gallery] .gallery-images');
  const gallery = item.getAttribute('data-project-gallery');
  const images = gallery ? gallery.split(',').map(s => s.trim()) : [item.getAttribute('data-project-image')];
  
  // Clear existing gallery
  galleryContainer.innerHTML = '';
  
  // Set the main modal image to the first image
  if (images.length > 0) {
    const mainImage = document.querySelector('[data-project-modal-img]');
    if (mainImage) {
      mainImage.src = images[0];
    }
  }
  
  // Add all images to gallery
  images.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Project image ${index + 1}`;
    img.loading = 'lazy';
    img.className = index === 0 ? 'active' : '';
    
    // Click handler to update main image
    img.onclick = function() {
      const mainImage = document.querySelector('[data-project-modal-img]');
      if (mainImage) {
        mainImage.src = src;
        // Update active state
        galleryContainer.querySelectorAll('img').forEach(i => i.classList.remove('active'));
        img.classList.add('active');
      }
    };
    
    galleryContainer.appendChild(img);
  });
  
  // Set initial main image
  if (images.length > 0) {
    projectModalImg.src = images[0];
  }
}

const projectModalFunc = function () {
  projectModalContainer.classList.toggle("active");
  projectOverlay.classList.toggle("active");
};

modalProjectItems.forEach(item => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    const title = item.getAttribute("data-project-title");
    const description = item.getAttribute("data-project-description");
    const technical = item.getAttribute("data-project-technical");
    const gallery = item.getAttribute("data-project-gallery");
    const mainImage = item.getAttribute("data-project-image");
    
    // Show modal
    projectModalContainer.classList.add("active");
    document.querySelector("[data-project-overlay]").classList.add("active");
    document.querySelector(".project-modal").classList.add("active");
    
    // Set content
    if (projectModalTitle) projectModalTitle.innerHTML = title;
    if (projectModalOverview) projectModalOverview.innerHTML = description;
    
    // Set technical details
    const technicalSection = document.querySelector("[data-project-modal-technical]");
    if (technicalSection && technical) {
      technicalSection.innerHTML = technical;
    }
    
    // Set up gallery
    const galleryContainer = document.querySelector('.gallery-images');
    if (galleryContainer) {
      galleryContainer.innerHTML = '';
      
      // Get all images (gallery images + main image)
      const allImages = gallery ? 
        [mainImage, ...gallery.split(',').map(src => src.trim())] : 
        [mainImage];
      
      // Set initial main image
      if (projectModalImg) {
        projectModalImg.src = allImages[0];
      }
      
      // Add all images to gallery
      allImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Gallery image ${index + 1}`;
        img.className = index === 0 ? 'active' : '';
        img.onclick = () => {
          if (projectModalImg) {
            projectModalImg.src = src;
            galleryContainer.querySelectorAll('img').forEach(i => i.classList.remove('active'));
            img.classList.add('active');
          }
        };
        galleryContainer.appendChild(img);
      });
    }
  });
});

projectModalCloseBtn.addEventListener("click", projectModalFunc);
projectOverlay.addEventListener("click", projectModalFunc);

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav links
navigationLinks.forEach((link, linkIndex) => {
  link.addEventListener("click", function () {
    const clickedPage = this.textContent.toLowerCase().trim();
    
    // Remove active class from all links and pages
    navigationLinks.forEach(navLink => navLink.classList.remove("active"));
    pages.forEach(page => page.classList.remove("active"));
    
    // Find and activate the matching page
    pages.forEach(page => {
      if (page.dataset.page === clickedPage) {
        page.classList.add("active");
        this.classList.add("active");
        window.scrollTo(0, 0);
      }
    });
  });
});

// Responsive Project Card Rendering
(function() {
  const projectList = document.querySelector('.project-list');
  const template = document.getElementById('project-card-template');
  if (!projectList || !template) return;

  // Gather all existing project items
  const items = Array.from(projectList.querySelectorAll('.project-item'));
  items.forEach(item => {
    // Get data attributes
    const img = item.getAttribute('data-project-image');
    const title = item.getAttribute('data-project-title');
    const desc = item.getAttribute('data-project-description');
    const tech = item.getAttribute('data-project-technical');
    const cat = item.getAttribute('data-category');
    const gallery = item.getAttribute('data-project-gallery');
    
    // Create new card from template
    const card = template.content.cloneNode(true);
    const li = card.querySelector('li');
    li.setAttribute('data-category', cat);
    li.setAttribute('data-project-image', img);
    li.setAttribute('data-project-title', title);
    li.setAttribute('data-project-description', desc);
    li.setAttribute('data-project-technical', tech || '');
    li.setAttribute('data-project-gallery', gallery || '');
    li.className = item.className;
    // Fill in content
    const previewImg = card.querySelector('.project-preview-img');
    if (previewImg) {
      previewImg.src = img;
      previewImg.alt = title;
    }
    const figure = card.querySelector('.project-img');
    if (figure) {
      figure.innerHTML = ''; // Clear any existing content
      const mainImg = document.createElement('img');
      mainImg.src = img;
      mainImg.alt = title;
      mainImg.loading = 'lazy';
      figure.appendChild(mainImg);
    }
    card.querySelector('.project-title').textContent = title;
    card.querySelector('.project-category').textContent = cat.replace(/\b\w/g, l => l.toUpperCase());
    // Insert card and remove old item
    projectList.insertBefore(card, item);
    item.remove();
  });
})();

// Enhanced Project Modal Logic
(function() {
  const projectItems = document.querySelectorAll('.project-item');
  const modalContainer = document.querySelector('[data-project-modal-container]');
  const modal = modalContainer.querySelector('.themed-modal');
  const modalImg = modal.querySelector('[data-project-modal-img]');
  const modalTitle = modal.querySelector('[data-project-modal-title]');
  const modalOverview = modal.querySelector('[data-project-modal-overview]');
  const modalTechnical = modal.querySelector('[data-project-modal-technical]');
  const modalGallery = modal.querySelector('[data-project-modal-gallery]');
  const galleryImagesDiv = modalGallery.querySelector('.gallery-images');
  const galleryPrev = modalGallery.querySelector('[data-gallery-prev]');
  const galleryNext = modalGallery.querySelector('[data-gallery-next]');
  let galleryImages = [];
  let galleryIndex = 0;

  // Helper: Animate modal in
  function showModal() {
    modal.classList.add('active');
    modalContainer.classList.add('active');
    setTimeout(() => modal.classList.add('themed-modal-animate'), 10);
  }
  function hideModal() {
    modal.classList.remove('active');
    modalContainer.classList.remove('active');
    modal.classList.remove('themed-modal-animate');
  }

  // Helper: Render gallery
  function renderGallery(imgArr) {
    console.log('Rendering gallery with images:', imgArr); // Debug log
    galleryImagesDiv.innerHTML = '';
    if (!imgArr || !imgArr.length) return;
    
    imgArr.forEach((src, idx) => {
      console.log('Rendering image:', src); // Debug log
      if (!src) return; // Skip empty sources
      const img = document.createElement('img');
      img.src = src;
      img.className = idx === galleryIndex ? 'active' : '';
      img.alt = `Gallery image ${idx + 1}`;
      img.addEventListener('click', () => {
        document.querySelectorAll('.gallery-images img').forEach(img => img.classList.remove('active'));
        img.classList.add('active');
        modalImg.src = src;
      });
      galleryImagesDiv.appendChild(img);
      console.log('Added image:', src); // Debug log
    });
  }
  function updateGallery() {
    if (!galleryImages.length) return;
    modalImg.src = galleryImages[galleryIndex];
    renderGallery(galleryImages);
  }

  // Main: Open modal with project data
  projectItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      // Data attributes for new modal
      const title = item.getAttribute('data-project-title') || '';
      const overview = item.getAttribute('data-project-overview') || item.getAttribute('data-project-description') || '';
      const technical = item.getAttribute('data-project-technical') || '';
      const gallery = item.getAttribute('data-project-gallery');
      // Gallery: comma-separated or single image fallback
      console.log('Gallery:', item); // Debug log
      galleryImages = gallery ? gallery.split(',').map(s => s.trim()) : [item.getAttribute('data-project-image')];
      console.log('Gallery Images:', galleryImages); // Debug log
      galleryIndex = 0;
      // Fill modal
      modalTitle.textContent = title;
      
      // Format overview with proper paragraphs and highlights
      const formattedOverview = overview.split('. ')
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0)
        .map(sentence => {
          // Highlight key technical terms
          sentence = sentence.replace(/\b(real-time|monitoring|control|automation|analytics|visualization|integration)\b/gi, 
            match => `<strong>${match}</strong>`);
          return `<p>${sentence}.</p>`;
        })
        .join('');
      modalOverview.innerHTML = formattedOverview;
      
      // Format technical details with proper structure
      const formattedTechnical = technical.split('\n').map(line => {
        if (line.trim().endsWith(':')) {
          // Section headers
          return `<h4 class="tech-section-title">${line}</h4>`;
        } else if (line.trim().startsWith('•')) {
          // Main bullet points
          return `<div class="tech-main-point">${line.replace('•', '')}</div>`;
        } else if (line.trim().startsWith('-')) {
          // Sub bullet points
          return `<div class="tech-sub-point">${line}</div>`;
        } else if (line.trim().startsWith('  -')) {
          // Indented points
          return `<div class="tech-detail-point">${line}</div>`;
        } else {
          return line ? `<div class="tech-text">${line}</div>` : '';
        }
      }).join('');
      
      modalTechnical.innerHTML = formattedTechnical;
      updateGallery();
      showModal();
    });
  });
  // Close modal
  modalContainer.querySelector('[data-project-modal-close-btn]').onclick = hideModal;
  modalContainer.querySelector('[data-project-overlay]').onclick = hideModal;
})();

// Blog Modal System
(function() {
  const blogPosts = {
    post1: {
      title: "A Day and Night is Still Not Enough",
      category: "Life & Career",
      date: "September 5, 2023",
      image: "./assets/images/night-coding.png",
      content: `
        <p>In the heart of Mandaue City's industrial landscape, my day begins before the sun rises. As an embedded systems engineer, I navigate between the physical and digital realms, breathing life into machines that power our manufacturing processes. But this is just the beginning of my 24-hour journey.</p>

        <p>By day, I'm immersed in the world of industrial automation. My fingers dance across keyboards, writing firmware that controls everything from motor systems to temperature monitoring solutions. Every line of code represents a bridge between human intention and mechanical action. The hum of machines and the rhythmic beeping of testing equipment create the soundtrack to my daylight hours.</p>

        <p>But when the sun sets and the factory floors quiet down, my second shift begins. The world of freelancing opens up through my Upwork projects, connecting me with clients across different time zones. Each project brings new challenges: a smart home system for a client in Europe, an IoT solution for a startup in America, or a custom monitoring system for a local business. The night hours blur as I transform caffeine into code, each project adding another layer to my growing expertise.</p>

        <p>Yet there's another role that brings a different kind of satisfaction – being a thesis advisor and commissioner. Working with engineering students reminds me of my own journey and ignites a passion for nurturing the next generation of tech innovators. Their fresh perspectives and ambitious ideas keep me connected to the cutting edge of technology, while my industrial experience helps ground their concepts in practical reality.</p>

        <p>Time becomes a precious commodity when you're living multiple professional lives. Twenty-four hours feel like a constraint when your mind is bursting with ideas and your heart is set on conquering new technological frontiers. Every minute counts, every line of code matters, and every mentoring session shapes the future.</p>

        <p>The challenge isn't just in managing time – it's in maintaining the quality and passion in everything I do. Industrial systems demand precision and reliability. Freelance clients expect innovation and efficiency. Students need guidance and inspiration. Balancing these responsibilities isn't just about scheduling; it's about bringing the best version of myself to each role.</p>

        <p>Looking ahead, I dream of expanding these horizons even further. I envision building a bridge between industrial automation and accessible education, creating platforms where practical experience meets academic learning. The possibilities in embedded systems and IoT are endless, and I'm determined to explore them all, one day (and night) at a time.</p>

        <p>They say time is a limited resource, but passion knows no bounds. As I continue this journey of constant learning and creation, I've come to embrace the beautiful chaos of my triple life. A day and night might not be enough, but the dreams we chase and the impact we create make every minute worth it.</p>

        <p><strong>To all my fellow engineers, freelancers, and mentors out there: keep pushing boundaries, keep learning, and keep dreaming. The future of technology is in our hands, and it's going to take more than 24 hours to build it.</strong></p>
      `
    },
    post2: {
      title: "The Future of Industrial Automation",
      category: "Technology",
      date: "August 28, 2023",
      image: "./assets/images/automation.jpg",
      content: `
        <p>The landscape of industrial automation is undergoing a radical transformation. As someone deeply embedded in this evolution, I witness daily how the convergence of IoT, machine learning, and traditional control systems is reshaping manufacturing as we know it.</p>

        <p>When I first started working with industrial automation, the focus was primarily on basic control systems – PLCs, motor controls, and simple monitoring solutions. Today, we're implementing systems that not only control processes but predict failures, optimize performance, and adapt in real-time to changing conditions. <strong>The future isn't just about automation; it's about intelligent automation.</strong></p>

        <p>One of the most exciting developments I'm currently working on involves the integration of machine learning algorithms with traditional control systems. For instance, we've implemented a predictive maintenance system that analyzes vibration patterns, temperature fluctuations, and power consumption data to forecast potential equipment failures before they occur. This isn't just automation – it's proactive intelligence that saves hundreds of thousands in potential downtime.</p>

        <p>The IoT revolution has also transformed how we approach industrial connectivity. Gone are the days of isolated systems and manual data collection. Our current projects implement mesh networks of sensors, creating a digital nervous system throughout the facility. Real-time data flows seamlessly from the shop floor to the cloud, enabling instantaneous analysis and response.</p>

        <p>But with these advancements come new challenges. <strong>Cybersecurity has become a critical concern</strong>. As we connect more systems to networks, the attack surface expands. We're constantly balancing the benefits of connectivity with the need for robust security measures. This includes implementing encrypted communications, secure gateways, and rigorous access controls.</p>

        <p>Edge computing is another game-changer. By processing data closer to its source, we've reduced latency and bandwidth requirements while improving system reliability. In one recent project, we deployed edge devices that process complex sensor data locally, only sending relevant insights to the central system. This has dramatically improved response times and reduced network load.</p>

        <p>The human element remains crucial in this technological evolution. While automation reduces the need for manual intervention, it increases the demand for skilled professionals who can design, implement, and maintain these sophisticated systems. <strong>This is where education and industry must work hand in hand.</strong></p>

        <p>Looking ahead, I see several trends that will define the next phase of industrial automation:</p>
        <ul>
          <li><strong>Artificial Intelligence Integration:</strong> Moving beyond rule-based systems to truly adaptive control mechanisms</li>
          <li><strong>Digital Twins:</strong> Creating virtual replicas of physical systems for testing and optimization</li>
          <li><strong>Augmented Reality:</strong> Enhancing maintenance and operations through AR-guided procedures</li>
          <li><strong>Sustainable Automation:</strong> Implementing systems that optimize energy usage and reduce waste</li>
        </ul>

        <p>The future of industrial automation is not just about replacing human tasks with machines – it's about creating symbiotic systems where human intelligence and machine capability complement each other. As we continue to push the boundaries of what's possible, the key is to maintain a balance between innovation and reliability, between connectivity and security, between automation and human oversight.</p>

        <p><strong>The fourth industrial revolution is well underway, and it's our responsibility as engineers to shape it responsibly, ensuring that the future we're building is not just automated, but intelligent, secure, and sustainable.</strong></p>
      `
    },
    post3: {
      title: "Guiding Tomorrow's Engineers",
      category: "Education",
      date: "August 15, 2023",
      image: "./assets/images/mentorship.webp",
      content: `
        <p>There's a unique joy in watching a student's eyes light up when their first line of code makes an LED blink, or when their carefully designed circuit springs to life. As a thesis advisor and commissioner, I've had the privilege of witnessing countless such moments, each one reinforcing my belief in the transformative power of hands-on engineering education.</p>

        <p>The journey from theory to practice is often challenging for engineering students. Textbook knowledge, while essential, can feel abstract until it's applied to real-world problems. This is where practical mentoring becomes crucial. <strong>My approach has always been to bridge the gap between academic concepts and industrial applications.</strong></p>

        <p>One of the most rewarding aspects of mentoring is helping students discover their own problem-solving abilities. Recently, I guided a team working on an automated waste segregation system using machine learning. The project faced numerous challenges – from sensor calibration issues to algorithm optimization. Rather than providing direct solutions, I encouraged them to break down problems into manageable components and explore different approaches.</p>

        <p>The industrial experience I've gained proves invaluable in mentoring. I often share real-world examples from my work in industrial automation, helping students understand how theoretical concepts translate into practical applications. For instance, when discussing control systems, I can relate PID control theory to actual motor control implementations I've worked on.</p>

        <p><strong>Modern engineering education needs to evolve with technology</strong>. I emphasize the importance of staying current with industry trends and emerging technologies. This means introducing students to:</p>
        <ul>
          <li>Modern development tools and practices</li>
          <li>Industry-standard protocols and communications</li>
          <li>Real-world project management methodologies</li>
          <li>Practical troubleshooting techniques</li>
        </ul>

        <p>One of my favorite teaching methods is the "fail fast, learn faster" approach. I encourage students to prototype quickly, test their ideas, and learn from failures. This builds resilience and problem-solving skills that are essential in real-world engineering.</p>

        <p>The role of a mentor extends beyond technical guidance. It's about fostering:</p>
        <ul>
          <li><strong>Critical Thinking:</strong> Encouraging students to question assumptions and explore alternatives</li>
          <li><strong>Professional Ethics:</strong> Understanding the responsibilities that come with engineering decisions</li>
          <li><strong>Communication Skills:</strong> Learning to present ideas and collaborate effectively</li>
          <li><strong>Innovation Mindset:</strong> Thinking creatively to solve complex problems</li>
        </ul>

        <p>I've noticed that students who engage in practical projects during their academic years tend to transition more smoothly into their professional careers. They develop not just technical skills, but also the confidence to tackle real-world challenges.</p>

        <p>Looking forward, I envision creating more structured mentoring programs that combine academic rigor with practical industry experience. This could include:</p>
        <ul>
          <li>Industry-academia collaboration projects</li>
          <li>Virtual and physical lab sessions</li>
          <li>Regular industry exposure through site visits and internships</li>
          <li>Mentorship networks connecting students with professionals</li>
        </ul>

        <p><strong>The future of engineering lies in our ability to nurture the next generation of innovators. As mentors, we don't just transfer knowledge – we inspire dreams, build confidence, and shape the problem-solvers of tomorrow.</strong></p>
      `
    }
  };

  const modalContainer = document.querySelector('[data-blog-modal-container]');
  const modal = modalContainer.querySelector('.blog-modal');
  const modalTitle = modal.querySelector('[data-blog-modal-title]');
  const modalCategory = modal.querySelector('[data-blog-modal-category]');
  const modalDate = modal.querySelector('[data-blog-modal-date]');
  const modalImg = modal.querySelector('[data-blog-modal-img]');
  const modalText = modal.querySelector('[data-blog-modal-text]');
  const overlay = modalContainer.querySelector('[data-blog-overlay]');
  const closeBtn = modal.querySelector('[data-blog-modal-close-btn]');

  // Open modal with blog content
  document.querySelectorAll('.blog-post-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const postId = link.getAttribute('data-blog-modal');
      const post = blogPosts[postId];
      if (post) {
        modalTitle.textContent = post.title;
        modalCategory.textContent = post.category;
        modalDate.textContent = post.date;
        modalImg.src = post.image;
        modalImg.alt = post.title;
        modalText.innerHTML = post.content;
        modalContainer.classList.add('active');
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal
  function closeModal() {
    modalContainer.classList.remove('active');
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
})();


document.addEventListener("DOMContentLoaded", () => {
  emailjs.init("qMf9apmMuRImePlmc"); // 🔑 Replace with your EmailJS Public Key

  const form = document.querySelector("[data-form]");
  const inputs = form.querySelectorAll("[data-form-input]");
  const submitBtn = form.querySelector("[data-form-btn]");

  // Enable/disable button
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      let allFilled = [...inputs].every(field => field.value.trim() !== "");
      submitBtn.disabled = !allFilled;
    });
  });

  // Handle submit with EmailJS
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending...";

    emailjs.sendForm("service_vdybils", "template_az6k6oc", form)
      .then(() => {
        alert("✅ Message sent successfully!");
        form.reset();
        submitBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
        submitBtn.disabled = true;
      })
      .catch((error) => {
        alert("❌ Failed to send message. Try again.\n\n" + error);
        submitBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
        submitBtn.disabled = false;
      });
  });
});