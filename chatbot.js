import axios from 'axios';

const OUT_OF_SCOPE_KEYWORDS = ['contact', 'help', 'service', 'support'];

const WEBSITE_STRUCTURE = `
Our website has the following sections:
1. Homepage: An overview of our company and offerings.
2. About Us: Learn about our company, mission, and team.
3. Services: We offer consulting, support, and training. You can explore the individual services in detail.
4. Contact: Reach out to us via email, phone, or the contact form.
5. FAQ: Frequently asked questions regarding our services and processes.
Please use this structure to guide users to the correct section based on their queries.
`;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    
    const isOutOfScope = OUT_OF_SCOPE_KEYWORDS.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    if (isOutOfScope) {
      return res.status(200).json({
        reply: `It looks like you're asking for something outside of my capabilities. Please contact our service team at support@company.com or call +1-800-123-4567 for further assistance.`
      });
    }

    try {
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo', 
          messages: [
            { role: 'system', content: WEBSITE_STRUCTURE },
            { role: 'user', content: message }
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      res.status(200).json({ reply: response.data.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data from OpenAI API' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
