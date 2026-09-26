/* ==========================================================================
   STATE & AUDIO SYNTHESIZER (WEB AUDIO API RETRO SFX)
   ========================================================================== */
   let sfxAktif = true;
   let crtAktif = true;
   let audioCtx = null;
   
   function dapatkanAudioContext() {
       if (!audioCtx) {
           audioCtx = new (window.AudioContext || window.webkitAudioContext)();
       }
       if (audioCtx.state === 'suspended') {
           audioCtx.resume();
       }
       return audioCtx;
   }
   
   function putarSuara(frekuensi = 440, jenis = 'square', durasi = 0.1) {
       if (!sfxAktif) return;
   
       try {
           const ctx = dapatkanAudioContext();
           const osilator = ctx.createOscillator();
           const pengaturVolume = ctx.createGain();
   
           osilator.type = jenis;
           osilator.frequency.setValueAtTime(frekuensi, ctx.currentTime);
   
           pengaturVolume.gain.setValueAtTime(0.06, ctx.currentTime);
           pengaturVolume.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durasi);
   
           osilator.connect(pengaturVolume);
           pengaturVolume.connect(ctx.destination);
   
           osilator.start();
           osilator.stop(ctx.currentTime + durasi);
       } catch (e) {
           console.warn("Audio Context Error:", e);
       }
   }
   
   // Chime Level-Up / Quest Clear
   function putarSuaraSukses() {
       if (!sfxAktif) return;
       putarSuara(523.25, 'square', 0.08);
       setTimeout(() => putarSuara(659.25, 'square', 0.08), 80);
       setTimeout(() => putarSuara(783.99, 'square', 0.12), 160);
       setTimeout(() => putarSuara(1046.50, 'square', 0.2), 240);
   }
   
   /* ==========================================================================
      TOGGLE SFX & CRT OVERLAY
      ========================================================================== */
   function toggleSFX() {
       sfxAktif = !sfxAktif;
       const tombolSFX = document.getElementById('tombol-sfx');
   
       if (sfxAktif) {
           tombolSFX.textContent = '🔊 SFX';
           putarSuara(880);
       } else {
           tombolSFX.textContent = '🔇 SFX';
       }
   }
   
   function toggleCRT() {
       crtAktif = !crtAktif;
       const overlayCRT = document.getElementById('crt-overlay');
       const tombolCRT = document.getElementById('tombol-crt');
   
       putarSuara(crtAktif ? 600 : 300);
   
       if (crtAktif) {
           overlayCRT.classList.remove('matikan');
           tombolCRT.textContent = '📺 CRT';
       } else {
           overlayCRT.classList.add('matikan');
           tombolCRT.textContent = '📺 OFF';
       }
   }
   
   /* ==========================================================================
      NAVIGASI & SCROLL CONTROL
      ========================================================================== */
   function toggleMenuMobile() {
       putarSuara(500);
       const navMenu = document.getElementById('nav-menu');
       navMenu.classList.toggle('aktif');
   }
   
   function tutupMenuMobile() {
       putarSuara(450);
       const navMenu = document.getElementById('nav-menu');
       navMenu.classList.remove('aktif');
   }
   
   function keAtasHalaman() {
       putarSuara(650);
       window.scrollTo({ top: 0, behavior: 'smooth' });
   }
   
   /* ==========================================================================
      FILTER QUEST LOG
      ========================================================================== */
   function filterQuest(kategori, tombol) {
       putarSuara(550);
       
       // Update active tab button
       document.querySelectorAll('.tombol-filter').forEach(btn => btn.classList.remove('aktif'));
       tombol.classList.add('aktif');
   
       // Filter project items
       const itemQuests = document.querySelectorAll('.item-quest');
       itemQuests.forEach(item => {
           if (kategori === 'all' || item.getAttribute('data-kategori') === kategori) {
               item.style.display = 'flex';
           } else {
               item.style.display = 'none';
           }
       });
   }
   
   /* ==========================================================================
      MODAL RPG DIALOG POPUP
      ========================================================================== */
   function bukaModalProyek(judul, deskripsi, tags, status) {
       putarSuaraSukses();
       document.getElementById('modal-judul').textContent = judul;
       document.getElementById('modal-deskripsi').textContent = deskripsi;
       document.getElementById('modal-status').textContent = status;
       
       const wadahTags = document.getElementById('modal-tags');
       wadahTags.innerHTML = tags.map(t => `${t}`).join('');
       
       document.getElementById('modal-proyek').classList.add('aktif');
   }
   
   function tutupModalProyek() {
       putarSuara(350);
       document.getElementById('modal-proyek').classList.remove('aktif');
   }
   
   /* Close Modal on ESC key */
   window.addEventListener('keydown', (e) => {
       if (e.key === 'Escape') tutupModalProyek();
   });
   
   /* ==========================================================================
      FORM HANDLER
      ========================================================================== */
   function kirimPesan(event) {
       event.preventDefault();
       putarSuaraSukses();
   
       const nama = document.getElementById('nama-pengirim').value;
       alert(`📜 QUEST ACCEPTED!\n\nTerima kasih, Petualang ${nama}! Scroll pesan Anda telah dikirimkan ke Marcelino.`);
       
       event.target.reset();
   }
   
   /* ==========================================================================
      TYPEWRITER EFFECT UNTUK HERO DIALOGUE
      ========================================================================== */
   document.addEventListener('DOMContentLoaded', () => {
       const elemenTeks = document.getElementById('teks-dialog-hero');
       if (elemenTeks) {
           const teksAsli = elemenTeks.textContent;
           elemenTeks.textContent = '';
           let index = 0;
   
           function ketikTeks() {
               if (index < teksAsli.length) {
                   elemenTeks.textContent += teksAsli.charAt(index);
                   if (sfxAktif && index % 3 === 0) putarSuara(400 + (index % 5) * 40, 'triangle', 0.02);
                   index++;
                   setTimeout(ketikTeks, 25);
               }
           }
           
           setTimeout(ketikTeks, 500);
       }
   
       // Event listener hover pada tombol
       const elemenTombol = document.querySelectorAll('.tombol-pixel, .nav-menu a, .slot-inv');
       elemenTombol.forEach(el => {
           el.addEventListener('mouseenter', () => {
               if (sfxAktif) putarSuara(300, 'triangle', 0.03);
           });
       });
   });
   
   window.addEventListener('scroll', () => {
       const tombolScroll = document.getElementById('tombol-scroll-atas');
       if (window.scrollY > 250) {
           tombolScroll.style.display = 'block';
       } else {
           tombolScroll.style.display = 'none';
       }
   });