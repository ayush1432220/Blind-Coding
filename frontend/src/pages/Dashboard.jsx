import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import CodeEditor from "../components/CodeEditor";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [questions, setQuestions] = useState(null);
  const [activeQuestionType, setActiveQuestionType] = useState('easy');
  const [isBlind, setIsBlind] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axiosInstance.get("/api/questions/assigned");
        setQuestions(data);
      } catch (err) {
        setError("Failed to load your assigned questions. Please try again.");
        console.error(err);
      }
    };
    if (user) {
      fetchQuestions();
    }
  }, [user]);

  const handleCheatAttempt = async (eventType, details = "") => {
    try {
      await axiosInstance.post("/api/security/log-event", { eventType, details });
    } catch (error) {
      console.error("Failed to log cheat event:", error);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prevCount => {
            const newCount = prevCount + 1;
            const details = `User switched tabs. Warning count: ${newCount}`;
            handleCheatAttempt('tab-switch', details);
            alert(`Warning: Tab switched. This is your warning number ${newCount}.`);
            return newCount;
        });
      }
    };
    if (isBlind) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isBlind]);

  useEffect(() => {
    if (!isBlind) return;
    const antiCheatInterval = setInterval(() => {
      debugger;
    }, 1000);
    return () => clearInterval(antiCheatInterval);
  }, [isBlind]);

  const handleSubmit = async () => {
    const activeQuestion = questions?.[activeQuestionType]?.question;
    if (!activeQuestion) {
      alert("Question not loaded yet. Please wait.");
      return;
    }
    setLoading(true);
    setOutput(null);
    try {
      const { data } = await axiosInstance.post("/api/code/submit", {
        code,
        language,
        questionId: activeQuestion._id,
      });
      setOutput(data);
      const updatedData = await axiosInstance.get("/api/questions/assigned");
      setQuestions(updatedData.data);
    } catch (error) {
      setOutput({ status: "Client Error", stderr: error.response?.data?.message || "Failed to submit code." });
    } finally {
      setLoading(false);
      setIsBlind(false);
    }
  };
  
  const activeQuestionData = questions?.[activeQuestionType];
  const hasAttempted = !!activeQuestionData?.submission;

  if (error) {
    return <div className="text-center text-red-500 mt-10 p-4 bg-red-100 rounded-md">{error}</div>;
  }
  
  if (!questions) {
    return <div className="text-center mt-10">Loading your assigned questions...</div>;
  }

  return (
    <div
      className={`transition-colors duration-500 min-h-screen ${isBlind ? "bg-black" : "bg-gray-100"}`}
      onContextMenu={(e) => { if (isBlind) e.preventDefault(); }}
    >
      <div className="max-w-4xl mx-auto p-4">
        {!isBlind ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex border-b mb-4">
              <button 
                onClick={() => setActiveQuestionType('easy')}
                className={`py-2 px-6 font-semibold ${activeQuestionType === 'easy' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                Easy Question
              </button>
              <button 
                onClick={() => setActiveQuestionType('hard')}
                className={`py-2 px-6 font-semibold ${activeQuestionType === 'hard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                Hard Question
              </button>
            </div>
            
            {hasAttempted ? (
              <div>
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold">{activeQuestionData?.question?.title}</h1>
                    <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">Attempted</span>
                </div>
                <p className="text-gray-600 mb-6 whitespace-pre-wrap">{activeQuestionData?.question?.description}</p>
                
                <h3 className="text-xl font-semibold mb-2">Your Submission Result:</h3>
                <div className="p-4 rounded-lg bg-gray-900 text-white font-mono border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Result</h3>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                      activeQuestionData?.submission?.status === 'Accepted' ? 'bg-green-600 text-white' 
                      : activeQuestionData?.submission?.status?.includes('Error') || activeQuestionData?.submission?.status === 'Wrong Answer' ? 'bg-red-600 text-white' 
                      : 'bg-yellow-500 text-black'
                    }`}>
                      {activeQuestionData?.submission?.status}
                    </span>
                  </div>
                  {(activeQuestionData?.submission?.output) && (
                    <div className="mt-4">
                      <h4 className="text-gray-400 text-sm font-semibold mb-2">Output:</h4>
                      <pre className="bg-black p-3 rounded text-white whitespace-pre-wrap">
                        <code>{activeQuestionData?.submission?.output}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold mb-2">{activeQuestionData?.question?.title}</h1>
                <p className="text-gray-600 mb-6 whitespace-pre-wrap">{activeQuestionData?.question?.description}</p>
                <div className="mb-6">
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                    Choose your language:
                  </label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                  </select>
                </div>
                <button
                  onClick={() => setIsBlind(true)}
                  className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 text-xl"
                >
                  Start Challenge
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Blind Coding Mode: {activeQuestionData?.question?.title}</h2>
              <div className="text-white bg-red-600 px-3 py-1 rounded-full text-sm font-bold">
                  Tab Switch Warnings: {tabSwitchCount}
              </div>
            </div>
            <CodeEditor code={code} setCode={setCode} isBlind={isBlind} onCheatAttempt={handleCheatAttempt} />
            <button onClick={handleSubmit} disabled={loading} className="mt-4 w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed">
              {loading ? "Processing..." : "Submit Code"}
            </button>
            {output && (
              <div className="mt-6 p-4 rounded-lg bg-gray-900 text-white font-mono border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Result</h3>
                  <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                      output.status === 'Accepted' ? 'bg-green-600 text-white' 
                      : output.status?.includes('Error') || output.status === 'Wrong Answer' ? 'bg-red-600 text-white' 
                      : 'bg-yellow-500 text-black'
                  }`}>
                      {output.status}
                  </span>
                </div>
                {(output.stdout || output.output) && (
                  <div className="mt-4">
                    <h4 className="text-gray-400 text-sm font-semibold mb-2">Output:</h4>
                    <pre className="bg-black p-3 rounded text-white whitespace-pre-wrap  overflow-x-auto">
                      <code>{output.stdout || output.output}</code>
                    </pre>
                  </div>
                )}
                {output.stderr && (
                    <div className="mt-4">
                        <h4 className="text-gray-400 text-sm font-semibold mb-2">Error:</h4>
                        <pre className="bg-black p-3 rounded text-red-400 whitespace-pre-wrap  overflow-x-auto">
                            <code>{output.stderr}</code>
                        </pre>
                    </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;