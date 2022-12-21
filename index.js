const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
const PORT = process.env.PORT || 3010
const { addUser, getUser, deleteUser,  } = require('./users');
const { createRoom, getRooms, joinRoom, getUsers, getBoard, setUserDirection, startGame, broadcast_board } = require('./rooms');


app.use(cors())

io.on('connection', (socket) => {


    socket.on('gameUpdate', ({ room_name }) => {
        const interval = setInterval(() => {
            const board = broadcast_board(room_name);
            console.log('boardboard', JSON.stringify(board));
            if (board) {
                if (board.started) {
                    socket.emit('gameUpdate', {board});
                } else if ((board.winner || board.loser) && !board.started) {
                    socket.emit('gameUpdate', {board});
                    clearInterval(interval);
                }
            }
            

        }, 130)
        // const interval = setInterval(() => {
        //     console.log('99999999')
        //     const { board } = getBoard(room_name);
        //     console.log('boardboard', JSON.stringify(board));
        //     if (board.started) {
        //         socket.emit('gameUpdate', {board});
        //     } else if ((board.winner || board.loser) && !board.started) {
        //         clearInterval(interval);
        //     }
        // }, 1300);
    })

    // socket.in(room).emit('game', ['test'])



    socket.on('login', ({ name }, callback) => {
        const { user, error } = addUser(socket.id, name)
        if (error) return callback(error);
        socket.join(user)
        // socket.emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
        // io.in(room).emit('users', getUsers(room))
        callback()
    })

    socket.on('getRooms', () => {
        const rooms = getRooms();
        socket.emit('getRooms', rooms)
    });
    
    socket.on('getUsers', ({ room_name }, callback) => {
        const {users, error} = getUsers(room_name);
        if (error) return callback(error);
        io.in(room_name).emit('getUsers', {users})
        callback()
    });

    socket.on('createRoom', ({ user_name, room_name }, callback) => {
        const { room, error } = createRoom(user_name, room_name);
        if (error) return callback(error);
        socket.join(room.name);
        io.in(room.name).emit('notification', { title: 'Someone\'s here', description: `${user_name} just entered the room` })
        io.in(room.name).emit('getUsers', getUsers(room.name))
        callback();
    });
    
    socket.on('joinRoom', ({ user_name, room_name }, callback) => {
        const { room, error } = joinRoom(user_name, room_name);
        if (error) return callback(error);
        socket.join(room.name);
        io.in(room.name).emit('notification', { title: 'Someone\'s here', description: `${user_name} just entered the room` })
        io.in(room.name).emit('getUsers', getUsers(room.name))
        // socket.emit('getUsers', getUsers(room.name))
        callback();
    });

    socket.on('sendMessage', message => {
        const user = getUser(socket.id)
        if (error) return callback(error);
        socket.in(user.room).emit('message', { user: user.name, text: message });
    })

    socket.on('setUserDirection', ({user_name, room_name, direction}) => {
        setUserDirection(user_name, room_name, direction)
    })
    
    socket.on('startGame', ({user_name, room_name}) => {
        startGame(user_name, room_name);

        // const interval = setInterval(() => {
        //     console.log('99999999')
        //     const { board } = getBoard(room_name);
        //     console.log('boardboard', JSON.stringify(board));
        //     if (board.started) {
        //         socket.emit('gameUpdate', {board});
        //     } else if ((board.winner || board.loser) && !board.started) {
        //         clearInterval(interval);
        //     }
        // }, 1300);
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
        const user = deleteUser(socket.id)
        if (user) {
            io.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
            // io.in(user.room).emit('users', getUsers(user.room))
        }
    })
})

app.get('/', (req, res) => {
    res.send("Server is up and running")
})

http.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})