const express = require('express');

const DB = require('../helpers/db');

const router = express.Router();
const path = require('path');

var multer  = require('multer')

const upload = multer({ dest: path.resolve(__dirname, '../public/images/profile/') });

// GET: /
router.get('/', (req, res, next) => {
  // Constuct and run a simple query
  const query = DB.builder()
    .select()
    .function('NOW()')
    .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    res.render('homepage', {
      // title: `Time from the database is ${results.rows[0].now}`,
    });
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/register', upload.single('file'), function (req, res, next) {
  const filename = req.file.filename;
  const session = req.session;
  const query = DB.builder()
    .insert()
    .into('tbl_register')
    .set('fullname', req.body.fullname)
    .set('emailid', req.body.emailid)
    .set('password', req.body.password)
    .set('image', filename)
    .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    res.redirect('login');
  });
});

router.post('/login', (req, res, next) => {
  const session = req.session;
  const fetchemailid = req.body.emailid;
  const fetchpassword = req.body.password;
  const query = DB.builder()
    .select()
    .from('tbl_register')
    .where('emailid = ? AND password = ?', fetchemailid, fetchpassword)
    .toParam();
  return DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }
    if (results.rowCount) {
      session.emailid = fetchemailid;
      session.userid = results.rows[0].id;
      // console.log(req.session);
      // console.log("Data matched");
      res.redirect('header');
    } else {
      // console.log("Data not matched");
      res.render('login');
    }
  });
});

// router.post('/home', (req, res) => {
//   const session = req.session;
//   res.write('Welcome' + session.emailid + 'to your account');
// });

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      // console.log("destroyed ----->>>>", req.session);
      res.render('login');
    }
  });
});

router.get('/index', (req, res) => {
  res.render('index');
});

router.get('/header', (req, res, next) => {
  if (req.session.emailid) {
    const query = DB.builder()
        .select()
          .field('fullname')
          .field('t_tweetText')
          .field('t_time')
          .from('tbl_register', 'r')
          .join(DB.builder().select().from('tbl_tweet'), 't', 't.t_userid = r.id')
          //.where('emailid = ?', req.session.emailid)
          .toParam();
    DB.executeQuery(query, (error, results) => {
      if (error) {
        next(error);
        return;
      }
      res.render('header', { res: results.rows });
    });
  } else {
    res.render('login');
  }
});

router.post('/header', (req, res, next) => {
  const query = DB.builder()
    .insert()
      .into('tbl_tweet')
      .set('t_tweetText', req.body.comment)
      .set('t_likeCount', '0')
      .set('t_time', 'now()')
      .set('t_userid', req.session.userid)
      .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    res.redirect('/header');
  });
});

router.get('/homepage', (req, res) => {
  res.render('homepage');
});

router.get('/profile', (req, res, next) => {
  if (req.session.emailid) {
    const query = DB.builder()
        .select()
          .field('fullname')
          .field('t_tweetText')
          .field('t_time')
          .field('image')
          .from('tbl_register', 'r')
          .join(DB.builder().select().from('tbl_tweet'), 't', 't.t_userid = r.id')
          .where('emailid = ?', req.session.emailid)
          .toParam();
    DB.executeQuery(query, (error, results) => {
      if (error) {
        next(error);
        return;
      }
      console.log(results.rows[0]);
      res.render('profile', { res: results.rows});
    });
  } else {
    res.render('login');
  }
});

router.post('/profile', (req, res) => {
  const query = DB.builder()
    .insert()
      .into('tbl_tweet')
      .set('t_tweetText', req.body.comment)
      .set('t_likeCount', '0')
      .set('t_time', 'now()')
      .set('t_userid', req.session.userid)
      .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    res.redirect('/profile');
  });
});

router.get('/updateprofile', (req, res) => {
  const session = req.session;
  const query = DB.builder()
    .select()
    .field('fullname')
    .field('emailid')
    .field('password')
    .field('image')
    .from('tbl_register')
    .where('emailid = ?', session.emailid)
    .toParam();
  return DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }
    res.render('updateprofile', { res: results.rows });
  });
});

router.post('/updateprofile', upload.single('file'), function (req, res, next) {
  const session = req.session;
  const filename = req.file.filename;
  const query = DB.builder()
    .update()
      .table('tbl_register')
      .set('fullname', req.body.fullname)
      .set('emailid', req.body.emailid)
      .set('password', req.body.password)
      .set('image', filename)
      .where('emailid = ?', session.emailid)
      .toParam();
  DB.executeQuery(query, (error, next) => {
    if (error) {
      next(error);
    }
  });
  res.redirect('updateprofile');
});


module.exports = router;
