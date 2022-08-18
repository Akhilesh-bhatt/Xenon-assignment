import { useState, useEffect } from "react";
import { db } from "../firebase.config";
import Spinner from "./Spinner";
import {
  collection,
  query,
  limit,
  orderBy,
  getDocs
} from "firebase/firestore";
// import AwesomeSlider from 'react-awesome-slider';
// import 'react-awesome-slider/dist/styles.css';
// import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.css";
// SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((docs) => {
        return listings.push({
          id: docs.id,
          data: docs.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };

    fetchListing();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (listings.length === 0) {
    return <></>
  }
  return (
    listings && (
      <>
        <p className="exploreHeading">Recommanded</p>
        {/* <AwesomeSlider>
          {listings.forEach(({ data, id }) => (
              <div
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
                className="swiperSlideDiv"
                style={{
                  background: `url(${data.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              >
                
              </div>
          ))}
        </AwesomeSlider> */}
      </>
    )
  );
}

export default Slider;
