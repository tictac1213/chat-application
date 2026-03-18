import { SearchBar } from "./SearchBar";

const dummyConversations = [
    { _id: "1", name: "General Chat"},
    { _id: "2", name: "Project Team"},
    { _id: "3", name: "Friends"}
];


export default function Sidebar({ selectedConversation, setSelectedConversation, conversations}){

    return (
        <div className="h-full flex flex-col bg-gray-800">
            {/* SearchBar */}
            <div className="p-4 border-b border-gray-700 font-semibold text-lg">
                Conversations
            </div>
            <div className="p-2 border-b border-gray-600" >
                <SearchBar></SearchBar>
            </div>

            {/* Header */}

            {/* List */}
            <div className="flex-1 overlow-y-auto">
                {conversations.map((conv) => {
                    const isSelected = selectedConversation?._id === conv._id;

                    return (
                        <div
                            key={conv._id}
                            onClick={() => setSelectedConversation(conv)}
                            className={`p-4 cursor-pointer border-b border-gray-700 hover:bg-gray-700 ${isSelected ? "bg-gray-600" : ""}`}
                        >
                            <div className="font-semibold"> 
                                {conv.name}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                                {conv.lastMessage ? `${conv.lastMessage?.senderId.username} : ${conv.lastMessage?.content}` : "Start a conversation now!"}
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}
