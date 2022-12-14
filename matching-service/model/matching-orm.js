import sequelize from "./repository.js";
import Match from "./match.js";

sequelize
  .sync()
  .then((result) => {
    console.log("Sequelize Match model/table successfully synced/created");
  })
  .catch((err) => {
    console.log(err);
  });

// separate orm functions from repository
export async function createMatch(uname, diff, sid) {
  const match = await Match.create({
    username: uname,
    difficulty: diff,
    socketID: sid,
  });

  return match.id;

  // const matches = await Match.findAll();
  // console.log("All matches:", JSON.stringify(matches, null, 2));
}

export async function checkExists() {
  const match = await Match.findOne();
  if (match === null) {
    return false;
  } else {
    return true;
  }
}

export async function checkDifficultyExists(diff) {
  const match = await Match.findOne({
    where: { difficulty: diff },
  });
  if (match === null) {
    return false;
  } else {
    return true;
  }
}

export async function checkIDExists(id) {
  const match = await Match.findOne({
    where: { id: id },
  });
  if (match === null) {
    return false;
  } else {
    return true;
  }
}

export async function removeByID(id) {
  const num_removed = await Match.destroy({
    where: {
      id: id,
    },
  });

  if (num_removed == 1) {
    return true;
  } else if (num_removed == 0) {
    return false;
  } else {
    throw "Database remove error!";
  }
}

export async function removeBySocketID(socketID) {
  const num_removed = await Match.destroy({
    where: {
      socketID: socketID,
    },
  });

  if (num_removed == 1) {
    return true;
  } else if (num_removed == 0) {
    return false;
  } else {
    throw "Database remove error!";
  }
}

// relies on timestamp
export async function popLatest() {
  const match = await Match.findOne({
    where: {}, // empty to return all entries
    order: [["createdAt", "ASC"]],
  });

  const curr_id = match.id;
  const curr_username = match.username;
  const curr_difficulty = match.difficulty;
  const curr_socketID = match.socketID;

  match.destroy();

  return buildMatchInstance(
    curr_id,
    curr_username,
    curr_difficulty,
    curr_socketID
  );
}

export async function popLatestDifficulty(diff) {
  const match = await Match.findOne({
    where: { difficulty: diff },
    order: [["createdAt", "ASC"]],
  });

  const curr_id = match.id;
  const curr_username = match.username;
  const curr_difficulty = match.difficulty;
  const curr_socketID = match.socketID;

  match.destroy();

  return buildMatchInstance(
    curr_id,
    curr_username,
    curr_difficulty,
    curr_socketID
  );
}

function buildMatchInstance(id, username, difficulty, socketID) {
  return Match.build({
    id: id,
    username: username,
    difficulty: difficulty,
    socketID: socketID,
  });
}
