import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import homeIcon from "../assets/svg/homeIcon.svg";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import ListingItem from "../components/ListingItem";

function Profile() {
  const auth = getAuth();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];

      querySnap.forEach((listing) => {
        return listings.push({
          id: listing.id,
          data: listing.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onDelete = async (listingId) => {
    if (window.confirm("Are you want to delete listing?")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Delete listing successfully");
    }
  };

  const onEdit = (listingId) => {
    navigate(`/editlisting/${listingId}`)
  }

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //update user in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }

      //update user in firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { name });
    } catch (error) {
      toast.error("Could not update user info!");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div className="profile">
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <button className="logOut" type="button" onClick={onLogout}>
            Logout
          </button>
        </header>

        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal details</p>
            <p
              className="changePersonalDetails"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? "done" : "change"}
            </p>
          </div>

          <div className="profileCard">
            <form>
              <input
                type="text"
                id="name"
                className={!changeDetails ? "profileName" : "profileNameActive"}
                onChange={onChange}
                disabled={!changeDetails}
                value={name}
              />

              <input
                type="text"
                id="email"
                className={
                  !changeDetails ? "profileEmail" : "profileEmailActive"
                }
                onChange={onChange}
                disabled={!changeDetails}
                value={email}
              />
            </form>
          </div>

          <Link className="createListing" to="/createlisting">
            <img src={homeIcon} alt="Home" />
            <p>Rent or sell your home</p>
            <img src={arrowRight} alt="Arrow Right" />
          </Link>

          {!loading && listings?.length > 0 && (
            <>
              <p className="listingText">Your Listings</p>
              <ul className="listingList">
                {listings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Profile;
