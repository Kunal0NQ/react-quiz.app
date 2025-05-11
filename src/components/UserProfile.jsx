import { useParams } from 'react-router-dom';
import {  CiUser } from "react-icons/ci";
import { Link } from "react-router-dom"

function UserProfile() {
    const { username } = useParams();

    return (
        <section className="relative pt-36 pb-24">
        <img src="https://pagedone.io/asset/uploads/1705471739.png" alt="cover-image" className="w-full absolute top-0 left-0 z-0 h-60 object-cover" />
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-center justify-center relative z-10 mb-2.5">
                <CiUser className="text-4xl border-4  bg-zinc-200 rounded-full object-cover" size={48} />
              
            </div>
          
            <h3 className="z-10 text-center font-manrope font-bold text-3xl leading-10 text-zinc-600 mb-3">{username}'s Profile</h3>
            {/* <p className="font-normal text-base leading-7 text-gray-500 text-center mb-8">A social media influencers and singer</p> */}
           
        </div>
    </section>
                                            

    );
}

export default UserProfile;
