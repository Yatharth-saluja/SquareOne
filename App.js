import React, { useEffect, useState } from 'react';
import Header from './Components/Header';
import Todos from './Components/Todos';
import AddTodo from './Components/AddTodo';
import PomodoroTimer from './Components/PomodoroTimer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import WorkAmbianceMusicSelection from './Components/WorkAmbianceMusicSelection';

function App() {
    const initTodo = () => {
        const localData = localStorage.getItem('todos');
        return localData ? JSON.parse(localData) : [];
    };

    const [todos, setTodos] = useState(() => {
        return initTodo();
    });

    const [encouragementMessage, setEncouragementMessage] = useState("");
    const [showEncouragement, setShowEncouragement] = useState(false);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");

    const encouragingMessages = [
        "In the midst of winter, I found there was, within me, an invincible summer. - Albert Camus",
        "You don't have to see the whole staircase, just take the first step. - Martin Luther King Jr",
        "The best way out is always through. - Robert Frost",
        "When you reach the end of your rope, tie a knot in it and hang on. - Franklin D. Roosevelt",
        "Even the darkest night will end and the sun will rise. - Victor Hugo",
        "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.' - Mary Anne Radmacher",
        "You are braver than you believe, stronger than you seem, and smarter than you think. - A.A. Milne",
        "Every day may not be good, but there is something good in every day.",
        "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
        "The comeback is always stronger than the setback."
    ];

    const onDelete = (todo) => {
        // Check if the task had a deadline and if it passed
        if (todo.deadline && new Date() > todo.deadline) {
            alert(`Deadline passed for: ${todo.title}`);
        }

        // Add a comment
        const comment = `Congratulations! You completed a task: "${todo.title}"`;
        setComments([...comments, comment]);

        // Show comments section
        setShowComments(true);

        // Hide comments section after 10 minutes
        setTimeout(() => {
            setShowComments(false);
        }, 600000); // 10 minutes in milliseconds

        // Filter out the todo to be deleted and update todos state and localStorage
        const updatedTodos = todos.filter(t => t.sno !== todo.sno);
        setTodos(updatedTodos);
        localStorage.setItem("todos", JSON.stringify(updatedTodos));

        // Show random encouragement message
        const randomIndex = Math.floor(Math.random() * encouragingMessages.length);
        const randomMessage = encouragingMessages[randomIndex];
        setEncouragementMessage(randomMessage);
        setShowEncouragement(true);

        // Hide encouragement message after 60 seconds
        setTimeout(() => {
            setShowEncouragement(false);
        }, 60000);
    };

    const addTodo = (title, desc, deadline) => {
        if (!title || !desc) {
            alert("Title and Description are required!");
            return;
        }
        if (todos.length >= 10) {
            alert("You can only add up to 10 tasks. Please complete or delete existing tasks.");
            return;
        }
        let sno;
        if (todos.length === 0) {
            sno = 0;
        } else {
            sno = todos[todos.length - 1].sno + 1;
        }
        const myTodo = {
            sno: sno,
            title: title,
            desc: desc,
            deadline: deadline ? new Date(deadline) : null, // Convert deadline to Date object
            completed: false
        };
        const updatedTodos = [...todos, myTodo];
        setTodos(updatedTodos);
        localStorage.setItem("todos", JSON.stringify(updatedTodos));
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (newComment.trim() !== "") {
            const comment = `User commented: "${newComment}"`;
            setComments([...comments, comment]);
            setNewComment("");
        }
    };

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const [selectedMusic, setSelectedMusic] = useState("");

    useEffect(() => {
        // Shuffle music every 10 minutes
        const shuffleInterval = setInterval(() => {
            shuffleMusic();
        }, 600000); // 10 minutes in milliseconds

        return () => clearInterval(shuffleInterval);
    }, []);

    const shuffleMusic = () => {
        // Logic to shuffle music in the WorkAmbianceMusicSelection component
        // You can pass down a prop to trigger shuffle if needed
    };

    const handleSelectMusic = (music) => {
        setSelectedMusic(music);
        // You can perform additional actions based on the selected music if needed
    };

    return (
        <>
            <Header title="My Todoist" searchBar={false} />
            <AddTodo addTodo={addTodo} />
            {todos.length === 0 ? (
                <div className="text-center mt-4">
                    <h3 className="text-xl text-white">No todos left</h3>
                </div>
            ) : (
                <Todos todos={todos} onDelete={onDelete} />
            )}
            {showEncouragement && (
                <div className="encouragement-banner">
                    <p>{encouragementMessage}</p>
                </div>
            )}

            {showComments && (
                <div className="mt-4">
                    <ul className="list-group">
                        {comments.map((comment, index) => (
                            <li key={index} className="list-group-item">{comment}</li>
                        ))}
                    </ul>
                </div>
            )}




            <div className="mt-4">
                <form onSubmit={handleSubmitComment}>
                    <div className="mb-3">
                        <div className='container text-center p-4'>
                            <img className="peanut-gif m-5" src="https://i.pinimg.com/originals/e0/b9/e4/e0b9e4f8f70ddaf9467b02571202c88c.gif" alt="snoopy" />
                            <div className='comment-section '><label htmlFor="commentInput" className="form-label text-black text-align-center justify-content-center">Write a comment:</label></div>
                            <textarea className="form-control" id="commentInput" rows="3" value={newComment} onChange={handleCommentChange}>Shower Praises!</textarea>
                            <button type="submit" className="submit btn btn-primary btn-outline-dark m-3 justify-content-center">Add Comment</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="pomo-timer text-center">
                <header className="pomodoro">
                    <h1>Pomodoro Timer</h1>
                    <img className="clock-gif" src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Alarm_Clock_GIF_Animation_High_Res.gif" alt='clock' />
                </header>
                <main>
                    <PomodoroTimer />
                </main>
            </div>

            <div className='music-playlist'>
                <WorkAmbianceMusicSelection onSelectMusic={handleSelectMusic} />
            </div>
            <footer></footer>
        </>
    );
}

export default App;
