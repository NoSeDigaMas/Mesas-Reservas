const availableTables = [
  { number: 1, reserved: false },
  { number: 2, reserved: false },
  { number: 3, reserved: false },
  { number: 4, reserved: false },
  { number: 5, reserved: false },
  { number: 6, reserved: false },
  { number: 7, reserved: false },
  { number: 8, reserved: false },
  { number: 9, reserved: false },
  { number: 10, reserved: false },
  { number: 11, reserved: false },
  { number: 12, reserved: false }
];

const reservations = [];

document.addEventListener('DOMContentLoaded', () => {
  renderTables();
  document.getElementById('reserveButton').addEventListener('click', reserveTable);
  document.getElementById('reportButton').addEventListener('click', generateReport);
});

function renderTables() {
  const availableTablesDiv = document.getElementById('availableTables');
  const occupiedTablesDiv = document.getElementById('occupiedTables');

  availableTablesDiv.innerHTML = '';
  occupiedTablesDiv.innerHTML = '';

  availableTables.forEach(table => {
    const tableDiv = document.createElement('div');
    tableDiv.className = 'table';
    tableDiv.innerHTML = `
    <img src="mesa chimba.jpg" alt="Mesa ${table.number}"><div class="table-name">Mesa ${table.number}</div>`;
    const reserveButton = document.createElement('button');
    reserveButton.className = 'button';
    reserveButton.textContent = 'Reservar';
    reserveButton.onclick = () => reserveTableByNumber(table.number);
    tableDiv.appendChild(reserveButton);

    availableTablesDiv.appendChild(tableDiv);
  });

  reservations.forEach(res => {
    const tableDiv = document.createElement('div');
    tableDiv.className = 'table';
    tableDiv.innerHTML = `
    <img src="mesa chimba.jpg" alt="Mesa ${res.number}"><div class="table-name">Mesa ${res.number}</div>`;
    const releaseButton = document.createElement('button');
    releaseButton.className = 'button';
    releaseButton.textContent = 'Liberar';
    releaseButton.onclick = () => releaseTable(res.number, res.dateTime);
    tableDiv.appendChild(releaseButton);
    occupiedTablesDiv.appendChild(tableDiv);
  });
}

function reserveTable() {
  const customerName = document.getElementById('customerName').value.trim();
  const tableNumber = parseInt(document.getElementById('tableNumber').value);
  const reservationDateTime = document.getElementById('reservationDateTime').value;

  if (!customerName || isNaN(tableNumber) || !reservationDateTime) {
    alert('Por favor ingresar nombre, número de mesa y fecha/hora.');
    return;
  }

  const newDate = new Date(reservationDateTime);
  const conflict = reservations.some(r => {
    if (r.number === tableNumber) {
      const existingDate = new Date(r.dateTime);
      const diffHours = Math.abs((newDate - existingDate) / (1000 * 60 * 60));
      return diffHours < 3;
    }
    return false;
  });

  if (conflict) {
    alert("La mesa ya está reservada en ese horario. Debes esperar al menos 3 horas.");
    return;
  }

  reservations.push({ number: tableNumber, customer: customerName, dateTime: reservationDateTime });
  renderTables();
  document.getElementById('customerName').value = '';
  document.getElementById('tableNumber').value = '';
  document.getElementById('reservationDateTime').value = '';
}

function reserveTableByNumber(tableNumber) {
  const customerName = document.getElementById('customerName').value.trim();
  const reservationDateTime = document.getElementById('reservationDateTime').value;

  if (!customerName || !reservationDateTime) {
    alert('Por favor, ingresa nombre y fecha/hora.');
    return;
  }

  const newDate = new Date(reservationDateTime);
  const conflict = reservations.some(r => {
    if (r.number === tableNumber) {
      const existingDate = new Date(r.dateTime);
      const diffHours = Math.abs((newDate - existingDate) / (1000 * 60 * 60));
      return diffHours < 3;
    }
    return false;
  });

  if (conflict) {
    alert("La mesa ya está reservada en ese horario. Debes esperar al menos 3 horas.");
    return;
  }

  reservations.push({ number: tableNumber, customer: customerName, dateTime: reservationDateTime });
  renderTables();
  document.getElementById('customerName').value = '';
  document.getElementById('reservationDateTime').value = '';
}

function releaseTable(tableNumber, dateTime) {
  const index = reservations.findIndex(r => r.number === tableNumber && r.dateTime === dateTime);
  if (index !== -1) {
    reservations.splice(index, 1);
    renderTables();
  }
}

function generateReport() {
  const reportOutput = document.getElementById('reportOutput');
  reportOutput.textContent = 'Reporte de Reservas Actuales:\n\n';

  reservations.forEach(res => {
    const dateObj = new Date(res.dateTime);
    const formattedDate = dateObj.toLocaleDateString('es-ES');
    const formattedTime = dateObj.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });

    reportOutput.textContent += `Mesa ${res.number} - Reservada por: ${res.customer} - Fecha: ${formattedDate} - Hora: ${formattedTime}\n`;
  });

  if (reservations.length === 0) {
    reportOutput.textContent += 'No hay reservas actuales.';
  }
}

renderTables();
