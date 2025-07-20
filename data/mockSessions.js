export const mockSessions = [
  {
    id: 'session-1234-5678-9012',
    userId: 'user-abcd-efgh-ijkl',
    messageCount: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    status: 'active',
    messages: [
      {
        id: 'msg-1',
        content: 'Hello, how can I help you today?',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-4',
        aiResponse: 'Hello! I\'m here to help you with any questions you might have.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: 'msg-2',
        content: 'What is the weather like today?',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-4',
        aiResponse: 'I don\'t have access to real-time weather data, but I can help you find weather information through other means.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 25)
      },
      {
        id: 'msg-3',
        content: 'Can you explain machine learning?',
        isUser: false,
        isProcessed: true,
        aiModel: 'GPT-4',
        aiResponse: 'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 20)
      },
      {
        id: 'msg-4',
        content: 'What are the different types of machine learning?',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-4',
        aiResponse: 'The main types are supervised learning, unsupervised learning, and reinforcement learning.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 18)
      },
      {
        id: 'msg-5',
        content: 'Can you give an example of supervised learning?',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-4',
        aiResponse: 'Sure, an example is predicting house prices based on historical data where both features (like size, location) and target (price) are known.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 15)
      },
      {
        id: 'msg-6',
        content: 'What about unsupervised learning?',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-4',
        aiResponse: 'Unsupervised learning deals with unlabeled data, like clustering customers into different segments based on their purchasing behavior without predefined categories.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 12)
      },
      {
        id: 'msg-7',
        content: 'And reinforcement learning?',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-4',
        aiResponse: 'Reinforcement learning involves an agent learning to make decisions by performing actions in an environment to maximize a reward, like training a robot to walk.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 10)
      },
      {
        id: 'msg-8',
        content: 'Thanks, that clarifies a lot!',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-4',
        aiResponse: 'You\'re welcome! Is there anything else I can help you with?',
        retryCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 8)
      }
    ]
  },
  {
    id: 'session-2345-6789-0123',
    userId: 'user-bcde-fghi-jklm',
    messageCount: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    status: 'completed',
    messages: [
      {
        id: 'msg-9',
        content: 'Can you explain machine learning?',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-3.5',
        aiResponse: 'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 60)
      },
      {
        id: 'msg-10',
        content: 'What is the capital of France?',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-3.5',
        aiResponse: 'The capital of France is Paris.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 55)
      },
      {
        id: 'msg-11',
        content: 'Tell me a fun fact about space.',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-3.5',
        aiResponse: 'A day on Venus is longer than its year. It takes Venus 243 Earth days to rotate once on its axis, but only 225 Earth days to orbit the Sun.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 50)
      },
      {
        id: 'msg-12',
        content: 'How do I make a simple website?',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-3.5',
        aiResponse: 'You can start with HTML for structure, CSS for styling, and JavaScript for interactivity. Many online tutorials and frameworks like React or Vue can help.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 45)
      }
    ]
  },
  {
    id: 'session-3456-7890-1234',
    userId: 'user-cdef-ghij-klmn',
    messageCount: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
    status: 'failed',
    messages: [
      {
        id: 'msg-13',
        content: 'Why is my code not working?',
        isUser: true,
        isProcessed: false,
        aiModel: 'Claude',
        aiResponse: 'I apologize, I encountered an error processing your request. Please check your input or try again later.',
        retryCount: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 120)
      },
      {
        id: 'msg-14',
        content: 'Can you debug this Python script?',
        isUser: true,
        isProcessed: false,
        aiModel: 'Claude',
        aiResponse: 'I\'m sorry, I\'m having trouble connecting to the debugging service. Please ensure your script is valid.',
        retryCount: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 115)
      }
    ]
  },
  {
    id: 'session-4567-8901-2345',
    userId: 'user-defg-hijk-lmno',
    messageCount: 10,
    createdAt: new Date(Date.now() - 1000 * 60 * 90),
    status: 'active',
    messages: [
      {
        id: 'msg-15',
        content: 'Tell me about the latest trends in AI.',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-4',
        aiResponse: 'Some of the latest trends in AI include generative AI, explainable AI (XAI), AI ethics, and advancements in reinforcement learning for complex tasks.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        errorMessage: null
      },
      {
        id: 'msg-16',
        content: 'What is generative AI?',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-4',
        aiResponse: 'Generative AI refers to AI models that can create new content, such as text, images, music, or even code, that resembles real-world data.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        errorMessage: null
      },
      {
        id: 'msg-17',
        content: 'Can you give an example of generative AI?',
        isUser: true,
        isProcessed: true,
        aiModel: 'GPT-4',
        aiResponse: 'ChatGPT for text generation, DALL-E for image generation, and Midjourney are popular examples of generative AI.',
        retryCount: 0,
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        retryCount: 1,
        errorMessage: 'SMTP connection timeout'
      }
    ]
  }
];
