import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io();

function App() {
    const [msg, setMsg] = useState("");
    const [user, setUser] = useState({});
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [receiver, setReceiver] = useState("");

    socket.on("received", (msg) => {
        setMessages([...messages, msg]);
    });

    socket.on("users", (users) => {
        console.log(users);
        setUsers(users.filter((item) => item.name !== user.name));
    });

    useEffect(() => {
        setReceiver(users[0]?.id);
        console.log(users);
    }, [users]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessages([...messages, msg]);
        socket.emit("msg", { msg, id: socket.id, receiver: receiver || "" });
        setMsg("");
    };

    useEffect(() => {
        socket.on("connect", () => {
            const name = prompt("Enter your name");
            setUser({ name, id: socket.id });
            if (!name) return;
            socket.emit("custom", {
                msg: "Hello from the client!",
                id: socket.id,
                name,
            });
        });
    }, []);

    return (
        <div className="App">
            <h1>Socket IO</h1>
            <p>Logged in: {user?.name || null}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                    style={{ width: "40%" }}
                />

                {/* create a radio button containing values from the users state */}
                {users.map((user, index) => (
                    <div
                        key={index}
                        style={{
                            width: "10%",
                            display: "flex",
                            flexDirection: "row-reverse",
                        }}
                    >
                        <input
                            type="radio"
                            name="receiver"
                            value={user.id}
                            defaultChecked={index === 0}
                            onChange={(e) => setReceiver(e.target.value)}
                        />
                        <label>{user.name}</label>
                    </div>
                ))}

                <br />

                <button style={{ width: "20%" }}>Send message</button>
            </form>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
        </div>
    );
}

export default App;
