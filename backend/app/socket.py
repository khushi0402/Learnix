import socketio

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

rooms = {}


# 🔌 CONNECT
@sio.event
async def connect(sid, environ):
    print("✅ Connected:", sid)


# 🔥 JOIN ROOM
@sio.event
async def join_room(sid, data):
    room_id = data.get("roomId")
    username = data.get("username")

    if not room_id or not username:
        return

    await sio.enter_room(sid, room_id)

    if room_id not in rooms:
        rooms[room_id] = []

    # avoid duplicate
    if not any(u["sid"] == sid for u in rooms[room_id]):
        rooms[room_id].append({
            "sid": sid,
            "username": username
        })

    print(f"{username} joined {room_id}")

    # ✅ send updated users
    await sio.emit("user_list", rooms[room_id], room=room_id)

    # ✅ notify others
    await sio.emit(
        "user_joined",
        {"username": username},
        room=room_id,
        skip_sid=sid
    )


# 🔥 CODE SYNC
@sio.event
async def code_change(sid, data):
    await sio.emit(
        "code_update",
        data["code"],
        room=data["roomId"],
        skip_sid=sid
    )


# 🎥 VIDEO OFFER
@sio.event
async def video_offer(sid, data):
    await sio.emit(
        "video_offer",
        {
            "offer": data["offer"],
            "sender": sid
        },
        to=data["target"]
    )


# 🎥 VIDEO ANSWER
@sio.event
async def video_answer(sid, data):
    await sio.emit(
        "video_answer",
        {
            "answer": data["answer"]
        },
        to=data["target"]
    )


# ❄️ ICE
@sio.event
async def ice_candidate(sid, data):
    await sio.emit(
        "ice_candidate",
        {
            "candidate": data["candidate"]
        },
        to=data["target"]
    )


# 🔴 LEAVE ROOM
@sio.event
async def leave_room(sid, data):
    room_id = data.get("roomId")

    if room_id in rooms:
        user = next((u for u in rooms[room_id] if u["sid"] == sid), None)

        rooms[room_id] = [u for u in rooms[room_id] if u["sid"] != sid]

        await sio.emit("user_list", rooms[room_id], room=room_id)

        # ✅ notify others
        if user:
            await sio.emit(
                "user_left",
                {"username": user["username"]},
                room=room_id
            )


# 🔌 DISCONNECT
@sio.event
async def disconnect(sid):
    for room_id in list(rooms.keys()):
        user = next((u for u in rooms[room_id] if u["sid"] == sid), None)

        rooms[room_id] = [u for u in rooms[room_id] if u["sid"] != sid]

        if not rooms[room_id]:
            del rooms[room_id]
            continue

        await sio.emit("user_list", rooms[room_id], room=room_id)

        # ✅ notify others
        if user:
            await sio.emit(
                "user_left",
                {"username": user["username"]},
                room=room_id
            )