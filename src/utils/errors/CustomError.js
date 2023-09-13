export default class CustomError{
    static throwNewError({name="Error", cause="", message ="", customParameters}){
        const error = new Error(message, {cause});
        error.name = name;
        if(customParameters)
            Object.keys(customParameters).forEach((parameterName, idx)=>{
                error[parameterName.toString()] = customParameters[idx];
            });
        throw error;
    }
}