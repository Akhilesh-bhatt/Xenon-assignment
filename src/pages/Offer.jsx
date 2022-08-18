import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import {
  collection,
  getDocs,
  orderBy,
  where,
  limit,
  startAfter,
  query,
} from "firebase/firestore";
import ListingItem from "../components/ListingItem";

function Offer() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchListing, setLastFetchListing] = useState(null)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        //Get referance
        const listingsRef = collection(db, "listings");

        //Create query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        //Execute query snap
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchListing(lastVisible)
        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch user data");
      }
    };

    fetchListings();
  }, []);

  //pagination /Load more
  const onFetchMoreListings = async () => {
    try {
      //Get referance
      const listingsRef = collection(db, "listings");

      //Create query
      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchListing),
        limit(10)
      );

      //Execute query snap
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchListing(lastVisible)
      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch user data");
    }
  };
  

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          Offers
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
              ))}
            </ul>
          </main>
          
          <br />
          <br />
          {lastFetchListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
          )}
        </>
      ) : (
        <h3>No offer currently availible</h3>
      )}
    </div>
  );
}

export default Offer;
