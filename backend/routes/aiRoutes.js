const express = require('express');
const router = express.Router();

// Mock AI Chatbot Response
router.post('/chat', (req, res) => {
    const { message } = req.body;
    let reply = "I am an AI assistant. How can I help you today?";
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
        reply = "I'm really sorry you're feeling this way. It's important to talk to someone. Please consider booking a session with one of our counsellors or using the SOS button if you're in crisis.";
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('stress') || lowerMessage.includes('exam')) {
        reply = "Exams and stress can be overwhelming. Try taking deep breaths. A 5-minute break might also help. You can read some of our Mental Health Resources for tips!";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        reply = "Hello there! How are you feeling today?";
    } else if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
        reply = "You can book an appointment from your dashboard under the 'Book Session' tab.";
    }

    // Simulate network delay
    setTimeout(() => {
        res.json({ success: true, reply });
    }, 1000);
});

module.exports = router;
