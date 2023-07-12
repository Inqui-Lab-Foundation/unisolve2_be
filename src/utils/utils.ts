export function sanitizeForDb(item:any):any{
	if(!item){
        return item;
    }

    if(typeof item === 'string' || item instanceof String){
        return item.trim()
    }
    
    return item
}