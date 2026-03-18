

export default function groupMessageByDate(messages){
    const result = [];
    let lastDate = null;

    messages.forEach((msg) => {
        const date = new Date(msg.createdAt);

        const curDate = formatDateLabel(date);
        if(curDate === lastDate){
            result.push({
                type: "message",
                data: msg
            });
        }
        else{
            lastDate = curDate;

            result.push({
                type: "date",
                data: curDate
            })

            result.push({
                type: "message",
                data: msg
            });
        }
        
    });

    return result;
}

function formatDateLabel(date){
    const today = new Date();
    const yesterday = new Date(Date.now() - 24*60*60*1000);
    
    if(date.toDateString() === today.toDateString())
        return "Today";
    if(date.toDateString() === yesterday.toDateString())
        return "Yesterday";

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    })

}