var express = require('express');
var router = express.Router();


const userDAO = require('../Database/DAO/user');
const ticketDAO = require('../Database/DAO/ticket');
const bundleDAO = require('../Database/DAO/bundle');
const employeeDAO = require('../Database/DAO/employee');
const operationDAO = require('../Database/DAO/operation');
const scansDAO = require('../Database/DAO/scans');

const addFP = require('../Others/addFilePerpetual');

/* INDEX */
router.get('/', async function (req, res, next) {
  res.send("API - INTERNATIONAL SYSTEMS");
});


/* EMPLOYEE */
router.get('/employee', async function (req, res, next) {
  res.send(await employeeDAO.getAll());
});

router.get('/employee/:empnum', async function (req, res, next) {
  let employee = await employeeDAO.get(req.params.empnum);
  employee["historic_earnings"] = await employeeDAO.getEarnings(req.params.empnum)
  res.send(employee);
});



/* OPERATION */
router.get('/operation', async function (req, res, next) {
  res.send(await operationDAO.getAll());
});

/* BUNDLE */
router.get('/bundle', async function (req, res, next) {
  res.send(await bundleDAO.getAll());
});

router.get('/complete/bundle', async function (req, res, next) {
  let tickets = await ticketDAO.getAll();
  const bundle = await bundleDAO.getAll();

  res.send(bundle.map((b) => ({
    id: b.bundle,
    name: b.bundle + " - " + b.quantity + "x [" + b.cut + " | " + b.style + " (" + b.size + ") " + b.color + "]",
    operations: tickets.filter(t => t.bundle == b.bundle && t.time > 0).map(t => ({
      id: t.operation,
      name: t.operation,
      isFinished: t.empnum > 0,
      ticket: {
        id: t.ticket,
        operation: t.operation,
        bundle: t.bundle,
        time: t.time,
        earn: t.standard * t.quantity,
        standard: t.standard,
        quantity: t.quantity
      }
    }))
  }))
  );
});


router.get('/ticket', async function (req, res, next) {
  let tickets = await ticketDAO.getAll();
  res.send(tickets);
});


router.get('/compact/ticket', async function (req, res, next) {
  let tickets = await ticketDAO.getAll();

  res.send(tickets.map(t => ({
    id: t.ticket,
    operation: t.operation,
    bundle: t.bundle
  })));
});


/* TICKET */
router.get('/complete/ticket', async function (req, res, next) {
  let tickets = await ticketDAO.getAll();
  let bundle = await bundleDAO.getAll();
  let operation = await operationDAO.getAll();
  
  for(let i = 0; i < tickets.length;i++){
    tickets[i]._bundle = bundle.filter((b) => tickets[i].bundle == b.bundle);
    tickets[i]._operation = operation.filter((o) => tickets[i].operation == o.operation);
  }
  res.send(tickets);
});

/* AUTH */
router.get('/auth', async function (req, res, next) {
  const user = {
    username: req.query.username,
    password: req.query.password
  }
  res.send(await userDAO.auth(user.username, user.password));
});

router.post('/scans', async function (req, res, next) {
  console.log(req.body);

  res.send(await scansDAO.insertJSON(req.body));
});


/* register ticket */
router.get('/start_ticket/:empnum/:ticket', async function (req, res, next) {
  res.send(await scansDAO.start(req.params.empnum, req.params.ticket));
});

router.get('/finish_ticket/:empnum/:ticket', async function (req, res, next) {
  // addFP.add(ticket);
  res.send(await scansDAO.finish(req.params.empnum, req.params.ticket));
});
router.get('/efficiency_ticket/:empnum/:ticket', async function (req, res, next) {
  res.send(await scansDAO.getEfficiency(req.params.empnum, req.params.ticket));
});


router.get('/scans/:empnum', async function (req, res, next) {
  res.send(await scansDAO.getByEmpnum(req.params.empnum));
});


module.exports = router;
