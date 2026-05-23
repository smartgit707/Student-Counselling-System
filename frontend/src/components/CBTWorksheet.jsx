import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, CheckCircle, List } from 'lucide-react';

const CBTWorksheet = ({ sid }) => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [responses, setResponses] = useState({});
    const [history, setHistory] = useState([]);
    const [view, setView] = useState('list'); // 'list', 'form', 'history'

    useEffect(() => {
        fetchTemplates();
        fetchHistory();
    }, [sid]);

    const fetchTemplates = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/cbt/templates');
            setTemplates(res.data.templates);
        } catch (err) {
            console.error('Failed to fetch CBT templates', err);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/cbt/student/${sid}`);
            setHistory(res.data.responses);
        } catch (err) {
            console.error('Failed to fetch CBT history', err);
        }
    };

    const handleSelectTemplate = (template) => {
        setSelectedTemplate({
            ...template,
            questions: JSON.parse(template.questions_json)
        });
        setResponses({});
        setView('form');
    };

    const handleResponseChange = (questionId, value) => {
        setResponses(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/cbt/submit', {
                sid,
                template_id: selectedTemplate.template_id,
                responses_json: responses
            });
            alert('Worksheet submitted successfully!');
            setSelectedTemplate(null);
            setView('history');
            fetchHistory();
        } catch (err) {
            alert('Failed to submit worksheet');
        }
    };

    return (
        <div className="card h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="flex items-center gap-2 text-primary m-0">
                    <Activity size={20} /> Clinical Tools (CBT)
                </h3>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setView('list')} 
                        className={`btn ${view === 'list' || view === 'form' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                    >
                        Worksheets
                    </button>
                    <button 
                        onClick={() => setView('history')} 
                        className={`btn ${view === 'history' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                    >
                        History
                    </button>
                </div>
            </div>

            {view === 'list' && (
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                    <p className="text-muted text-sm mb-4">Select an interactive worksheet to help process your thoughts.</p>
                    {templates.length === 0 ? <p className="text-gray-500 text-sm">No worksheets available at the moment.</p> : templates.map(t => (
                        <div key={t.template_id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer bg-white" onClick={() => handleSelectTemplate(t)}>
                            <h4 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                                {t.title}
                                <span className="text-blue-500"><List size={18} /></span>
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{t.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {view === 'form' && selectedTemplate && (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <button onClick={() => setView('list')} className="text-sm text-blue-600 hover:underline mb-4 self-start">← Back to templates</button>
                    <h4 className="text-xl font-bold mb-2">{selectedTemplate.title}</h4>
                    <p className="text-sm text-gray-600 mb-6">{selectedTemplate.description}</p>
                    
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-6">
                        {selectedTemplate.questions.map((q, idx) => (
                            <div key={idx} className="bg-blue-50 p-4 rounded-md">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">{q.label}</label>
                                {q.type === 'textarea' ? (
                                    <textarea 
                                        className="form-input w-full" 
                                        rows="3" 
                                        placeholder={q.placeholder}
                                        value={responses[q.id] || ''}
                                        onChange={(e) => handleResponseChange(q.id, e.target.value)}
                                        required
                                    />
                                ) : (
                                    <input 
                                        type="text" 
                                        className="form-input w-full" 
                                        placeholder={q.placeholder}
                                        value={responses[q.id] || ''}
                                        onChange={(e) => handleResponseChange(q.id, e.target.value)}
                                        required
                                    />
                                )}
                            </div>
                        ))}
                        <button type="submit" className="btn btn-primary w-full py-3 flex justify-center items-center gap-2">
                            <CheckCircle size={18} /> Complete Worksheet
                        </button>
                    </form>
                </div>
            )}

            {view === 'history' && (
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                    <p className="text-muted text-sm mb-4">Review your completed worksheets.</p>
                    {history.length === 0 ? <p className="text-gray-500 text-sm">No completed worksheets yet.</p> : history.map(h => (
                        <div key={h.response_id} className="p-4 rounded-lg border border-gray-200 bg-white">
                            <div className="flex justify-between items-center mb-3">
                                <h5 className="font-semibold text-gray-800 m-0">{h.title}</h5>
                                <span className="text-xs text-gray-500">{new Date(h.submitted_at).toLocaleDateString()}</span>
                            </div>
                            <div className="space-y-3 bg-gray-50 p-3 rounded text-sm">
                                {Object.entries(JSON.parse(h.responses_json)).map(([k, v]) => (
                                    <div key={k}>
                                        <span className="font-medium text-gray-600 block mb-1">Q: {k}</span>
                                        <p className="text-gray-800 bg-white p-2 border rounded m-0 whitespace-pre-wrap">{v}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CBTWorksheet;
