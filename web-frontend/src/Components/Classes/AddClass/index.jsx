import Class from "../Class";

const AddClass = () => {
    

    const getClasses = async () => {
        const getClasses = await fetch("classes/", {
            
        })   
    }
    
    let array = [{code: "1234", title: "Linear Algebra"}, {code: "1234", title: "Linear Algebra"}, {code: "1234", title: "Linear Algebra"}]
    
    return ( <>
        {array.map((element) => {
           return <Class {...element} />
        })}
    </> );
}
 
export default AddClass;