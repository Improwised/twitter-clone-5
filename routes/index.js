const express = require('express');

const DB = require('../helpers/db');

const router = express.Router();

// GET: /
router.get('/', (req, res, next) => {
  // Constuct and run a simple query
  const query = DB.builder()
    .select()
    .function('NOW()')
    .toParam()

  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }

    res.render('welcome', {
      // title: `Time from the database is ${results.rows[0].now}`,
    });
  });
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/home', (req, res, next) => {
  var session = req.session;
  console.log(req.session)
  console.log('Welcome' + req.session.emailid + 'to your account');

  return res.render('home');
});

router.post('/register', (req, res, next) => {

  const query = DB.builder()
    .insert()
    .into('tbl_register')
    .set('fullname', req.body.fullname)
    .set('emailid', req.body.emailid)
    .set('password', req.body.password)
    .toParam()
  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }
  res.render('register');
  });
});

router.post('/login', (req, res, next) => {

  const fetchemailid = req.body.emailid;
  const fetchpassword = req.body.password;
  const query = DB.builder()
    .select()
    .from('tbl_register')
    .where('emailid = ? AND password = ?', fetchemailid, fetchpassword)
    .toParam()
  return DB.executeQuery(query, (error, results) => {
    if (error) {
      console.log("error!!!!");
      next(error);
      return;
    }
    if(results.rowCount){
      var sess=req.session;
      console.log(fetchemailid);
      req.session.emailid = fetchemailid;
      console.log(req.session);
      console.log("Data matched");
      return res.redirect("home");
    } else {
      console.log("Data not matched")
      res.render('login');
    }
  });
});



router.post('/home', (req, res, next) => {
  var session = req.session;
  res.write('Welcome' + session.emailid + 'to your account');
  // res.render('login');
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("destroyed ----->>>>", req.session.id);
        res.render('login');
      }
    });
});


module.exports = router;
