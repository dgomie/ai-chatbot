const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));


// The "catchall" handler: for any request that doesn't match an API route, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});


app.post("/api/generateWorkoutPlan", async (req, res) => { 
  const { age, activityLevel, workoutType, location, week, bodyPart } = req.body;
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  async function generateAIresponse(prompt) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text(); 
      return text;
    } catch (error) {
      console.error("Error generating AI response:", error);
      return null; 
    }
  }

  try {
    const workoutPlan = await generateAIresponse(`Create a ${week} week ${location} ${workoutType} workout plan with detailed exercises focusing on ${bodyPart}. Include estimated calories burned for each workout. The user is ${age} and is at a ${activityLevel} exercise level.`);
    if (workoutPlan) {
      res.json({ workoutPlan });
    } else {
      res.status(500).json({ error: "Failed to generate workout plan" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


