import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import React, { useState }  from 'react';
import { messagesQuery, messageAddedSubscription, addMessageMutation } from './graphql/queries';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

export default function Chat({user}) {
  // const [messages, setMessages] = useState([]);
   const {loading, error, data} = useQuery(messagesQuery);
   const messages = data ? data.messages : [];
  // useQuery(messagesQuery, {
  //   onCompleted: ({messages}) => setMessages(messages)
  // })
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({client, subscriptionData}) => {
      
      client.writeData({data: {
      messages: messages.concat(subscriptionData.data.messageAdded)
    }})
    }
  })
  const [addMessage, {called}] = useMutation(addMessageMutation)

 


  const handleSend = async (text) => {
    await addMessage({variables: {input: {text}}});
  }

    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Chatting as {user}</h1>
          <MessageList user={user} messages={messages} />
          <MessageInput onSend={handleSend} />
        </div>
      </section>
    );
  }  

