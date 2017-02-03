const express = require('express');
const DB = require('../helpers/db');

const router = express.Router();
const path = require('path');

const multer = require('multer');

const upload = multer({ dest: path.resolve(__dirname, '../public/images/profile/') });
const uploadtweet = multer({ dest: path.resolve(__dirname, '../public/images/tweetimage/') });
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
    res.render('index', {
       // title: `Time from the database is ${results.rows[0].now}`,

    });
  });
});


router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', upload.single('file'), (req, res, next) => {
  const filename = req.file.filename;
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
    res.redirect('/login');
  });
});


router.get('/login', (req, res) => {
  res.render('login');
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
      res.redirect('header');
    } else {
      res.render('login');
    }
  });
});


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("destroyed ----->>>>", req.session);
      res.render('login');
    }
  });
});

router.get('/index', (req, res) => {
  res.render('index');
});


router.get('/header', (req, res, next) => {
  let query;
  const session = req.session;
  if (req.session.emailid) {
    query = DB.builder()
      .select()
      .field('fullname')
      .field('t_tweetText')
      .field('image')
      .field('t.*')
      .from('tbl_register', 'r')
      .join('tbl_tweet', 't', 't.t_userid = r.id')
      .where(DB.builder().expr()
        .or('t.t_userid IN ?', DB.builder()
          .select()
          .field('f_followerid')
          .from('tbl_follower')
          .where('f_userid = ?', req.session.userid)
        )
        .or('t.t_userid= ?', req.session.userid)
      )
      .order('t_time', false);
    console.log(query.toString());
    DB.executeQuery(query.toParam(), (error, tweets) => {
      if (error) {
        next(error);
        return;
      }

      query = DB.builder()
          .select()
          .from('tbl_register')
          .where('id != ?', session.userid)
          .where('id NOT IN ?',
          DB.builder()
             .select()
             .field('f_followerid')
             .from('tbl_follower')
             .where('f_userid = ?', session.userid))
             .toParam();
       // console.log("--->/////", query);

      DB.executeQuery(query, (error1, follow) => {
        if (error1) {
          next(error1);
          return;
        }

        query = DB.builder()
        .select()
        .from('tbl_register', 'r')
        .field('fullname')
        .field('image')
        .where('id = ?', req.session.userid)
        .toParam();
        console.log(query);

        DB.executeQuery(query, (error2, username) => {
          if (error2) {
            next(error2);
            return;
          }
          res.render('header', {
            tweets: tweets.rows,
            follow: follow.rows,
            username: username.rows,
          });
        });
      });
    });
  } else {
    res.render('login');
  }
});

router.post('/header', uploadtweet.single('file'), (req, res, next) => {
  console.log("--->>>>>");
  let filename = '';
  if (req.file) {
    filename = req.file.filename;
  } else {
    filename = '';
  }
  const query = DB.builder()
    .insert()
      .into('tbl_tweet')
      .set('t_tweetText', req.body.comment)
      .set('t_likeCount', '0')
      .set('t_time', 'now()')
      .set('t_image', filename)
      .set('t_userid', req.session.userid)
      .toParam();
  console.log('=========', query);
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    res.redirect('/header');
  });
});


router.get('/profile', (req, res, next) => {
  let query;
  const session = req.session;
  if (req.session.emailid) {
    query = DB.builder()
        .select()
          .field('fullname')
          .field('t_tweetText')
          .field('t_time')
          .field('image')
          .field('t_image')
          .from('tbl_register', 'r')
          .join(DB.builder().select().from('tbl_tweet'), 't', 't.t_userid = r.id')
          .where('emailid = ?', req.session.emailid)
          .order('t_time', false)
          .toParam();
    DB.executeQuery(query, (error, results) => {
      if (error) {
        next(error);
        return;
      }

      query = DB.builder()
          .select()
          .field('fullname')
          .field('f_followerid')
          .field('f_id')
          .field('image')
          .from('tbl_register', 'r')
          .join(DB.builder().select().from('tbl_follower'), 'f', 'r.id = f.f_followerid')
          .where('r.id != ?', session.userid)
          .toParam();

      console.log(query);

      DB.executeQuery(query, (error1, follow) => {
        if (error1) {
          next(error1);
          return;
        }

        query = DB.builder()
          .select()
          .from('tbl_register', 'r')
          .field('fullname')
          .field('image')
          .where('id = ?', req.session.userid)
          .toParam();
        console.log(query);

        DB.executeQuery(query, (error2, username) => {
          if (error2) {
            next(error2);
            return;
          }

          res.render('profile', {
            res: results.rows,
            follow: follow.rows,
            username: username.rows,
          });
        });
      });
    });
  } else {
    res.render('login');
  }
});

router.post('/profile', (req, res, next) => {
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

router.post('/follow', (req, res, next) => {
  const session = req.session;
  const query = DB.builder()
    .insert()
    .into('tbl_follower')
    .set('f_userid', session.userid)
    .set('f_followerid', req.body.myfollow)
    .toParam();

  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }

    res.redirect('/header');
  });
});

router.post('/unfollow', (req, res, next) => {
  const query = DB.builder()
      .delete()
      .from('tbl_follower')
      .where('f_followerid=?', req.body.myfollow)
      .toParam();

  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    res.redirect('/profile');
  });
});

router.get('/updateprofile', (req, res, next) => {
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

router.post('/updateprofile', upload.single('file'), (req, res) => {
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
  res.redirect('profile');
});

module.exports = router;
