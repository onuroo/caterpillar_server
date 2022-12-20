let rooms = [];

// {
      // name: '',
      // users: [
      //   {
      //     creator: false,
      //     name: '',
      //   }
      // ],
      // board: {
      //   users: [
      //    name: user_name,
      //    tiles: [],
      //   ],
      //   foods: [
      //     {
      //       x,
      //       y,
      //       state: false || true
      //     }
      //   ],
      //   wall: {
      //     x: 0,
      //   }
      //   winner: null,
      //   loser: null
      //   started: false
      // }
      //
// }


const CELL_SIZE = 10;

const createRoom = (user_name, room_name) => {
    const existingRoom = rooms.find(room => room.name.trim().toLowerCase() === room_name.trim().toLowerCase());

    if (existingRoom) return { error: "Room has already been taken" };
    if (!user_name) return { error: "Name is required" };
    if (!room_name) return { error: "Room name is required" };


    const room = {
      users: [
        {
          creator: true,
          name: user_name,
        }
      ],
      name: room_name,
      board: {
        users: [
          {
            name: user_name,
            direction: 'up',
            tiles: [
              {
                x: 100,
                y: 100,
                direction: 'up',
              },
              {
                x: 100,
                y: 110,
                direction: 'up',
              },
              {
                x: 100,
                y: 120,
                direction: 'up',
              },
            ],
            foods: [],
          }
        ],
        wall: {
          x: 400,
        },
        started: false,
        winner: null,
        loser: null,
      },
    };

    rooms.push(room);

    return { room };
};

const joinRoom = (name, room_name) => {
  const finded_room = rooms.find(room => room.name.trim().toLowerCase() === room_name.trim().toLowerCase());

  if (finded_room.started) return { error: "Game has started. You can not join this room" };

  if (finded_room.users.find(user => user.name === name)) {
    return { room: finded_room };
  }

  rooms = [
    ...rooms.filter(room => room.name.trim().toLowerCase() !== room_name.trim().toLowerCase()),
    {
      users: [
        ...finded_room.users,
        {
          creator: false,
          name
        },
      ],
      name: finded_room.name,
      board: {
        ...finded_room.board,
        users: [
          ...finded_room.board.users,
          {
            name,
            direction: 'up',
            tiles: [
              {
                x: 500,
                y: 100,
                direction: 'up',
              },
              {
                x: 500,
                y: 110,
                direction: 'up',
              },
              {
                x: 500,
                y: 120,
                direction: 'up',
              },
            ],
            foods: [],
          }
        ],
        winner: null,
        loser: null,
        started: false,
      },
    }
  ];
  
  return { room: finded_room };

};

const getRooms = () => rooms;

const getUsers = (room_name) => {
  const finded_room = rooms.find(room => room.name.trim().toLowerCase() === room_name?.trim().toLowerCase());
  if (finded_room) {
    return { users: finded_room.users }
  } else {
    if (!finded_room) return { error: "No room available" }
  }
};

const setDirectionToCoordinates = (x, y, direction) => {
  if (direction === 'up') return { x, y: y - CELL_SIZE };
  else if (direction === 'left') return { x: x - CELL_SIZE, y }
  else if (direction === 'down') return { x, y: y + CELL_SIZE }
  else if (direction === 'right') return { x: x + CELL_SIZE, y }
}

