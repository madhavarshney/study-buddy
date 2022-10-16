import Class from "../Class";

const AddClass = () => {
    // const AddClass = async () => {

    // }
    
    let array = [{code: "1234", title: "Linear Algebra"}, {code: "1234", title: "Linear Algebra"}, {code: "1234", title: "Linear Algebra"}]
    
    return ( <>
        {array.map((element) => {
           return <Class props={element} />
        })}
    </> );
}
 
export default AddClass;