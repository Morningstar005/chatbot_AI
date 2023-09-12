import React, { useState } from 'react'
import {MainContainer,ChatContainer,MessageList,Message,MessageInput,TypingIndicator} from "@chatscope/chat-ui-kit-react"
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
const API_KEY="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"

const App = () => {
  const [typing,setTyping] = useState(false)
  const [messages,setMessage] = useState([
    {
      message:"Hello, I'm Hemant bhatnagar",
      sender:"ChatGPT"
    }
  ])

  const handleSend =async(message)=>{
    const newMessage ={
      message:message,
      sender:"user",
      direction:"outgoing"
    }

    const newMessages = [...messages,newMessage];
    setMessage(newMessages)
    //
    // set a tpying indicator 
    setTyping(true)
    // message state update
    await processMessageToChatGPT(newMessages)
    //process message to Chatgpt
  }

  async function processMessageToChatGPT(chatMessages){
    //chatMessages {sender:"user" or "ChatGPT",message:"The message content here"}
    //apimessages {role:"user" or "assistant",content:"The message content here"}

    let apiMessages= chatMessages.map((messageObject)=>{
      let role = "";
      if(messageObject.sender==="ChatGPT"){
        role="assistant"
    }else{
      role="user"
    }
    return {role:role,content:messageObject.message}
    })


    const systemMessage ={
      role:"system",
      content:"Explain all concepts like humans"
    }
    const apiRequestBody ={
      "model":"gpt-3.5-turbo",
      "messages":[
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization":"Bearer "+ API_KEY,
        "Content-Type":"application/json"
      },
      body:JSON.stringify(apiRequestBody)
    }).then((data)=>{
      return data.json()
    }).then((data)=>{
      console.log("data",data)
      console.log(data.choices[0].message.content)
      setMessage(
        [...chatMessages,{
          message:data.choices[0].message.content,
          sender:"ChatGPT"
          
        }]
      );
      setTyping(false)
    })
  }
  return (
    <div >
      <div className='relative items-center justify-center h-[100vh]'>
        <MainContainer>
          <ChatContainer>
            <MessageList 
            scrollBehavior='smooth'
            typingIndicator={typing?<TypingIndicator content="Hemant is typing "/>:null}>
              {
                messages.map((message,i)=>{
                  return <Message key={i} model={message} />
                })
              }
            </MessageList>
            <MessageInput placeholder='Type Message here' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>

      </div>
    </div>
  )
}

export default App