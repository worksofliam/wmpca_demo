const express = require('express');
const app = express();
const port = 5000;

const db2 = require('./classes/db2');

app.use('/public', express.static('public'));
app.set('view engine', 'pug');

app.get('/departments', async (req, res) => {
  const nameSort = req.query.nameSort || 'asc';
  const departments = await db2.executeStatement(`select * from sample.department order by DEPTNAME ${nameSort}`);

  res.render('departments', {departments, nameSort});
});

app.get('/departments/:deptid/projects', async (req, res) => {
  const deptid = req.params.deptid;

  const projects = await db2.executeStatement(`select * from sample.project where DEPTNO = ?`, [deptid]);

  res.render('projects', {departmentNo: deptid, projects});
});

app.get('/departments/:deptid/projects/:projid/activity', async (req, res) => {
  const {deptid, projid} = req.params;

  const activities = await db2.executeStatement(`select a.projno, a.actno, a.acstdate, (select b.actdesc from sample.act as b where b.actno = a.actno) as actdesc from sample.projact as a where a.projno = ?`, [projid]);

  res.render('activity', {departmentNo: deptid, projectNo: projid, activities});
});

db2.connect(`Driver=IBM i Access ODBC Driver;System=seiden.iinthecloud.com;UID=ALAN3;Password=`)
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});