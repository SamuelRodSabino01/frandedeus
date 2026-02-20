document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle with ARIA
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        // Toggle Nav
        const isExpanded = navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.classList.toggle('menu-open', isExpanded);
        
        // Update ARIA
        hamburger.setAttribute('aria-expanded', isExpanded);
        hamburger.setAttribute('aria-label', isExpanded ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    });

    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
        });
    });

    // Form Validation and Submission with improved feedback
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.querySelector('.form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }
            
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name && phone && email && message) {
                // Show loading state
                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                
                btn.classList.add('loading');
                btn.disabled = true;
                formMessage.style.display = 'none';

                // Simulate API call
                setTimeout(() => {
                    // Show success message
                    formMessage.className = 'form-message success';
                    formMessage.textContent = `Obrigado, ${name}! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.`;
                    formMessage.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    btn.classList.remove('loading');
                    btn.innerText = originalText;
                    btn.disabled = false;
                    
                    // Scroll to message
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 5000);
                }, 1500);
            }
        });
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            toggleFAQ(item);
        });
        
        // Keyboard support
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(item);
            }
        });
    });
    
    function toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
        const question = item.querySelector('.faq-question');
        question.setAttribute('aria-expanded', !isActive);
    }

    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    if (phoneInputs.length) {
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
                e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            });
        });
    }

    // Portfolio Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('filter-active'));
            btn.classList.add('filter-active');
            
            // Filter items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    function setupBooking() {
        const isBookingPage = document.body.getAttribute('data-booking-page') === 'true';
        if (!isBookingPage) {
            return;
        }
        const servicesSelect = document.getElementById('bookingService');
        const dateInput = document.getElementById('bookingDate');
        const bookingForm = document.getElementById('bookingForm');
        const timeSlotsContainer = document.getElementById('timeSlots');
        const alertBox = document.getElementById('bookingAlert');
        const summaryBox = document.getElementById('bookingSummary');
        const stepElements = Array.from(document.querySelectorAll('.booking-step'));
        const stepIndicators = Array.from(document.querySelectorAll('.booking-step-indicator'));
        const nextButtons = document.querySelectorAll('[data-next-step]');
        const prevButtons = document.querySelectorAll('[data-prev-step]');
        const serviceCards = document.querySelectorAll('.booking-service-card');
        const calendarGrid = document.getElementById('bookingCalendarGrid');
        const calendarCurrentMonth = document.getElementById('calendarCurrentMonth');
        const calendarNavButtons = document.querySelectorAll('.calendar-nav');
        let calendarCurrentDate = new Date();
        let minDateString = '';
        if (!servicesSelect || !dateInput || !bookingForm || !timeSlotsContainer) {
            return;
        }
        const services = {
            design: { name: 'Design Personalizado', duration: 30 },
            henna: { name: 'Design com Henna', duration: 45 },
            micropigmentacao: { name: 'Micropigmentação', duration: 120 },
            lamination: { name: 'Brow Lamination', duration: 60 },
            pacote: { name: 'Pacote Completo', duration: 90 }
        };
        const storageKey = 'frandedeus_agendamentos';
        let bookings = [];
        function loadBookings() {
            try {
                const data = localStorage.getItem(storageKey);
                bookings = data ? JSON.parse(data) : [];
            } catch (e) {
                bookings = [];
            }
        }
        function saveBookings() {
            try {
                localStorage.setItem(storageKey, JSON.stringify(bookings));
            } catch (e) {
            }
        }
        function parseTimeToMinutes(time) {
            const parts = time.split(':');
            return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        }
        function minutesToTime(minutes) {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            const hh = h.toString().padStart(2, '0');
            const mm = m.toString().padStart(2, '0');
            return hh + ':' + mm;
        }
        function isClosedDate(dateStr) {
            const d = new Date(dateStr + 'T00:00:00');
            const day = d.getDay();
            return day === 0;
        }
        function getDayHours(dateStr) {
            const d = new Date(dateStr + 'T00:00:00');
            const day = d.getDay();
            if (day === 6) {
                return { start: '09:00', end: '14:00' };
            }
            return { start: '09:00', end: '19:00' };
        }
        function intervalsOverlap(start1, duration1, start2, duration2) {
            const end1 = start1 + duration1;
            const end2 = start2 + duration2;
            return start1 < end2 && start2 < end1;
        }
        function hasConflict(dateStr, startMinutes, duration) {
            return bookings.some(b => {
                if (b.date !== dateStr) {
                    return false;
                }
                const bStart = parseTimeToMinutes(b.time);
                return intervalsOverlap(startMinutes, duration, bStart, b.duration);
            });
        }
        function setMinDate() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            const min = year + '-' + month + '-' + day;
            minDateString = min;
            dateInput.min = min;
        }
        function clearAlert() {
            if (!alertBox) {
                return;
            }
            alertBox.textContent = '';
            alertBox.className = 'form-message';
            alertBox.style.display = 'none';
        }
        function showAlert(type, message) {
            if (!alertBox) {
                return;
            }
            alertBox.className = 'form-message ' + type;
            alertBox.textContent = message;
            alertBox.style.display = 'block';
        }
        function renderCalendar() {
            if (!calendarGrid || !calendarCurrentMonth) {
                return;
            }
            const year = calendarCurrentDate.getFullYear();
            const month = calendarCurrentDate.getMonth();
            const firstDay = new Date(year, month, 1);
            const firstWeekday = firstDay.getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const minDate = minDateString ? new Date(minDateString + 'T00:00:00') : null;
            calendarCurrentMonth.textContent = firstDay.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            calendarGrid.innerHTML = '';
            const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            weekdayLabels.forEach(label => {
                const headerCell = document.createElement('div');
                headerCell.className = 'calendar-weekday';
                headerCell.textContent = label;
                calendarGrid.appendChild(headerCell);
            });
            for (let i = 0; i < firstWeekday; i++) {
                const emptyCell = document.createElement('button');
                emptyCell.type = 'button';
                emptyCell.className = 'calendar-day empty';
                emptyCell.disabled = true;
                calendarGrid.appendChild(emptyCell);
            }
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const cell = document.createElement('button');
                cell.type = 'button';
                cell.className = 'calendar-day';
                const yyyy = year.toString();
                const mm = (month + 1).toString().padStart(2, '0');
                const dd = day.toString().padStart(2, '0');
                const dateStr = yyyy + '-' + mm + '-' + dd;
                cell.textContent = day.toString();
                cell.setAttribute('data-date', dateStr);
                let disabled = false;
                if (minDate && date < minDate) {
                    disabled = true;
                }
                if (isClosedDate(dateStr)) {
                    disabled = true;
                }
                if (disabled) {
                    cell.disabled = true;
                    cell.classList.add('disabled');
                } else {
                    cell.addEventListener('click', () => {
                        document.querySelectorAll('.calendar-day.selected').forEach(btn => {
                            btn.classList.remove('selected');
                        });
                        cell.classList.add('selected');
                        dateInput.value = dateStr;
                        const event = new Event('change');
                        dateInput.dispatchEvent(event);
                        clearAlert();
                    });
                }
                if (dateInput.value === dateStr) {
                    cell.classList.add('selected');
                }
                calendarGrid.appendChild(cell);
            }
        }
        function setActiveStep(step) {
            stepElements.forEach(el => {
                const value = parseInt(el.getAttribute('data-step'), 10);
                el.classList.toggle('active', value === step);
            });
            stepIndicators.forEach(el => {
                const value = parseInt(el.getAttribute('data-step'), 10);
                el.classList.toggle('active', value === step);
            });
        }
        function updateSummary() {
            if (!summaryBox) {
                return;
            }
            const serviceId = servicesSelect.value;
            const date = dateInput.value;
            const selectedBtn = timeSlotsContainer.querySelector('.time-slot-btn.selected');
            if (!serviceId || !date || !selectedBtn) {
                summaryBox.textContent = '';
                return;
            }
            const service = services[serviceId];
            const time = selectedBtn.getAttribute('data-time');
            const startMinutes = parseTimeToMinutes(time);
            const endMinutes = startMinutes + service.duration;
            const endTime = minutesToTime(endMinutes);
            const d = new Date(date + 'T00:00:00');
            const formattedDate = d.toLocaleDateString('pt-BR');
            summaryBox.innerHTML =
                '<p><strong>Serviço:</strong> ' + service.name + '</p>' +
                '<p><strong>Data:</strong> ' + formattedDate + '</p>' +
                '<p><strong>Horário:</strong> ' + time + ' às ' + endTime + '</p>' +
                '<p><strong>Duração estimada:</strong> ' + service.duration + ' minutos</p>';
        }
        function buildTimeSlots() {
            clearAlert();
            timeSlotsContainer.innerHTML = '';
            const serviceId = servicesSelect.value;
            const date = dateInput.value;
            if (!serviceId) {
                showAlert('error', 'Selecione um serviço antes de escolher o horário.');
                return;
            }
            if (!date) {
                showAlert('error', 'Selecione um dia para ver os horários disponíveis.');
                return;
            }
            if (isClosedDate(date)) {
                showAlert('error', 'Neste dia não há atendimentos. Escolha outro dia.');
                return;
            }
            const service = services[serviceId];
            const hours = getDayHours(date);
            const startMinutes = parseTimeToMinutes(hours.start);
            const endMinutes = parseTimeToMinutes(hours.end);
            let anySlot = false;
            for (let m = startMinutes; m + service.duration <= endMinutes; m += 30) {
                if (hasConflict(date, m, service.duration)) {
                    continue;
                }
                anySlot = true;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn btn-outline time-slot-btn';
                const time = minutesToTime(m);
                btn.textContent = time;
                btn.setAttribute('data-time', time);
                btn.addEventListener('click', () => {
                    timeSlotsContainer.querySelectorAll('.time-slot-btn').forEach(b => {
                        b.classList.remove('selected');
                    });
                    btn.classList.add('selected');
                    clearAlert();
                    updateSummary();
                });
                timeSlotsContainer.appendChild(btn);
            }
            if (!anySlot) {
                showAlert('error', 'Não há horários disponíveis para este dia e serviço. Escolha outra data.');
            }
        }
        nextButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetStep = parseInt(btn.getAttribute('data-next-step'), 10);
                clearAlert();
                if (targetStep === 2) {
                    if (!servicesSelect.value) {
                        showAlert('error', 'Selecione um serviço para continuar.');
                        return;
                    }
                }
                if (targetStep === 3) {
                    if (!servicesSelect.value) {
                        showAlert('error', 'Selecione um serviço para continuar.');
                        return;
                    }
                    if (!dateInput.value) {
                        showAlert('error', 'Selecione um dia para continuar.');
                        return;
                    }
                    buildTimeSlots();
                }
                if (targetStep === 4) {
                    const selectedBtn = timeSlotsContainer.querySelector('.time-slot-btn.selected');
                    if (!selectedBtn) {
                        showAlert('error', 'Escolha um horário disponível para continuar.');
                        return;
                    }
                    updateSummary();
                }
                setActiveStep(targetStep);
            });
        });
        prevButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetStep = parseInt(btn.getAttribute('data-prev-step'), 10);
                clearAlert();
                setActiveStep(targetStep);
            });
        });
        if (serviceCards.length) {
            serviceCards.forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.getAttribute('data-service-id');
                    servicesSelect.value = id;
                    serviceCards.forEach(otherCard => {
                        otherCard.classList.toggle('selected', otherCard === card);
                    });
                    const event = new Event('change');
                    servicesSelect.dispatchEvent(event);
                    clearAlert();
                });
            });
        }
        servicesSelect.addEventListener('change', () => {
            clearAlert();
            timeSlotsContainer.innerHTML = '';
            if (summaryBox) {
                summaryBox.textContent = '';
            }
        });
        dateInput.addEventListener('change', () => {
            clearAlert();
            timeSlotsContainer.innerHTML = '';
            if (summaryBox) {
                summaryBox.textContent = '';
            }
        });
        loadBookings();
        setMinDate();
        if (calendarNavButtons.length) {
            calendarNavButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.getAttribute('data-calendar-action');
                    if (action === 'prev-month') {
                        calendarCurrentDate = new Date(calendarCurrentDate.getFullYear(), calendarCurrentDate.getMonth() - 1, 1);
                    } else if (action === 'next-month') {
                        calendarCurrentDate = new Date(calendarCurrentDate.getFullYear(), calendarCurrentDate.getMonth() + 1, 1);
                    }
                    renderCalendar();
                });
            });
        }
        renderCalendar();
        const nameInput = document.getElementById('bookingName');
        const phoneInput = document.getElementById('bookingPhone');
        const emailInput = document.getElementById('bookingEmail');
        bookingForm.addEventListener('submit', e => {
            e.preventDefault();
            clearAlert();
            if (!servicesSelect.value) {
                showAlert('error', 'Selecione um serviço.');
                setActiveStep(1);
                return;
            }
            if (!dateInput.value) {
                showAlert('error', 'Selecione um dia.');
                setActiveStep(2);
                return;
            }
            const selectedBtn = timeSlotsContainer.querySelector('.time-slot-btn.selected');
            if (!selectedBtn) {
                showAlert('error', 'Selecione um horário.');
                setActiveStep(3);
                return;
            }
            if (!nameInput.value.trim() || !phoneInput.value.trim() || !emailInput.value.trim()) {
                showAlert('error', 'Preencha nome, telefone e e-mail.');
                return;
            }
            const serviceId = servicesSelect.value;
            const service = services[serviceId];
            const date = dateInput.value;
            const time = selectedBtn.getAttribute('data-time');
            const startMinutes = parseTimeToMinutes(time);
            if (hasConflict(date, startMinutes, service.duration)) {
                showAlert('error', 'O horário escolhido acabou de ser reservado. Escolha outro horário.');
                buildTimeSlots();
                return;
            }
            bookings.push({
                serviceId: serviceId,
                date: date,
                time: time,
                duration: service.duration,
                name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                email: emailInput.value.trim(),
                notes: document.getElementById('bookingNotes') ? document.getElementById('bookingNotes').value.trim() : ''
            });
            saveBookings();
            updateSummary();
            showAlert('success', 'Agendamento confirmado com sucesso.');
            buildTimeSlots();
        });
    }

    setupBooking();
});