const getBoard = (room_name) => {
  const finded_room = rooms.find(room => room.name.trim().toLowerCase() === room_name?.trim().toLowerCase());
  const finded_room_index = rooms.findIndex(room => room.name.trim().toLowerCase() === room_name?.trim().toLowerCase());
  const board = finded_room?.board;

  if (!finded_room.started) {
    return {
      board: {
        users: [],
        wall: {},
        winner: null,
        loser: null,
        started: false, 
      }
    };
  }

  console.log('5555555')


  const randomIntFromInterval = (min, max) => { // min and max included 
    // return Math.floor(Math.random() * (max - min + 1) + min)
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
  }
  
  // const updateFoods = (tiles, foods, user_name) => {
  //   return checkEating(tiles, foods, user_name);
  //   // if (foods.filter(food => food.state).length > 0) {

  //   //   console.log('updatedFoodsupdatedFoods', updatedFoods)
  //   //   // got some active foods on map
  //   //   return updatedFoods;
  //   // } else {
  //   //   // let finded = false;
  //   //   // while (!finded) {
  //   //   //   const randomX = randomIntFromInterval(0, 380);
  //   //   //   const randomY = randomIntFromInterval(0, 380);
  //   //   //   console.log('111', randomX, randomY);
  //   //   //   if (!tiles.find(tile => tile.x === randomX && tile.y === randomY) && !foods.filter(food => food.state).find(food => food.x === randomX && food.y === randomY)) {
  //   //   //     finded = true;
  //   //   //     return [
  //   //   //       ...foods,
  //   //   //       {
  //   //   //         x: randomX,
  //   //   //         y: randomY,
  //   //   //         state: true
  //   //   //       }
  //   //   //     ];
  //   //   //   }
  //   //   // }
  //   // }
  // };

  const checkEating = (tiles, foods, user_name, user_index, wall) => {
    console.log('tiles', JSON.stringify(tiles))
    console.log('foods', JSON.stringify(foods))
    console.log('user_name', JSON.stringify(user_name))

    let foods_array = foods || [];

    if (foods?.filter(i => i.state).length === 0) {

      let finded = false;
        while (!finded) {
          const randomX = randomIntFromInterval(0, 380);
          const randomY = randomIntFromInterval(0, 380);
          console.log('111', randomX, randomY);
          if (!tiles.find(tile => tile.x === randomX && tile.y === randomY) && !foods.filter(food => food.state).find(food => food.x === randomX && food.y === randomY)) {
            finded = true;
            foods_array = [
              {
                x: randomX,
                y: randomY,
                state: true
              }
            ];
          }
        }

      
    } else {
      foods_array = foods;
    }

    console.log('foods_arrayfoods_array', foods_array)

    let new_wall = wall;

    const updatedFoods = foods_array.filter(i => i.state).map((food) => {
      const foodX = food.x;
      const foodY = food.y;
      console.log('foodX, foodY', foodX, foodY);

      const has_eat_action = tiles.find(tile => tile.x === foodX && tile.y === foodY);

      console.log('has_eat_action', has_eat_action, JSON.stringify(tiles))
      

      if (has_eat_action) {

        const randomX = randomIntFromInterval(0, 380);
        const randomY = randomIntFromInterval(0, 380);

        new_wall = user_index === 0 ? {
          x: new_wall.x + 10
        } : {
          x: new_wall.x - 10
        }; 

        return {
          x: randomX,
          y: randomY,
          state: true
        }
      } else return food
    });

    console.log('updatedFoods', updatedFoods)
    return {
      new_foods: updatedFoods,
      new_wall: new_wall
    };
  };


  const checkCollision = (tile, foods, wall, user, user_index) => {
    console.log('checkCollision', JSON.stringify(tile), JSON.stringify(foods), JSON.stringify(wall))
    if (tile.x < 0 || tile.x > 800 || tile.y < 0 || tile.y > 400) {
      console.log('hitting the wall or edge', user)
      return user;
    } else if (tile.direction === 'right' && tile.x === wall.x && user_index === 0) {
      console.log('hitting the wall right', user)
      return user;
    } else if (tile.direction === 'left' && tile.x < wall.x && user_index === 1) {
      console.log('hitting the wall left', user)
      return user;
    }
    return false;
  }

  const updateBoard = () => {
    const wall = board.wall;

    
    // let hasCollisionByUser = false;
    hasCollisionByUser = board.users.find((user, index) => {
      return user.tiles.find((tile) => {
        return checkCollision(tile, user.foods, board.wall, user, index);
        // if (!hasCollisionByUser) {
        //   hasCollisionByUser = return checkCollision(tile, user.foods, board.wall, user);
        // }
      });
    });

    let winner = null;
    let loser = null;

    if (hasCollisionByUser) {
      loser = hasCollisionByUser;
      winner = board.users.find(i => i.name !== hasCollisionByUser?.name) || null;

      return {
        users: board.users,
        wall,
        started: false,
        winner,
        loser,
      }
    }

    
    let updated_wall = null;

    const updated_users = board.users.map((user, user_index) => {
      console.log('user.foods', user.foods)

      let new_tiles_array = user.tiles.map((tile, index) => {
        if (index === 0) {
          const direction = user.direction || tile.direction
          const { x, y } = setDirectionToCoordinates(tile.x, tile.y, direction)
          return {
            x,
            y,
            direction,
          }
        } else {
          const direction = index === 1 ? user.direction || user.tiles[index - 1].direction : user.tiles[index - 1].direction;
          const { x, y } = setDirectionToCoordinates(tile.x, tile.y, tile.direction)
          return {
            x,
            y,
            direction: direction,
          }
        }
      });

      const { new_foods, new_wall } = checkEating(new_tiles_array, user.foods, user.name, user_index, wall);

      updated_wall = new_wall;

      return {
        name: user.name,
        foods: new_foods,
        direction: null,
        tiles: new_tiles_array,
      }
    });
    console.log('updated_wall', updated_wall)
    return {
      users: updated_users,
      wall: updated_wall,
      started: true,
      winner,
      loser,
    }
  };

  const board_instance = updateBoard();

  rooms[finded_room_index] = {
    ...finded_room,
    board: board_instance,
  };
  return {
    board: board_instance,
  }
}

