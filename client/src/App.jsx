import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:8080");

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

                {/* create a dropdown checkbox containing values from the users state */}
                <select name="users" id="users" style={{ width: "25%" }}>
                    {users.map((user) => (
                        <option
                            key={user?.id}
                            value={user?.id}
                            onChange={() => setReceiver(user?.id)}
                        >
                            {user.name}
                        </option>
                    ))}
                </select>

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
