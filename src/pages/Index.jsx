import { useState } from "react";
import { HOUNDIFY_API_KEY } from "../config.js";
import { Container, VStack, Input, Button, Text, Box, HStack, IconButton } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    // Simulate LLM response
    const llmResponse = await getLLMResponse(input);
    const llmMessage = { sender: "llm", text: llmResponse };
    setMessages((prevMessages) => [...prevMessages, llmMessage]);

    setInput("");
  };

  const getLLMResponse = async (query) => {
    const response = await fetch("https://api.houndify.com/v1/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Hound-Request-Authentication": HOUNDIFY_API_KEY,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    return data.AllResults[0].SpokenResponseLong;
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Box width="100%" height="60vh" overflowY="auto" border="1px solid #ccc" borderRadius="md" padding={4}>
          {messages.map((message, index) => (
            <Box key={index} alignSelf={message.sender === "user" ? "flex-end" : "flex-start"} bg={message.sender === "user" ? "blue.100" : "gray.100"} borderRadius="md" padding={2} marginY={1}>
              <Text>{message.text}</Text>
            </Box>
          ))}
        </Box>
        <HStack width="100%">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." />
          <Button onClick={handleSend}>Send</Button>
          <IconButton aria-label="Record" icon={<FaMicrophone />} size="md" />
        </HStack>
      </VStack>
    </Container>
  );
};

export default Index;
