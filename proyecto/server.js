const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.10'; 

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// DB
const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    dni TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    area TEXT NOT NULL
  )`);
  // Nueva tabla para los registros de llegada
  db.run(`CREATE TABLE IF NOT EXISTS llegadas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dni TEXT NOT NULL,
    hora TEXT NOT NULL,
    FOREIGN KEY(dni) REFERENCES employees(dni)
  )`);
});

// Ruta básica
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login admin
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'SecurityAdmin' && password === 'QvdifuujIjapUpep') {
    return res.json({ ok: true, redirect: '/security.html' });
  }
  return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
});

// Acceso empleado por DNI
app.post('/api/employee/access', (req, res) => {
  const { dni } = req.body;
  db.get('SELECT * FROM employees WHERE dni = ?', [dni], (err, row) => {
    if (err) return res.status(500).json({ ok: false, message: 'Error de base de datos' });
    if (!row) return res.status(404).json({ ok: false, message: 'No existe la cuenta' });
    return res.json({ ok: true, redirect: `/qr.html?dni=${encodeURIComponent(dni)}` });
  });
});

// API empleados
app.get('/api/employees', (req, res) => {
  db.all('SELECT * FROM employees ORDER BY apellido, nombre', [], (err, rows) => {
    if (err) return res.status(500).json({ ok: false, message: 'Error de base de datos' });
    res.json(rows);
  });
});
//mostrar
app.get('/api/employees/:dni', (req, res) => {
  db.get('SELECT * FROM employees WHERE dni = ?', [req.params.dni], (err, row) => {
    if (err) return res.status(500).json({ ok: false });
    if (!row) return res.status(404).json({ ok: false });
    res.json(row);
  });
});
//ingresar
app.post('/api/employees', (req, res) => {
  const { nombre, apellido, dni, area } = req.body;
  if (!nombre || !apellido || !dni || !area) return res.status(400).json({ ok: false, message: 'Faltan datos' });
  const stmt = db.prepare('INSERT INTO employees (dni, nombre, apellido, area) VALUES (?, ?, ?, ?)');
  stmt.run([dni, nombre, apellido, area], (err) => {
    if (err) {
      if (err.message.includes('UNIQUE')) return res.status(409).json({ ok: false, message: 'DNI ya existe' });
      return res.status(500).json({ ok: false, message: 'Error al insertar' });
    }
    res.json({ ok: true });
  });
});
//modificar
app.put('/api/employees/:dni', (req, res) => {
  const { nombre, apellido, area } = req.body;
  const dni = req.params.dni;
  db.run('UPDATE employees SET nombre = ?, apellido = ?, area = ? WHERE dni = ?', [nombre, apellido, area, dni], function (err) {
    if (err) return res.status(500).json({ ok: false, message: 'Error al modificar' });
    if (this.changes === 0) return res.status(404).json({ ok: false, message: 'DNI no encontrado' });
    res.json({ ok: true });
  });
});
//eliminar
app.delete('/api/employees/:dni', (req, res) => {
  db.run('DELETE FROM employees WHERE dni = ?', [req.params.dni], function (err) {
    if (err) return res.status(500).json({ ok: false, message: 'Error al eliminar' });
    if (this.changes === 0) return res.status(404).json({ ok: false, message: 'DNI no encontrado' });
    res.json({ ok: true });
  });
});

// QR por DNI (PNG)
app.get('/api/qrcode/:dni.png', (req, res) => {
  const { dni } = req.params;
  db.get('SELECT * FROM employees WHERE dni = ?', [dni], async (err, row) => {
    if (err || !row) return res.status(404).send('No encontrado');
    try {
      // El QR ahora contiene el DNI como texto plano.
      const payload = row.dni;
      res.type('png');
      await QRCode.toFileStream(res, payload, { width: 300, margin: 1 });
    } catch (e) {
      res.status(500).send('Error generando QR');
    }
  });
});

// Nueva ruta para registrar la llegada
app.post("/registrar-llegada", (req, res) => {
  const { dni, hora } = req.body;
  db.run("INSERT INTO llegadas (dni, hora) VALUES (?, ?)", [dni, hora], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error guardando llegada");
    }
    res.send("Llegada registrada con éxito");
  });
});

// Nueva ruta para obtener todas las llegadas
app.get("/llegadas", (req, res) => {
  db.all("SELECT * FROM llegadas ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ ok: false, message: "Error de base de datos" });
    }
    res.json(rows);
  });
});

// Arranque del servidor en 127.0.0.10
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});
