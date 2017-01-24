const express = require('express');

const DB = require('../helpers/db');

const router = express.Router();

// GET: /
router.get('/', (req, res, next) => {
  // Constuct and run a simple query
  const query = DB.builder()
    .select()
    .function('NOW()')
    .toParam();

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

router.get('/index', (req, res, next) => {
  res.render('index');
});
router.get('/header', (req, res, next) => {

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



module.exports = router;
