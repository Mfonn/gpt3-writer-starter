import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
`
Write me a response in the style of a Medical Report about a patient
Title:
`

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.7,
    max_tokens: 3000,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();


      // I build Prompt #2.
      const secondPrompt = 
      `
      Take the response and title of the response below and generate a response written as probable diagnosis, reasons for the diagnosis and the next line of management
    
      Title: ${req.body.userInput}
    
      Table of Contents: ${basePromptOutput.text}
    
      Blog Post:
      `
      
   
   // I call the OpenAI API a second time with Prompt #2
   const secondPromptCompletion = await openai.createCompletion({
     model: 'text-davinci-002',
     prompt: `${secondPrompt}`,
     // I set a higher temperature for this one. Up to you!
     temperature: 0.85,
         // I also increase max_tokens.
     max_tokens: 2250,
   });
   
     // Get the output
        const secondPromptOutput = secondPromptCompletion.data.choices.pop();

        // Send over the Prompt #2's output to our UI instead of Prompt #1's.
        res.status(200).json({ output: secondPromptOutput });

};

export default generateAction;