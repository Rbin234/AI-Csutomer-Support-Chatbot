import { errorHandler } from "../middleware/errorHandler.js";
import Chatbot from "../models/chat.model.js";

export const handleHealthRequest = async (req, res,next) => {
  try {
    const { type, params, title = "HealthAI" } = req.body;
    // const { id: userId } = req.user;
    const userId = "6882ae41eaf980a75a31328b"
    const client = req.app.locals.gradioClient;
    console.log(req.body)

    let api_name;
    switch (type) {
      case "fda":
        api_name = "/fda_drug_lookup_gr";
        break;
      case "pubmed":
        api_name = "/pubmed_search_gr";
        break;
      case "topic":
        api_name = "/health_topics_gr";
        break;
      default:
        return res.status(400).json({ success: false, error: "Invalid type" });
    }

    const result = await client.predict(api_name, params);
    const parsedResult = await JSON.parse(result.data[0]);
    if(parsedResult.status == "error"){
       throw new Error("Error is found!")
    }
    
    // ✅ Ensure chat exists for user
    let chat = await Chatbot.findOne({ userId, title });
    if (!chat) {
      chat = await Chatbot.create({ userId, title, messages: [] });
    }

    // ✅ Save USER request
    chat.messages.push({
      sender: "user",
      message: JSON.stringify({
        type,
        params,
      }),
    });

    // ✅ Save AI response (entire structured JSON)
    chat.messages.push({
      sender: "ai",
      message: JSON.stringify(parsedResult),
    });

    await chat.save();

    console.log(parsedResult)
    res.json({ success: true, data: parsedResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const fetchHealthRequest = async (req, res) => {
  try {
    let chats = await Chatbot.find();

    // Parse all messages in each chat
    const parsedChats = chats.map(chat => {
      return {
        ...chat.toObject(),
        messages: chat.messages.map(msg => {
          let parsedMessage = msg.message;
          try {
            parsedMessage = JSON.parse(msg.message);
          } catch (e) {
            console.warn("Could not parse message:", msg.message);
          }
          return {
            ...msg.toObject(),
            message: parsedMessage
          };
        })
      };
    });

    return res.json({ success: true, data: parsedChats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// const parsedResult = await JSON.parse(result.data[0]);
