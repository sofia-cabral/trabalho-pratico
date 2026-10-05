// Data do banco de dados simulado para áreas e pacotes
const areasData = {
  feminino: [
    { id: 'f-axilas', title: 'Axilas', price: 79, sessions: '8 a 10 sessões', duration: '15 min' },
    { id: 'f-virilha', title: 'Virilha Completa', price: 149, sessions: '8 a 10 sessões', duration: '30 min' },
    { id: 'f-pernas', title: 'Pernas Inteiras', price: 219, sessions: '8 a 10 sessões', duration: '45 min' },
    { id: 'f-buco', title: 'Buço / Rosto', price: 59, sessions: '8 a 10 sessões', duration: '10 min' },
    { id: 'f-bracos', title: 'Braços Completos', price: 129, sessions: '8 a 10 sessões', duration: '30 min' },
    { id: 'f-linha-alba', title: 'Linha Alba (Barriga)', price: 69, sessions: '8 a 10 sessões', duration: '15 min' }
  ],
  masculino: [
    { id: 'm-barba', title: 'Barba Completa', price: 129, sessions: '8 a 10 sessões', duration: '20 min' },
    { id: 'm-peitoral', title: 'Peitoral + Abdômen', price: 229, sessions: '8 a 10 sessões', duration: '40 min' },
    { id: 'm-costas', title: 'Costas Completas', price: 199, sessions: '8 a 10 sessões', duration: '35 min' },
    { id: 'm-faixa-barba', title: 'Faixa de Barba / Pescoço', price: 79, sessions: '8 a 10 sessões', duration: '15 min' },
    { id: 'm-ombros', title: 'Ombros', price: 99, sessions: '8 a 10 sessões', duration: '20 min' },
    { id: 'm-axilas', title: 'Axilas Masculinas', price: 89, sessions: '8 a 10 sessões', duration: '15 min' }
  ]
};

let currentGender = 'feminino';
let selectedCalcAreas = [];

// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
  renderAreas('feminino');
  renderCalcOptions();
  setMinBookingDate();
  setupMobileMenu();
});

// Menu Mobile
function setupMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('nav-menu');
  
  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  });
}

// Alternar entre abas de público (Feminino / Masculino)
function switchGender(gender) {
  currentGender = gender;
  document.getElementById('tab-fem').classList.toggle('active', gender === 'feminino');
  document.getElementById('tab-masc').classList.toggle('active', gender === 'masculino');
  renderAreas(gender);
}

// Renderizar cards de áreas de tratamento
function renderAreas(gender) {
  const grid = document.getElementById('areas-grid');
  grid.innerHTML = '';

  areasData[gender].forEach(area => {
    const card = document.createElement('div');
    card.className = 'area-card';
    card.innerHTML = `
      <div class="area-card-header">
        <h3 class="area-title">${area.title}</h3>
        <span class="area-price">R$ ${area.price}<small>/sessão</small></span>
      </div>
      <ul class="area-details">
        <li><i class="fa-regular fa-clock"></i> Duração média: ${area.duration}</li>
        <li><i class="fa-solid fa-rotate"></i> Recomendado: ${area.sessions}</li>
        <li><i class="fa-solid fa-snowflake"></i> Resfriamento -9°C indolor</li>
      </ul>
      <a href="#agendamento" class="btn btn-secondary btn-block" onclick="preSelectService('${gender === 'feminino' ? 'Laser Feminino' : 'Laser Masculino'} - ${area.title}')">Agendar Esta Área</a>
    `;
    grid.appendChild(card);
  });
}

// Renderizar opções na Calculadora Dinâmica
function renderCalcOptions() {
  const container = document.getElementById('calc-options');
  container.innerHTML = '';

  const allAreas = [...areasData.feminino, ...areasData.masculino];
  
  // Filtrar áreas duplicadas para a calculadora se necessário
  const uniqueAreas = Array.from(new Set(allAreas.map(a => a.title)))
    .map(title => allAreas.find(a => a.title === title));

  uniqueAreas.forEach(area => {
    const item = document.createElement('div');
    item.className = 'calc-option-item';
    item.id = `calc-item-${area.id}`;
    item.onclick = () => toggleCalcSelection(area);
    item.innerHTML = `
      <div>
        <strong>${area.title}</strong>
        <div style="font-size:0.75rem; color:var(--text-muted);">R$ ${area.price},00/sessão</div>
      </div>
      <div class="calc-checkbox"><i class="fa-solid fa-check"></i></div>
    `;
    container.appendChild(item);
  });
}

// Alternar seleção na Calculadora
function toggleCalcSelection(area) {
  const index = selectedCalcAreas.findIndex(a => a.title === area.title);
  if (index > -1) {
    selectedCalcAreas.splice(index, 1);
  } else {
    selectedCalcAreas.push(area);
  }

  // Atualizar visual do card selecionado
  document.querySelectorAll('.calc-option-item').forEach(el => {
    const title = el.querySelector('strong').innerText;
    const isSelected = selectedCalcAreas.some(a => a.title === title);
    el.classList.toggle('selected', isSelected);
  });

  updateCalcSummary();
}

