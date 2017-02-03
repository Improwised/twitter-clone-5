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
    }
    res.render('index', {
       // title: `Time from the database is ${results.rows[0].now}`,
    });
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', upload.single('file'), function (req, res, next) {
  const fullname = req.sanitize('fullname').trim();
  const emailid = req.sanitize('emailid').trim();
  const password = req.sanitize('password').trim();
  const securityquestion = req.sanitize('question').trim();
  const securityanswer = req.sanitize('answer').trim();

  req.checkBody('fullname', 'Username is required').notEmpty();
  if (emailid !== '') {
    req.checkBody('emailid', 'Email is not valid').isEmail();
  } else {
    req.checkBody('emailid', 'Email is required').notEmpty();
  }
  req.checkBody('question', 'question is required').notEmpty();
  req.checkBody('answer', 'answer is required').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    res.render('register', {
      errors,
    });
  } else {
    let photo = '';
    if (req.file) {
      photo = req.file.filename;
    } else {
      photo = 'default.png';
    }
    const query = DB.builder()
      .insert()
      .into('tbl_register')
      .set('fullname', fullname)
      .set('emailid', emailid)
      .set('password', password)
      .set('image', photo)
      .set('securityquestion', securityquestion)
      .set('securityanswer', securityanswer)
      .toParam();
    DB.executeQuery(query, (error) => {
      if (error) {
        next(error);
      }
      res.redirect('/login');
    });
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const session = req.session;
  const emailid = req.sanitize('emailid').trim();
  const password = req.sanitize('password').trim();

  if (emailid !== '') {
    req.checkBody('emailid', 'Email is not valid').isEmail();
  } else {
    req.checkBody('emailid', 'Email is required').notEmpty();
  }
  req.checkBody('password', 'Password is required').notEmpty();

  const query = DB.builder()
    .select()
    .from('tbl_register')
    .where('emailid = ? AND password = ?', emailid, password)
    .toParam();
  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
    }
    if (results.rowCount) {
      session.emailid = emailid;
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
          .where('f_userid = ?', req.session.userid),
        )
        .or('t.t_userid= ?', req.session.userid),
      )
      .order('t_time', false);
    DB.executeQuery(query.toParam(), (error, tweets) => {
      if (error) {
        next(error);
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
      DB.executeQuery(query, (follow) => {
        if (error) {
          next(error);
        }
        query = DB.builder()
          .select()
          .from('tbl_register', 'r')
          .field('fullname')
          .field('image')
          .where('id = ?', req.session.userid)
          .toParam();
        DB.executeQuery(query, (username) => {
          if (error) {
            next(error);
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

router.post('/header', uploadtweet.single('file'), function (req, res, next) {
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
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
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
      .from('tbl_register', 'r')
      .join(DB.builder().select().from('tbl_tweet'), 't', 't.t_userid = r.id')
      .where('emailid = ?', session.emailid)
      .toParam();
    DB.executeQuery(query, (error, results) => {
      if (error) {
        next(error);
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
      DB.executeQuery(query, (follow) => {
        if (error) {
          next(error);
        }
        query = DB.builder()
          .select()
          .from('tbl_register', 'r')
          .field('fullname')
          .field('image')
          .where('id = ?', req.session.userid)
          .toParam();
          console.log(query);
        DB.executeQuery(query, (error, username) => {
          if (error) {
            next(error);
          }
          query = DB.builder()
            .select()
            .from('tbl_register','r')
            .field('fullname')
            .field('image')
            .where('id = ?', req.session.userid)
            .toParam();
            console.log(query);
          DB.executeQuery(query, (error, username1) => {
            if (error) {
              next(error);
            }
            res.render('profile', {
            res: results.rows,
            follow: follow.rows,
            username : username.rows,
            username1 : username1.rows,
            });
          });
        });
      });
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
  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
    }
    res.redirect('/header');
   });
});

router.post('/unfollow', (req, res, next) => {
  const session = req.session;
  const query = DB.builder()
    .delete()
    .from('tbl_follower')
    .where('f_followerid=?', req.body.myfollow)
    .toParam();
  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
    }
    res.redirect('/profile');
   });
});

router.get('/followername', (req, res, next) => {
  const query = DB.builder()
    .select()
    .field('fullname')
    .field('t_tweetText')
    .field('t_time')
    .from('tbl_register', 'r')
    .where('t.t_userid = r.id')
    .toParam()
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
    }
  });
});

router.get('/updateprofile', (req, res) => {
  const session = req.session;
  if (req.session.emailid) {
    const query = DB.builder()
      .select()
      .field('fullname')
      .field('emailid')
      .field('password')
      .field('image')
      .from('tbl_register')
      .where('emailid = ?', session.emailid)
      .toParam();
    DB.executeQuery(query, (error, next, results) => {
      if (error) {
        next(error);
      }
      res.render('updateprofile', { res: results.rows });
    });
  } else {
    res.render('login');
  }
});


router.post('/updateprofile', upload.single('file'), function (req, res) {
  const session = req.session;
  const query = DB.builder()
    .update()
      .table('tbl_register')
      .set('fullname', req.body.fullname)
      .set('emailid', req.body.emailid)
      .set('password', req.body.password)
      .where('emailid = ?', session.emailid)
      .toParam();
  DB.executeQuery(query, (error, next) => {
    if (error) {
      next(error);
    }
  });
  res.redirect('updateprofile');
});


router.get('/profilepictureupload', (req, res, next) => {
  const session = req.session;
  if (req.session.emailid) {
    const query = DB.builder()
      .select()
      .field('image')
      .from('tbl_register')
      .where('emailid = ?', session.emailid)
      .toParam();
    DB.executeQuery(query, (error, results) => {
      if (error) {
        next(error);
      }
      res.render('updateprofile', { res: results.rows });
    });
  }
  res.render('login');
});

router.post('/profilepictureupload', upload.single('file'), function (req, res) {
  const session = req.session;
  if (req.session.emailid) {
    let photo = ''; /*= req.file.filename;*/
    if (req.file) {
      photo = req.file.filename;
    } else {
      photo = 'default.png';
    }
    const query = DB.builder()
      .update()
      .table('tbl_register')
      .set('image', photo)
      .where('emailid = ?', session.emailid)
      .toParam();
    DB.executeQuery(query, (error, next) => {
      if (error) {
        next(error);
      }
    });
    res.redirect('updateprofile');
  } else {
    res.render('login');
  }
});

router.get('/deleteaccount', (req, res, next) => {
  const session = req.session;
  if (req.session.emailid) {
    const query = DB.builder()
      .delete()
      .from('tbl_register')
      .where('emailid = ?', session.emailid)
      .toParam();
    DB.executeQuery(query, (error) => {
      if (error) {
        next(error);
      }
      res.render('login');
    });
  }
});

router.get('/resetpassword', (req, res) => {
  res.render('resetpassword');
});
router.get('/getpassword', (req, res) => {
  res.render('getpassword');
});

router.post('/resetpassword', (req, res, next) => {
  const query = DB.builder()
    .select()
    .field('password')
    .from('tbl_register')
    .where('emailid = ?', req.body.emailid)
    .where('securityquestion = ?', req.body.question)
    .where('securityanswer = ?', req.body.answer)
    .toParam();
  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
    }
    res.render('getpassword', { res: results.rows });
  });
});


module.exports = router;
