import Users from "./Users.jsx";
import "./Card.css";
import admin from "./admin.png";
import faculty from "./faculty.png";
import hod from "./hod.png";
function FeatureCard(){
    return(
        <div className="Feature-card-container">
        <Users 
        image={admin}
        title="ADMIN" 
        description="fdghfh"
        />
        <Users 
        image={faculty}
        title="FACULTY" 
        description="fdghfh" />
        <Users 
        image={hod}
        title="HOD"
        description="fdghfh" />
        </div>
    );
}
export default FeatureCard;