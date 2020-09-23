export class InputHandler{
    constructor(){
        document.addEventListener("keydown", (event)=>{
            alert(event.key);
        });
    }
}