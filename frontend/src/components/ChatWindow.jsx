import Message from './Message';
import InputBox from './InputBox';
import { useEffect, useRef, useState } from 'react';
import groupMessageByDate from '../utils/groupMessageByDate';


const dummyMessages = [
    {_id: "m1", senderId: "1", content: "Hello", createdAt: Date.now()},
    {_id: "m2", senderId: "2", content: "Hello", createdAt: Date.now()},
    {_id: "m3", senderId: "1", content: "How", createdAt: Date.now()}
]


export default function ChatWindow({ conversation, messages, sendMessage, loadOlderMessages, hasMore, loadingOlderMessages, typingUsers}){

    const [isAtBottom, setIsAtBottom] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const containerRef = useRef(null);
    const prevHeightRef  = useRef(0);

    // Conversation Effect -> on open start at bottom 
    useEffect(() => {
        const el = containerRef.current;
        if(!el)
            return;

        requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight;
        });
    }, [conversation]);


    // Message Effect -> Show scroll button
    useEffect(() => {
        
    
        const el = containerRef.current;

        if(!el)
            return;

        // recieved new msg
        if(isAtBottom){
            requestAnimationFrame(() => {
                el.scrollTop = el.scrollHeight;
            });
            setShowScrollButton(false);
            return;
        }
        
        
        setShowScrollButton(true);
        


    }, [messages.length])

    useEffect(() => {
         const el = containerRef.current;
        if (!el) return;

        // loading older messages
        if(prevHeightRef.current){
            const newHeight = el.scrollHeight;
            el.scrollTop = newHeight - prevHeightRef.current;
            prevHeightRef.current = 0;
            return;
        }
    }, [messages])

    // if at bottom
    const handleScroll = () => {
        const el = containerRef.current;
        if(!el)
            return;

        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;

        setIsAtBottom(atBottom);

        if(el.scrollTop < 100 && hasMore && !loadingOlderMessages){
            prevHeightRef.current = el.scrollHeight;
            loadOlderMessages();
        }
    };


    const scrollToBottom = () => {
        const el = containerRef.current;
        if(!el)
            return;
        el.scrollTo({
            top: el.scrollHeight,
            behavior: "auto"
        });
        setShowScrollButton(false);
    };

    if(!conversation){
        return (
            <div className='h-full flex items-center justify-center text-gray-400'>
                Select a conversation to start chatting
            </div>
        );
    }

    const groupedMessages = groupMessageByDate(messages);

    



    return (
        <div className='h-full flex flex-col relative'>

            {/* Header */}
            <div className='p-4 border-b border-gray-800 bg-gray-800 font-semibold'>
                {conversation.name}
                <div className='text-xs text-gray-500'>
                    {
                        typingUsers.size ? (() =>{
                            let typing = ""
                            Array.from(typingUsers).forEach((user) => {
                                if(typing.length){
                                    typing += ", "
                                }
                                typing += `${conversation.members.find(m => m._id.toString() === user)?.username} is Typing`
                            })

                            return typing
                        }
                        )() : ""
                        
                    }
                
                </div>
            </div>

            {/* Messages */}
            <div 
                ref={containerRef}
                onScroll={handleScroll}
                className='flex-1 overflow-y-auto p-4 space-y-3'>
                {
                    groupedMessages.map(fm => {                    
                
                        // console.log(fm);
                        
                        if(fm.type === "date"){
                            return <div key={`date-${fm.data}`}  className='text-center' >
                                {fm.data}
                            </div>
                        }
                        else{
                            return <Message key={fm.data._id} message={fm.data} />
                        }
                    })
                }
            </div>
            
            
            {/* Scrool to bottom btn */}
            {showScrollButton && (
            <button
                onClick={scrollToBottom}
                className='absolute bottom-24 right-4 bg-gray-600 hover:bg-gray-400 px-1 py-1 shadow-lg transition rounded text-sm'>
                    Scroll to bottom
            </button>
            )}

            {/* Input box */}
            <InputBox  sendMessage={sendMessage} conversationId={conversation._id}  />
        

       </div>
    )
}