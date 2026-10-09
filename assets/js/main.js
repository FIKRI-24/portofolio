/**
 * Main JavaScript for Portfolio Web
 * Author: Fikri Arrahman
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (mobileMenuBtn && mobileMenu) {
    const toggleMobileMenu = (open) => {
      const shouldOpen = open !== undefined ? open : mobileMenu.classList.contains('hidden');
      if (shouldOpen) {
        mobileMenu.classList.remove('hidden');
        if (menuIconOpen) menuIconOpen.classList.add('hidden');
        if (menuIconClose) menuIconClose.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.classList.add('hidden');
        if (menuIconOpen) menuIconOpen.classList.remove('hidden');
        if (menuIconClose) menuIconClose.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    };

    mobileMenuBtn.addEventListener('click', () => {
      toggleMobileMenu();
    });

    // Close mobile menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });
  }

  // 2. Active Navbar Item on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);

  // 3. Project Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button styles
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'text-slate-600', 'hover:bg-slate-100');
      });
      btn.classList.remove('bg-white', 'text-slate-600', 'hover:bg-slate-100');
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-sm');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Add subtle entrance animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px) scale(0.98)';
          card.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          });

          // Bersihkan seluruh style inline setelah transisi selesai agar efek hover CSS & 3D tilt berfungsi kembali secara alami
          setTimeout(() => {
            card.style.opacity = '';
            card.style.transform = '';
            card.style.transition = '';
          }, 320);
        } else {
          card.classList.add('hidden');
          card.style.opacity = '';
          card.style.transform = '';
          card.style.transition = '';
        }
      });
    });
  });

  // 4. Copy Email to Clipboard
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyFeedback = document.getElementById('copy-feedback');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'arrahmanfikri223@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        if (copyFeedback) {
          copyFeedback.classList.remove('hidden');
          setTimeout(() => {
            copyFeedback.classList.add('hidden');
          }, 2500);
        }
      }).catch(err => {
        console.error('Gagal menyalin email:', err);
      });
    });
  }

  // 5. Contact Form Submission (Real Email Dispatch & WhatsApp Integration)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const formStatusText = document.getElementById('form-status-text');
  const waSendBtn = document.getElementById('wa-send-btn');

  if (contactForm) {
    // 5a. Kirim Cepat via WhatsApp
    if (waSendBtn) {
      waSendBtn.addEventListener('click', () => {
        const name = (document.getElementById('name')?.value || '').trim();
        const email = (document.getElementById('email')?.value || '').trim();
        const subject = (document.getElementById('subject')?.value || '').trim();
        const message = (document.getElementById('message')?.value || '').trim();

        let waText = 'Halo Fikri Arrahman, saya melihat portofolio Anda dan ingin berdiskusi mengenai proyek / peluang kerja.';
        if (name || subject || message) {
          waText = `Halo Fikri Arrahman, saya menghubungi Anda melalui formulir portofolio web:\n\n👤 *Nama:* ${name || '-'}\n📧 *Email:* ${email || '-'}\n📌 *Topik:* ${subject || '-'}\n\n💬 *Pesan:*\n${message || '-'}`;
        }
        const waUrl = `https://wa.me/6283185478251?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      });
    }

    // 5b. Pengiriman Email Nyata (FormSubmit AJAX + Mailto Fallback)
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;

      const name = (document.getElementById('name')?.value || '').trim();
      const email = (document.getElementById('email')?.value || '').trim();
      const subject = (document.getElementById('subject')?.value || '').trim();
      const message = (document.getElementById('message')?.value || '').trim();

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg> Mengirim Pesan...
      `;

      try {
        const response = await fetch('https://formsubmit.co/ajax/arrahmanfikri223@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `[Portofolio] ${subject} - dari ${name}`,
            message: message
          })
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok || data.success === 'true' || data.success === true) {
          if (formStatus) {
            formStatus.className = 'p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2';
            if (formStatusText) {
              formStatusText.textContent = 'Pesan berhasil terkirim ke email Fikri! Terima kasih, saya akan segera merespons Anda.';
            }
            formStatus.classList.remove('hidden');
          }
          contactForm.reset();
        } else {
          throw new Error(data.message || 'Gagal mengirim formulir.');
        }
      } catch (err) {
        console.warn('Pengiriman via API dialihkan ke mailto:', err);
        // Fallback langsung ke mailto agar data pesan tidak pernah hilang
        const mailtoUrl = `mailto:arrahmanfikri223@gmail.com?subject=${encodeURIComponent(`[Portofolio] ${subject} - ${name}`)}&body=${encodeURIComponent(`Halo Fikri,\n\nNama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`)}`;
        window.location.href = mailtoUrl;

        if (formStatus) {
          formStatus.className = 'p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-2';
          if (formStatusText) {
            formStatusText.textContent = 'Membuka aplikasi email untuk mengirim pesan... Jika tidak terbuka otomatis, silakan kirim ke arrahmanfikri223@gmail.com';
          }
          formStatus.classList.remove('hidden');
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
        if (window.lucide) {
          window.lucide.createIcons();
        }
        setTimeout(() => {
          if (formStatus) formStatus.classList.add('hidden');
        }, 7000);
      }
    });
  }

  // 6. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 7. Project Modal Details
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalStack = document.getElementById('modal-stack');
  const modalLive = document.getElementById('modal-live');
  const modalCode = document.getElementById('modal-code');

  const projectDetails = {
    '1': {
      title: 'PRISMA-AI — Intelligent Assessment Management System',
      category: 'Web & AI / Full-Stack',
      desc: `Sistem manajemen assessment berbasis web yang dikembangkan untuk membantu pengelolaan instrumen assessment secara terintegrasi dengan fitur AI Chatbot sebagai asisten pembelajaran. Proyek ini menjadi bagian dari penelitian tugas akhir dan pengalaman utama dalam mengembangkan aplikasi web full-stack dari sisi kebutuhan sistem, database, backend, frontend, integrasi AI, testing, hingga deployment menggunakan Docker.

Fitur Unggulan yang Dikembangkan:
• Manajemen Pengguna dan Role (Multi-Role Auth)
• Manajemen Instrumen Assessment & Bank Soal
• Pembuatan Soal secara Manual & Import Soal dari Word / Excel
• Pengelolaan Kisi-Kisi, Kunci Jawaban, dan Indikator Pembelajaran
• Sinkronisasi Soal dengan Kisi-Kisi secara Otomatis
• Pelaksanaan Assessment dengan Live Timer & Autosave Jawaban Siswa
• Perhitungan dan Pengolahan Nilai Otomatis
• Laporan Hasil Ujian Siap Cetak dalam Format PDF dan Excel
• Monitoring Pelaksanaan Assessment secara Real-Time
• AI Chatbot (Gemini API) sebagai Asisten Pembelajaran Aktif & Riwayat Percakapan
• Guardrails Cerdas: Proteksi terintegrasi agar chatbot tidak membocorkan kunci jawaban secara langsung pada soal assessment yang sedang dikerjakan.`,
      tech: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Docker', 'Gemini API / AI Chatbot'],
      image: 'assets/img/prisma-ai.png',
      live: '#',
      code: 'https://github.com/FIKRI-24'
    },
    '2': {
      title: 'Sistem Informasi Berbasis Web Terintegrasi',
      category: 'Web Development / Full-Stack',
      desc: 'Pengembangan sistem informasi berbasis web menggunakan arsitektur MVC modern. Menyediakan modul autentikasi terpusat dan role-based access control, manajemen basis data relasional terstruktur (CRUD), validasi formulir berlapis, pelaporan berkala, serta antarmuka responsif.',
      tech: ['Laravel', 'PHP', 'JavaScript', 'MySQL / PostgreSQL', 'Tailwind CSS', 'REST API'],
      live: '#',
      code: 'https://github.com/FIKRI-24'
    },
    '3': {
      title: 'Sistem Pakar / Expert System Berbasis Web',
      category: 'Artificial Intelligence & Web',
      desc: 'Aplikasi berbasis web untuk sistem inferensi pakar yang mengadopsi basis pengetahuan dan aturan cerdas (rule-based reasoning). Dilengkapi dengan formulir kuesioner gejala interaktif, mesin inferensi keputusan, kalkulasi hasil, serta ringkasan solusi rekomendasi otomatis.',
      tech: ['PHP', 'JavaScript', 'MySQL', 'Rule-Based Engine', 'Tailwind CSS'],
      live: '#',
      code: 'https://github.com/FIKRI-24'
    },
    '4': {
      title: 'Perangkat IoT Smart System (Arduino & ESP)',
      category: 'Internet of Things (IoT)',
      desc: 'Pengembangan sistem berbasis mikrokontroler Arduino dan ESP (ESP32/ESP8266) yang terhubung dengan sensor dan aktuator. Mengirimkan data telemetri melalui protokol jaringan ke dashboard web untuk visualisasi dan pemantauan kondisi lingkungan secara real-time.',
      tech: ['ESP32 / ESP8266', 'Arduino IDE / C++', 'Sensors & Actuators', 'HTTP / MQTT', 'Web Dashboard'],
      live: '#',
      code: 'https://github.com/FIKRI-24'
    }
  };

  const projectDetailBtns = document.querySelectorAll('.view-detail-btn');
  projectDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const data = projectDetails[id];

      if (data && modal) {
        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalDesc.textContent = data.desc;

        // Render modal image preview
        const modalImgContainer = document.getElementById('modal-image-container');
        const modalImg = document.getElementById('modal-image');
        if (modalImgContainer && modalImg) {
          if (data.image) {
            modalImg.src = data.image;
            modalImgContainer.classList.remove('hidden');
          } else {
            modalImg.src = '';
            modalImgContainer.classList.add('hidden');
          }
        }

        // Render tech pills
        modalStack.innerHTML = '';
        data.tech.forEach(t => {
          const pill = document.createElement('span');
          pill.className = 'px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200';
          pill.textContent = t;
          modalStack.appendChild(pill);
        });

        modalLive.href = data.live;
        modalCode.href = data.code;

        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    });
  });

  if (modalClose && modal) {
    const closeModal = () => {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    };
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  // 8. Lucide Icons initialization
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 9. Native Scroll Reveal System with IntersectionObserver
  const initScrollReveal = () => {
    // Skip animations if user prefers reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const revealElements = document.querySelectorAll('[data-aos]');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      document.documentElement.classList.add('has-scroll-reveal');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    }
  };

  initScrollReveal();

  // 10. Interactive 3D Tilt Effect on Desktop for 3D Cards
  const tiltCards = document.querySelectorAll('.card-3d-depth, .clean-card');
  if (window.matchMedia('(min-width: 1024px)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.15s ease-out';
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4; // Max -4deg to 4deg
        const rotateY = ((x - centerX) / centerX) * 4;  // Max -4deg to 4deg

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = '';
        setTimeout(() => {
          card.style.transition = '';
        }, 400);
      });
    });
  }
});
