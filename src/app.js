import React, { useState } from "react";
import axios from "axios"; // axiosをインポート

function App() {
  const [tweets, setTweets] = useState([]); // tweetsを管理するstateを定義

  // GETリクエストを送信し、取得したtweetsをstateにセットする関数
  const getTweets = async () => {
    try {
      const res = await axios.get("http://localhost:3000/tweets"); // GETリクエストを送信
      setTweets(res.data); // 取得したtweetsをstateにセット
    } catch (err) {
      console.error(err);
    }
  };

  // POSTリクエストを送信し、新しいtweetを作成する関数
  const postTweet = async (content, userId) => {
    try {
      await axios.post("http://localhost:3000/tweets", { content, userId }); // POSTリクエストを送信
      getTweets(); // tweetsを再取得し、stateを更新
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" /> 
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
      <button onClick={getTweets}>Get Tweets</button>
     
      <button onClick={() => postTweet("example content", 1)}>
        Post Tweet
      </button>
      
      {tweets.map((tweet, index) => (
        <div key={index}>{tweet.content}</div>
      ))}
    
    </div>
  );
}
export default App;
