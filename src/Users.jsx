import "./Users.css";
function Users({image,title,description}){
    return(
    <div className="Users">
        <img src={image} alt="user" className="user-img"/>
        <h5>{title}</h5>
        <h5>{description}</h5>
        <button>Login</button>
    </div>
);
}
export default Users;