const setUserDirection = (user_name, room_name, direction) => {
  let finded_room = rooms.find(room => room.name.trim().toLowerCase() === room_name?.trim().toLowerCase());
  const finded_room_index = rooms.findIndex(room => room.name.trim().toLowerCase() === room_name?.trim().toLowerCase());

  let is_available_direction = isAvailableDirection(finded_room.board.users.find(user => user.name === user_name).tiles[0].direction, direction);

  if (!is_available_direction) return false;

  finded_room.board = {
    ...finded_room.board,
    users: finded_room.board.users.map((user) => {
      if (user.name === user_name) {
        return {
          ...user,
          direction,
        }
      } else return user;
    }),
  }

  rooms[finded_room_index] = finded_room;
  return true;
};

const startGame = (user_name, room_name) => {
  let finded_room = rooms.find(room => room.name.trim().toLowerCase() === room_name?.trim().toLowerCase());
  const finded_room_index = rooms.findIndex(room => room.name.trim().toLowerCase() === room_name?.trim().toLowerCase());
  finded_room.started = true;

  rooms[finded_room_index] = finded_room;

   const interval = setInterval(() => {
    console.log('99999999')
    const { board } = getBoard(room_name);
    console.log('boardboard', JSON.stringify(board));
    if (board.started) {
        // socket.emit('gameUpdate', {board});
    } else if ((board.winner || board.loser) && !board.started) {
        clearInterval(interval);
    }
  }, 130);

  return true;
};

const broadcast_board = (room_name) => {
  const finded_room = rooms.find(room => room.name.trim().toLowerCase() === room_name?.trim().toLowerCase());
  const board = finded_room?.board;
  console.log('board22222', board)
  if (board) {
    return board;
  }
}
// const addUser = (id, name, room) => {
//     const existingUser = users.find(user => user.name.trim().toLowerCase() === name.trim().toLowerCase())

//     if (existingUser) return { error: "Username has already been taken" }
//     if (!name && !room) return { error: "Username and room are required" }
//     if (!name) return { error: "Username is required" }
//     if (!room) return { error: "Room is required" }

//     const user = { id, name, room }
//     users.push(user)
//     return { user }
// }

// const getUser = id => {
//     let user = users.find(user => user.id == id)
//     return user
// }

// const deleteUser = (id) => {
//     const index = users.findIndex((user) => user.id === id);
//     if (index !== -1) return users.splice(index, 1)[0];
// }

// const getUsers = (room) => users.filter(user => user.room === room)

const isAvailableDirection = (currentDirection, direction) => {
  if (currentDirection === 'up' || currentDirection === 'down') {
    if (direction === 'left' || direction === 'right') return true;
    else return false;
  } else if (currentDirection === 'left' || currentDirection === 'right') {
    if (direction === 'up' || direction === 'down') return true;
    else return false;
  }
};

module.exports = { createRoom, joinRoom, getRooms, getUsers, getBoard, setUserDirection, startGame, broadcast_board }