
import axios from "../api/axios";
import { useState } from "react"


export function SearchBar(){

    const[results, setResults] = useState([]);
    const[resultUsers, setResultUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("")
    


    async function handleQuery(e){
        let query = e.target.value;
        
        if(query.length <= 2){
            
            setSearchQuery("");
            setResults([]);
            setResultUsers([]);
            return;
        }
        // console.log(query);
        setSearchQuery(query);
        const res = await axios.get(`/conversation?search=${query}`);
        // console.log(res);
        const data = res.data;
        if(data.conversations?.length){
            setResults(data.conversations);
        }
        else{
            setResults([]);
        }
        if(data.users?.length){
            setResultUsers(data.users);
            // console.log(resultUsers);
            
        }   
        else{
            setResultUsers([]);
        }     

    }

    const openDm = async (id) => {
        const res = await axios.post("/conversation", {
            members: [id]
        })

        console.log(res);
        
        
    }

    return <div>
        <div className="flex items-center bg-gray-900">
            <input className="p-2 bg-gray-900 flex-1 focus:outline-none" onChange={handleQuery}  type="text"  placeholder="Search here..."/>
            <button>
            
            </button>  <img src="src\assets\search.png" alt="Search" className="h-10 w-10 bg-gray-900 p-2 " />

        </div>

        <div className="">
            {searchQuery ? 
            (
                
                (results.length+resultUsers.length) ?    
                (
                    <>
                        {/* {console.log('here')} */}
                        {results?.map((c) => {
                            return <div key={`conv-${c._id}`} className="border border-gray-500 p-2 hover:bg-gray-800"  onClick={() => openConv(c._id)}>{c.name}</div>
                        })}
                        {resultUsers?.map((c) => {
        
                            return <div key={`user-${c._id}`} className="border border-gray-500 p-2 hover:bg-gray-800" onClick={() => openDm(c._id)}>{c.username}</div>
                        })}
                    </>
                )
                : (
                    <div className="p-2 ">No results found</div>
                )
            ) 
            :
            ""    
        }
        </div>
    </div>
}   