const db = require('../database/connection');
const moment = require('moment');
const _ = require('lodash');

// get all actors
exports.getAllActors = async (req, res) => {
  const allActors = [];
  const allEvents = await resolveAllEVents().then(events => events);

  // fetch all events
  for(var i = 0; i < allEvents.length; i++){
    actor = await getActor(allEvents[i].actor).then(actor => actor[0]).catch(err => console.log(err));
    allActors.push(actor);
  }

  // delay before results
  res.status(200).json(allActors);
}

// update actors
exports.updateActorProfile = (req, res) => {
  if(!req.body.avatar_url){
    res.status(400).send();
  }else{
    // update actor
    db.serialize(() => {
      db.all(`SELECT * FROM actors WHERE id = ${req.body.id}`, (err, val) => {
        if(err) console.log(err);
        if(val.length > 0){
          db.run(`UPDATE actors SET avatar_url = ? WHERE id = ${req.body.id}`, [req.body.avatar_url],  (err, val) => {
            if(err) res.status(400).send();
            // return data
            res.status(200).send();
          });
        }else{
          res.status(404).send();
        }
      });
    });
  }
}

// get actor streak
exports.getActorStreak = async (req, res) => {
  
  const allEvents = await resolveAllEVentsUnsorted().then(events => events);
  const streakInfo = await getStreakInfo(allEvents).then(streak => streak);
    const streakInfoArray = getStreakInfoArray(streakInfo);

    const sortedStreakInfo = _.orderBy(
      streakInfoArray,
      ['highestStreak', 'latestEvent', 'login'],
      ['desc', 'desc', 'asc'],
  );

  const actorsIdByStreak = getActorsIdByStreak(sortedStreakInfo);
  const actorsInOrder = await Promise.all(actorsIdByStreak.map(actor => getActor(actor).then(val => val[0])));
  res.status(200).json(actorsInOrder);  
}

// get total numbers of days actors has
function ActorByEvents(actorID) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, type, actor, repo, created_at FROM events WHERE actor = ${actorID} `, (err, actor) => {
      if(err) reject(err);
      resolve(actor);
    });
  });
}

// get all events
function resolveAllEVents() {
  return new Promise((resolve, reject) => {
    // get actor streaks
    db.serialize(() => {
      db.all(`SELECT id, type, actor, repo, created_at, COUNT(*) FROM events GROUP BY actor ORDER BY COUNT(*) DESC, created_at DESC`, (err, val) => {
        if(err) reject(err);
        resolve(val);
      });
    });
  });
}

// get all events
function resolveAllEVentsUnsorted(actorID) {
  return new Promise((resolve, reject) => {
    // get actor streaks
    db.serialize(() => {
      db.all(`SELECT id, type, actor, repo, created_at FROM events ORDER BY created_at DESC`, (err, val) => {
        if(err) reject(err);
        resolve(val);
      });
    });
  });
}

// resolve actor information
function getActor (actorID) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, login, avatar_url FROM actors WHERE id = ${actorID}`, (err, actor) => {
      if(err) reject(err);
      resolve(actor);
    });
  });
}

// resolve repository information
function getRepository (repoID) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, name, url FROM repositories WHERE id = ${repoID}`, (err, repo) => {
      if(err) reject(err);
      resolve(repo);
    });
  });
}

// resolve all actors
function fetchActors() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, login, avatar_url FROM actors`, (err, actor) => {
      if(err) reject(err);
      resolve(actor);
    });
  });
}

// resolve get streak info 
const getStreakInfo = (allEvents) => {
  return new Promise((resolve, reject) => {
    let actorLogin;
    let streakInfo = {}
    allEvents.map(async event => {
      actorLogin = await getActor(event.actor).then(actor => actor[0].login);
        if (streakInfo[event.actor]) {
            // get actor streak info if already available
        var actorStreak   = streakInfo[event.actor];
        var lastEvent     = moment(actorStreak.lastEvent, 'YYYY-MM-DD');
        var currentEvent  = moment(event.created_at, 'YYYY-MM-DD');
        var daysDifference  = lastEvent.diff(currentEvent, 'days');

          if (daysDifference === 1) {
          // increment streak
          actorStreak.currentStreak += 1;

          if (actorStreak.currentStreak > actorStreak.highestStreak) {
            actorStreak.highestStreak = actorStreak.currentStreak;
          } else {
            // do nothing
          }

            } else if (daysDifference > 1) {
              // reset streak
              actorStreak.currentStreak = 0;

            } else {

              // do nothing
            }

            actorStreak.lastEvent = event.created_at;
        } else {
          // new data treat as new streak
          streakInfo[event.actor] = {
              currentStreak: 0,
              highestStreak: 0,
              lastEvent: event.created_at,
              latestEvent: moment(event.created_at).valueOf(),
              login: actorLogin,
          };
        }
    });

    setTimeout((t) => {
      // console.log(streakInfo);
      resolve(streakInfo)
    }, 2000);
  });
}

const getStreakInfoArray = streakInfo => Object.keys(streakInfo).map(actor => ({
  actor,
  highestStreak: streakInfo[actor].highestStreak,
  latestEvent: streakInfo[actor].latestEvent,
  login: streakInfo[actor].login,
}));

const getActorsIdByStreak = sortedStreakInfo => sortedStreakInfo.map(info => Number(info.actor));

