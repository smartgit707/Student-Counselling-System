import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Heart, Award } from 'lucide-react';

const VirtualPet = ({ sid }) => {
    const [pet, setPet] = useState(null);
    const [quests, setQuests] = useState([]);

    useEffect(() => {
        if (sid) {
            fetchPet();
            fetchQuests();
        }
    }, [sid]);

    const fetchPet = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/pet/${sid}`);
            setPet(res.data.pet);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchQuests = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/pet/quests/${sid}`);
            setQuests(res.data.quests);
        } catch (err) {
            console.error(err);
        }
    };

    const feedPet = async () => {
        try {
            await axios.post(`http://localhost:5000/api/pet/${sid}/feed`);
            fetchPet();
        } catch (err) {
            console.error(err);
        }
    };

    const completeQuest = async (quest_id) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/pet/quests/complete`, { sid, quest_id });
            alert(`Quest completed! +${res.data.exp_reward} XP`);
            fetchPet();
            fetchQuests();
        } catch (err) {
            alert(err.response?.data?.message || 'Error completing quest');
        }
    };

    const getPetEmoji = (level) => {
        if (level < 2) return '🌱'; // Seed
        if (level < 5) return '🌿'; // Sprout
        if (level < 10) return '🪴'; // Potted Plant
        if (level < 20) return '🌳'; // Tree
        return '🌸'; // Blooming Tree
    };

    if (!pet) return <div>Loading...</div>;

    const expProgress = (pet.experience % (pet.level * 50)) / (pet.level * 50) * 100;

    return (
        <div className="card h-full flex flex-col">
            <h3 className="mb-4 flex items-center gap-2 text-primary">
                <Heart size={20} /> Virtual Wellness Pet
            </h3>
            
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg border border-green-100 mb-6">
                <div style={{ fontSize: '5rem', filter: pet.health < 30 ? 'grayscale(100%)' : 'none', transition: 'transform 0.3s ease' }} className="hover:scale-110 cursor-pointer" onClick={feedPet} title="Click to feed!">
                    {getPetEmoji(pet.level)}
                </div>
                <h4 className="mt-4 font-bold text-xl">{pet.name}</h4>
                <div className="text-sm font-medium text-gray-600 mb-2">Level {pet.level}</div>
                
                <div className="w-full max-w-xs space-y-2">
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Health</span>
                            <span>{pet.health}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-400 h-2 rounded-full" style={{ width: `${pet.health}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>XP to next level</span>
                            <span>{pet.experience % (pet.level * 50)} / {pet.level * 50}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${expProgress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="flex items-center gap-2 mb-3 font-semibold">
                    <Target size={18} /> Daily Quests
                </h4>
                <div className="space-y-3">
                    {quests.length === 0 ? <p className="text-sm text-gray-500">No quests today!</p> : quests.map(q => (
                        <div key={q.quest_id} className={`flex items-center justify-between p-3 rounded-lg border ${q.completed ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-blue-100 shadow-sm'}`}>
                            <div>
                                <h5 className="font-medium text-sm m-0" style={{ textDecoration: q.completed ? 'line-through' : 'none' }}>{q.title}</h5>
                                <p className="text-xs text-gray-500 m-0">{q.description}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-blue-600 flex items-center"><Award size={12} className="mr-1"/> {q.exp_reward}</span>
                                {!q.completed && (
                                    <button onClick={() => completeQuest(q.quest_id)} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Done</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VirtualPet;
