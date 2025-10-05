import { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../api/axios';
import StatCard from '../components/StatCard';

const AdminPanel = () => {
  const [participants, setParticipants] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [view, setView] = useState('submissions');
  const [loading, setLoading] = useState(true);
  const [participantSearch, setParticipantSearch] = useState('');
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [submissionsRes, participantsRes, logsRes] = await Promise.all([
          axiosInstance.get('/api/admin/submissions'),
          axiosInstance.get('/api/admin/participants'),
          axiosInstance.get('/api/admin/security-logs')
        ]);
        
        setSubmissions(submissionsRes.data);
        setParticipants(participantsRes.data);
        setSecurityLogs(logsRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewCode = (code) => {
    setSelectedCode(code);
    setIsModalOpen(true);
  };

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'submissions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const totalParticipants = participants.length;
  const totalSubmissions = submissions.length;
  const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted').length;
  const successRate = totalSubmissions > 0 ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1) + '%' : '0%';

  const filteredParticipants = useMemo(() =>
    participants.filter(p =>
      p.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(participantSearch.toLowerCase())
    ), [participants, participantSearch]);

  const filteredSubmissions = useMemo(() =>
    submissions.filter(s =>
      (s.userId?.name.toLowerCase().includes(submissionSearch.toLowerCase())) ||
      (s.userId?.email.toLowerCase().includes(submissionSearch.toLowerCase()))
    ), [submissions, submissionSearch]);

  if (loading) {
    return <div className="text-center mt-10">Loading admin data...</div>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Participants" value={totalParticipants} icon={'👥'} />
          <StatCard title="Total Submissions" value={totalSubmissions} icon={'📄'} />
          <StatCard title="Success Rate" value={successRate} icon={'✅'} />
          <StatCard title="Security Events" value={securityLogs.length} icon={'🛡️'} />
        </div>

        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setView('submissions')} className={`px-4 py-2 rounded ${view === 'submissions' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Submissions ({filteredSubmissions.length})</button>
            <button onClick={() => setView('participants')} className={`px-4 py-2 rounded ${view === 'participants' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Participants ({filteredParticipants.length})</button>
            <button onClick={() => setView('logs')} className={`px-4 py-2 rounded ${view === 'logs' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>Security Logs ({securityLogs.length})</button>
          </div>
          <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Export Submissions (CSV)</button>
        </div>

        {view === 'submissions' && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">All Submissions</h2>
              <input 
                type="text"
                placeholder="Search by participant..."
                className="px-4 py-2 border rounded-md"
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.map(s => (
                  <tr key={s._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{s.userId?.name || 'N/A'} ({s.userId?.email})</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${s.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{s.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">{s.language}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(s.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleViewCode(s.code)} className="text-indigo-600 hover:text-indigo-900 font-medium">
                        View Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
             </table>
            </div>
          </div>
        )}
        
        {view === 'participants' && (
          <div className="bg-white p-4 rounded-lg shadow-md">
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Registered Participants</h2>
              <input 
                type="text"
                placeholder="Search by name or email..."
                className="px-4 py-2 border rounded-md"
                value={participantSearch}
                onChange={(e) => setParticipantSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered At</th>
                </tr>
              </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                {filteredParticipants.map(p => (
                  <tr key={p._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(p.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
             </table>
            </div>
          </div>
        )}

        {view === 'logs' && (
          <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">Security Event Logs</h2>
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                </tr>
              </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                {securityLogs.map(log => (
                  <tr key={log._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{log.userId?.name || 'N/A'} ({log.userId?.email})</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="font-mono bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{log.eventType}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
             </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">Submitted Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-2xl">
                &times;
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <pre className="bg-gray-900 text-white p-4 rounded-md text-sm">
                <code>
                  {selectedCode}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;