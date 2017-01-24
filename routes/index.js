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
  res.redirect('/login');
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
      return res.redirect("header");
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
  console.log("----->>>>", req.session);
  req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("destroyed ----->>>>", req.session);
        res.render('login');
      }
    });
});

router.get('/index', (req, res, next) => {
  res.render('index');
});
router.get('/header', (req, res, next) => {
  if(req.session.emailid) {
    const query = DB.builder()
      .select()
        .from('tbl_tweet')
        .toParam()
      DB.executeQuery(query, (error, results) => {
        if (error) {
          next(error);
          return;
        }


      res.render('header',{res:results.rows});
   })
  } else  {
    res.render('login');
  }

});

router.get('/profile', (req, res, next) => {
  res.render('profile');
});

router.post('/header', (req, res, next) => {

  const query = DB.builder()
    .insert()
      .into('tbl_tweet')
      .set('t_tweetText', req.body.comment)
      .set('t_likeCount',"0")
      .set('t_time', "now()")
      .toParam()
  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }
    res.redirect('/header');
});
});

// router.post('/likecount', (req, res, next) =>{
//   const query = DB.builder()
//     .update()
//       .table("tbl_tweet")
//       .set('t_likeCount', 't_likeCount + 1')
//   DB.executeQuery(query, (error, updatedBooks) => {
//     if (error) {
//       return next(error);
//     }
//     res.redirect('/');
//   });
// });
  // .select()
  //     .from('tbl_tweet')
  //     .field('t_likeCount')
  //     .toParam()
  // executeQuery(query, (error, books) => {
  //   if (error) {
  //     return next(error);
  //   }


// })
router.get('/homepage', (req, res, next) => {
  res.render('homepage');
});


module.exports = router;
