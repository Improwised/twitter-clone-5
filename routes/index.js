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
    res.render('index', {
       title: `Time from the database is ${results.rows[0].now}`,
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
      req.session.userid = results.rows[0].id;
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
  let query
  if(req.session.emailid) {

  query = DB.builder()
        .select()
          .field('fullname')
          .field('t_tweetText')
          .field('t_time')
          .from('tbl_register','r')
          .join(DB.builder().select().from('tbl_tweet'),'t','t.t_userid = r.id')

          .toParam()


      DB.executeQuery(query, (error, tweets) => {
        if (error) {
          next(error);
          return;
          }


  query = DB.builder()
      .select()
      .from('tbl_register','r')
      .field('fullname')
      .field('id')
      .where('id != ?',req.session.userid)
      .toParam();
    console.log(query);

      DB.executeQuery(query, (error, follow) => {
        if (error) {
          next(error);
          return;

        }

  query = DB.builder()
      .select()
      .from('tbl_register','r')
      .field('fullname')
      .where('id = ?',req.session.userid)
      .toParam();
    console.log(query);

      DB.executeQuery(query, (error, username) => {
        if (error) {
          next(error);
          return;
        }

       // console.log(results.rows);
      res.render('header',{
        tweets : tweets.rows,
        follow : follow.rows,
        username : username.rows,
      });
    });
  });
  });
 } else  {
    res.render('login');
  }
});

router.get('/profile', (req, res, next) => {
  query = DB.builder()
      .select()
      .from('tbl_register','r')
      .field('fullname')
      .field('id')
      .where('id != ?',req.session.userid)
      .toParam();
    console.log(query);

      DB.executeQuery(query, (error, follow) => {
        if (error) {
          next(error);
          return;
      }

  res.render('profile',{
    follow : follow.rows,
  });
});
});

router.post('/header', (req, res, next) => {
  const query = DB.builder()
    .insert()
      .into('tbl_tweet')
      .set('t_tweetText', req.body.comment)
      .set('t_likeCount',"0")
      .set('t_time', "now()")
      .set('t_userid', req.session.userid)
      .toParam()
  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }
    res.redirect('/header');
});
});

router.post('/follow', (req, res, next) => {

  const session = req.session;

    const query = DB.builder()
        .insert()
        .into('tbl_follower')
        .set('f_userid',session.userid)
        .set('f_followerid',req.body.myfollow)
        .toParam();

  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }
        // console.log(results.rows);
    res.redirect('/header');
   });

});

router.post('/unfollow', (req, res, next) => {
  console.log("jksbdkjdbsbd");
  const session = req.session;

    const query = DB.builder()
        .delete()
        .from('tbl_follower')
        .where('f_followerid=?',req.body.myunfollow)
        .toParam();

  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }
        // console.log(results.rows);
    res.redirect('/header');
   });

});

router.get('/followername', (req, res, next) => {

  query = DB.builder()
        .select()
          .field('fullname')
          .field('t_tweetText')
          .field('t_time')
          .from('tbl_register','r')
          // .join(DB.builder().select().from('tbl_tweet'),'t','t.t_userid = r.id')
          .where('t.t_userid = r.id')
          .toParam()


      DB.executeQuery(query, (error, followername) => {
        if (error) {
          next(error);
          return;
          }
});
});
module.exports = router;
