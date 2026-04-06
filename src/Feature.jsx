import "./Feature.css";

function Feature({title,image,description}){
    return(
    <div className="Users">
        <img src={image} alt="user" className="user-img"/>
        <h5>{title}</h5>
        <h5>{description}</h5>
    </div>
);
}
export default Feature;