// Atualizar resumo e valores da Calculadora
function updateCalcSummary() {
  const summaryContainer = document.getElementById('summary-items');
  const subtotalEl = document.getElementById('subtotal-val');
  const discountRow = document.getElementById('discount-row');
  const discountEl = document.getElementById('discount-val');
  const finalEl = document.getElementById('final-val');

  if (selectedCalcAreas.length === 0) {
    summaryContainer.innerHTML = '<p class="empty-text">Nenhuma área selecionada ainda.</p>';
    subtotalEl.innerText = 'R$ 0,00';
    discountRow.style.display = 'none';
    finalEl.innerText = 'R$ 0,00';
    return;
  }

  summaryContainer.innerHTML = '';
  let subtotal = 0;

  selectedCalcAreas.forEach(item => {
    subtotal += item.price;
    const row = document.createElement('div');
    row.className = 'summary-item';
    row.innerHTML = `<span>${item.title}</span> <span>R$ ${item.price},00</span>`;
    summaryContainer.appendChild(row);
  });

  // Lógica de Desconto Progressivo
  let discountPercent = 0;
  if (selectedCalcAreas.length === 2) {
    discountPercent = 0.10; // 10% OFF
  } else if (selectedCalcAreas.length >= 3) {
    discountPercent = 0.25; // 25% OFF
  }

  const discountVal = subtotal * discountPercent;
  const finalVal = subtotal - discountVal;

  subtotalEl.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  
  if (discountPercent > 0) {
    discountRow.style.display = 'flex';
    discountEl.innerText = `- R$ ${discountVal.toFixed(2).replace('.', ',')} (${discountPercent * 100}% OFF)`;
  } else {
    discountRow.style.display = 'none';
  }

  finalEl.innerText = `R$ ${finalVal.toFixed(2).replace('.', ',')}`;
}

// Enviar Calculadora para o WhatsApp
function sendCalcToWhatsApp() {
  if (selectedCalcAreas.length === 0) {
    alert('Por favor, selecione pelo menos 1 área na calculadora!');
    return;
  }

  const areasList = selectedCalcAreas.map(a => `- ${a.title}`).join('%0A');
  const finalPrice = document.getElementById('final-val').innerText;

  const msg = `Olá! Montei meu pacote personalizado na calculadora do site:%0A%0A*Áreas Selecionadas:*%0A${areasList}%0A%0A*Valor Final estimado:* ${finalPrice}/sessão.%0A%0AGostaria de tirar dúvidas e agendar minha avaliação!`;
  window.open(`https://wa.me/5531999999999?text=${msg}`, '_blank');
}

// Máscara para telefone no campo de agendamento
function maskPhone(input) {
  let v = input.value.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
  v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  input.value = v;
}

// Configurar data mínima (hoje)
function setMinBookingDate() {
  const dateInput = document.getElementById('booking-date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

// Pré-selecionar serviço no formulário de agendamento ao clicar nos cards
function preSelectService(serviceName) {
  const select = document.getElementById('service-select');
  for (let option of select.options) {
    if (option.value.includes(serviceName) || option.text.includes(serviceName)) {
      option.selected = true;
      break;
    }
  }
}

// Lógica de submissão do formulário de agendamento
function handleBooking(e) {
  e.preventDefault();

  const name = document.getElementById('client-name').value;
  const phone = document.getElementById('client-phone').value;
  const service = document.getElementById('service-select').value;
  const date = document.getElementById('booking-date').value;
  const time = document.getElementById('booking-time').value;

  // Formatar data em PT-BR
  const formattedDate = date.split('-').reverse().join('/');

  //Preencher dados do modal
  const modalDetails = document.getElementById('modalDetails');
  modalDetails.innerHTML = `
    <strong>Nome:</strong> ${name}<br>
    <strong>Contato:</strong> ${phone}<br>
    <strong>Procedimento:</strong> ${service}<br>
    <strong>Data & Horário:</strong> ${formattedDate} às ${time}
  `;

  // Configurar botão de envio final no modal
  const modalBtn = document.getElementById('modalWhatsappBtn');
  modalBtn.onclick = () => {
    const msg = `Olá! Gostaria de confirmar meu pré-agendamento feito pelo site:%0A%0A*Nome:* ${name}%0A*Contato:* ${phone}%0A*Procedimento:* ${service}%0A*Data:* ${formattedDate}%0A*Horário:* ${time}%0A%0AAguardo a confirmação da equipe!`;
    window.open(`https://wa.me/5531999999999?text=${msg}`, '_blank');
    closeModal();
  };

  // Exibir modal
  document.getElementById('bookingModal').classList.add('active');
}

// Fechar Modal
function closeModal() {
  document.getElementById('bookingModal').classList.remove('active');
}

// Toggle do FAQ
function toggleFaq(element) {
  const item = element.parentElement;
  item.classList.toggle('active');
}
